import * as chai from 'chai';
import { GraphGenerator } from '../graph/generator';
import { createMockGraph, createMockEmptyGraph, createMockInvalidGraph } from './mocks/graphMock';

const expect = chai.expect;

suite('GraphGenerator Test Suite', () => {
    let generator: GraphGenerator;

    setup(() => {
        generator = new GraphGenerator();
    });

    test('should generate butterfly graph', () => {
        const mockGraph = createMockGraph();
        const result = generator.generateButterflyGraph(mockGraph.nodes, mockGraph.edges);

        expect(result.nodes).to.have.lengthOf(5);
        expect(result.edges).to.have.lengthOf(4);
        expect(result.nodes.find(n => n.id === 'main')?.position).to.deep.equal({ x: 0, y: 0 });
    });

    test('should handle empty graph', () => {
        const mockGraph = createMockEmptyGraph();
        const result = generator.generateButterflyGraph(mockGraph.nodes, mockGraph.edges);

        expect(result.nodes).to.have.lengthOf(0);
        expect(result.edges).to.have.lengthOf(0);
    });

    test('should handle invalid graph', () => {
        const mockGraph = createMockInvalidGraph();
        expect(() => generator.generateButterflyGraph(mockGraph.nodes, mockGraph.edges))
            .to.throw('Invalid graph structure');
    });

    test('should position nodes correctly', () => {
        const mockGraph = createMockGraph();
        const result = generator.generateButterflyGraph(mockGraph.nodes, mockGraph.edges);

        const mainNode = result.nodes.find(n => n.id === 'main');
        const func1Node = result.nodes.find(n => n.id === 'func1');
        const func2Node = result.nodes.find(n => n.id === 'func2');

        expect(mainNode?.position).to.deep.equal({ x: 0, y: 0 });
        expect(func1Node?.position?.x).to.be.lessThan(0);
        expect(func2Node?.position?.x).to.be.greaterThan(0);
    });

    test('should handle single node graph', () => {
        const singleNodeGraph = {
            nodes: [{ id: 'main', label: 'main', position: { x: 0, y: 0 } }],
            edges: []
        };
        const result = generator.generateButterflyGraph(singleNodeGraph.nodes, singleNodeGraph.edges);

        expect(result.nodes).to.have.lengthOf(1);
        expect(result.edges).to.have.lengthOf(0);
        expect(result.nodes[0].position).to.deep.equal({ x: 0, y: 0 });
    });

    test('should handle disconnected nodes', () => {
        const disconnectedGraph = {
            nodes: [
                { id: 'node1', label: 'node1', position: { x: 0, y: 0 } },
                { id: 'node2', label: 'node2', position: { x: 0, y: 0 } }
            ],
            edges: []
        };
        const result = generator.generateButterflyGraph(disconnectedGraph.nodes, disconnectedGraph.edges);

        expect(result.nodes).to.have.lengthOf(2);
        expect(result.edges).to.have.lengthOf(0);
    });

    test('should handle circular dependencies', () => {
        const circularGraph = {
            nodes: [
                { id: 'node1', label: 'node1', position: { x: 0, y: 0 } },
                { id: 'node2', label: 'node2', position: { x: 0, y: 0 } }
            ],
            edges: [
                { source: 'node1', target: 'node2' },
                { source: 'node2', target: 'node1' }
            ]
        };
        const result = generator.generateButterflyGraph(circularGraph.nodes, circularGraph.edges);

        expect(result.nodes).to.have.lengthOf(2);
        expect(result.edges).to.have.lengthOf(2);
    });

    test('should handle deep graph structure', () => {
        const deepGraph = {
            nodes: [
                { id: 'main', label: 'main', position: { x: 0, y: 0 } },
                { id: 'level1', label: 'level1', position: { x: 0, y: 0 } },
                { id: 'level2', label: 'level2', position: { x: 0, y: 0 } },
                { id: 'level3', label: 'level3', position: { x: 0, y: 0 } }
            ],
            edges: [
                { source: 'main', target: 'level1' },
                { source: 'level1', target: 'level2' },
                { source: 'level2', target: 'level3' }
            ]
        };
        const result = generator.generateButterflyGraph(deepGraph.nodes, deepGraph.edges);

        expect(result.nodes).to.have.lengthOf(4);
        expect(result.edges).to.have.lengthOf(3);
        expect(result.nodes.find(n => n.id === 'main')?.position).to.deep.equal({ x: 0, y: 0 });
    });
}); 