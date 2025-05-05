export interface FunctionInfo {
    name: string;
    parameters: ParameterInfo[];
    returnType?: string;
    isMethod: boolean;
    isAsync: boolean;
    isLambda: boolean;
    location?: Location;
}

export interface ParameterInfo {
    name: string;
    type: string;
}

export interface Location {
    line: number;
    column: number;
    endLine: number;
    endColumn: number;
} 