#ifndef BATCH_SOLVER_H
#define BATCH_SOLVER_H

#include <unordered_map>

#include "aStarSolver.h"
#include "sortedList.h"

class BatchSolver : public AStarSolver
{
public:
    BatchSolver() = default;
    ~BatchSolver() override = default;

    State solve(
        std::vector<std::vector<Task>>,
        std::size_t,
        std::optional<Chronometer> &) override;

    std::string get_name() const override { return "Batch Solver"; };

    void add_neighbors(
        const std::vector<State> &,
        std::unordered_map<State, unsigned int, StateHash, StateEqual> &,
        std::unordered_map<State, unsigned int, StateHash, StateEqual> &,
        std::vector<std::vector<State>> &,
        const unsigned int) const;
};

State BatchSolver::solve(
    std::vector<std::vector<Task>> jobs,
    std::size_t n_workers,
    std::optional<Chronometer> &c)
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

    std::vector<State> to_be_processed(omp_get_num_threads());
    std::vector<std::vector<State>> to_be_added(omp_get_num_threads());

    // O(n^2 + 2n + n^2 + n * (l + n + n^2 + k)) or O(n^2 + n + 2n^2 + n^2 * (l + n + n^2 + k))
    while (!found_goal_state)
    {
        const unsigned int amount_states_to_be_processed = (unsigned int)omp_get_num_threads() < (unsigned int)open_set.size()
                                                               ? (unsigned int)omp_get_num_threads()
                                                               : (unsigned int)open_set.size();
        for (unsigned int i = 0; i < amount_states_to_be_processed; i++)
        {
            to_be_processed[i] = open_set.pop();
            if (to_be_processed[i].is_goal_state())
            {
                goal_state = to_be_processed[i];
                found_goal_state = true;
            }
        }

        if (found_goal_state)
        {
            break;
        }

#pragma omp parallel for
        for (unsigned int thread_id = 0; thread_id < amount_states_to_be_processed; thread_id++)
        {
            State current_state = to_be_processed[thread_id];
#pragma omp critical(chronometer)
            {
                if (c.has_value())
                    c.value().process_iteration(current_state);
            }

            const std::vector<State> neighbor_states = current_state.get_neighbors_of(); // O(2n + n^2) or (n + 2n^2)
            add_neighbors(neighbor_states, g_costs, f_costs, to_be_added, thread_id);
        }

        for (unsigned int thread_id = 0; thread_id < amount_states_to_be_processed; thread_id++)
            for (const State &neighbor : to_be_added[thread_id])
                open_set.append(neighbor);
    }
    c->log_timestamp(10, goal_state);
    return goal_state;
}

void BatchSolver::add_neighbors(
    const std::vector<State> &neighbors,
    std::unordered_map<State, unsigned int, StateHash, StateEqual> &g_costs,
    std::unordered_map<State, unsigned int, StateHash, StateEqual> &f_costs,
    std::vector<std::vector<State>> &to_be_added,
    const unsigned int thread_id) const
{
    to_be_added[thread_id] = std::vector<State>();
    for (const State &neighbor : neighbors)
    {
        const unsigned int tentative_g_cost = neighbor.get_g_cost();
#pragma omp critical(costs)
        {
            if (g_costs.find(neighbor) == g_costs.end() || tentative_g_cost < g_costs[neighbor])
            {
                g_costs[neighbor] = tentative_g_cost;
                f_costs[neighbor] = tentative_g_cost + neighbor.get_h_cost();
                to_be_added[thread_id].emplace_back(neighbor);
            }
        }
    }
}

#endif // BATCH_SOLVER_H