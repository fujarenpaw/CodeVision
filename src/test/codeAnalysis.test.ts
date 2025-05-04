import * as chai from 'chai';
import { CodeAnalysis } from '../codeAnalysis/codeAnalysis';

const expect = chai.expect;

suite('CodeAnalysis Test Suite', () => {
    let codeAnalysis: CodeAnalysis;

    setup(() => {
        codeAnalysis = new CodeAnalysis();
    });

    test('should analyze code', () => {
        const code = 'function test() { return true; }';
        const result = codeAnalysis.analyze(code);

        expect(result).to.not.be.undefined;
        expect(result.functions).to.have.lengthOf(1);
        expect(result.functions[0].name).to.equal('test');
    });

    test('should handle empty code', () => {
        const code = '';
        const result = codeAnalysis.analyze(code);

        expect(result).to.not.be.undefined;
        expect(result.functions).to.have.lengthOf(0);
    });

    test('should handle code with no functions', () => {
        const code = 'const x = 1;';
        const result = codeAnalysis.analyze(code);

        expect(result).to.not.be.undefined;
        expect(result.functions).to.have.lengthOf(0);
    });
}); 