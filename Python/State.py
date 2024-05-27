from typing import List, Iterator, cast, Self

from DataFreezer import freeze_data


class State:

    def __init__(
            self,
            jobs: List[List[int]],
            schedule: List[List[int]],
            workers_status: List[int]
    ):
        self.jobs = jobs
        self.schedule = schedule
        self.workers_status = workers_status

    def calculate_h_cost(self) -> int:
        h_costs: List[int] = []
        for job_idx, job in enumerate(self.schedule):
            h_costs.append(0)
            for task_idx, task in enumerate(job):
                if (task == -1):
                    h_costs[job_idx] = (
                        h_costs[job_idx] +
                        self.jobs[job_idx][task_idx]
                    )
        return min(h_costs)

    def is_goal_state(self) -> bool:
        for job in self.schedule:
            for task in job:
                if (task == -1):
                    return False
        return True

    def get_first_unscheduled_tasks_idxs(self) -> List[int]:
        first_unscheduled_tasks_idxs: List[int] = []
        for job in self.schedule:
            current_task_idx: int = 0
            while (
                current_task_idx < len(job) and
                job[current_task_idx] >= 0
            ):
                current_task_idx = current_task_idx + 1
            if (current_task_idx < len(job)):
                first_unscheduled_tasks_idxs.append(current_task_idx)
            else:
                first_unscheduled_tasks_idxs.append(-1)
        return first_unscheduled_tasks_idxs

    def get_first_unscheduled_tasks_start_times(
        self,
        first_unscheduled_tasks_idxs: List[int],
    ) -> List[int]:
        first_unscheduled_tasks_start_times: List[int] = []
        for job_idx, job in enumerate(self.schedule):
            currently_unscheduled_task_idx = (
                first_unscheduled_tasks_idxs[job_idx]
            )
            if (currently_unscheduled_task_idx != -1):
                if (currently_unscheduled_task_idx == 0):
                    first_unscheduled_tasks_start_times.append(0)
                else:
                    first_unscheduled_tasks_start_times.append(
                        self.jobs[job_idx][currently_unscheduled_task_idx - 1]
                        + job[currently_unscheduled_task_idx - 1]
                    )
            else:
                first_unscheduled_tasks_start_times.append(-1)
        return first_unscheduled_tasks_start_times

    def get_neighbors_of(self) -> List[Self]:
        neighbors: List[State] = []

        first_unscheduled_tasks_idxs = self.get_first_unscheduled_tasks_idxs()
        first_unscheduled_tasks_start_times = (
            self.get_first_unscheduled_tasks_start_times(
                first_unscheduled_tasks_idxs
            )
        )

        for job_idx in range(0, len(self.schedule), 1):
            task_start_time = first_unscheduled_tasks_start_times[job_idx]
            if (task_start_time != -1):
                unscheduled_task_idx = first_unscheduled_tasks_idxs[job_idx]
                for worker_id, worker_start_free_time in (
                    enumerate(self.workers_status)
                ):
                    worker_start_time = max(
                        worker_start_free_time,
                        task_start_time
                    )

                    new_schedule = [job[:] for job in self.schedule]
                    new_schedule[job_idx][unscheduled_task_idx] = (
                        worker_start_time
                    )

                    new_workers_status = self.workers_status[:]
                    new_workers_status[worker_id] = (
                        worker_start_time +
                        self.jobs[job_idx][unscheduled_task_idx]
                    )

                    neighbors.append(State(new_schedule, new_workers_status))

        return neighbors

    def __iter__(self) -> Iterator[List[int]]:
        return self.schedule.__iter__()

    def __len__(self) -> int:
        return len(self.schedule)

    def __getitem__(self, index: int) -> List[int]:
        return self.schedule[index]

    def __str__(self) -> str:
        out: str = "(schedule=["
        for job in self.schedule:
            out: str = f"{out}[ "
            for task in job:
                out: str = f"{out}{task} "
            out: str = f"{out}]"
        out: str = f"{out}],workers_status=[ {' '.join([
                    str(worker_status) for worker_status in self.workers_status
                ])} ])"
        return out

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
