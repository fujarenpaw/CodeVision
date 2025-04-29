#include "DebugTest.hpp"
#include <sstream>
#include <thread>

// DebugBase 実装
void DebugBase::addChild(std::shared_ptr<DebugBase> child) {
    children.push_back(child);
}

// DebugTestA 実装
DebugTestA::DebugTestA() {
    className = "DebugTestA";
    startTime = std::chrono::steady_clock::now();
}

void DebugTestA::execute() {
    std::cout << "Starting " << className << " execution" << std::endl;
    processLevel1();
    for (auto& child : children) {
        child->execute();
    }
}

std::string DebugTestA::getDebugInfo() const {
    auto endTime = std::chrono::steady_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
    std::stringstream ss;
    ss << className << " execution time: " << duration.count() << "ms";
    return ss.str();
}

void DebugTestA::processLevel1() { processLevel2(); }
void DebugTestA::processLevel2() { processLevel3(); }
void DebugTestA::processLevel3() { processLevel4(); }
void DebugTestA::processLevel4() { processLevel5(); }
void DebugTestA::processLevel5() { processLevel6(); }
void DebugTestA::processLevel6() { processLevel7(); }
void DebugTestA::processLevel7() {
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    std::cout << className << " reached level 7" << std::endl;
}

// DebugTestB 実装
DebugTestB::DebugTestB() {
    className = "DebugTestB";
    startTime = std::chrono::steady_clock::now();
}

void DebugTestB::execute() {
    std::cout << "Starting " << className << " execution" << std::endl;
    processLevel1();
    for (auto& child : children) {
        child->execute();
    }
}

std::string DebugTestB::getDebugInfo() const {
    auto endTime = std::chrono::steady_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
    std::stringstream ss;
    ss << className << " execution time: " << duration.count() << "ms";
    return ss.str();
}

void DebugTestB::processLevel1() { processLevel2(); }
void DebugTestB::processLevel2() { processLevel3(); }
void DebugTestB::processLevel3() { processLevel4(); }
void DebugTestB::processLevel4() { processLevel5(); }
void DebugTestB::processLevel5() { processLevel6(); }
void DebugTestB::processLevel6() { processLevel7(); }
void DebugTestB::processLevel7() {
    std::this_thread::sleep_for(std::chrono::milliseconds(150));
    std::cout << className << " reached level 7" << std::endl;
}

// DebugTestC 実装
DebugTestC::DebugTestC() {
    className = "DebugTestC";
    startTime = std::chrono::steady_clock::now();
}

void DebugTestC::execute() {
    std::cout << "Starting " << className << " execution" << std::endl;
    processLevel1();
    for (auto& child : children) {
        child->execute();
    }
}

std::string DebugTestC::getDebugInfo() const {
    auto endTime = std::chrono::steady_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
    std::stringstream ss;
    ss << className << " execution time: " << duration.count() << "ms";
    return ss.str();
}

void DebugTestC::processLevel1() { processLevel2(); }
void DebugTestC::processLevel2() { processLevel3(); }
void DebugTestC::processLevel3() { processLevel4(); }
void DebugTestC::processLevel4() { processLevel5(); }
void DebugTestC::processLevel5() { processLevel6(); }
void DebugTestC::processLevel6() { processLevel7(); }
void DebugTestC::processLevel7() {
    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    std::cout << className << " reached level 7" << std::endl;
}

// DebugTestFacade 実装
DebugTestFacade::DebugTestFacade() {
    testA = std::make_shared<DebugTestA>();
    testB = std::make_shared<DebugTestB>();
    testC = std::make_shared<DebugTestC>();
}

void DebugTestFacade::runAllTests() {
    std::cout << "Running all tests..." << std::endl;
    testA->execute();
    testB->execute();
    testC->execute();
}

void DebugTestFacade::runTestA() {
    std::cout << "Running Test A..." << std::endl;
    testA->execute();
}

void DebugTestFacade::runTestB() {
    std::cout << "Running Test B..." << std::endl;
    testB->execute();
}

void DebugTestFacade::runTestC() {
    std::cout << "Running Test C..." << std::endl;
    testC->execute();
} 