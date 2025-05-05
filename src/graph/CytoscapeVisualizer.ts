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

        this.initializeStyles();
    }

    private initializeStyles(): void {
        if (!this.cy) return;
        
        this.cy.style()
            .selector('node')
            .style({
                'width': 120,
                'height': 60,
                'background-color': '#666',
                'label': 'data(label)',
                'text-wrap': 'wrap',
                'text-max-width': '100px',
                'text-valign': 'center',
                'text-halign': 'center',
                'color': '#fff',
                'font-size': '12px',
                'padding': '10px',
                'border-width': '2px',
                'border-color': '#999',
                'shape': 'roundrectangle'
            })
            .selector('edge')
            .style({
                'width': 2,
                'line-color': '#999',
                'target-arrow-color': '#999',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'control-point-step-size': 50
            })
            .update();
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
                    type: node.type,
                    ...(node.location ? { location: node.location } : {})
                }
            })),
            edges: edges.map(edge => ({
                data: {
                    source: edge.source,
                    target: edge.target,
                    ...(edge.data ? edge.data : {})
                }
            }))
        };

        this.cy.elements().remove();
        this.cy.add(elements as any);
    }

    setLayout(layout: GraphLayout): void {
        if (!this.cy) {
            throw new Error('Visualizer not initialized');
        }

        const layoutOptions = {
            name: layout.name,
            ...layout.options,
            spacingFactor: 2.0,
            nodeDimensionsIncludeLabels: true,
            padding: 50,
            rankDir: 'LR',
            rankSep: 200,
            nodeSep: 100,
            animate: true,
            animationDuration: 500,
            avoidOverlap: true,
            avoidOverlapPadding: 20
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
                type: node.data('type'),
                data: node.data(),
                location: node.data('location')
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