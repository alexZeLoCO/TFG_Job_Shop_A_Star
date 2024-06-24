#ifndef A_STAR_SOLVER_H
#define A_STAR_SOLVER_H

#include <vector>

#include "optional.h"
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
        Chronometer &) const = 0;

    virtual std::string get_name() const = 0;
};

#endif // A_STAR_SOLVER_H