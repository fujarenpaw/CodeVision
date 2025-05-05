/// <reference lib="dom" />

export interface GraphNode {
    id: string;
    label: string;
    type: 'class' | 'function';
    location?: {
        file: string;
        line: number;
        character: number;
    };
    data?: Record<string, unknown>;
}

export interface GraphEdge {
    source: string;
    target: string;
    data?: Record<string, unknown>;
}

export interface GraphLayout {
    name: string;
    options?: Record<string, unknown>;
}

export interface GraphVisualizer {
    /**
     * グラフの初期化
     * @param container グラフを表示するHTML要素
     */
    initialize(container: HTMLElement): void;

    /**
     * グラフデータの設定
     * @param nodes ノードデータ
     * @param edges エッジデータ
     */
    setData(nodes: GraphNode[], edges: GraphEdge[]): void;

    /**
     * レイアウトの設定
     * @param layout レイアウト設定
     */
    setLayout(layout: GraphLayout): void;

    /**
     * ノードのクリックイベントハンドラの設定
     * @param handler イベントハンドラ
     */
    onNodeClick(handler: (node: GraphNode) => void): void;

    /**
     * グラフのズームレベルを設定
     * @param level ズームレベル
     */
    setZoom(level: number): void;

    /**
     * グラフのリセット
     */
    reset(): void;

    /**
     * グラフの破棄
     */
    destroy(): void;
} 