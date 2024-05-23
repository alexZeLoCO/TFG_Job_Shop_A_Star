from typing import List, Iterator, cast

from DataFreezer import freeze_data


class State:

    def __init__(
            self,
            schedule: List[List[int]],
            workers_status: List[int]
    ):
        self.schedule = schedule
        self.workers_status = workers_status

    def __iter__(self) -> Iterator[List[int]]:
        return self.schedule.__iter__()

    def __len__(self) -> int:
        return len(self.schedule)

    def __getitem__(self, index: int) -> List[int]:
        return self.schedule[index]

    def __str__(self) -> str:
        return (f"(schedule={self.schedule},"
                f"workers_status={self.workers_status})")

    def __repr__(self) -> str:
        return str(self)

    def __eq__(self, other: object) -> bool:
        if (not isinstance(other, State)):
            return False
        other_state: State = cast(State, other)
        return (
            other_state.schedule == self.schedule and
            other_state.workers_status == self.workers_status
        )

    def __hash__(self) -> int:
        return freeze_data(tuple(
            [self.schedule, self.workers_status]
        )).__hash__()
