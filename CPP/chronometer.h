#include <chrono>
#ifndef CHRONOMETER_H
#define CHRONOMETER_H

#include <map>
#include <iomanip>

#include "state.h"

class Chronometer
{
private:
    std::chrono::_V2::system_clock::time_point m_start_time;
    std::vector<float> m_goals;
    unsigned int m_currentGoalIdx = 0;
    std::map<float, double> m_times;
    std::string m_solver_name;

public:
    Chronometer() : Chronometer(std::vector<float>(1, 0), "Unknown Solver") {}
    explicit Chronometer(const std::vector<float> &goals, std::string const &solver_name) : m_goals(goals),
                                                                                            m_solver_name(solver_name) {}

    void start() { this->m_start_time = std::chrono::high_resolution_clock::now(); }
    std::chrono::duration<double> time() const
    {
        return std::chrono::high_resolution_clock::now() - this->m_start_time;
    }

    void process_iteration(const State &state)
    {
        this->log_timestamp(state.get_completion_percentage(), state);
    }

    void log_timestamp(float goal, const State &state)
    {
        const float targeted_goal = this->m_goals.size() > this->m_currentGoalIdx ? this->m_goals[this->m_currentGoalIdx] : 0;
        if (goal > 0 && goal >= targeted_goal)
        {
            double timestamp = this->time().count();
            this->m_currentGoalIdx++;
            if (this->m_times.find(targeted_goal) == this->m_times.end())
                this->m_times[targeted_goal] = timestamp;
            else
                this->m_times[targeted_goal] = this->m_times[targeted_goal] + timestamp;
            auto n_workers = (unsigned int)state.get_workers_status().size();
#pragma omp critical(io)
            std::cout << "c++;" << omp_get_max_threads() << ";a_star;" << this->m_solver_name << ";" << targeted_goal << ";" << state.get_jobs().size() << ";" << state.get_jobs()[0].size() << ";"
                      << n_workers << ";" << std::setprecision(5) << std::scientific
                      << timestamp << std::defaultfloat << ";" << state << ";" << state.get_g_cost() << std::endl;
        }
    }

    void enable_goals()
    {
        this->m_currentGoalIdx = 0;
    }

    std::map<float, double> get_timestamps() const
    {
        return this->m_times;
    }
};

#endif // CHRONOMETER_H