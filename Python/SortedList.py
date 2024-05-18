from typing import List, Generic, TypeVar, Callable, Iterator

T = TypeVar('T')

class SortedList(Generic[T]):

    def __init__(self, sorter: Callable[[T, T], bool]):
        self._data: List[T] = []
        self._sorter: Callable[[T, T], bool] = sorter

    def append(self, item: T) -> None:
        current_index: int = 0
        while (
            current_index < len(self) and
            not self._sorter(item, self[current_index])
        ):
            current_index = current_index + 1
        self._data.append(None) 
        for i in range (len(self) - 1, current_index, -1):
            self._data[i] = self._data[i-1]
        self._data[current_index] = item

    def pop(self) -> T:
        return self._data.pop()

    def __getitem__(self, index: int) -> T:
        return self._data[index]

    def __iter__(self) -> Iterator[T]:
        return self._data.__iter__()

    def __len__(self) -> int:
        return len(self._data)

    def __str__(self) -> str:
        return str(self._data)

    def __repr__(self) -> str:
        return str(self)
