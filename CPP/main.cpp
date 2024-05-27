#include <iostream>
#include <unordered_map>
#include <vector>
#include <chrono>
#include <typeinfo>
#include <iomanip>
#include <omp.h>
#include <algorithm>

#include "state.h"
#include "sortedList.h"

// Forward declaration of the template function
template <typename T>
std::ostream &operator<<(std::ostream &os, const std::vector<T> &vec);

// Helper function to print vectors
template <typename T>
void print_vector(std::ostream &os, const std::vector<T> &vec)
{
    os << '[';
    for (std::size_t i = 0; i < vec.size(); ++i)
    {
        os << vec[i];
        if (i != vec.size() - 1)
        {
            os << ", ";
        }
    }
    os << ']';
}

// Specialization for vectors of vectors
template <typename T>
void print_vector(std::ostream &os, const std::vector<std::vector<T>> &vec)
{
    os << '[';
    for (std::size_t i = 0; i < vec.size(); ++i)
    {
        os << vec[i];
        if (i != vec.size() - 1)
        {
            os << ", ";
        }
    }
    os << ']';
}

// Overload of the << operator for std::vector
template <typename T>
std::ostream &operator<<(std::ostream &os, const std::vector<T> &vec)
{
    print_vector(os, vec);
    return os;
}

State a_star(std::vector<std::vector<int>> jobs, int n_workers)
{
    const std::size_t n_jobs = jobs.size();
    if (n_jobs == 0)
        return State();
    const std::size_t n_tasks = jobs[0].size();
    if (n_tasks == 0)
        return State();

    const std::vector<std::vector<int>> starting_schedule(n_jobs, std::vector<int>(n_tasks, -1));
    const std::vector<int> starting_workers_status(n_workers, 0);

    const State starting_state(jobs, starting_schedule, starting_workers_status, 0);

    std::unordered_map<State, int, StateHash> g_costs;
    g_costs.try_emplace(starting_state, 0);
    std::unordered_map<State, int, StateHash> f_costs;
    f_costs.try_emplace(starting_state, starting_state.get_f_cost());

    const auto comparator = [&f_costs](const State &lhs, const State &rhs)
    {
        return f_costs[lhs] < f_costs[rhs];
    };

    SortedList<State> open_set(comparator);
    open_set.append(starting_state);

    State goal_state;
    bool found_goal_state = false;

    while (!found_goal_state && !open_set.empty())
    {
        int max_threads = std::min(omp_get_max_threads(), (int)open_set.size());
#pragma omp parallel for shared(open_set, goal_state, found_goal_state, f_costs, g_costs)
        for (int i = 0; i < max_threads; i++)
        {
            State current_state;

#pragma omp critical(open_set)
            current_state = open_set.pop();

            if (current_state.is_goal_state())
            {
#pragma omp critical(goal)
                {
                    goal_state = current_state;
                    found_goal_state = true;
                }
            }

            const std::vector<State> neighbor_states = current_state.get_neighbors_of();
            for (const State &neighbor : neighbor_states)
            {
                int tentative_g_cost = neighbor.get_max_worker_status();
#pragma omp critical(open_set)
                {
                    if (g_costs.find(neighbor) == g_costs.end() ||
                        tentative_g_cost < g_costs[neighbor])
                    {
                        g_costs[neighbor] = tentative_g_cost;
                        f_costs[neighbor] = tentative_g_cost + neighbor.get_h_cost();
                        if (!open_set.contains(neighbor))
                            open_set.append(neighbor);
                    }
                }
            }
        }
    }
    return goal_state;
}

State timeit(
    const std::function<State(std::vector<std::vector<int>>, int)> &foo,
    const std::vector<std::vector<int>> &jobs, int n_workers)
{
    foo(jobs, n_workers); // Cache warm up
    auto start_time = std::chrono::high_resolution_clock::now();
    const State result = foo(jobs, n_workers);
    auto end_time = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double> total_time = end_time - start_time;
    std::cout << "c++;" << omp_get_max_threads() << ";a_star" << ";(" << jobs << ", "
              << n_workers << ");" << jobs.size() << ";" << jobs[0].size() << ";"
              << n_workers << ";" << std::setprecision(5) << std::scientific
              << total_time.count() << std::endl;
    return result;
}

void process_jobs(const std::vector<std::vector<int>> &jobs, int max_workers)
{
    for (int n_workers = 1; n_workers <= max_workers; n_workers++)
    {
        timeit(a_star, jobs, n_workers);
    }
}

void process_jobs(const std::vector<std::vector<int>> &jobs)
{
    process_jobs(jobs, jobs.size() + 1);
}

int main(int argc, char **argv)
{
    // CSV HEADER
    std::cout << "lang;n_threads;function;args;n_jobs;n_tasks;n_workers;runtime" << std::endl;

    // timeit(a_star, {{2, 1, 4, 5, 5, 4, 1, 2, 2, 1, 4, 5}}, 1);
    // timeit(a_star, {{2}, {1}, {4}, {5}, {5}, {4}, {1}, {2}, {2}, {1}, {4}, {5}}, 1);

    // timeit(a_star, {{2, 1, 4, 5, 5, 4, 1, 2, 2, 1, 4, 5}}, 2);
    // timeit(a_star, {{2}, {1}, {4}, {5}, {5}, {4}, {1}, {2}, {2}, {1}, {4}, {5}}, 2);

    process_jobs({{2, 5}, {3, 3}});
    process_jobs({{2, 5, 1}, {3, 3, 3}});
    process_jobs({{2, 5, 1, 2}, {3, 3, 3, 7}});
    process_jobs({{2, 5, 1, 2, 5}, {3, 3, 3, 7, 5}});

    process_jobs({{2, 5}, {3, 3}, {1, 7}});
    process_jobs({{2, 5, 1}, {3, 3, 3}, {1, 7, 2}});
    process_jobs({{2, 5, 1, 2}, {3, 3, 3, 7}, {1, 7, 2, 8}}, 2);
    process_jobs({{2, 5, 1, 2, 5}, {3, 3, 3, 7, 5}, {1, 7, 2, 8, 1}}, 1); // Does not go past 1 worker

    process_jobs({{2, 5}, {3, 3}, {1, 7}, {2, 2}}, 4);
    process_jobs({{2, 5, 1}, {3, 3, 3}, {1, 7, 2}, {2, 2, 3}}, 2);
    process_jobs({{2, 5, 1, 2}, {3, 3, 3, 7}, {1, 7, 2, 8}, {2, 2, 3, 6}}, 1);             // check max_workers
    process_jobs({{2, 5, 1, 2, 5}, {3, 3, 3, 7, 5}, {1, 7, 2, 8, 1}, {2, 2, 3, 6, 4}}, 1); // check max_workers

    return 0;
}
