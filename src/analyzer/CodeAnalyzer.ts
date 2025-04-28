import * as vscode from 'vscode';

export interface FunctionInfo {
    name: string;
    uri: vscode.Uri;
    range: vscode.Range;
    callers: FunctionInfo[];
    callees: FunctionInfo[];
}

export class CodeAnalyzer {
    private async getCallHierarchyItem(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<vscode.CallHierarchyItem | undefined> {
        console.log('Getting call hierarchy item for:', {
            uri: document.uri.toString(),
            position: {
                line: position.line,
                character: position.character
            },
            language: document.languageId,
            lineText: document.lineAt(position.line).text
        });

        try {
            // まず、シンボルプロバイダーを使用して関数を検出
            const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
                'vscode.executeDocumentSymbolProvider',
                document.uri
            );

            console.log('Document symbols:', symbols);

            // カーソル位置にある関数を特定
            let targetFunction: vscode.DocumentSymbol | undefined;
            if (symbols) {
                for (const symbol of symbols) {
                    if (symbol.kind === vscode.SymbolKind.Function || 
                        symbol.kind === vscode.SymbolKind.Method) {
                        if (symbol.range.contains(position)) {
                            targetFunction = symbol;
                            break;
                        }
                    }
                }
            }

            if (targetFunction) {
                console.log('Found function symbol:', targetFunction.name);
            } else {
                console.log('No function symbol found at position');
            }

            // Call Hierarchy APIを使用
            const items = await vscode.commands.executeCommand<vscode.CallHierarchyItem[]>(
                'vscode.prepareCallHierarchy',
                document.uri,
                position
            );

            console.log('Call hierarchy items:', items);
            return items?.[0];
        } catch (error) {
            console.error('Error in getCallHierarchyItem:', error);
            return undefined;
        }
    }

    private async getCallers(item: vscode.CallHierarchyItem): Promise<vscode.CallHierarchyIncomingCall[]> {
        console.log('Getting callers for:', item.name);
        try {
            const calls = await vscode.commands.executeCommand<vscode.CallHierarchyIncomingCall[]>(
                'vscode.provideIncomingCalls',
                item
            );
            console.log('Callers found:', calls?.length);
            return calls || [];
        } catch (error) {
            console.error('Error getting callers:', error);
            return [];
        }
    }

    private async getCallees(item: vscode.CallHierarchyItem): Promise<vscode.CallHierarchyOutgoingCall[]> {
        console.log('Getting callees for:', item.name);
        try {
            const calls = await vscode.commands.executeCommand<vscode.CallHierarchyOutgoingCall[]>(
                'vscode.provideOutgoingCalls',
                item
            );
            console.log('Callees found:', calls?.length);
            return calls || [];
        } catch (error) {
            console.error('Error getting callees:', error);
            return [];
        }
    }

    private convertToFunctionInfo(
        item: vscode.CallHierarchyItem,
        _depth: number,
        _maxDepth: number
    ): FunctionInfo {
        return {
            name: item.name,
            uri: item.uri,
            range: item.range,
            callers: [],
            callees: []
        };
    }

    public async analyzeFunction(
        document: vscode.TextDocument,
        position: vscode.Position,
        maxDepth = 2
    ): Promise<FunctionInfo | undefined> {
        try {
            console.log('Starting function analysis...');
            const item = await this.getCallHierarchyItem(document, position);
            if (!item) {
                console.log('No call hierarchy item found at position');
                return undefined;
            }

            console.log('Found call hierarchy item:', item.name);
            const rootFunction = this.convertToFunctionInfo(item, 0, maxDepth);

            // 呼び出し元の解析
            const callers = await this.getCallers(item);
            for (const caller of callers) {
                if (caller.fromRanges.length > 0) {
                    const callerInfo = this.convertToFunctionInfo(caller.from, 1, maxDepth);
                    rootFunction.callers.push(callerInfo);
                }
            }

            // 呼び出し先の解析
            const callees = await this.getCallees(item);
            for (const callee of callees) {
                if (callee.fromRanges.length > 0) {
                    const calleeInfo = this.convertToFunctionInfo(callee.to, 1, maxDepth);
                    rootFunction.callees.push(calleeInfo);
                }
            }

            console.log('Function analysis completed:', {
                name: rootFunction.name,
                callers: rootFunction.callers.length,
                callees: rootFunction.callees.length
            });

            return rootFunction;
        } catch (error) {
            console.error('Error analyzing function:', error);
            throw error;
        }
    }
} 