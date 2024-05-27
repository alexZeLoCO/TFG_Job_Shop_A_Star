from typing import List, Dict
from SortedList import SortedList
from State import State
from Wrappers import timeit


@timeit
def a_star(jobs: List[List[int]], n_workers: int) -> List[List[int]]:
    starting_state: State = State(
        [[-1] * len(jobs[0])] * len(jobs),
        [0] * n_workers
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
            tentative_g_cost: int = max(neighbor.workers_status)
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


def process_jobs(jobs: List[List[int]], max_workers: int = -1) -> None:
    if (max_workers == -1):
        max_workers = len(jobs) + 1
    for n_workers in range(1, max_workers+1, 1):
        a_star(jobs, n_workers)


def main():

    # CSV HEADER
    print("function;args;runtime")

    process_jobs([[2, 5], [3, 3]])
    process_jobs([[2, 5, 1], [3, 3, 3]])
    process_jobs([[2, 5, 1, 2], [3, 3, 3, 7]])
    process_jobs([[2, 5, 1, 2, 5], [3, 3, 3, 7, 5]])

    process_jobs([[2, 5], [3, 3], [1, 7]])
    process_jobs([[2, 5, 1], [3, 3, 3], [1, 7, 2]])
    process_jobs([[2, 5, 1, 2], [3, 3, 3, 7], [1, 7, 2, 8]], 2)
    process_jobs([[2, 5, 1, 2, 5], [3, 3, 3, 7, 5], [1, 7, 2, 8, 1]], 1)

    process_jobs([[2, 5], [3, 3], [1, 7], [2, 2]])
    process_jobs([[2, 5, 1], [3, 3, 3], [1, 7, 2], [2, 2, 3]], 2)
    process_jobs([[2, 5, 1, 2], [3, 3, 3, 7], [1, 7, 2, 8], [2, 2, 3, 6]], 1)
    process_jobs([[2, 5, 1, 2, 5], [3, 3, 3, 7, 5], [1, 7, 2, 8, 1], [2, 2, 3, 6, 4]], 1)


if __name__ == '__main__':
    main()
