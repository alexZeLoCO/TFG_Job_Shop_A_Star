#include <iostream>
#include <vector>
#include <algorithm>

class State
{

private:
    const std::vector<std::vector<int>> jobs;

    const std::vector<std::vector<int>> schedule;
    const std::vector<int> workers_status;

    unsigned int h_cost;
    unsigned int g_cost;

public:
    State(
        std::vector<std::vector<int>> jobs,
        std::vector<std::vector<int>> schedule,
        std::vector<int> workers_status,
        unsigned int g_cost) :
        jobs(jobs),
        schedule(schedule),
        workers_status(workers_status)
    {
        this->g_cost = g_cost;
        this->h_cost = this->calculate_h_cost();
    }

    State() : State(
                  std::vector<std::vector<int>>(),
                  std::vector<std::vector<int>>(),
                  std::vector<int>(), (unsigned int)0) {}

    const std::vector<std::vector<int>> get_schedule() const { return this->schedule; }
    const std::vector<int> get_workers_status() const { return this->workers_status; }

    const unsigned int get_g_cost() const { return this->g_cost; }
    const unsigned int get_h_cost() const { return this->h_cost; }
    const unsigned int get_f_cost() const { return this->get_g_cost() + this->get_h_cost(); }

    unsigned int get_max_worker_status() const
    {
        // idk why but if these are called inside std::max_element, it segfaults
        std::vector<int>::const_iterator value_begin = this->get_workers_status().begin();
        std::vector<int>::const_iterator value_end = this->get_workers_status().end();
        std::vector<int>::const_iterator max_element = std::max_element(
            value_begin, value_end
        );
        return max_element == this->get_workers_status().end() ? 0 : *(max_element.base());
    }

    unsigned int calculate_h_cost() const
    {
        std::vector<int> h_costs;
        for (int job_idx = 0; job_idx < this->jobs.size(); job_idx++)
        {
            h_costs.push_back(0);
            std::vector<int> job = jobs[job_idx];
            for (int task_idx = 0; task_idx < job.size(); task_idx++)
                if (this->get_schedule()[job_idx][task_idx] == -1)
                    h_costs[job_idx] += job[task_idx];
        }
        return *(std::min_element(h_costs.begin(), h_costs.end()).base());
    }

    bool is_goal_state() const
    {
        for (const std::vector<int> job : this->get_schedule())
            for (const int task : job)
                if (task == -1)
                    return false;
        return true;
    }

    int distance_to(std::vector<std::vector<int>> to) const
    {
        State from = *this;
        for (int job_idx = 0; job_idx < this->jobs.size(); job_idx++)
            for (int task_idx = 0; task_idx < this->jobs[job_idx].size(); task_idx++)
                if (from.get_schedule()[job_idx][task_idx] != to[job_idx][task_idx])
                    return jobs[job_idx][task_idx];
        return 0;
    }

    std::vector<int> get_first_unscheduled_task_idxs() const
    {
        std::vector<int> first_unscheduled_task_idxs;
        for (const std::vector<int> job : this->get_schedule())
        {
            int current_task_idx = 0;
            while (
                current_task_idx < job.size() &&
                job[current_task_idx] >= 0)
                current_task_idx++;
            if (current_task_idx < job.size())
                first_unscheduled_task_idxs.push_back(current_task_idx);
            else
                first_unscheduled_task_idxs.push_back(-1);
        }
        return first_unscheduled_task_idxs;
    }

    std::vector<int> get_first_unscheduled_task_start_times(
        std::vector<int> first_unscheduled_task_idxs) const
    {
        std::vector<int> first_unscheduled_task_start_times;
        for (int job_idx = 0; job_idx < jobs.size(); job_idx++)
        {
            int currently_unscheduled_task_idx = first_unscheduled_task_idxs[job_idx];
            if (currently_unscheduled_task_idx != -1)
            {
                if (currently_unscheduled_task_idx == 0)
                    first_unscheduled_task_start_times.push_back(0);
                else
                    first_unscheduled_task_start_times.push_back(
                        jobs[job_idx][currently_unscheduled_task_idx - 1] +
                        this->get_schedule()[job_idx][currently_unscheduled_task_idx - 1]);
            }
            else
                first_unscheduled_task_start_times.push_back(-1);
        }
        return first_unscheduled_task_start_times;
    }

    std::vector<State> get_neighbors_of() const
    {
        std::vector<State> neighbors;

        std::vector<int> first_unscheduled_task_idxs = this->get_first_unscheduled_task_idxs();
        std::vector<int> first_unscheduled_task_start_times = this->get_first_unscheduled_task_start_times(first_unscheduled_task_idxs);

        for (int job_idx = 0; job_idx < this->get_schedule().size(); job_idx++)
        {
            int task_start_time = first_unscheduled_task_idxs[job_idx];
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

                    State new_state(this->jobs, new_schedule, new_workers_status, this->distance_to(new_schedule));

                    neighbors.push_back(new_state);
                }
            }
        }
        return neighbors;
    }
};

std::ostream &operator<<(std::ostream &output_stream, const State &the_state)
{
    output_stream << "(schedule=[";
    for (const std::vector<int> job : the_state.get_schedule())
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

bool operator==(const State a, const State b)
{
    std::vector<std::vector<int>> a_schedule = a.get_schedule(), b_schedule = b.get_schedule();
    if (a_schedule.size() != b_schedule.size())
        return false;
    for (int job_idx = 0; job_idx < a_schedule.size(); job_idx++)
    {
        std::vector<int> a_job = a_schedule[job_idx], b_job = b_schedule[job_idx];
        if (a_job.size() != b_job.size())
            return false;
        for (int task_idx = 0; task_idx < a_job.size(); task_idx++)
        {
            if (a_job[task_idx] != b_job[task_idx])
                return false;
        }
    }
    std::vector<int> a_workers_status = a.get_workers_status(), b_workers_status = b.get_workers_status();
    if (a_workers_status.size() != b_workers_status.size())
        return false;
    for (int worker_status_idx = 0; worker_status_idx < a_workers_status.size(); worker_status_idx++)
    {
        if (a_workers_status[worker_status_idx] != b_workers_status[worker_status_idx])
            return false;
    }
    return true;
}

struct StateHash
{
    std::size_t operator()(const State &key) const
    {
        std::vector<std::vector<int>> schedule = key.get_schedule();
        size_t seed = schedule.size() * schedule[0].size();
        for (int i = 0; i < schedule.size(); i++)
            for (int j = 0; j < schedule[i].size(); j++)
                seed ^= (i * j) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        return seed;
    }
};
