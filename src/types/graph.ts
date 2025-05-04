export interface Node {
    id: string;
    name?: string;
    label: string;
    level?: number;
    position: {
        x: number;
        y: number;
    };
}

export interface Edge {
    source: string;
    target: string;
    type?: string;
}

export interface Graph {
    nodes: Node[];
    edges: Edge[];
} 