/// <reference lib="dom" />

import cytoscape from 'cytoscape';
import { GraphNode, GraphEdge, GraphLayout, GraphVisualizer } from './GraphVisualizer';

export class CytoscapeVisualizer implements GraphVisualizer {
    private cy: cytoscape.Core | null = null;

    initialize(container: HTMLElement): void {
        this.cy = cytoscape({
            container: container,
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'background-color': '#666',
                        'color': '#fff'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': '#999',
                        'target-arrow-color': '#999',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier'
                    }
                }
            ]
        });
    }

    setData(nodes: GraphNode[], edges: GraphEdge[]): void {
        if (!this.cy) {
            throw new Error('Visualizer not initialized');
        }

        const elements = {
            nodes: nodes.map(node => ({
                data: {
                    id: node.id,
                    label: node.label,
                    ...node.data
                }
            })),
            edges: edges.map(edge => ({
                data: {
                    source: edge.source,
                    target: edge.target,
                    ...edge.data
                }
            }))
        };

        this.cy.elements().remove();
        this.cy.add(elements);
    }

    setLayout(layout: GraphLayout): void {
        if (!this.cy) {
            throw new Error('Visualizer not initialized');
        }

        const layoutOptions = {
            name: layout.name,
            ...layout.options
        };

        this.cy.layout(layoutOptions).run();
    }

    onNodeClick(handler: (node: GraphNode) => void): void {
        if (!this.cy) {
            throw new Error('Visualizer not initialized');
        }

        this.cy.on('tap', 'node', (evt: cytoscape.EventObject) => {
            const node = evt.target;
            handler({
                id: node.id(),
                label: node.data('label'),
                data: node.data()
            });
        });
    }

    setZoom(level: number): void {
        if (!this.cy) {
            throw new Error('Visualizer not initialized');
        }

        this.cy.zoom({
            level: level,
            renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
        });
    }

    reset(): void {
        if (!this.cy) {
            throw new Error('Visualizer not initialized');
        }

        this.cy.reset();
    }

    destroy(): void {
        if (this.cy) {
            this.cy.destroy();
            this.cy = null;
        }
    }
} 