import time
from abc import ABC, abstractmethod
from typing import List
from dataclasses import dataclass, field
from datetime import datetime

class DebugBase(ABC):
    def __init__(self):
        self.class_name = self.__class__.__name__
        self.start_time = time.time()
        self.children: List['DebugBase'] = []

    def add_child(self, child: 'DebugBase') -> None:
        self.children.append(child)

    @abstractmethod
    def execute(self) -> None:
        pass

    def get_debug_info(self) -> str:
        duration = (time.time() - self.start_time) * 1000  # Convert to milliseconds
        return f"{self.class_name} execution time: {duration:.2f}ms"

class DebugTestA(DebugBase):
    def execute(self) -> None:
        print(f"Starting {self.class_name} execution")
        self._process_level1()
        for child in self.children:
            child.execute()

    def _process_level1(self) -> None: self._process_level2()
    def _process_level2(self) -> None: self._process_level3()
    def _process_level3(self) -> None: self._process_level4()
    def _process_level4(self) -> None: self._process_level5()
    def _process_level5(self) -> None: self._process_level6()
    def _process_level6(self) -> None: self._process_level7()
    def _process_level7(self) -> None:
        time.sleep(0.1)
        print(f"{self.class_name} reached level 7")

class DebugTestB(DebugBase):
    def execute(self) -> None:
        print(f"Starting {self.class_name} execution")
        self._process_level1()
        for child in self.children:
            child.execute()

    def _process_level1(self) -> None: self._process_level2()
    def _process_level2(self) -> None: self._process_level3()
    def _process_level3(self) -> None: self._process_level4()
    def _process_level4(self) -> None: self._process_level5()
    def _process_level5(self) -> None: self._process_level6()
    def _process_level6(self) -> None: self._process_level7()
    def _process_level7(self) -> None:
        time.sleep(0.15)
        print(f"{self.class_name} reached level 7")

class DebugTestC(DebugBase):
    def execute(self) -> None:
        print(f"Starting {self.class_name} execution")
        self._process_level1()
        for child in self.children:
            child.execute()

    def _process_level1(self) -> None: self._process_level2()
    def _process_level2(self) -> None: self._process_level3()
    def _process_level3(self) -> None: self._process_level4()
    def _process_level4(self) -> None: self._process_level5()
    def _process_level5(self) -> None: self._process_level6()
    def _process_level6(self) -> None: self._process_level7()
    def _process_level7(self) -> None:
        time.sleep(0.2)
        print(f"{self.class_name} reached level 7")

class DebugTestFacade:
    def __init__(self):
        self.test_a = DebugTestA()
        self.test_b = DebugTestB()
        self.test_c = DebugTestC()

    def run_all_tests(self) -> None:
        print("Running all tests...")
        self.test_a.execute()
        self.test_b.execute()
        self.test_c.execute()

    def run_test_a(self) -> None:
        print("Running Test A...")
        self.test_a.execute()

    def run_test_b(self) -> None:
        print("Running Test B...")
        self.test_b.execute()

    def run_test_c(self) -> None:
        print("Running Test C...")
        self.test_c.execute()

if __name__ == "__main__":
    facade = DebugTestFacade()
    facade.run_all_tests() 