import * as chai from 'chai';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { CodeAnalysisEngine } from '../codeAnalysis/engine';
import { createMockDocumentSymbols, createMockIncomingCalls } from './mocks/codeAnalysisMock';

const expect = chai.expect;

suite('CodeAnalysisEngine Test Suite', () => {
    let engine: CodeAnalysisEngine;
    let mockSymbolProvider: sinon.SinonStub;
    let mockCallHierarchyProvider: sinon.SinonStub;

    setup(() => {
        engine = new CodeAnalysisEngine();
        mockSymbolProvider = sinon.stub(vscode.languages, 'registerDocumentSymbolProvider').returns({
            dispose: (): void => { /* empty */ }
        });
        mockCallHierarchyProvider = sinon.stub(vscode.languages, 'registerCallHierarchyProvider').returns({
            dispose: (): void => { /* empty */ }
        });
    });

    teardown(() => {
        sinon.restore();
    });

    test('should detect function definition', async () => {
        const mockDocument = await vscode.workspace.openTextDocument({
            content: 'function test() {}\nfunction test2() {}',
            language: 'typescript'
        });

        const mockSymbols = createMockDocumentSymbols();
        mockSymbolProvider.resolves(mockSymbols);

        const result = await engine.detectFunctionDefinition(mockDocument.getText());
        expect(result).to.have.lengthOf(1);
        expect(result[0].name).to.equal('testFunction');
    });

    test('should detect function calls', async () => {
        const mockDocument = await vscode.workspace.openTextDocument({
            content: 'function caller() { testFunction(); }',
            language: 'typescript'
        });

        const mockCalls = createMockIncomingCalls();
        mockCallHierarchyProvider.resolves(mockCalls);

        const result = await engine.detectFunctionCalls(mockDocument.getText());
        expect(result).to.have.lengthOf(1);
        expect(result[0].caller).to.equal('caller');
    });

    test('should handle empty document', async () => {
        const mockDocument = await vscode.workspace.openTextDocument({
            content: '',
            language: 'typescript'
        });

        const result = await engine.detectFunctionDefinition(mockDocument.getText());
        expect(result).to.have.lengthOf(0);
    });

    test('should handle document with no functions', async () => {
        const mockDocument = await vscode.workspace.openTextDocument({
            content: 'const x = 1;',
            language: 'typescript'
        });

        const result = await engine.detectFunctionDefinition(mockDocument.getText());
        expect(result).to.have.lengthOf(0);
    });

    test('should handle symbol provider error', async () => {
        const mockDocument = await vscode.workspace.openTextDocument({
            content: 'function test() {}',
            language: 'typescript'
        });

        mockSymbolProvider.rejects(new Error('Provider error'));

        try {
            await engine.detectFunctionDefinition(mockDocument.getText());
            expect.fail('Should have thrown an error');
        } catch (error: unknown) {
            if (error instanceof Error) {
                expect(error.message).to.equal('Provider error');
            } else {
                expect.fail('Error should be an instance of Error');
            }
        }
    });

    test('should handle call hierarchy provider error', async () => {
        const mockDocument = await vscode.workspace.openTextDocument({
            content: 'function test() {}',
            language: 'typescript'
        });

        mockCallHierarchyProvider.rejects(new Error('Provider error'));

        try {
            await engine.detectFunctionCalls(mockDocument.getText());
            expect.fail('Should have thrown an error');
        } catch (error: unknown) {
            if (error instanceof Error) {
                expect(error.message).to.equal('Provider error');
            } else {
                expect.fail('Error should be an instance of Error');
            }
        }
    });
}); 