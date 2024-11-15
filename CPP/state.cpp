#include "state.h"

unsigned int State::calculate_max_worker_status() const
{
    int max_element = 0;
    for (const int worker_free_start_time : this->get_workers_status())
        if (worker_free_start_time > max_element)
            max_element = worker_free_start_time;
    return max_element;
}

float State::calculate_completion_percentage() const
{
    unsigned int n_scheduled_tasks = 0;
    unsigned int total_tasks = int(this->m_jobs.size());
    if (total_tasks == 0)
        return 1;
    total_tasks *= int(this->m_jobs[0].size());
    for (std::vector<int> job : this->m_schedule)
        for (int task : job)
            if (task != -1)
                n_scheduled_tasks++;
    return ((float)n_scheduled_tasks) / ((float)total_tasks);
}

unsigned int State::calculate_h_cost() const
{
    // return 0;
    std::vector<int> h_costs;
    for (std::size_t job_idx = 0; job_idx < this->m_jobs.size(); job_idx++)
    {
        h_costs.emplace_back(
            this->first_unscheduled_task_idxs[job_idx] == -1
                ? 0
                : this->m_jobs[job_idx][this->first_unscheduled_task_idxs[job_idx]].get_h_cost());
    }
    auto max_element = std::max_element(h_costs.begin(), h_costs.end());
    return max_element == h_costs.end() ? 0 : *max_element;
    /*
     unsigned int unscheduled_tasks_count = 0;
     for (std::size_t job_idx = 0; job_idx < this->m_jobs.size(); job_idx++)
         for (std::size_t task_idx = 0; task_idx < this->m_jobs[job_idx].size(); task_idx++)
             if (this->m_schedule[job_idx][task_idx] == -1)
                 unscheduled_tasks_count += this->m_jobs[job_idx][task_idx].get_duration();
     return unscheduled_tasks_count;
     */
}

bool State::is_goal_state() const
{
    if (this->m_jobs.empty())
        return false;
    for (const std::vector<int> &job : this->get_schedule())
        for (const int task : job)
            if (task == -1)
                return false;
    return true;
}

std::vector<int> State::calculate_first_unscheduled_task_idxs() const
{
    std::vector<int> out;
    for (const std::vector<int> &job : this->get_schedule())
    {
        std::size_t current_task_idx = 0;
        while (
            current_task_idx < job.size() &&
            job[current_task_idx] >= 0)
            current_task_idx++;
        if (current_task_idx < job.size())
            out.emplace_back(current_task_idx);
        else
            out.emplace_back(-1);
    }
    return out;
}

std::vector<int> State::calculate_first_unscheduled_task_start_times() const
{
    std::vector<int> first_unscheduled_task_start_times;
    for (std::size_t job_idx = 0; job_idx < this->m_jobs.size(); job_idx++)
    {
        int currently_unscheduled_task_idx = this->first_unscheduled_task_idxs[job_idx];
        if (currently_unscheduled_task_idx != -1)
        {
            if (currently_unscheduled_task_idx == 0)
                first_unscheduled_task_start_times.emplace_back(0);
            else
                first_unscheduled_task_start_times.emplace_back(
                    this->m_jobs[job_idx][currently_unscheduled_task_idx - 1].get_duration() +
                    this->get_schedule()[job_idx][currently_unscheduled_task_idx - 1]);
        }
        else
            first_unscheduled_task_start_times.emplace_back(-1);
    }
    return first_unscheduled_task_start_times;
}

std::vector<State> State::get_neighbors_of() const
{
    std::vector<State> neighbors;

    std::vector<int> first_unscheduled_task_start_times = this->calculate_first_unscheduled_task_start_times(); // O(n)

    // O(n) if there is only one qualified_worker per task, else O(n^2)
    for (std::size_t job_idx = 0; job_idx < this->get_schedule().size(); job_idx++)
    {
        int task_start_time = first_unscheduled_task_start_times[job_idx];
        if (task_start_time != -1)
        {
            int unscheduled_task_idx = first_unscheduled_task_idxs[job_idx];
            Task currentTask = this->m_jobs[job_idx][unscheduled_task_idx];
            unsigned int qualified_worker = currentTask.get_qualified_worker();
            int worker_start_time = this->get_workers_status()[qualified_worker] > task_start_time
                                        ? this->get_workers_status()[qualified_worker]
                                        : task_start_time;

            std::vector<std::vector<int>> new_schedule = this->get_schedule();
            new_schedule[job_idx][unscheduled_task_idx] = worker_start_time;

            std::vector<int> new_workers_status = this->get_workers_status();
            new_workers_status[qualified_worker] = (worker_start_time +
                                                    currentTask.get_duration());

            neighbors.emplace_back(this->m_jobs, new_schedule, new_workers_status);
        }
    }
    return neighbors;
}

bool operator<(const State &a, const State &b)
{
    return a.get_g_cost() < b.get_g_cost();
}

std::ostream &operator<<(std::ostream &output_stream, const State &the_state)
{
    output_stream << "(schedule=[";
    for (const std::vector<int> &job : the_state.get_schedule())
    {
        output_stream << "[ ";
        for (const int task_start_time : job)
        {
            output_stream << task_start_time << " ";
        }
        output_stream << "]";
    }
    output_stream << "],workers_status=[ ";
    for (const int worker_status : the_state.get_workers_status())
    {
        output_stream << worker_status << " ";
    }
    output_stream << "])";
    return output_stream;
}

State &State::operator=(const State &other_state)
{
    this->g_cost = other_state.get_g_cost();
    this->m_schedule = other_state.get_schedule();
    this->m_jobs = other_state.m_jobs;
    this->first_unscheduled_task_idxs = other_state.first_unscheduled_task_idxs;
    this->h_cost = other_state.h_cost;
    this->m_workers_status = other_state.get_workers_status();
    this->m_completion_percentage = other_state.get_completion_percentage();
    return *this;
}

bool operator==(const State &a, const State &b)
{
    std::size_t a_hash = FullHash()(a);
    std::size_t b_hash = FullHash()(b);

    return a_hash == b_hash;
}

std::size_t StateHash::operator()(State key) const
{
    if (key.get_state_hash() != UNINITIALIZED_HASH)
        return key.get_state_hash();

    std::size_t hashValue = 0;

    for (const unsigned int worker_status : key.get_workers_status())
        hashValue ^= std::hash<unsigned int>()(worker_status) + 0x9e3779b9 + (hashValue << 6) + (hashValue >> 2);

    for (const std::vector<int> &job : key.get_schedule())
        for (const int timestamp : job)
            hashValue ^= std::hash<int>()(timestamp) + 0x9e3779b9 + (hashValue << 6) + (hashValue >> 2);

    key.set_state_hash(hashValue);
    return hashValue;
}

std::size_t FullHash::operator()(State key) const
{
    if (key.get_full_hash() != UNINITIALIZED_HASH)
        return key.get_full_hash();

    std::size_t hashValue = StateHash()(key);

    for (const std::vector<Task> &job : key.get_jobs())
        for (const Task &task : job)
        {
            hashValue ^= std::hash<unsigned int>()(task.get_duration()) + 0x9e3779b9 + (hashValue << 6) + (hashValue >> 2);
            hashValue ^= std::hash<unsigned int>()(task.get_qualified_worker()) + 0x9e3779b9 + (hashValue << 6) + (hashValue >> 2);
        }

    key.set_full_hash(hashValue);
    return hashValue;
}

bool StateEqual::operator()(const State &a, const State &b) const
{
    std::size_t a_hash = StateHash()(a);
    std::size_t b_hash = StateHash()(b);

    return a_hash == b_hash;
}
