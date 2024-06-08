from typing import Tuple


class Task:

    def __init__(
        self,
        duration: int,
        qualified_workers: Tuple[int] = None
    ) -> None:
        self.duration: int = duration
        self.qualified_workers: Tuple = qualified_workers

    def __repr__(self) -> str:
        return (f"({self.duration}, "
                f"{repr(self.qualified_workers)})")
