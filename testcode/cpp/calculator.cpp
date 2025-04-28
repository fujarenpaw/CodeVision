#include "calculator.hpp"
#include <cmath>
#include <stdexcept>

double Calculator::add(double a, double b) {
    return a + b;
}

double Calculator::subtract(double a, double b) {
    return a - b;
}

double Calculator::multiply(double a, double b) {
    return a * b;
}

double Calculator::divide(double a, double b) {
    if (b == 0) {
        throw std::invalid_argument("Division by zero");
    }
    return a / b;
}

double Calculator::power(double base, int exponent) {
    return std::pow(base, exponent);
}

double Calculator::squareRoot(double number) {
    if (number < 0) {
        throw std::invalid_argument("Cannot calculate square root of negative number");
    }
    return std::sqrt(number);
}

double Calculator::calculateExpression(double a, double b) {
    // (a + b)² / (a - b)
    double sum = add(a, b);
    double difference = subtract(a, b);
    double squared = power(sum, 2);
    return divide(squared, difference);
}

double Calculator::solveQuadratic(double a, double b, double c) {
    // Returns one root of ax² + bx + c = 0
    double discriminant = power(b, 2) - multiply(multiply(4, a), c);
    if (discriminant < 0) {
        throw std::invalid_argument("No real roots");
    }
    
    double sqrtDisc = squareRoot(discriminant);
    return divide(-b + sqrtDisc, multiply(2, a));
} 