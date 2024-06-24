#include "job_processors.h"

std::vector<std::vector<Task>> get_jobs_from_file(const std::string &filename)
{
    std::ifstream file(filename);
    std::string my_string;
    std::string my_number;
    std::vector<std::vector<Task>> out;
    if (!file.is_open())
    {
        std::cerr << "Could not read file" << std::endl;
        file.close();
        return out;
    }
    while (std::getline(file, my_string))
    {
        std::stringstream line(my_string);
        out.emplace_back();
        bool is_worker = true;
        unsigned int qualified_worker = 0;
        while (std::getline(line, my_number, ';'))
        {
            if (is_worker)
            {
                qualified_worker = stoi(my_number);
                is_worker = false;
            }
            else
            {
                out[out.size() - 1].emplace_back(stoi(my_number),
                                                 std::vector<unsigned int>(1, qualified_worker));
                is_worker = true;
            }
        }
    }
    file.close();
    return out;
}

std::vector<std::vector<Task>> cut(std::vector<std::vector<Task>> jobs, float percentage)
{
    percentage = percentage < 0 ? 0 : percentage;
    percentage = percentage > 1 ? 1 : percentage;
    const unsigned int jobs_to_keep = int(float(jobs.size()) * percentage);
    const unsigned int tasks_to_keep = int(float(jobs[0].size()) * percentage);
    std::vector<std::vector<Task>> new_jobs;

    for (unsigned int job_idx = 0; job_idx < jobs_to_keep; job_idx++)
    {
        new_jobs.emplace_back();
        for (unsigned int task_idx = 0; task_idx < tasks_to_keep; task_idx++)
            new_jobs[job_idx].push_back(jobs[job_idx][task_idx]);
    }

    return new_jobs;
}

State timeit(
    unsigned int n_iters,
    const AStarSolver &solver,
    const std::vector<std::vector<Task>> &jobs, int n_workers)
{
    auto opt = std::optional<Chronometer>();
    // solver.solve(jobs, n_workers, opt); // Cache warm up
    State result;
    std::map<unsigned short, bool> goals = {{1, false}, {2, false}, {3, false}, {4, false}, {5, false}, {6, false}, {7, false}, {8, false}, {9, false}, {10, false}};
    auto c = std::optional<Chronometer>(Chronometer(goals, solver.get_name()));
    for (unsigned int iter = 0; iter < n_iters; iter++)
    {
        c.value().enable_goals();
        c.value().start();
        result = solver.solve(jobs, n_workers, c);
    }
    for (const auto &[goal, timestamp] : c.value().get_timestamps())
    {
#pragma omp critical(io)
        std::cout << "c++;" << omp_get_max_threads() << ";a_star;" << solver.get_name() << ";AVERAGE " << goal << ";" << jobs.size() << ";" << jobs[0].size() << ";"
                  << n_workers << ";" << std::setprecision(5) << std::scientific
                  << timestamp / n_iters << ";" << result << ";" << result.get_max_worker_status() << std::endl;
    }
    return result;
}

unsigned int calculate_n_workers(
    const std::vector<std::vector<Task>> &jobs)
{
    unsigned int n_workers = 0;
    for (const std::vector<Task> &job : jobs)
        for (const Task &task : job)
            for (const unsigned int worker : task.get_qualified_workers())
                if (worker > n_workers)
                    n_workers = worker;
    return n_workers + 1;
}
