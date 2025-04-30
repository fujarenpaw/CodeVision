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

            console.log('Document symbols:', JSON.stringify(symbols, null, 2));

            // カーソル位置にある関数を特定
            let targetFunction: vscode.DocumentSymbol | undefined;
            let className = '';
            if (symbols) {
                for (const symbol of symbols) {
                    console.log('Checking symbol:', {
                        name: symbol.name,
                        kind: symbol.kind,
                        range: symbol.range
                    });
                    
                    if (symbol.kind === vscode.SymbolKind.Class) {
                        console.log('Found class:', symbol.name);
                        // クラス内の関数を探す
                        if (symbol.range.contains(position)) {
                            className = symbol.name;
                            console.log('Cursor is inside class:', className);
                            for (const child of symbol.children || []) {
                                console.log('Checking class child:', {
                                    name: child.name,
                                    kind: child.kind,
                                    range: child.range
                                });
                                if ((child.kind === vscode.SymbolKind.Function || 
                                    child.kind === vscode.SymbolKind.Method) &&
                                    child.range.contains(position)) {
                                    targetFunction = child;
                                    console.log('Found method in class:', child.name);
                                    break;
                                }
                            }
                        }
                    } else if (symbol.kind === vscode.SymbolKind.Function || 
                        symbol.kind === vscode.SymbolKind.Method) {
                        if (symbol.range.contains(position)) {
                            targetFunction = symbol;
                            console.log('Found standalone function:', symbol.name);
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

            console.log('Call hierarchy items before modification:', JSON.stringify(items, null, 2));
            
            if (items && items[0]) {
                // クラスメソッドの場合はクラス名を追加
                if (items[0].detail) {
                    // detailフィールドからクラス名を抽出
                    const detailMatch = items[0].detail.match(/^([\w:]+)\s*-/);
                    if (detailMatch && detailMatch[1]) {
                        className = detailMatch[1];
                        console.log('Extracted class name from detail:', className);
                    }
                }
                
                if (className) {
                    const originalName = items[0].name;
                    items[0].name = `${className}::${items[0].name}`;
                    console.log('Modified function name:', {
                        original: originalName,
                        className: className,
                        modified: items[0].name
                    });
                }
                console.log('Final call hierarchy item:', JSON.stringify(items[0], null, 2));
                return items[0];
            }
            return undefined;
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
        // detailからクラス名を抽出
        let className = '';
        if (item.detail) {
            const detailMatch = item.detail.match(/^([\w:]+)\s*-/);
            if (detailMatch && detailMatch[1]) {
                className = detailMatch[1];
                console.log('Extracted class name from detail (recursive):', className);
            }
        }
        let displayName = item.name;
        if (className) {
            displayName = `${className}::${item.name}`;
        }
        console.log('FunctionInfo name:', displayName);
        const functionInfo: FunctionInfo = {
            name: displayName,
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