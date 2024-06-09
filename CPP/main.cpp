#include <iostream>
#include <vector>

#include "vector_ostreams.h"
#include "job_processors.h"
#include "task.h"

#include "fcfsSolver.h"
#include "batchSolver.h"

int main(int argc, char **argv)
{
    // CSV HEADER
    std::cout << "lang;n_threads;function;percentage;n_jobs;n_tasks;n_workers;runtime;schedule;makespan" << std::endl;

    // std::cout << a_star({{2, 5, 1}, {3, 3, 3}}, 2, std::optional<Chronometer>()) << std::endl;

    std::string dataset_file = "../datasets/ft06.csv";

    std::vector<std::vector<Task>> jobs =
        cut(get_jobs_from_file(dataset_file), 0.5);

    FcfsSolver fcfsSolver;
    timeit(fcfsSolver, jobs, calculate_n_workers(jobs));
    BatchSolver batchSolver;
    timeit(batchSolver, jobs, calculate_n_workers(jobs));

    return 0;
}
