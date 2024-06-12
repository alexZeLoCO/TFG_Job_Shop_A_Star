#ifndef A_STAR_SOLVER_H
#define A_STAR_SOLVER_H

#include <optional>
#include <vector>

#include "chronometer.h"
#include "state.h"
#include "task.h"

class AStarSolver
{
public:
    AStarSolver() = default;
    AStarSolver(AStarSolver const &) = delete;
    virtual ~AStarSolver() = default;

    virtual State solve(
        std::vector<std::vector<Task>>,
        std::size_t,
        std::optional<Chronometer> &) = 0;

    virtual std::string get_name() const = 0;
};

#endif // A_STAR_SOLVER_H