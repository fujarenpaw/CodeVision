import * as vscode from 'vscode';
import { Position } from '../types/display';
import * as cytoscape from 'cytoscape';
import { Graph } from '../types/graph';

export class DisplaySystem {
    private panel: vscode.WebviewPanel | undefined;
    private cy: cytoscape.Core | undefined;
    private currentZoom = 1;
    private currentPosition: Position = { x: 0, y: 0 };
    private currentTheme = 'default';
    private nodeClickCallback: ((nodeId: string) => void) | undefined;

    public async createWebViewPanel(): Promise<vscode.WebviewPanel> {
        this.panel = vscode.window.createWebviewPanel(
            'butterflyGraph',
            'Butterfly Graph',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        this.panel.webview.html = this.getWebviewContent();
        this.setupMessageHandlers();

        return this.panel;
    }

    public async handleZoom(level: number): Promise<void> {
        this.currentZoom = level;
        if (this.cy) {
            this.cy.zoom({
                level: level,
                renderedPosition: { x: 0, y: 0 }
            });
        }
    }

    public async handlePan(offset: Position): Promise<void> {
        this.currentPosition = offset;
        if (this.cy) {
            this.cy.pan({
                x: offset.x,
                y: offset.y
            });
        }
    }

    public async handleNodeClick(nodeId: string): Promise<void> {
        if (this.nodeClickCallback) {
            this.nodeClickCallback(nodeId);
        }
    }

    public async applyTheme(theme: string): Promise<void> {
        this.currentTheme = theme;
        if (this.panel) {
            await this.panel.webview.postMessage({
                command: 'applyTheme',
                theme: theme
            });
        }
    }

    public getCurrentZoom(): number {
        return this.currentZoom;
    }

    public getCurrentPosition(): Position {
        return this.currentPosition;
    }

    public getCurrentTheme(): string {
        return this.currentTheme;
    }

    public onNodeClick(callback: (nodeId: string) => void): void {
        this.nodeClickCallback = callback;
    }

    public async updateGraph(graph: Graph): Promise<void> {
        if (!this.panel) {
            return;
        }
        await this.panel.webview.postMessage({ type: 'updateGraph', graph });
    }

    public async dispose(): Promise<void> {
        if (this.panel) {
            this.panel.dispose();
            this.panel = undefined;
        }
    }

    private getWebviewContent(): string {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Butterfly Graph</title>
                <script src="https://unpkg.com/cytoscape/dist/cytoscape.min.js"></script>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        width: 100vw;
                        height: 100vh;
                        overflow: hidden;
                    }
                    #cy {
                        width: 100%;
                        height: 100%;
                    }
                </style>
            </head>
            <body>
                <div id="cy"></div>
                <script>
                    const vscode = acquireVsCodeApi();
                    const cy = cytoscape({
                        container: document.getElementById('cy'),
                        style: [
                            {
                                selector: 'node',
                                style: {
                                    'label': 'data(name)',
                                    'text-valign': 'center',
                                    'text-halign': 'center'
                                }
                            },
                            {
                                selector: 'edge',
                                style: {
                                    'width': 2,
                                    'target-arrow-shape': 'triangle'
                                }
                            }
                        ]
                    });

                    // Handle messages from the extension
                    window.addEventListener('message', event => {
                        const message = event.data;
                        switch (message.command) {
                            case 'applyTheme':
                                applyTheme(message.theme);
                                break;
                        }
                    });

                    function applyTheme(theme) {
                        // Apply theme-specific styles
                        const styles = {
                            default: {
                                'background-color': '#ffffff',
                                'node-color': '#666',
                                'edge-color': '#999'
                            },
                            dark: {
                                'background-color': '#1e1e1e',
                                'node-color': '#fff',
                                'edge-color': '#666'
                            },
                            light: {
                                'background-color': '#f5f5f5',
                                'node-color': '#333',
                                'edge-color': '#666'
                            }
                        };

                        const themeStyle = styles[theme] || styles.default;
                        cy.style()
                            .selector('node')
                            .style('background-color', themeStyle['node-color'])
                            .update();
                        cy.style()
                            .selector('edge')
                            .style('line-color', themeStyle['edge-color'])
                            .update();
                        cy.style()
                            .selector('core')
                            .style('background-color', themeStyle['background-color'])
                            .update();
                    }
                </script>
            </body>
            </html>
        `;
    }

    private setupMessageHandlers(): void {
        if (this.panel) {
            this.panel.webview.onDidReceiveMessage(
                message => {
                    switch (message.command) {
                        case 'nodeClick':
                            this.handleNodeClick(message.nodeId);
                            break;
                    }
                },
                undefined
            );
        }
    }
} 