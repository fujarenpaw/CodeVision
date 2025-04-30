import * as vscode from 'vscode';

export interface FunctionInfo {
    name: string;
    uri: vscode.Uri;
    range: vscode.Range;
    location: {
        file: string;
        line: number;
        character: number;
    };
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

    private async convertToFunctionInfoRecursive(
        item: vscode.CallHierarchyItem,
        depth: number,
        maxDepth: number,
        isExcluded: (name: string) => boolean,
        direction: 'callee' | 'caller'
    ): Promise<FunctionInfo> {
        const functionInfo: FunctionInfo = {
            name: item.name,
            uri: item.uri,
            range: item.range,
            location: {
                file: item.uri.fsPath,
                line: item.range.start.line,
                character: item.range.start.character
            },
            callers: [],
            callees: []
        };

        if (depth < maxDepth) {
            if (direction === 'callee') {
                const callees = await this.getCallees(item);
                for (const callee of callees) {
                    if (callee.fromRanges.length > 0) {
                        if (!isExcluded(callee.to.name)) {
                            const calleeInfo = await this.convertToFunctionInfoRecursive(
                                callee.to, depth + 1, maxDepth, isExcluded, 'callee'
                            );
                            functionInfo.callees.push(calleeInfo);
                        }
                    }
                }
            } else if (direction === 'caller') {
                const callers = await this.getCallers(item);
                for (const caller of callers) {
                    if (caller.fromRanges.length > 0) {
                        if (!isExcluded(caller.from.name)) {
                            const callerInfo = await this.convertToFunctionInfoRecursive(
                                caller.from, depth + 1, maxDepth, isExcluded, 'caller'
                            );
                            functionInfo.callers.push(callerInfo);
                        }
                    }
                }
            }
        }
        return functionInfo;
    }

    public async analyzeFunction(
        document: vscode.TextDocument,
        position: vscode.Position,
        calleeLevels = 2,
        callerLevels = 2
    ): Promise<FunctionInfo | undefined> {
        try {
            console.log('Starting function analysis...');
            const item = await this.getCallHierarchyItem(document, position);
            if (!item) {
                console.log('No call hierarchy item found at position');
                return undefined;
            }

            console.log('Found call hierarchy item:', item.name);

            // 除外する関数名パターン（operatorや予約語など）
            const excludePatterns = [
                /^operator[\s\S]*/, // operatorで始まるもの全て
                /^std::/,             // 標準ライブラリ関数
                /^__.*__$/,           // __で囲まれた特殊関数
                /^~.*/,               // デストラクタ
            ];
            function isExcluded(name: string): boolean {
                return excludePatterns.some(pattern => pattern.test(name));
            }

            // 呼び出し先（callee）方向のツリー
            const rootFunction = await this.convertToFunctionInfoRecursive(
                item, 0, calleeLevels, isExcluded, 'callee'
            );

            // 呼び出し元（caller）方向のツリーも構築
            const callers = await this.getCallers(item);
            for (const caller of callers) {
                if (caller.fromRanges.length > 0) {
                    if (!isExcluded(caller.from.name)) {
                        const callerInfo = await this.convertToFunctionInfoRecursive(
                            caller.from, 1, callerLevels, isExcluded, 'caller'
                        );
                        rootFunction.callers.push(callerInfo);
                    }
                }
            }

            return rootFunction;
        } catch (error) {
            console.error('Error analyzing function:', error);
            throw error;
        }
    }
} 