import { GraphNode, GraphEdge } from './GraphVisualizer';
import * as vscode from 'vscode';

export interface LayoutOptions {
    maxNodesPerLevel: number;
    callerLevels: number;
    calleeLevels: number;
    viewportWidth: number;
    viewportHeight: number;
}

export class GraphLayout {
    private nodes: GraphNode[] = [];
    private edges: GraphEdge[] = [];
    private options: LayoutOptions;

    constructor(options: LayoutOptions) {
        this.options = options;
    }

    public setData(nodes: GraphNode[], edges: GraphEdge[]): void {
        this.nodes = nodes;
        this.edges = edges;
    }

    public calculateLayout(): { nodes: GraphNode[]; edges: GraphEdge[] } {
        // ノードのクラスタリング
        const clusteredNodes = this.clusterNodes();
        
        // 階層的なレイアウトの計算
        const layout = this.calculateHierarchicalLayout(clusteredNodes);
        
        // ビューポートに基づく最適化
        return this.optimizeForViewport(layout);
    }

    private clusterNodes(): Map<string, GraphNode[]> {
        const clusters = new Map<string, GraphNode[]>();
        
        // 中心ノードを特定
        const rootNode = this.nodes.find(node => node.id === 'root');
        if (!rootNode) {
            return clusters;
        }

        // 呼び出し元のクラスタリング
        const callerNodes = this.nodes.filter(node => node.id.startsWith('caller_'));
        clusters.set('callers', callerNodes);

        // 呼び出し先のクラスタリング
        const calleeNodes = this.nodes.filter(node => node.id.startsWith('callee_'));
        clusters.set('callees', calleeNodes);

        // 中心ノード
        clusters.set('root', [rootNode]);

        return clusters;
    }

    private calculateHierarchicalLayout(clusters: Map<string, GraphNode[]>): { nodes: GraphNode[]; edges: GraphEdge[] } {
        const layoutNodes: GraphNode[] = [];
        const layoutEdges: GraphEdge[] = [...this.edges];

        // 中心ノードの配置
        const rootNode = clusters.get('root')?.[0];
        if (rootNode) {
            rootNode.x = this.options.viewportWidth / 2;
            rootNode.y = this.options.viewportHeight / 2;
            layoutNodes.push(rootNode);
        }

        // 呼び出し元の配置
        const callerNodes = clusters.get('callers') || [];
        this.layoutNodesHorizontally(callerNodes, 0, this.options.viewportHeight / 2, true);

        // 呼び出し先の配置
        const calleeNodes = clusters.get('callees') || [];
        this.layoutNodesHorizontally(calleeNodes, this.options.viewportWidth, this.options.viewportHeight / 2, false);

        return {
            nodes: [...layoutNodes, ...callerNodes, ...calleeNodes],
            edges: layoutEdges
        };
    }

    private layoutNodesHorizontally(nodes: GraphNode[], startX: number, y: number, isLeft: boolean): void {
        const nodeSpacing = 100;
        const verticalSpacing = 50;
        
        nodes.forEach((node, index) => {
            const row = Math.floor(index / this.options.maxNodesPerLevel);
            const col = index % this.options.maxNodesPerLevel;
            
            node.x = isLeft 
                ? startX - (col + 1) * nodeSpacing
                : startX + (col + 1) * nodeSpacing;
            node.y = y + (row - Math.floor(nodes.length / this.options.maxNodesPerLevel) / 2) * verticalSpacing;
        });
    }

    private optimizeForViewport(layout: { nodes: GraphNode[]; edges: GraphEdge[] }): { nodes: GraphNode[]; edges: GraphEdge[] } {
        // ビューポート外のノードを非表示
        const visibleNodes = layout.nodes.filter(node => 
            node.x >= 0 && 
            node.x <= this.options.viewportWidth && 
            node.y >= 0 && 
            node.y <= this.options.viewportHeight
        );

        // 表示されるノードに接続されているエッジのみを保持
        const visibleNodeIds = new Set(visibleNodes.map(node => node.id));
        const visibleEdges = layout.edges.filter(edge => 
            visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
        );

        return {
            nodes: visibleNodes,
            edges: visibleEdges
        };
    }
} 