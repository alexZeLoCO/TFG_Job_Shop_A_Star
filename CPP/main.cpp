#include <iostream>
#include <vector>
#include <optional>

#include "vector_ostreams.h"
#include "job_processors.h"
#include "task.h"

#include "fcfsSolver.h"
#include "batchSolver.h"
#include "recursiveSolver.h"
#include "hdaSolver.h"

int main(int argc, char **argv)
{
    if (argc < 3)
    {
        std::cerr << "ERR. USE: ./main FILE PERCENTAGE [SOLVER NAME: RECURSIVE | FCFS | BATCH | HDA | ALL]" << std::endl;
        return 1;
    }
    const std::string filename = *(argv + 1);
    const auto percentage = (float)atof(*(argv + 2));
    const std::string solvername = argc >= 4 ? *(argv + 3) : "ALL";

    std::vector<std::vector<Task>> jobs =
        cut(get_jobs_from_file(filename), percentage);

    const auto task = [&jobs](const AStarSolver &solver)
    { timeit(5, solver, jobs, calculate_n_workers(jobs)); };

    if (solvername == "RECURSIVE" || solvername == "ALL")
        task(RecursiveSolver());
    if (solvername == "FCFS" || solvername == "ALL")
        task(FcfsSolver());
    if (solvername == "BATCH" || solvername == "ALL")
        task(BatchSolver());
    if (solvername == "HDA" || solvername == "ALL")
        task(HdaSolver());

    return 0;
}
