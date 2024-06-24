#ifndef FCFS_SOLVER_H
#define FCFS_SOLVER_H

#include <unordered_map>

#include "aStarSolver.h"
#include "sortedList.h"

class FcfsSolver : public AStarSolver
{
public:
    FcfsSolver() = default;
    ~FcfsSolver() override = default;

    State solve(
        std::vector<std::vector<Task>>,
        std::size_t,
        Chronometer &) const override;

    std::string get_name() const override { return "FCFS Solver"; };

    State get_state(
        SortedList<State> &,
        const bool &) const;
    void add_neighbors(
        const std::vector<State> &,
        std::unordered_map<State, unsigned int, StateHash, StateEqual> &,
        std::unordered_map<State, unsigned int, StateHash, StateEqual> &,
        SortedList<State> &) const;
};

State FcfsSolver::solve(
    std::vector<std::vector<Task>> jobs,
    std::size_t n_workers,
    Chronometer &c) const
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
    g_costs[starting_state] = 0;
    std::unordered_map<State, unsigned int, StateHash, StateEqual> f_costs;
    f_costs[starting_state] = starting_state.get_f_cost();

    const auto comparator = [&f_costs](const State &lhs, const State &rhs)
    {
        return f_costs[lhs] < f_costs[rhs];
    };

    SortedList<State> open_set(comparator);
    open_set.append(starting_state);

    State goal_state;
    bool found_goal_state = false;

// O(n^2 + 2n + n^2 + n * (l + n + n^2 + k)) or O(n^2 + n + 2n^2 + n^2 * (l + n + n^2 + k))
#pragma omp parallel shared(found_goal_state, goal_state, open_set, f_costs, g_costs, c)
    while (!found_goal_state)
    {
        State current_state = this->get_state(open_set, found_goal_state);

#pragma omp critical(chronometer)
        {
            c.process_iteration(current_state);
        }
        if (current_state.is_goal_state())
        {
            goal_state = current_state;
            found_goal_state = true;
            break;
        }

        const std::vector<State> neighbor_states = current_state.get_neighbors_of(); // O(2n + n^2) or (n + 2n^2)
        this->add_neighbors(neighbor_states, g_costs, f_costs, open_set);
    }
    c.log_timestamp(10, goal_state);
    return goal_state;
}

State FcfsSolver::get_state(
    SortedList<State> &open_set,
    const bool &found_goal_state) const
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

void FcfsSolver::add_neighbors(
    const std::vector<State> &neighbors,
    std::unordered_map<State, unsigned int, StateHash, StateEqual> &g_costs,
    std::unordered_map<State, unsigned int, StateHash, StateEqual> &f_costs,
    SortedList<State> &open_set) const
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

#endif // FCFS_SOLVER_H