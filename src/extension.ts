// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CodeAnalyzer } from './analyzer/CodeAnalyzer';
import { CytoscapeVisualizer } from './graph/CytoscapeVisualizer';
import { GraphNode, GraphEdge } from './graph/GraphVisualizer';
import { SettingsManager } from './config/settings';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
	console.log('Butterfly Graph extension is now active!');
	
	// サポートされている言語の確認
	const supportedLanguages = ['cpp', 'c', 'python'];
	// const supportedLanguages = ['cpp', 'c', 'csharp', 'python']; // C#は一旦サポートしない
	console.log('Supported languages:', supportedLanguages);

	const analyzer = new CodeAnalyzer();
	const settingsManager = SettingsManager.getInstance();
	let currentPanel: vscode.WebviewPanel | undefined;

	const showButterflyGraph = async () => {
		try {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage('No active editor');
				return;
			}

			// 言語のサポート確認
			const languageId = editor.document.languageId;
			if (!supportedLanguages.includes(languageId)) {
				vscode.window.showErrorMessage(
					`Language '${languageId}' is not supported. Supported languages are: ${supportedLanguages.join(', ')}`
				);
				return;
			}

			// 設定の取得
			const settings = settingsManager.getSettings();
			console.log('Current settings:', settings);

			// カーソル位置の詳細な情報を取得
			const position = editor.selection.active;
			const wordRange = editor.document.getWordRangeAtPosition(position);
			const word = wordRange ? editor.document.getText(wordRange) : '';

			console.log('Analyzing function in language:', languageId);
			console.log('Cursor position:', {
				line: position.line,
				character: position.character,
				word: word,
				wordRange: wordRange
			});

			// 言語サーバーの状態を確認
			const languageServerStatus = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', editor.document.uri);
			console.log('Language server status:', languageServerStatus ? 'active' : 'inactive');

			const functionInfo = await analyzer.analyzeFunction(
				editor.document,
				position,
				settings.calleeLevels,
				settings.callerLevels
			);
			if (!functionInfo) {
				vscode.window.showErrorMessage('No function found at the current position. Make sure the cursor is inside a function definition.');
				return;
			}

			// WebViewパネルの作成または再利用
			if (currentPanel) {
				currentPanel.reveal(vscode.ViewColumn.Active);
			} else {
				currentPanel = vscode.window.createWebviewPanel(
					'butterflyGraph',
					'Butterfly Graph',
					vscode.ViewColumn.Active,
					{
						enableScripts: true,
						retainContextWhenHidden: true
					}
				);

				currentPanel.onDidDispose(() => {
					currentPanel = undefined;
				});
			}

			// グラフデータの生成
			const nodes: GraphNode[] = [];
			const edges: GraphEdge[] = [];
			const addedNodeIds = new Set<string>();
			const nodeMeta: Record<string, { direction: 'root' | 'caller' | 'callee'; depth: number }> = {};

			function getNodeId(info: { location: { file: string; line: number; character: number } }): string {
				// パス区切りを「/」に統一
				const normalizedFile = info.location.file.replace(/\\/g, '/');
				return `${normalizedFile}:${info.location.line}:${info.location.character}`;
			}

			function addFunctionInfoToGraph(
				info: any,
				parentId: string | null | undefined,
				direction: 'root' | 'caller' | 'callee',
				depth: number,
				parentClassName?: string | undefined
			) {
				const nodeId = getNodeId(info);
				if (addedNodeIds.has(nodeId)) {
					return; // 既に探索済みなら再帰しない
				}
				// --- クラス名抽出 ---
				let className: string | undefined = undefined;
				if (info.name && info.name.includes('::')) {
					const match = info.name.match(/^(.*?)::(.*)$/);
					if (match) {
						className = match[1];
					}
				} else if (info.detail) {
					// detailからクラス名を抽出（例: "DebugTestA - ..."）
					const detailMatch = info.detail.match(/^([\w:]+)\s*-/);
					if (detailMatch && detailMatch[1]) {
						className = detailMatch[1];
					}
				} else if (parentClassName) {
					className = parentClassName;
				}
				// --- 関数ノード追加 ---
				let functionLabel = info.name;
				if (className && info.name && !info.name.includes('::')) {
					functionLabel = `${className}::${info.name}`;
				}
				nodes.push({
					id: nodeId,
					label: functionLabel,
					type: 'function',
					location: info.location
				});
				addedNodeIds.add(nodeId);
				nodeMeta[nodeId] = { direction, depth };
				// --- 既存の親子エッジ ---
				if (parentId) {
					if (direction === 'callee') {
						edges.push({ source: parentId, target: nodeId });
					} else if (direction === 'caller') {
						edges.push({ source: nodeId, target: parentId });
					}
				}
				// 再帰的にcaller/calleeを展開
				if (info.callees && info.callees.length > 0) {
					for (const callee of info.callees) {
						addFunctionInfoToGraph(callee, nodeId, 'callee', depth + 1, className || parentClassName);
					}
				}
				if (info.callers && info.callers.length > 0) {
					for (const caller of info.callers) {
						addFunctionInfoToGraph(caller, nodeId, 'caller', depth + 1, className || parentClassName);
					}
				}
			}

			// ルートノードから再帰的に展開（中央）
			addFunctionInfoToGraph(functionInfo, null, 'root', 0);

			// WebViewからのメッセージ受信を設定
			currentPanel.webview.onDidReceiveMessage(
				async message => {
					console.log('Received message from WebView:', message);
					if (message.command === 'jumpToFunction') {
						const location = message.location;
						console.log('Location data:', location);
						if (location) {
							try {
								const uri = vscode.Uri.file(location.file);
								console.log('URI:', uri.toString());
								const position = new vscode.Position(location.line, location.character);
								const range = new vscode.Range(position, position);
								console.log('Opening document at position:', {
									file: location.file,
									line: location.line,
									character: location.character
								});
								await vscode.window.showTextDocument(uri, { selection: range });
								console.log('Successfully opened document at position:', position);
							} catch (error) {
								console.error('Error opening document:', error);
								vscode.window.showErrorMessage(`Failed to open document: ${error instanceof Error ? error.message : String(error)}`);
							}
						} else {
							console.error('No location data provided in message');
							vscode.window.showErrorMessage('No location data provided');
						}
					}
				},
				undefined,
				context.subscriptions
			);

			// WebViewのHTMLコンテンツ
			currentPanel.webview.html = getWebviewContent(nodes, edges, settings, nodeMeta, getNodeId(functionInfo));

			// WebViewのメッセージングを有効化
			currentPanel.webview.postMessage({ type: 'ready' });
			console.log('WebView ready message sent');
		} catch (error) {
			vscode.window.showErrorMessage(`Error showing butterfly graph: ${error instanceof Error ? error.message : String(error)}`);
		}
	};

	const disposable = vscode.commands.registerCommand('codevision.showButterflyGraph', showButterflyGraph);
	context.subscriptions.push(disposable);
}

const MAX_LABEL_LENGTH = 30;

function truncateLabel(label: string): string {
	console.log('Truncating label:', {
		original: label,
		isClassMethod: label.includes('::')
	});
	
	// クラスメソッドの場合は既に「クラス名::関数名」形式になっているので、そのまま返す
	if (label.includes('::')) {
		console.log('Returning class method label as is:', label);
		return label;
	}
	// 通常の関数の場合は従来通り関数名のみを返し、長さ制限を適用
	const truncated = label.length > MAX_LABEL_LENGTH ? label.slice(0, MAX_LABEL_LENGTH - 3) + '...' : label;
	console.log('Returning truncated label:', truncated);
	return truncated;
}

function getWebviewContent(nodes: GraphNode[], edges: GraphEdge[], settings: any, nodeMeta: Record<string, { direction: 'root' | 'caller' | 'callee'; depth: number }>, selectedNodeId?: string): string {
	console.log('Generating webview content with nodes:', JSON.stringify(nodes.map(n => ({
		id: n.id,
		label: n.label,
		location: n.location
	}))));
	const centerX = 0;
	const centerY = 0;
	const xOffset = 300;
	const yStep = 100;

	// direction, depthごとにノードを分類
	const callerNodes = nodes.filter(n => nodeMeta[n.id]?.direction === 'caller');
	const calleeNodes = nodes.filter(n => nodeMeta[n.id]?.direction === 'callee');
	const rootNode = nodes.find(n => nodeMeta[n.id]?.direction === 'root');

	// 各階層ごとにY座標を均等割り当て
	function assignPositions(nodes: GraphNode[], direction: 'caller' | 'callee') {
		const grouped: Record<number, GraphNode[]> = {};
		nodes.forEach(n => {
			const depth = nodeMeta[n.id]?.depth || 1;
			if (!grouped[depth]) grouped[depth] = [];
			grouped[depth].push(n);
		});
		const positions: Record<string, { x: number, y: number }> = {};
		Object.entries(grouped).forEach(([depthStr, group]) => {
			const depth = parseInt(depthStr, 10);
			const x = centerX + (direction === 'callee' ? 1 : -1) * xOffset * depth;
			const yStart = centerY - ((group.length - 1) / 2) * yStep;
			group.forEach((n, i) => {
				// クラスノードは上にずらす
				if (n.type === 'class') {
					positions[n.id] = { x, y: yStart + i * yStep - 150 };
				} else {
					positions[n.id] = { x, y: yStart + i * yStep };
				}
			});
		});
		return positions;
	}
	const callerPositions = assignPositions(callerNodes, 'caller');
	const calleePositions = assignPositions(calleeNodes, 'callee');
	const nodePositions: Record<string, { x: number, y: number }> = { ...callerPositions, ...calleePositions };
	if (rootNode) nodePositions[rootNode.id] = { x: centerX, y: centerY };

	const nodesJson = JSON.stringify(nodes.map(node => ({
		data: {
			id: node.id,
			label: truncateLabel(node.label),
			type: node.type,
			location: node.location
		},
		position: nodePositions[node.id] || { x: 0, y: 0 }
	})));
	
	const edgesJson = JSON.stringify(edges.map(edge => ({
		data: {
			source: edge.source,
			target: edge.target
		}
	})));

	// テーマに基づくスタイル設定
	const themeStyles = getThemeStyles(settings.theme);

	return `<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Butterfly Graph</title>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.23.0/cytoscape.min.js"></script>
		<style>
			#cy {
				width: 100%;
				height: 100vh;
				position: absolute;
				left: 0;
				top: 0;
			}
		</style>
	</head>
	<body>
		<div id="cy"></div>
		<script>
			const vscode = acquireVsCodeApi();
			const cy = cytoscape({
				container: document.getElementById('cy'),
				elements: {
					nodes: ${nodesJson},
					edges: ${edgesJson}
				},
				style: [
					{
						selector: 'node[type = "class"]',
						style: {
							'label': 'data(label)',
							'text-valign': 'center',
							'text-halign': 'center',
							'background-color': '#1976d2', // クラスノードは青系
							'color': '#fff',
							'cursor': 'pointer'
						}
					},
					{
						selector: 'node[type = "function"]',
						style: {
							'label': 'data(label)',
							'text-valign': 'center',
							'text-halign': 'center',
							'background-color': '${themeStyles.nodeBackgroundColor}',
							'color': '${themeStyles.nodeTextColor}',
							'cursor': 'pointer'
						}
					},
					{
						selector: 'node.selected',
						style: {
							'color': '${themeStyles.selectedNodeTextColor}'
						}
					},
					{
						selector: 'edge',
						style: {
							'width': 2,
							'line-color': '${themeStyles.edgeColor}',
							'target-arrow-color': '${themeStyles.edgeColor}',
							'target-arrow-shape': 'triangle',
							'curve-style': 'bezier'
						}
					}
				],
				layout: {
					name: 'preset'
				},
				minZoom: 0.1,
				maxZoom: 10,
				wheelSensitivity: 0.2,
				zoomingEnabled: true,
				userZoomingEnabled: true
			});

			// 初期表示時に選択されたノードをハイライト
			${selectedNodeId ? `highlightSelectedNode('${selectedNodeId}');` : ''}

			cy.on('dblclick', 'node', function(evt) {
				try {
					const node = evt.target;
					const location = node.data('location');
					if (location) {
						const message = {
							command: 'jumpToFunction',
							location: location
						};
						vscode.postMessage(message);
					}
				} catch (error) {
					console.error('Error in dblclick handler:', error);
				}
			});

			// 選択された関数のノードにselectedクラスを適用
			function highlightSelectedNode(nodeId) {
				console.log('highlightSelectedNode called with nodeId:', nodeId);
				console.log('All node IDs:', cy.nodes().map(n => n.id()));
				cy.nodes().removeClass('selected');
				const selectedNode = cy.getElementById(nodeId);
				if (selectedNode.length > 0) {
					selectedNode.addClass('selected');
					console.log('selectedNode classes after addClass:', selectedNode.classes());
				} else {
					console.log('No node found for nodeId:', nodeId);
				}
			}

			window.addEventListener('message', event => {
				try {
					const message = event.data;
					if (message.type === 'ready') {
						// WebView is ready
					} else if (message.command === 'highlightNode') {
						highlightSelectedNode(message.nodeId);
					}
				} catch (error) {
					console.error('Error in message handler:', error);
				}
			});
		</script>
	</body>
	</html>`;
}

function getThemeStyles(theme: string): { 
	nodeBackgroundColor: string; 
	nodeTextColor: string; 
	edgeColor: string;
	selectedNodeBackgroundColor: string;
	selectedNodeBorderColor: string;
	selectedNodeTextColor: string;
} {
	switch (theme) {
		case 'dark':
			return {
				nodeBackgroundColor: '#333',
				nodeTextColor: '#fff',
				edgeColor: '#666',
				selectedNodeBackgroundColor: '#ff0000',
				selectedNodeBorderColor: '#00ff00',
				selectedNodeTextColor: '#ffff00'
			};
		case 'light':
			return {
				nodeBackgroundColor: '#f0f0f0',
				nodeTextColor: '#000',
				edgeColor: '#999',
				selectedNodeBackgroundColor: '#ff0000',
				selectedNodeBorderColor: '#008000',
				selectedNodeTextColor: '#1976d2'
			};
		default:
			return {
				nodeBackgroundColor: '#666',
				nodeTextColor: '#fff',
				edgeColor: '#999',
				selectedNodeBackgroundColor: '#ff0000',
				selectedNodeBorderColor: '#00ff00',
				selectedNodeTextColor: '#00ffff'
			};
	}
}