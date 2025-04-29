#pragma once
#include <string>
#include <memory>
#include <vector>
#include <chrono>
#include <iostream>

// 抽象基底クラス
class DebugBase {
public:
    virtual ~DebugBase() = default;
    virtual void execute() = 0;
    virtual std::string getDebugInfo() const = 0;
    virtual void addChild(std::shared_ptr<DebugBase> child) = 0;
protected:
    std::string className;
    std::vector<std::shared_ptr<DebugBase>> children;
    std::chrono::steady_clock::time_point startTime;
};

// 具象クラス1
class DebugTestA : public DebugBase {
public:
    DebugTestA();
    void execute() override;
    std::string getDebugInfo() const override;
    void addChild(std::shared_ptr<DebugBase> child) override;
private:
    void processLevel1();
    void processLevel2();
    void processLevel3();
    void processLevel4();
    void processLevel5();
    void processLevel6();
    void processLevel7();
};

// 具象クラス2
class DebugTestB : public DebugBase {
public:
    DebugTestB();
    void execute() override;
    std::string getDebugInfo() const override;
    void addChild(std::shared_ptr<DebugBase> child) override;
private:
    void processLevel1();
    void processLevel2();
    void processLevel3();
    void processLevel4();
    void processLevel5();
    void processLevel6();
    void processLevel7();
};

// 具象クラス3
class DebugTestC : public DebugBase {
public:
    DebugTestC();
    void execute() override;
    std::string getDebugInfo() const override;
    void addChild(std::shared_ptr<DebugBase> child) override;
private:
    void processLevel1();
    void processLevel2();
    void processLevel3();
    void processLevel4();
    void processLevel5();
    void processLevel6();
    void processLevel7();
};

// ファサードクラス
class DebugTestFacade {
public:
    DebugTestFacade();
    void runAllTests();
    void runTestA();
    void runTestB();
    void runTestC();
private:
    std::shared_ptr<DebugTestA> testA;
    std::shared_ptr<DebugTestB> testB;
    std::shared_ptr<DebugTestC> testC;
}; 