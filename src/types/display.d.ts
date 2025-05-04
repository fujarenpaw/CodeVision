import * as vscode from 'vscode';

export interface Position {
    x: number;
    y: number;
}

export interface DisplaySystem {
    createWebViewPanel(): Promise<vscode.WebviewPanel>;
    handleZoom(level: number): Promise<void>;
    handlePan(offset: Position): Promise<void>;
    handleNodeClick(nodeId: string): Promise<void>;
    applyTheme(theme: string): Promise<void>;
    getCurrentZoom(): number;
    getCurrentPosition(): Position;
    getCurrentTheme(): string;
    onNodeClick(callback: (nodeId: string) => void): void;
} 