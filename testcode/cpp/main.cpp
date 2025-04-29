#include "DebugTest.hpp"
#include <iostream>

int main() {
    try {
        DebugTestFacade facade;
        
        // 個別のテストを実行
        std::cout << "\nRunning individual tests:" << std::endl;
        facade.runTestA();
        facade.runTestB();
        facade.runTestC();
        
        // すべてのテストを実行
        std::cout << "\nRunning all tests:" << std::endl;
        facade.runAllTests();
        
        return 0;
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
} 