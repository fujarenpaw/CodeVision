export interface FunctionDefinition {
    name: string;
    range: {
        start: number;
        end: number;
    };
}

export interface FunctionCall {
    caller: string;
    callee: string;
    range: {
        start: number;
        end: number;
    };
}

export interface AnalysisResult {
    functions: FunctionDefinition[];
    calls: FunctionCall[];
}

export class CodeAnalysis {
    public analyze(code: string): AnalysisResult {
        const functions: FunctionDefinition[] = [];
        const calls: FunctionCall[] = [];

        // Simple regex-based function detection
        const functionRegex = /function\s+(\w+)\s*\(/g;
        let match;
        while ((match = functionRegex.exec(code)) !== null) {
            functions.push({
                name: match[1],
                range: {
                    start: match.index,
                    end: match.index + match[0].length
                }
            });
        }

        // Simple regex-based function call detection
        const callRegex = /(\w+)\s*\(/g;
        while ((match = callRegex.exec(code)) !== null) {
            const functionName = match[1];
            if (functions.some(f => f.name === functionName)) {
                calls.push({
                    caller: 'unknown', // In a real implementation, this would be determined by context
                    callee: functionName,
                    range: {
                        start: match.index,
                        end: match.index + match[0].length
                    }
                });
            }
        }

        return { functions, calls };
    }
} 