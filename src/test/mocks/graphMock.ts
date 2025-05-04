import { Node, Edge, Graph } from '../../types/graph';

export function createMockNode(id: string, label: string, level: number): Node {
    return {
        id,
        label,
        level,
        position: { x: 0, y: 0 }
    };
}

export function createMockEdge(source: string, target: string): Edge {
    return {
        source,
        target
    };
}

export function createMockGraph(): Graph {
    const nodes: Node[] = [
        createMockNode('main', 'main', 0),
        createMockNode('func1', 'func1', 1),
        createMockNode('func2', 'func2', 1),
        createMockNode('func3', 'func3', 2),
        createMockNode('func4', 'func4', 2)
    ];

    const edges: Edge[] = [
        createMockEdge('main', 'func1'),
        createMockEdge('main', 'func2'),
        createMockEdge('func1', 'func3'),
        createMockEdge('func2', 'func4')
    ];

    return { nodes, edges };
}

export function createMockEmptyGraph(): Graph {
    return {
        nodes: [],
        edges: []
    };
}

export function createMockInvalidGraph(): Graph {
    return {
        nodes: [
            createMockNode('main', 'main', 0)
        ],
        edges: [
            createMockEdge('main', 'nonexistent')
        ]
    };
} 