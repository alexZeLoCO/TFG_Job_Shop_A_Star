#include "job_processors.h"

struct ReadTaskStruct
{
    unsigned int duration;
    std::vector<unsigned int> qualified_workers;
};

std::vector<std::vector<Task>> get_jobs_from_file(const std::string &filename)
{
    std::ifstream file(filename);
    std::string my_string;
    std::string my_number;
    std::vector<std::vector<ReadTaskStruct>> data;
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
        data.emplace_back();
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
                data[data.size() - 1].emplace_back();
                data[data.size() - 1][data[data.size() - 1].size() - 1].duration = stoi(my_number);
                data[data.size() - 1][data[data.size() - 1].size() - 1].qualified_workers = std::vector<unsigned int>(1, qualified_worker);
                is_worker = true;
            }
        }
    }
    for (std::size_t job_idx = 0; job_idx < data.size(); job_idx++)
    {
        out.emplace_back();
        const std::vector<struct ReadTaskStruct> currentJob = data[job_idx];
        for (std::size_t task_idx = 0; task_idx < currentJob.size(); task_idx++)
        {
            const struct ReadTaskStruct currentTask = currentJob[task_idx];
            unsigned int h_cost = 0;
            for (std::size_t unscheduled_task_idx = task_idx; unscheduled_task_idx < currentJob.size(); unscheduled_task_idx++)
                h_cost += currentJob[unscheduled_task_idx].duration;
            out[job_idx].emplace_back(currentTask.duration, h_cost, currentTask.qualified_workers);
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
    // solver.solve(jobs, n_workers, opt); // Cache warm up
    State result;
    std::vector<float> goals = {0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1};
    auto c = Chronometer(goals, solver.get_name());
    unsigned int averageGCost = 0;
    unsigned int minGCost = 0;
    unsigned int maxGCost = 0;
    for (unsigned int iter = 0; iter < n_iters; iter++)
    {
        c.enable_goals();
        c.start();
        result = solver.solve(jobs, n_workers, c);
        averageGCost += result.get_g_cost();
        if (maxGCost < result.get_g_cost())
            maxGCost = result.get_g_cost();
        if (minGCost > result.get_g_cost() || iter == 0)
            minGCost = result.get_g_cost();
    }
    for (const auto &[goal, timestamp] : c.get_timestamps())
    {
#pragma omp critical(io)
        std::cout << "c++;" << omp_get_max_threads() << ";a_star;" << solver.get_name() << ";AVERAGE " << goal << ";" << jobs.size() << ";" << jobs[0].size() << ";"
                  << n_workers << ";" << std::setprecision(5) << std::scientific
                  << (n_iters > 0 ? timestamp / n_iters : 0) << std::defaultfloat << ";;"
                  << (n_iters > 0 ? averageGCost / n_iters : 0) << ";" << minGCost << ";" << maxGCost << std::endl;
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
