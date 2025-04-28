#ifndef CALCULATOR_HPP
#define CALCULATOR_HPP

class Calculator {
public:
    // 基本的な算術演算
    double add(double a, double b);
    double subtract(double a, double b);
    double multiply(double a, double b);
    double divide(double a, double b);

    // 高度な演算
    double power(double base, int exponent);
    double squareRoot(double number);
    
    // 複合演算
    double calculateExpression(double a, double b);
    double solveQuadratic(double a, double b, double c);
};

#endif // CALCULATOR_HPP 