#include "state.h"

unsigned int State::get_max_worker_status() const
{
    int max_element = 0;
    for (const int worker_free_start_time : this->get_workers_status())
        if (worker_free_start_time > max_element)
            max_element = worker_free_start_time;
    return max_element;
}

unsigned int State::calculate_h_cost() const
{
    std::vector<int> h_costs;
    for (int job_idx = 0; job_idx < this->jobs.size(); job_idx++)
    {
        h_costs.emplace_back(0);
        std::vector<int> job = jobs[job_idx];
        for (int task_idx = 0; task_idx < job.size(); task_idx++)
            if (this->get_schedule()[job_idx][task_idx] == -1)
                h_costs[job_idx] += job[task_idx];
    }
    auto min_element = std::min_element(h_costs.begin(), h_costs.end());
    return min_element == h_costs.end() ? 0 : *(min_element.base());
}

bool State::is_goal_state() const
{
    for (const std::vector<int> &job : this->get_schedule())
        for (const int task : job)
            if (task == -1)
                return false;
    return true;
}

int State::distance_to(std::vector<std::vector<int>> &to) const
{
    State from = *this;
    for (int job_idx = 0; job_idx < this->jobs.size(); job_idx++)
        for (int task_idx = 0; task_idx < this->jobs[job_idx].size(); task_idx++)
            if (from.get_schedule()[job_idx][task_idx] != to[job_idx][task_idx])
                return jobs[job_idx][task_idx];
    return 0;
}

std::vector<int> State::get_first_unscheduled_task_idxs() const
{
    std::vector<int> first_unscheduled_task_idxs;
    for (const std::vector<int> &job : this->get_schedule())
    {
        int current_task_idx = 0;
        while (
            current_task_idx < job.size() &&
            job[current_task_idx] >= 0)
            current_task_idx++;
        if (current_task_idx < job.size())
            first_unscheduled_task_idxs.emplace_back(current_task_idx);
        else
            first_unscheduled_task_idxs.emplace_back(-1);
    }
    return first_unscheduled_task_idxs;
}

std::vector<int> State::get_first_unscheduled_task_start_times(
    std::vector<int> &first_unscheduled_task_idxs) const
{
    std::vector<int> first_unscheduled_task_start_times;
    for (int job_idx = 0; job_idx < jobs.size(); job_idx++)
    {
        int currently_unscheduled_task_idx = first_unscheduled_task_idxs[job_idx];
        if (currently_unscheduled_task_idx != -1)
        {
            if (currently_unscheduled_task_idx == 0)
                first_unscheduled_task_start_times.emplace_back(0);
            else
                first_unscheduled_task_start_times.emplace_back(
                    jobs[job_idx][currently_unscheduled_task_idx - 1] +
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

    std::vector<int> first_unscheduled_task_idxs = this->get_first_unscheduled_task_idxs();
    std::vector<int> first_unscheduled_task_start_times = this->get_first_unscheduled_task_start_times(first_unscheduled_task_idxs);

    for (int job_idx = 0; job_idx < this->get_schedule().size(); job_idx++)
    {
        int task_start_time = first_unscheduled_task_start_times[job_idx];
        if (task_start_time != -1)
        {
            int unscheduled_task_idx = first_unscheduled_task_idxs[job_idx];
            for (int worker_id = 0; worker_id < this->get_workers_status().size(); worker_id++)
            {
                int worker_start_time = std::max(this->get_workers_status()[worker_id], task_start_time);

                std::vector<std::vector<int>> new_schedule = this->get_schedule();
                new_schedule[job_idx][unscheduled_task_idx] = worker_start_time;

                std::vector<int> new_workers_status = this->get_workers_status();
                new_workers_status[worker_id] = (worker_start_time + jobs[job_idx][unscheduled_task_idx]);

                neighbors.emplace_back(this->jobs, new_schedule, new_workers_status, this->distance_to(new_schedule));
            }
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
    this->schedule = other_state.get_schedule();
    this->jobs = other_state.jobs;
    this->workers_status = other_state.get_workers_status();
    return *this;
}

bool operator==(const State &a, const State &b)
{
    std::vector<std::vector<int>> a_schedule = a.get_schedule();
    std::vector<std::vector<int>> b_schedule = b.get_schedule();
    if (a_schedule.size() != b_schedule.size())
        return false;

    std::vector<int> a_workers_status = a.get_workers_status();
    std::vector<int> b_workers_status = b.get_workers_status();
    if (a_workers_status.size() != b_workers_status.size())
        return false;

    std::size_t a_hash = StateHash()(a);
    std::size_t b_hash = StateHash()(b);

    return a_hash == b_hash;
    /*
    for (size_t job_idx = 0; job_idx < a_schedule.size(); job_idx++)
    {
        std::vector<int> a_job = a_schedule[job_idx];
        std::vector<int> b_job = b_schedule[job_idx];
        if (
            a_job.size() != b_job.size() ||
            !std::equal(a_schedule.begin(), a_schedule.end(), b_schedule.begin(), b_schedule.end()))
            return false;
    }
    if (!std::equal(a_workers_status.begin(), a_workers_status.end(), b_workers_status.begin(), b_workers_status.end()))
        return false;
    return true;
    */
}

std::size_t StateHash::operator()(const State &key) const
{
    std::vector<std::vector<int>> schedule = key.get_schedule();
    std::size_t seed = schedule.size() * schedule[0].size();
    for (int i = 0; i < key.get_workers_status().size(); i++)
        seed ^= (i * key.get_workers_status()[i]) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    for (int i = 0; i < schedule.size(); i++)
        for (int j = 0; j < schedule[i].size(); j++)
            seed ^= (i * j * schedule[i][j]) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    return seed;
}
