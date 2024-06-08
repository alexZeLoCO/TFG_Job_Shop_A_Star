#include <iostream>
#include <unordered_map>
#include <vector>
#include <omp.h>
#include <algorithm>
#include <optional>
#include <thread>

#include "chronometer.h"
#include "job_processors.h"
#include "sortedList.h"
#include "state.h"
#include "task.h"
#include "vector_ostreams.h"

State get_state(SortedList<State> &, const bool &);
void add_neighbors(
    const std::vector<State> &,
    std::unordered_map<State, unsigned int, StateHash, StateEqual> &,
    std::unordered_map<State, unsigned int, StateHash, StateEqual> &,
    SortedList<State> &);

State a_star(
    std::vector<std::vector<Task>> jobs,
    std::size_t n_workers,
    std::optional<Chronometer> c)
{
    const std::size_t n_jobs = jobs.size();
    if (n_jobs == 0)
        return State();
    const std::size_t n_tasks = jobs[0].size();
    if (n_tasks == 0)
        return State();
    if (n_workers == 0)
        n_workers = n_tasks;

    const std::vector<std::vector<int>> starting_schedule(n_jobs, std::vector<int>(n_tasks, -1));
    const std::vector<int> starting_workers_status(n_workers, 0);

    const State starting_state(jobs, starting_schedule, starting_workers_status);

    std::unordered_map<State, unsigned int, StateHash, StateEqual> g_costs;
    g_costs.try_emplace(starting_state, 0);
    std::unordered_map<State, unsigned int, StateHash, StateEqual> f_costs;
    f_costs.try_emplace(starting_state, starting_state.get_f_cost());

    const auto comparator = [&f_costs](const State &lhs, const State &rhs)
    {
        return f_costs[lhs] < f_costs[rhs];
    };

    SortedList<State> open_set(comparator);
    open_set.append(starting_state);

    State goal_state;
    bool found_goal_state = false;

// O(n^2 + 2n + n^2 + n * (l + n + n^2 + k)) or O(n^2 + n + 2n^2 + n^2 * (l + n + n^2 + k))
#pragma omp parallel shared(found_goal_state, goal_state, open_set, f_costs, g_costs)
    while (!found_goal_state)
    {
        State current_state = get_state(open_set, found_goal_state);

        if (current_state.is_goal_state())
        {
            goal_state = current_state;
            found_goal_state = true;
        }

        const std::vector<State> neighbor_states = current_state.get_neighbors_of(); // O(2n + n^2) or (n + 2n^2)
        add_neighbors(neighbor_states, g_costs, f_costs, open_set);
    }
    return goal_state;
}

State get_state(SortedList<State> &open_set, const bool &found_goal_state)
{
    bool has_state;
    State current_state;
    do
    {
#pragma omp critical(open_set)
            {
                has_state = !open_set.empty();
                if (has_state)
                {
                    current_state = open_set.pop(); // O(1)
                }
            }
    } while (!has_state && !found_goal_state);
    return current_state;
}

void add_neighbors(
    const std::vector<State> &neighbors,
    std::unordered_map<State, unsigned int, StateHash, StateEqual> &g_costs,
    std::unordered_map<State, unsigned int, StateHash, StateEqual> &f_costs,
    SortedList<State> &open_set)
{
    for (const State &neighbor : neighbors)
    {
        const unsigned int tentative_g_cost = neighbor.get_g_cost();
#pragma omp critical(costs)
        {
            if (g_costs.find(neighbor) == g_costs.end() || tentative_g_cost < g_costs[neighbor])
            {
                g_costs[neighbor] = tentative_g_cost;
                f_costs[neighbor] = tentative_g_cost + neighbor.get_h_cost();
#pragma omp critical(open_set)
                open_set.append(neighbor);
            }
        }
    }
}

int main(int argc, char **argv)
{
    // CSV HEADER
    std::cout << "lang;n_threads;function;percentage;n_jobs;n_tasks;n_workers;runtime;schedule;makespan" << std::endl;

    // std::cout << a_star({{2, 5, 1}, {3, 3, 3}}, 2, std::optional<Chronometer>()) << std::endl;

    std::string dataset_file = "../datasets/abz5.csv";

    std::vector<std::vector<Task>> jobs =
        cut(get_jobs_from_file(dataset_file), 1);

    timeit(a_star, jobs, calculate_n_workers(jobs));

    return 0;
}
