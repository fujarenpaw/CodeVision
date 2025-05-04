import * as vscode from 'vscode';
import { FunctionDefinition, FunctionCall } from '../types/codeAnalysis';

export class CodeAnalysisEngine {
    private readonly supportedLanguages = ['c', 'cpp', 'csharp', 'python'];

    constructor() {
        // Initialize the engine
    }

    public async detectFunctionDefinition(code: string): Promise<FunctionDefinition[]> {
        try {
            const document = await this.createVirtualDocument(code);
            const definitions: FunctionDefinition[] = [];

            // Get the language identifier
            const languageId = document.languageId;
            if (!this.supportedLanguages.includes(languageId)) {
                throw new Error(`Unsupported language: ${languageId}`);
            }

            // Use LSP to get function definitions
            const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
                'vscode.executeDocumentSymbolProvider',
                document.uri
            );

            if (symbols) {
                for (const symbol of symbols) {
                    if (symbol.kind === vscode.SymbolKind.Function) {
                        definitions.push({
                            name: symbol.name,
                            startLine: symbol.range.start.line,
                            endLine: symbol.range.end.line,
                            parameters: this.extractParameters(symbol.detail || ''),
                            returnType: this.extractReturnType(symbol.detail || '')
                        });
                    }
                }
            }

            return definitions;
        } catch (error) {
            console.error('Error detecting function definitions:', error);
            throw error;
        }
    }

    public async detectFunctionCalls(code: string): Promise<FunctionCall[]> {
        try {
            const document = await this.createVirtualDocument(code);
            const calls: FunctionCall[] = [];

            // Get the language identifier
            const languageId = document.languageId;
            if (!this.supportedLanguages.includes(languageId)) {
                throw new Error(`Unsupported language: ${languageId}`);
            }

            // Use Call Hierarchy API to get function calls
            const callHierarchy = await vscode.commands.executeCommand<vscode.CallHierarchyItem[]>(
                'vscode.prepareCallHierarchy',
                document.uri,
                new vscode.Position(0, 0)
            );

            if (callHierarchy) {
                for (const item of callHierarchy) {
                    const incomingCalls = await vscode.commands.executeCommand<vscode.CallHierarchyIncomingCall[]>(
                        'vscode.provideCallHierarchyIncomingCalls',
                        item
                    );

                    if (incomingCalls) {
                        for (const call of incomingCalls) {
                            calls.push({
                                caller: call.from.name,
                                callee: item.name,
                                line: call.fromRanges[0].start.line
                            });
                        }
                    }
                }
            }

            return calls;
        } catch (error) {
            console.error('Error detecting function calls:', error);
            throw error;
        }
    }

    private async createVirtualDocument(code: string): Promise<vscode.TextDocument> {
        const uri = vscode.Uri.parse('untitled:temp.ts');
        const edit = new vscode.WorkspaceEdit();
        edit.insert(uri, new vscode.Position(0, 0), code);
        await vscode.workspace.applyEdit(edit);
        return await vscode.workspace.openTextDocument(uri);
    }

    private extractParameters(detail: string): string[] {
        // Extract parameters from function detail string
        // This is a simple implementation and might need to be enhanced
        const paramMatch = detail.match(/\((.*?)\)/);
        if (paramMatch && paramMatch[1]) {
            return paramMatch[1].split(',').map(p => p.trim());
        }
        return [];
    }

    private extractReturnType(detail: string): string | undefined {
        // Extract return type from function detail string
        // This is a simple implementation and might need to be enhanced
        const returnMatch = detail.match(/\)\s*:\s*(\w+)/);
        return returnMatch ? returnMatch[1] : undefined;
    }
} 