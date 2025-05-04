import * as vscode from 'vscode';

export class MockDocumentSymbol implements vscode.DocumentSymbol {
    name: string;
    detail: string;
    kind: vscode.SymbolKind;
    range: vscode.Range;
    selectionRange: vscode.Range;
    children: vscode.DocumentSymbol[];

    constructor(name: string, detail: string, range: vscode.Range) {
        this.name = name;
        this.detail = detail;
        this.kind = vscode.SymbolKind.Function;
        this.range = range;
        this.selectionRange = range;
        this.children = [];
    }
}

export class MockCallHierarchyItem implements vscode.CallHierarchyItem {
    name: string;
    kind: vscode.SymbolKind;
    uri: vscode.Uri;
    range: vscode.Range;
    selectionRange: vscode.Range;
    tags?: readonly vscode.SymbolTag[];

    constructor(name: string, uri: vscode.Uri, range: vscode.Range) {
        this.name = name;
        this.kind = vscode.SymbolKind.Function;
        this.uri = uri;
        this.range = range;
        this.selectionRange = range;
    }
}

export class MockCallHierarchyIncomingCall implements vscode.CallHierarchyIncomingCall {
    from: vscode.CallHierarchyItem;
    fromRanges: vscode.Range[];

    constructor(from: vscode.CallHierarchyItem, fromRanges: vscode.Range[]) {
        this.from = from;
        this.fromRanges = fromRanges;
    }
}

export function createMockDocumentSymbols(): vscode.DocumentSymbol[] {
    return [
        new MockDocumentSymbol(
            'testFunction',
            'function testFunction(): boolean',
            new vscode.Range(1, 0, 3, 0)
        )
    ];
}

export function createMockCallHierarchy(): vscode.CallHierarchyItem[] {
    const uri = vscode.Uri.parse('untitled:test.ts');
    return [
        new MockCallHierarchyItem(
            'testFunction',
            uri,
            new vscode.Range(1, 0, 3, 0)
        )
    ];
}

export function createMockIncomingCalls(): vscode.CallHierarchyIncomingCall[] {
    const uri = vscode.Uri.parse('untitled:test.ts');
    const caller = new MockCallHierarchyItem(
        'caller',
        uri,
        new vscode.Range(1, 0, 3, 0)
    );
    return [
        new MockCallHierarchyIncomingCall(
            caller,
            [new vscode.Range(2, 0, 2, 0)]
        )
    ];
} 