#ifndef STATE_H
#define STATE_H

#include <algorithm>
#include <vector>
#include <iostream>
#include <numeric>

#include "task.h"

class State
{
private:
    std::vector<std::vector<Task>> jobs{};

    std::vector<std::vector<int>> schedule{};
    std::vector<std::vector<int>> workers_status{};

    unsigned int h_cost{};
    unsigned int g_cost{};

public:
    State() : State(
                  std::vector<std::vector<Task>>(),
                  std::vector<std::vector<int>>(),
                  std::vector<std::vector<int>>())
    {
    }

    State(
        std::vector<std::vector<Task>> const &jobs,
        std::vector<std::vector<int>> const &schedule,
        std::vector<std::vector<int>> const &workers_status) : jobs(jobs),
                                                               schedule(schedule),
                                                               workers_status(workers_status)
    {
        this->g_cost = this->get_max_worker_status();
        this->h_cost = this->calculate_h_cost();
    };

    std::vector<std::vector<int>> get_schedule() const { return this->schedule; }
    std::vector<std::vector<int>> get_workers_status() const { return this->workers_status; }

    unsigned int get_g_cost() const { return this->g_cost; }
    unsigned int get_h_cost() const { return this->h_cost; }
    unsigned int get_f_cost() const { return this->get_g_cost() + this->get_h_cost(); }

    unsigned int get_max_worker_status() const;
    unsigned int calculate_h_cost() const;
    bool is_goal_state() const;
    std::vector<int> get_first_unscheduled_task_idxs() const;
    std::vector<int> get_first_unscheduled_task_start_times(
        std::vector<int> &) const;
    std::vector<State> get_neighbors_of() const;

    State &operator=(const State &);
};

bool operator<(const State &, const State &);
std::ostream &operator<<(std::ostream &, const State &);
bool operator==(const State &, const State &);

struct StateHash
{
    std::size_t operator()(const State &) const;
};

#endif // STATE_H