#ifndef STATE_H
#define STATE_H

#include <algorithm>
#include <vector>
#include <iostream>
#include <omp.h>

#include "task.h"
#include "vector_ostreams.h"

constexpr std::size_t UNINITIALIZED_HASH = 0;

class State
{
private:
    std::vector<std::vector<Task>> m_jobs{};

    std::vector<std::vector<int>> m_schedule{};
    std::vector<int> first_unscheduled_task_idxs{};
    std::vector<int> m_workers_status{};

    unsigned int h_cost{};
    unsigned int g_cost{};
    float m_completion_percentage;

    std::size_t state_hash = UNINITIALIZED_HASH;
    std::size_t full_hash = UNINITIALIZED_HASH;

    unsigned int calculate_max_worker_status() const;
    unsigned int calculate_h_cost() const;
    float calculate_completion_percentage() const;
    std::vector<int> calculate_first_unscheduled_task_idxs() const;
    std::vector<int> calculate_first_unscheduled_task_start_times() const;

public:
    State() : State(
                  std::vector<std::vector<Task>>(),
                  std::vector<std::vector<int>>(),
                  std::vector<int>())
    {
    }

    State(
        std::vector<std::vector<Task>> const &jobs,
        std::vector<std::vector<int>> const &schedule,
        std::vector<int> const &workers_status) : m_jobs(jobs),
                                                  m_schedule(schedule),
                                                  m_workers_status(workers_status)
    {
        this->g_cost = this->calculate_max_worker_status();
        this->first_unscheduled_task_idxs = this->calculate_first_unscheduled_task_idxs();
        this->h_cost = this->calculate_h_cost();
        this->m_completion_percentage = this->calculate_completion_percentage();
    };

    State(
        const State &other_state) : m_jobs(other_state.get_jobs()),
                                    m_schedule(other_state.get_schedule()),
                                    first_unscheduled_task_idxs(other_state.first_unscheduled_task_idxs),
                                    m_workers_status(other_state.get_workers_status()),
                                    h_cost(other_state.get_h_cost()),
                                    g_cost(other_state.get_g_cost()),
                                    m_completion_percentage(other_state.get_completion_percentage())
    {
    }

    std::vector<std::vector<Task>> get_jobs() const { return this->m_jobs; }
    std::vector<std::vector<int>> get_schedule() const { return this->m_schedule; }
    std::vector<int> get_workers_status() const { return this->m_workers_status; }

    unsigned int get_g_cost() const { return this->g_cost; }
    unsigned int get_h_cost() const { return this->h_cost; }
    unsigned int get_f_cost() const { return this->get_g_cost() + this->get_h_cost(); }

    std::size_t get_state_hash() const { return this->state_hash; }
    std::size_t get_full_hash() const { return this->full_hash; }

    void set_state_hash(std::size_t new_state_hash) { this->state_hash = new_state_hash; }
    void set_full_hash(std::size_t new_full_hash) { this->full_hash = new_full_hash; }

    bool is_goal_state() const;
    std::vector<State> get_neighbors_of() const;

    float get_completion_percentage() const { return this->m_completion_percentage; }

    State &operator=(const State &);
};

bool operator<(const State &, const State &);
std::ostream &operator<<(std::ostream &, const State &);
bool operator==(const State &, const State &);

struct StateHash
{
    std::size_t operator()(State) const;
};

struct FullHash
{
    std::size_t operator()(State) const;
};

struct StateEqual
{
    bool operator()(const State &, const State &) const;
};

#endif // STATE_H