from typing import List, Dict
from SortedList import SortedList
from State import State


def calculate_h_cost(state: State, jobs: List[List[int]]) -> int:
    h_costs: List[int] = []
    for job_idx, job in enumerate(state):
        h_costs.append(0)
        for task_idx, task in enumerate(job):
            if (task == -1):
                h_costs[job_idx] = h_costs[job_idx] + jobs[job_idx][task_idx]
    return min(h_costs)


def is_goal_state(state: State) -> bool:
    for job in state:
        for task in job:
            if (task == -1):
                return False
    return True


def get_first_unscheduled_tasks_idxs(state: State) -> List[int]:
    first_unscheduled_tasks_idxs: List[int] = []
    for job in state:
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
    state: State,
    first_unscheduled_tasks_idxs: List[int],
    jobs: List[List[int]]
) -> List[int]:
    first_unscheduled_tasks_start_times: List[int] = []
    for job_idx, job in enumerate(state):
        currently_unscheduled_task_idx = first_unscheduled_tasks_idxs[job_idx]
        if (currently_unscheduled_task_idx != -1):
            if (currently_unscheduled_task_idx == 0):
                first_unscheduled_tasks_start_times.append(0)
            else:
                first_unscheduled_tasks_start_times.append(
                    jobs[job_idx][currently_unscheduled_task_idx - 1] +
                    job[currently_unscheduled_task_idx - 1]
                )
        else:
            first_unscheduled_tasks_start_times.append(-1)
    return first_unscheduled_tasks_start_times


def get_neighbors_of(state: State, jobs: List[List[int]]) -> List[State]:
    neighbors: List[State] = []

    first_unscheduled_tasks_idxs = get_first_unscheduled_tasks_idxs(state)
    first_unscheduled_tasks_start_times = (
        get_first_unscheduled_tasks_start_times(
            state,
            first_unscheduled_tasks_idxs,
            jobs
        )
    )

    for job_idx in range(0, len(state), 1):
        task_start_time = first_unscheduled_tasks_start_times[job_idx]
        if (task_start_time != -1):
            unscheduled_task_idx = first_unscheduled_tasks_idxs[job_idx]
            # FIXME: Sth wrong here
            for worker_id, worker_start_free_time in (
                enumerate(state.workers_status)
            ):
                worker_start_time = max(
                    worker_start_free_time,
                    task_start_time
                )

                new_schedule = [job[:] for job in state]
                new_schedule[job_idx][unscheduled_task_idx] = worker_start_time

                new_workers_status = state.workers_status[:]
                new_workers_status[worker_id] = (
                    worker_start_time +
                    jobs[job_idx][unscheduled_task_idx]
                )

                neighbors.append(State(new_schedule, new_workers_status))

    return neighbors


def distance(a: State, b: State, jobs: List[List[int]]) -> int:
    for job_idx in range(0, len(a), 1):
        for task_idx in range(0, len(a[job_idx]), 1):
            if (a[job_idx][task_idx] != b[job_idx][task_idx]):
                return jobs[job_idx][task_idx]


def a_star(jobs: List[List[int]], n_workers: int) -> List[List[int]]:
    starting_state: State = State(
        [[-1] * len(jobs[0])] * len(jobs),
        [0] * n_workers
    )

    g_costs: Dict[State, int] = {
        starting_state: 0
    }
    f_costs: Dict[State, int] = {
        starting_state: calculate_h_cost(starting_state, jobs)
    }

    open_set: SortedList[State] = SortedList(
        lambda a, b: f_costs[a] < f_costs[b]
    )
    open_set.append(starting_state)

    while len(open_set) > 0:
        current_state: State = open_set.pop()
        if (is_goal_state(current_state)):
            return current_state.schedule
        neighbor_states: List[State] = get_neighbors_of(current_state, jobs)
        for neighbor in neighbor_states:
            tentative_g_cost: int = max(neighbor.workers_status)
            if (
                neighbor not in g_costs or
                tentative_g_cost < g_costs[neighbor]
            ):
                g_costs[neighbor] = tentative_g_cost
                f_costs[neighbor] = (
                    tentative_g_cost +
                    calculate_h_cost(neighbor, jobs)
                )
                if neighbor not in open_set:
                    open_set.append(neighbor)


def main():
    print(a_star([[2, 5, 1], [3, 3, 3]], 3))


if __name__ == '__main__':
    main()
