#ifndef RECURSIVE_SOLVER_H
#define RECURSIVE_SOLVER_H

#include <unordered_map>

#include "aStarSolver.h"
#include "sortedList.h"

class RecursiveSolver : public AStarSolver
{
public:
    RecursiveSolver() = default;
    ~RecursiveSolver() override = default;

    State solve(
        std::vector<std::vector<Task>>,
        std::size_t,
        std::optional<Chronometer> &) const override;

    std::string get_name() const override { return "Recursive Solver"; };
};

State RecursiveSolver::solve(
    std::vector<std::vector<Task>> jobs,
    std::size_t n_workers,
    std::optional<Chronometer> &c) const
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

    std::vector<State> neighbors = starting_state.get_neighbors_of();
    std::unordered_map<unsigned int, State> solutions;

#pragma omp parallel for shared(solutions) firstprivate(starting_state)
    for (const State local_start : neighbors)
    {
        std::unordered_map<State, unsigned int, StateHash, StateEqual> g_costs;
        g_costs.try_emplace(starting_state, 0);
        std::unordered_map<State, unsigned int, StateHash, StateEqual> f_costs;
        f_costs.try_emplace(starting_state, starting_state.get_f_cost());

        const auto comparator = [&f_costs](const State &lhs, const State &rhs)
        {
            return f_costs[lhs] < f_costs[rhs];
        };
        auto open_set = SortedList<State>(comparator);

        open_set.append(local_start);
        bool is_empty = open_set.empty();
        while (!is_empty)
        {
            State current_state = open_set.pop();
            if (current_state.is_goal_state())
            {
#pragma omp critical(solutions)
                solutions.try_emplace(omp_get_thread_num(), current_state);
                break;
            }
#pragma omp critical(chronometer)
            {
                if (c.has_value())
                    c.value().process_iteration(current_state);
            }
            std::vector<State> thread_neighbors = current_state.get_neighbors_of();
            for (const State &thread_neighbor : thread_neighbors)
            {
                const unsigned int tentative_g_cost = thread_neighbor.get_g_cost();
                if (g_costs.find(thread_neighbor) == g_costs.end() || tentative_g_cost < g_costs[thread_neighbor])
                {
                    g_costs[thread_neighbor] = tentative_g_cost;
                    f_costs[thread_neighbor] = tentative_g_cost + thread_neighbor.get_h_cost();
                    open_set.append(thread_neighbor);
                }
            }
        }
    }

    State best_solution;
    bool first = true;
    for (const std::pair<unsigned int, State> solution : solutions)
    {
        if (first || solution.second.get_f_cost() < best_solution.get_f_cost())
            best_solution = solution.second;
        first = false;
    }
    c->log_timestamp(10, best_solution);
    return best_solution;
}

#endif // RECURSIVE_SOLVER_H