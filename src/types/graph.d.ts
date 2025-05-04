export interface Node {
    id: string;
    name: string;
    position?: {
        x: number;
        y: number;
    };
}

export interface Edge {
    source: string;
    target: string;
}

export interface Graph {
    nodes: Node[];
    edges: Edge[];
}

export interface GraphGenerator {
    generateButterflyGraph(nodes: Node[], edges: Edge[]): Graph;
} 