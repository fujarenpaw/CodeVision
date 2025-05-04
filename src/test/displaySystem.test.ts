import * as chai from 'chai';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { DisplaySystem } from '../display/system';
import { MockWebviewPanel, createMockGraph } from './mocks/displayMock';

const expect = chai.expect;

suite('DisplaySystem Test Suite', () => {
    let displaySystem: DisplaySystem;
    let mockPanel: vscode.WebviewPanel;

    setup(async () => {
        displaySystem = new DisplaySystem();
        mockPanel = await displaySystem.createWebViewPanel();
    });

    teardown(() => {
        sinon.restore();
    });

    test('should create webview panel', async () => {
        expect(mockPanel).to.be.instanceOf(MockWebviewPanel);
        expect(mockPanel.webview.html).to.include('cytoscape');
        expect(mockPanel.title).to.equal('Butterfly Graph');
    });

    test('should handle zoom', async () => {
        const initialZoom = displaySystem.getCurrentZoom();
        await displaySystem.handleZoom(1.5);
        expect(displaySystem.getCurrentZoom()).to.be.greaterThan(initialZoom);

        await displaySystem.handleZoom(0.5);
        expect(displaySystem.getCurrentZoom()).to.be.lessThan(initialZoom);
    });

    test('should handle pan', async () => {
        const initialPosition = displaySystem.getCurrentPosition();
        const newPosition = { x: 100, y: 100 };
        
        await displaySystem.handlePan(newPosition);
        const currentPosition = displaySystem.getCurrentPosition();
        
        expect(currentPosition).to.not.deep.equal(initialPosition);
        expect(currentPosition).to.deep.equal(newPosition);
    });

    test('should handle node click', async () => {
        const spy = sinon.spy(vscode.commands, 'executeCommand');
        await displaySystem.handleNodeClick('main');
        
        expect(spy.calledWith('workbench.action.focusActiveEditorGroup')).to.be.true;
        expect(spy.calledOnce).to.be.true;
    });

    test('should apply theme', async () => {
        await displaySystem.applyTheme('dark');
        expect(displaySystem.getCurrentTheme()).to.equal('dark');

        await displaySystem.applyTheme('light');
        expect(displaySystem.getCurrentTheme()).to.equal('light');
    });

    test('should handle empty graph', async () => {
        const emptyGraph = { nodes: [], edges: [] };
        await displaySystem.updateGraph(emptyGraph);
        
        expect(mockPanel.webview.html).to.include('cytoscape');
        expect(mockPanel.webview.html).to.include('[]');
    });

    test('should update graph with new data', async () => {
        const mockGraph = createMockGraph();
        await displaySystem.updateGraph(mockGraph);
        
        expect(mockPanel.webview.html).to.include('cytoscape');
        expect(mockPanel.webview.html).to.include(mockGraph.nodes[0].id);
    });

    test('should handle panel disposal', async () => {
        const disposeSpy = sinon.spy(mockPanel, 'dispose');
        await displaySystem.dispose();
        
        expect(disposeSpy.calledOnce).to.be.true;
    });

    test('should handle invalid zoom values', async () => {
        const initialZoom = displaySystem.getCurrentZoom();
        
        await displaySystem.handleZoom(-1);
        expect(displaySystem.getCurrentZoom()).to.equal(initialZoom);
        
        await displaySystem.handleZoom(0);
        expect(displaySystem.getCurrentZoom()).to.equal(initialZoom);
    });
}); 