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
	const supportedLanguages = ['cpp', 'c', 'csharp', 'python'];
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

			const functionInfo = await analyzer.analyzeFunction(editor.document, position);
			if (!functionInfo) {
				vscode.window.showErrorMessage('No function found at the current position. Make sure the cursor is inside a function definition.');
				return;
			}

			// WebViewパネルの作成または再利用
			if (currentPanel) {
				currentPanel.reveal(vscode.ViewColumn.Beside);
			} else {
				currentPanel = vscode.window.createWebviewPanel(
					'butterflyGraph',
					'Butterfly Graph',
					vscode.ViewColumn.Beside,
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

			// 中心の関数
			const rootId = 'root';
			nodes.push({
				id: rootId,
				label: functionInfo.name
			});

			// 呼び出し元の関数（設定に基づいて制限）
			const callers = functionInfo.callers.slice(0, settings.maxNodesPerLevel);
			callers.forEach((caller, index) => {
				const callerId = `caller_${index}`;
				nodes.push({
					id: callerId,
					label: caller.name
				});
				edges.push({
					source: callerId,
					target: rootId
				});
			});

			// 呼び出し先の関数（設定に基づいて制限）
			const callees = functionInfo.callees.slice(0, settings.maxNodesPerLevel);
			callees.forEach((callee, index) => {
				const calleeId = `callee_${index}`;
				nodes.push({
					id: calleeId,
					label: callee.name
				});
				edges.push({
					source: rootId,
					target: calleeId
				});
			});

			// WebViewのHTMLコンテンツ
			currentPanel.webview.html = getWebviewContent(nodes, edges, settings);
		} catch (error) {
			vscode.window.showErrorMessage(`Error showing butterfly graph: ${error instanceof Error ? error.message : String(error)}`);
		}
	};

	const disposable = vscode.commands.registerCommand('butterfly-graph.show', showButterflyGraph);
	context.subscriptions.push(disposable);
}

const MAX_LABEL_LENGTH = 20;

function truncateLabel(label: string): string {
	return label.length > MAX_LABEL_LENGTH ? label.slice(0, MAX_LABEL_LENGTH - 3) + '...' : label;
}

function getWebviewContent(nodes: GraphNode[], edges: GraphEdge[], settings: any): string {
	const centerX = 0;
	const centerY = 0;
	const xOffset = 300;
	const yStep = 100;

	// ノードを分類
	const root = nodes.find(n => n.id === 'root');
	const callers = nodes.filter(n => n.id.startsWith('caller_'));
	const callees = nodes.filter(n => n.id.startsWith('callee_'));

	// 位置割り当て
	const nodePositions: Record<string, {x: number, y: number}> = {};
	if (root) nodePositions[root.id] = { x: centerX, y: centerY };
	callers.forEach((n, i) => {
		nodePositions[n.id] = { x: centerX - xOffset, y: centerY + (i - (callers.length-1)/2) * yStep };
	});
	callees.forEach((n, i) => {
		nodePositions[n.id] = { x: centerX + xOffset, y: centerY + (i - (callees.length-1)/2) * yStep };
	});

	const nodesJson = JSON.stringify(nodes.map(node => ({
		data: {
			id: node.id,
			label: truncateLabel(node.label)
		},
		position: nodePositions[node.id] || {x: 0, y: 0}
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
			const cy = cytoscape({
				container: document.getElementById('cy'),
				elements: {
					nodes: ${nodesJson},
					edges: ${edgesJson}
				},
				style: [
					{
						selector: 'node',
						style: {
							'label': 'data(label)',
							'text-valign': 'center',
							'text-halign': 'center',
							'background-color': '${themeStyles.nodeBackgroundColor}',
							'color': '${themeStyles.nodeTextColor}'
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
				}
			});
		</script>
	</body>
	</html>`;
}

function getThemeStyles(theme: string): { nodeBackgroundColor: string; nodeTextColor: string; edgeColor: string } {
	switch (theme) {
		case 'dark':
			return {
				nodeBackgroundColor: '#333',
				nodeTextColor: '#fff',
				edgeColor: '#666'
			};
		case 'light':
			return {
				nodeBackgroundColor: '#f0f0f0',
				nodeTextColor: '#000',
				edgeColor: '#999'
			};
		default:
			return {
				nodeBackgroundColor: '#666',
				nodeTextColor: '#fff',
				edgeColor: '#999'
			};
	}
}

// This method is called when your extension is deactivated
export function deactivate(): void {
	// Cleanup code can be added here if needed
}
