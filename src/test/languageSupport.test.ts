import * as assert from 'assert';
import { LanguageSupport } from '../codeAnalysis/languageSupport';

suite('Language Support Test Suite', () => {
    let languageSupport: LanguageSupport;

    suiteSetup(async () => {
        languageSupport = new LanguageSupport();
    });

    suite('C/C++ Language Support', () => {
        test('should detect function definition', async () => {
            const code = `
                void testFunction(int param1, float param2) {
                    // function body
                }
            `;
            const result = await languageSupport.analyzeFunction(code, 'cpp');
            assert.strictEqual(result.name, 'testFunction');
            assert.strictEqual(result.parameters.length, 2);
        });

        test('should detect function calls', async () => {
            const code = `
                void caller() {
                    testFunction(1, 2.0);
                }
            `;
            const result = await languageSupport.analyzeFunctionCalls(code, 'cpp');
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].name, 'testFunction');
        });

        test('should handle class methods', async () => {
            const code = `
                class TestClass {
                    void method() {
                        // method body
                    }
                };
            `;
            const result = await languageSupport.analyzeFunction(code, 'cpp');
            assert.strictEqual(result.name, 'method');
            assert.strictEqual(result.isMethod, true);
        });
    });

    suite('C# Language Support', () => {
        test('should detect function definition', async () => {
            const code = `
                public void TestMethod(string param1, int param2)
                {
                    // method body
                }
            `;
            const result = await languageSupport.analyzeFunction(code, 'csharp');
            assert.strictEqual(result.name, 'TestMethod');
            assert.strictEqual(result.parameters.length, 2);
        });

        test('should detect function calls', async () => {
            const code = `
                public void Caller()
                {
                    TestMethod("test", 42);
                }
            `;
            const result = await languageSupport.analyzeFunctionCalls(code, 'csharp');
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].name, 'TestMethod');
        });

        test('should handle async methods', async () => {
            const code = `
                public async Task<int> AsyncMethod()
                {
                    await Task.Delay(100);
                    return 42;
                }
            `;
            const result = await languageSupport.analyzeFunction(code, 'csharp');
            assert.strictEqual(result.name, 'AsyncMethod');
            assert.strictEqual(result.isAsync, true);
        });
    });

    suite('Python Language Support', () => {
        test('should detect function definition', async () => {
            const code = `
                def test_function(param1: str, param2: int) -> None:
                    # function body
                    pass
            `;
            const result = await languageSupport.analyzeFunction(code, 'python');
            assert.strictEqual(result.name, 'test_function');
            assert.strictEqual(result.parameters.length, 2);
        });

        test('should detect function calls', async () => {
            const code = `
                def caller():
                    test_function("test", 42)
            `;
            const result = await languageSupport.analyzeFunctionCalls(code, 'python');
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].name, 'test_function');
        });

        test('should handle class methods', async () => {
            const code = `
                class TestClass:
                    def method(self):
                        pass
            `;
            const result = await languageSupport.analyzeFunction(code, 'python');
            assert.strictEqual(result.name, 'method');
            assert.strictEqual(result.isMethod, true);
        });

        test('should handle async functions', async () => {
            const code = `
                async def async_function():
                    await asyncio.sleep(1)
            `;
            const result = await languageSupport.analyzeFunction(code, 'python');
            assert.strictEqual(result.name, 'async_function');
            assert.strictEqual(result.isAsync, true);
        });
    });

    suite('Edge Cases', () => {
        test('should handle nested functions', async () => {
            const code = `
                def outer():
                    def inner():
                        pass
                    inner()
            `;
            const result = await languageSupport.analyzeFunction(code, 'python');
            assert.strictEqual(result.name, 'outer');
        });

        test('should handle function overloading', async () => {
            const code = `
                void overloaded(int x) {}
                void overloaded(float x) {}
            `;
            const result = await languageSupport.analyzeFunction(code, 'cpp');
            assert.strictEqual(result.name, 'overloaded');
        });

        test('should handle lambda functions', async () => {
            const code = `
                auto lambda = [](int x) { return x * 2; };
            `;
            const result = await languageSupport.analyzeFunction(code, 'cpp');
            assert.strictEqual(result.isLambda, true);
        });
    });
}); 