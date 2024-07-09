#ifndef JOB_PROCESSORS_H
#define JOB_PROCESSORS_H

#include <vector>
#include <iostream>
#include <fstream>
#include <sstream>
#include <chrono>
#include <iomanip>
#include <functional>

#include "vector_ostreams.h"
#include "chronometer.h"
#include "task.h"
#include "state.h"
#include "aStarSolver.h"

std::vector<std::vector<Task>> get_jobs_from_file(const std::string &);

std::vector<std::vector<Task>> cut(std::vector<std::vector<Task>>, float);

State timeit(
    unsigned int,
    const AStarSolver &,
    const std::vector<std::vector<Task>> &, int);

unsigned int calculate_n_workers(const std::vector<std::vector<Task>> &);

#endif // JOB_PROCESSORS_H