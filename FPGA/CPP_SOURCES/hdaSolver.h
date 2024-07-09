#ifndef HDA_SOLVER_H
#define HDA_SOLVER_H

#include "optional.h"
#include "aStarSolver.h"
#include "sortedList.h"

class HdaSolver : public AStarSolver
{
private:
    State get_state(SortedList<State> &) const;

public:
    HdaSolver() = default;
    ~HdaSolver() override = default;

    State solve(
        std::vector<std::vector<Task>>,
        std::size_t,
        Chronometer &) const override;

    std::string get_name() const override { return "HDA* Solver"; };
};

State HdaSolver::solve(
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

    std::vector<SortedList<State>> open_sets;
    std::unordered_map<State, unsigned int, StateHash, StateEqual> f_costs;
    std::unordered_map<State, unsigned int, StateHash, StateEqual> g_costs;

    const auto nThreads = (unsigned short)omp_get_max_threads();
    const auto comparator = [&f_costs](const State &a, const State &b)
    { return f_costs[a] < f_costs[b]; };
    for (unsigned short threadIdx = 0; threadIdx < nThreads; threadIdx++)
        open_sets.emplace_back(comparator);

    const std::vector<std::vector<int>> starting_schedule(n_jobs, std::vector<int>(n_tasks, -1));
    const std::vector<int> starting_workers_status(n_workers, 0);
    const State starting_state(jobs, starting_schedule, starting_workers_status);

    g_costs[starting_state] = 0;
    f_costs[starting_state] = starting_state.get_f_cost();

    FullHash hasher;
    open_sets[hasher.operator()(starting_state) % nThreads].append(starting_state);

    State goal_state;
    bool found_goal_state = false;
#pragma omp parallel for shared(goal_state, found_goal_state, hasher, c)
    for (unsigned short threadIdx = 0; threadIdx < nThreads; threadIdx++)
    {
        State currentState;
        while (!found_goal_state)
        {
            currentState = this->get_state(open_sets[threadIdx]);

            if (currentState.is_goal_state())
            {
#pragma omp critical(flow)
                {
                    goal_state = currentState;
                    found_goal_state = true;
                }
            }

#pragma omp critical(chronometer)
            c.process_iteration(currentState);

            for (const State &neighbor : currentState.get_neighbors_of())
            {
                const unsigned int tentative_g_cost = neighbor.get_g_cost();
#pragma omp critical(open_set)
                {
                    if (g_costs.find(neighbor) == g_costs.end() ||
                        tentative_g_cost < g_costs[neighbor])
                    {
                        g_costs[neighbor] = tentative_g_cost;
                        f_costs[neighbor] = tentative_g_cost + neighbor.get_h_cost();
                        const unsigned short target_open_set = hasher.operator()(neighbor) % nThreads;
                        open_sets[target_open_set].append(neighbor);
                    }
                }
            }
        }
    }
    return goal_state;
}

State HdaSolver::get_state(SortedList<State> &myOpenSet) const
{
    Optional<State> maybeState;
    do
    {
#pragma omp critical(open_set)
        if (!myOpenSet.empty())
            maybeState = Optional<State>(myOpenSet.pop());
    } while (!maybeState.has_value());
    return maybeState.value();
}

#endif // HDA_SOLVER_h