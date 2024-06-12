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
    // CSV HEADER
    std::cout << "lang;n_threads;function;solver;percentage;n_jobs;n_tasks;n_workers;runtime;schedule;makespan" << std::endl;

    // std::cout << a_star({{2, 5, 1}, {3, 3, 3}}, 2, std::optional<Chronometer>()) << std::endl;

    std::string dataset_file = "../datasets/abz5.csv";

    std::vector<std::vector<Task>> jobs =
        cut(get_jobs_from_file(dataset_file), 0.5);

    RecursiveSolver recursiveSolver;
    timeit(5, recursiveSolver, jobs, calculate_n_workers(jobs));
    FcfsSolver fcfsSolver;
    timeit(5, fcfsSolver, jobs, calculate_n_workers(jobs));
    BatchSolver batchSolver;
    timeit(5, batchSolver, jobs, calculate_n_workers(jobs));
    HdaSolver hdaSolver;
    timeit(5, hdaSolver, jobs, calculate_n_workers(jobs));

    return 0;
}
