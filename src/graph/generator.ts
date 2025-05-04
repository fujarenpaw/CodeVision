import { Node, Edge, Graph } from '../types/graph';

export class GraphGenerator {
    public generateButterflyGraph(nodes: Node[], edges: Edge[]): Graph {
        if (!this.validateGraphStructure(nodes, edges)) {
            throw new Error('Invalid graph structure');
        }

        const centerNode = this.findCenterNode(nodes, edges);
        if (!centerNode) {
            return { nodes: [], edges: [] };
        }

        const { callers, callees } = this.groupNodesByLevel(centerNode, edges);
        const positionedNodes = this.positionNodes([centerNode, ...Array.from(callers), ...Array.from(callees)]);

        return {
            nodes: positionedNodes,
            edges
        };
    }

    private validateGraphStructure(nodes: Node[], edges: Edge[]): boolean {
        const nodeIds = new Set(nodes.map(n => n.id));
        return edges.every(e => nodeIds.has(e.source) && nodeIds.has(e.target));
    }

    private findCenterNode(nodes: Node[], edges: Edge[]): Node | undefined {
        const inDegree = new Map<string, number>();
        const outDegree = new Map<string, number>();

        for (const edge of edges) {
            inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
            outDegree.set(edge.source, (outDegree.get(edge.source) || 0) + 1);
        }

        let maxScore = -1;
        let centerNode: Node | undefined;

        for (const node of nodes) {
            const score = (inDegree.get(node.id) || 0) + (outDegree.get(node.id) || 0);
            if (score > maxScore) {
                maxScore = score;
                centerNode = node;
            }
        }

        return centerNode;
    }

    private groupNodesByLevel(centerNode: Node, edges: Edge[]): { callers: Set<Node>, callees: Set<Node> } {
        const callers = new Set<Node>();
        const callees = new Set<Node>();

        for (const edge of edges) {
            if (edge.target === centerNode.id) {
                callers.add({ id: edge.source, label: edge.source, position: { x: 0, y: 0 } });
            }
            if (edge.source === centerNode.id) {
                callees.add({ id: edge.target, label: edge.target, position: { x: 0, y: 0 } });
            }
        }

        return { callers, callees };
    }

    private positionNodes(nodes: Node[]): Node[] {
        if (nodes.length === 0) {
            return [];
        }

        const centerNode = nodes[0];
        const callerNodes = nodes.slice(1, Math.floor(nodes.length / 2) + 1);
        const calleeNodes = nodes.slice(Math.floor(nodes.length / 2) + 1);

        const spacing = 100;
        const verticalSpacing = 100;

        centerNode.position = { x: 0, y: 0 };

        callerNodes.forEach((node, index) => {
            const x = -spacing * (index + 1);
            const y = -verticalSpacing;
            node.position = { x, y };
        });

        calleeNodes.forEach((node, index) => {
            const x = spacing * (index + 1);
            const y = verticalSpacing;
            node.position = { x, y };
        });

        return nodes;
    }
} 