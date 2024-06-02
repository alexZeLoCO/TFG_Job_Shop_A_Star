#include <iostream>
#include <unordered_map>
#include <vector>
#include <chrono>
#include <typeinfo>
#include <iomanip>
#include <omp.h>
#include <algorithm>
#include <fstream>

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

std::vector<std::vector<int>> get_jobs_from_file(std::string filename)
{
    std::ifstream file(filename);
    std::string my_string;
    std::string my_number;
    std::vector<std::vector<int>> out;
    if (file.is_open())
    {
        while (std::getline(file, my_string))
        {
            std::stringstream line(my_string);
            out.push_back(std::vector<int>());
            unsigned int idx = 0;
            while (std::getline(line, my_number, ';'))
            {
                if (idx++ % 2 != 0)
                    out[out.size() - 1].push_back(stoi(my_number));
            }
        }
    }
    else
        std::cerr << "Could not read file";
    return out;
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

    const State starting_state(jobs, starting_schedule, starting_workers_status);

    std::unordered_map<State, int, StateHash, StateEqual> g_costs;
    g_costs.try_emplace(starting_state, 0);
    std::unordered_map<State, int, StateHash, StateEqual> f_costs;
    f_costs.try_emplace(starting_state, starting_state.get_f_cost());

    const auto comparator = [&f_costs](const State &lhs, const State &rhs)
    {
        return f_costs[lhs] < f_costs[rhs];
    };

    SortedList<State> open_set(comparator);
    open_set.append(starting_state);

    State goal_state;
    bool found_goal_state = false;
    bool has_state = !open_set.empty();

#pragma omp paralell shared(open_set, has_state, found_goal_state, goal_state, f_costs, g_costs)
    while (!found_goal_state && has_state)
    {
        State current_state;

#pragma omp critical(open_set)
        if (open_set.empty())
            has_state = false;

        if (!has_state)
            break;

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
                    open_set.append(neighbor);
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
              << total_time.count() << ";" << result << std::endl;
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
    std::cout << "lang;n_threads;function;args;n_jobs;n_tasks;n_workers;runtime;result" << std::endl;

    // std::cout << a_star({{2, 5, 1}, {3, 3, 3}}, 2) << std::endl;

    // timeit(a_star, {{2, 1, 4, 5, 5, 4, 1, 2, 2, 1, 4, 5}}, 1);
    // timeit(a_star, {{2}, {1}, {4}, {5}, {5}, {4}, {1}, {2}, {2}, {1}, {4}, {5}}, 1);
    // timeit(a_star, {{2, 1, 4, 5, 5, 4, 1, 2, 2, 1, 4, 5}}, 2);
    // timeit(a_star, {{2}, {1}, {4}, {5}, {5}, {4}, {1}, {2}, {2}, {1}, {4}, {5}}, 2);

    /*
        process_jobs({{2, 5}, {3, 3}});
        process_jobs({{2, 5, 1}, {3, 3, 3}});
        process_jobs({{2, 5, 1, 2}, {3, 3, 3, 7}});
        process_jobs({{2, 5, 1, 2, 5}, {3, 3, 3, 7, 5}});

        process_jobs({{2, 5}, {3, 3}, {1, 7}});
        process_jobs({{2, 5, 1}, {3, 3, 3}, {1, 7, 2}});
        process_jobs({{2, 5, 1, 2}, {3, 3, 3, 7}, {1, 7, 2, 8}});
        process_jobs({{2, 5, 1, 2, 5}, {3, 3, 3, 7, 5}, {1, 7, 2, 8, 1}});

        process_jobs({{2, 5}, {3, 3}, {1, 7}, {2, 2}});
        process_jobs({{2, 5, 1}, {3, 3, 3}, {1, 7, 2}, {2, 2, 3}});
        process_jobs({{2, 5, 1, 2}, {3, 3, 3, 7}, {1, 7, 2, 8}, {2, 2, 3, 6}});
        process_jobs({{2, 5, 1, 2, 5}, {3, 3, 3, 7, 5}, {1, 7, 2, 8, 1}, {2, 2, 3, 6, 4}});

        process_jobs({{2, 5}, {3, 3}, {1, 7}, {2, 2}, {3, 3}});
        process_jobs({{2, 5, 1}, {3, 3, 3}, {1, 7, 2}, {2, 2, 3}, {3, 3, 2}});
        process_jobs({{2, 5, 1, 2}, {3, 3, 3, 7}, {1, 7, 2, 8}, {2, 2, 3, 6}, {3, 3, 2, 4}});
        process_jobs({{2, 5, 1, 2, 5}, {3, 3, 3, 7, 5}, {1, 7, 2, 8, 1}, {2, 2, 3, 6, 4}, {3, 3, 2, 4, 6}});

        process_jobs({{2, 5}, {3, 3}, {1, 7}, {2, 2}, {3, 3}, {4, 4}});
        process_jobs({{2, 5, 1}, {3, 3, 3}, {1, 7, 2}, {2, 2, 3}, {3, 3, 2}, {4, 4, 1}});
        process_jobs({{2, 5, 1, 2}, {3, 3, 3, 7}, {1, 7, 2, 8}, {2, 2, 3, 6}, {3, 3, 2, 4}, {4, 4, 1, 5}});
        process_jobs({{2, 5, 1, 2, 5}, {3, 3, 3, 7, 5}, {1, 7, 2, 8, 1}, {2, 2, 3, 6, 4}, {3, 3, 2, 4, 6}, {4, 4, 1, 5, 3}});

    timeit(a_star,
           {{88, 68, 94, 99, 67},
            {72, 50, 69, 75, 94},
            {98, 73, 82, 51, 71},
            {94, 71, 81, 85, 66},
            {50, 59, 82, 67, 56}},
           5);
           */

    timeit(
        a_star,
        get_jobs_from_file("../datasets/abz5.csv"),
        5);

    return 0;
}
