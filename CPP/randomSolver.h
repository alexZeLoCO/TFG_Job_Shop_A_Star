#ifndef RANDOM_SOLVER_H
#define RANDOM_SOLVER_H

#include <random>

#include "aStarSolver.h"
#include "sortedList.h"

class RandomSolver : public AStarSolver
{
private:
    State get_random_next_state(const State &, std::mt19937 &) const;

public:
    RandomSolver() = default;
    ~RandomSolver() override = default;

    State solve(
        std::vector<std::vector<Task>>,
        std::size_t,
        Chronometer &) const override;

    std::string get_name() const override { return "RANDOM Solver"; };
};

State RandomSolver::solve(
    std::vector<std::vector<Task>> jobs,
    std::size_t n_workers,
    Chronometer &c) const
{
    const std::size_t nJobs = jobs.size();
    if (nJobs == 0)
        return State();
    const std::size_t nTasks = jobs[0].size();
    if (nTasks == 0)
        return State();
    if (n_workers == 0)
        n_workers = nTasks;

    std::random_device rd;
    std::mt19937 gen(rd());

    const auto startingSchedule = std::vector<std::vector<int>>(nJobs, std::vector<int>(nTasks, -1));
    const auto startingWorkersStatus = std::vector<int>(n_workers, 0);
    auto currentState = State(jobs, startingSchedule, startingWorkersStatus);

    while (!currentState.is_goal_state())
    {
        currentState = this->get_random_next_state(currentState, gen);
        c.process_iteration(currentState);
    }

    return currentState;
}

State RandomSolver::get_random_next_state(const State &currentState, std::mt19937 &gen) const
{
    std::vector<State> neighbors = currentState.get_neighbors_of();
    std::uniform_int_distribution<> dis(0, (int)neighbors.size() - 1);
    return neighbors[dis(gen)];
}

#endif // RANDOM_SOLVER_h