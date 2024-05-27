from typing import List, Dict
from SortedList import SortedList
from State import State
from Task import Task
from Wrappers import timeit


def get_n_worker_types(
    jobs: List[List[Task]]
) -> int:
    return max(max([
        max([
            max(task.qualified_workers) if (
                task.qualified_workers is not None and
                len(task.qualified_workers) > 0
            ) else 1
            for task in job
        ] for job in jobs)
    ]))


@timeit
def a_star(
    jobs: List[List[Task]],
    n_workers: int,
    n_worker_types: int = None
) -> List[List[int]]:
    if (n_worker_types is None):
        n_worker_types = get_n_worker_types(jobs)
    starting_state: State = State(
        jobs,
        [[-1] * len(jobs[0])] * len(jobs),
        [[0] * n_workers] * (n_worker_types)
    )

    g_costs: Dict[State, int] = {
        starting_state: 0
    }
    f_costs: Dict[State, int] = {
        starting_state: starting_state.calculate_h_cost()
    }

    open_set: SortedList[State] = SortedList(
        lambda a, b: f_costs[a] < f_costs[b]
    )
    open_set.append(starting_state)

    while len(open_set) > 0:
        current_state: State = open_set.pop()
        if (current_state.is_goal_state()):
            return current_state.schedule
        neighbor_states: List[State] = current_state.get_neighbors_of()
        for neighbor in neighbor_states:
            tentative_g_cost: int = max([
                max(worker_type) for worker_type in neighbor.workers_status
            ])
            if (
                neighbor not in g_costs or
                tentative_g_cost < g_costs[neighbor]
            ):
                g_costs[neighbor] = tentative_g_cost
                f_costs[neighbor] = (
                    tentative_g_cost +
                    neighbor.calculate_h_cost()
                )
                if neighbor not in open_set:
                    open_set.append(neighbor)


def process_jobs(
    jobs: List[List[Task]],
    max_workers: int = None
) -> None:
    if (max_workers is None):
        max_workers = len(jobs) + 1
    for n_workers in range(1, max_workers+1, 1):
        a_star(jobs, n_workers)


def main():

    # CSV HEADER
    print("lang;n_threads;function;args;n_jobs"
          ";n_tasks;n_workers;runtime")

    process_jobs([
        [Task(2), Task(5)],
        [Task(3), Task(3)]
    ])
    process_jobs([
        [Task(2), Task(5), Task(1)],
        [Task(3), Task(3), Task(3)]
    ])
    process_jobs([
        [Task(2), Task(5), Task(1), Task(2)],
        [Task(3), Task(3), Task(3), Task(7)]
    ], 2)
    process_jobs([
        [Task(2), Task(5), Task(1), Task(2), Task(5)],
        [Task(3), Task(3), Task(3), Task(7), Task(5)]
    ], 0)  # Does not get past the first one

    process_jobs([
        [Task(2), Task(5)],
        [Task(3), Task(3)],
        [Task(1), Task(7)]
    ])
    process_jobs([
        [Task(2), Task(5), Task(1)],
        [Task(3), Task(3), Task(3)],
        [Task(1), Task(7), Task(2)]
    ], 1)
    process_jobs([
        [Task(2), Task(5), Task(1), Task(2)],
        [Task(3), Task(3), Task(3), Task(7)],
        [Task(1), Task(7), Task(2), Task(8)]
    ], 0)  # Does not get past the first one
    process_jobs([
        [Task(2), Task(5), Task(1), Task(2), Task(5)],
        [Task(3), Task(3), Task(3), Task(7), Task(5)],
        [Task(1), Task(7), Task(2), Task(8), Task(1)]
    ], 0)  # By comparison, should not get past the first one

    process_jobs([
        [Task(2), Task(5)],
        [Task(3), Task(3)],
        [Task(1), Task(7)],
        [Task(2), Task(2)]
    ], 1)
    process_jobs([
        [Task(2), Task(5), Task(1)],
        [Task(3), Task(3), Task(3)],
        [Task(1), Task(7), Task(2)],
        [Task(2), Task(2), Task(3)]
    ], 0)  # By comparison, should not get past the first one
    process_jobs([
        [Task(2), Task(5), Task(1), Task(2)],
        [Task(3), Task(3), Task(3), Task(7)],
        [Task(1), Task(7), Task(2), Task(8)],
        [Task(2), Task(2), Task(3), Task(6)]
    ], 0)  # By comparison, should not get past the first one
    process_jobs([
        [Task(2), Task(5), Task(1), Task(2), Task(5)],
        [Task(3), Task(3), Task(3), Task(7), Task(5)],
        [Task(1), Task(7), Task(2), Task(8), Task(1)],
        [Task(2), Task(2), Task(3), Task(6), Task(4)]
    ], 0)  # By comparison, should not get past the first one


if __name__ == '__main__':
    main()
