#include <iostream>
#include <vector>

#include "vector_ostreams.h"
#include "job_processors.h"
#include "task.h"

#include "fcfsSolver.h"
#include "batchSolver.h"
#include "recursiveSolver.h"
#include "hdaSolver.h"
#include "randomSolver.h"

int main(int argc, char **argv)
{
    if (argc < 3)
    {
        std::cerr << "ERR. USE: ./main FILE PERCENTAGE [SOLVER NAME: RECURSIVE | FCFS | BATCH | HDA | ALL] [NUMBER OF ITERATIONS]" << std::endl;
        return 1;
    }
    const std::string filename = *(argv + 1);
    const auto percentage = (float)atof(*(argv + 2));
    const std::string solvername = argc >= 4 ? *(argv + 3) : "ALL";
    const unsigned int nIterations = argc >= 5 ? atoi(*(argv + 4)) : 1;

    std::vector<std::vector<Task>> jobs =
        cut(get_jobs_from_file(filename), percentage);

    const auto task = [nIterations, &jobs](const AStarSolver &solver)
    { timeit(nIterations, solver, jobs, calculate_n_workers(jobs)); };

    if (solvername == "RECURSIVE" || solvername == "ALL")
        task(RecursiveSolver());
    if (solvername == "FCFS" || solvername == "ALL")
        task(FcfsSolver());
    if (solvername == "BATCH" || solvername == "ALL")
        task(BatchSolver());
    if (solvername == "HDA" || solvername == "ALL")
        task(HdaSolver());
    if (solvername == "RANDOM" || solvername == "ALL")
        task(RandomSolver());

    return 0;
}
