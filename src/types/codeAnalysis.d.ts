export interface FunctionDefinition {
    name: string;
    startLine: number;
    endLine: number;
    parameters: string[];
    returnType?: string;
}

export interface FunctionCall {
    caller: string;
    callee: string;
    line: number;
}

export interface CodeAnalysisEngine {
    detectFunctionDefinition(code: string): Promise<FunctionDefinition[]>;
    detectFunctionCalls(code: string): Promise<FunctionCall[]>;
} 