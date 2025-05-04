import * as vscode from 'vscode';
import { Node, Edge, Graph } from '../../types/graph';

export class MockWebviewPanel implements vscode.WebviewPanel {
    viewType: string;
    title: string;
    webview: vscode.Webview;
    options: vscode.WebviewPanelOptions & vscode.WebviewOptions;
    viewColumn: vscode.ViewColumn;
    active: boolean;
    visible: boolean;
    onDidChangeViewState: vscode.Event<vscode.WebviewPanelOnDidChangeViewStateEvent>;
    onDidDispose: vscode.Event<void>;

    constructor() {
        this.viewType = 'codeVision';
        this.title = 'Code Vision';
        this.webview = new MockWebview();
        this.options = { retainContextWhenHidden: true };
        this.viewColumn = vscode.ViewColumn.One;
        this.active = true;
        this.visible = true;
        this.onDidChangeViewState = (_listener: (e: vscode.WebviewPanelOnDidChangeViewStateEvent) => void, _thisArgs?: unknown, _disposables?: vscode.Disposable[]): vscode.Disposable => {
            return { dispose: (): void => { /* empty */ } };
        };
        this.onDidDispose = (_listener: () => void, _thisArgs?: unknown, _disposables?: vscode.Disposable[]): vscode.Disposable => {
            return { dispose: (): void => { /* empty */ } };
        };
    }

    reveal(_column?: vscode.ViewColumn, _preserveFocus?: boolean): Thenable<void> {
        return Promise.resolve();
    }

    dispose(): void {
        /* empty */
    }
}

export class MockWebview implements vscode.Webview {
    html = '';
    options: vscode.WebviewOptions = {};
    cspSource = '';
    onDidReceiveMessage: vscode.Event<unknown> = (_listener: (e: unknown) => void, _thisArgs?: unknown, _disposables?: vscode.Disposable[]): vscode.Disposable => {
        return { dispose: (): void => { /* empty */ } };
    };

    postMessage(_message: unknown): Thenable<boolean> {
        return Promise.resolve(true);
    }

    asWebviewUri(localResource: vscode.Uri): vscode.Uri {
        return localResource;
    }
}

export function createMockGraph(): Graph {
    const nodes: Node[] = [
        { id: 'main', label: 'main', position: { x: 0, y: 0 } },
        { id: 'func1', label: 'func1', position: { x: -100, y: 100 } },
        { id: 'func2', label: 'func2', position: { x: 100, y: 100 } }
    ];

    const edges: Edge[] = [
        { source: 'main', target: 'func1' },
        { source: 'main', target: 'func2' }
    ];

    return { nodes, edges };
} 