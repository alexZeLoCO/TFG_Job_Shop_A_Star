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
    std::map<unsigned short, bool> m_goals;
    std::map<unsigned short, double> m_times;
    std::string m_solver_name;

public:
    Chronometer() : Chronometer(std::map<unsigned short, bool>(), "Unknown Solver") {}
    explicit Chronometer(const std::map<unsigned short, bool> &goals, std::string const &solver_name) : m_goals(goals),
                                                                                                        m_solver_name(solver_name) {}

    void start() { this->m_start_time = std::chrono::high_resolution_clock::now(); }
    std::chrono::duration<double> time() const
    {
        return std::chrono::high_resolution_clock::now() - this->m_start_time;
    }

    void process_iteration(const State &state)
    {
        auto goal = (unsigned short)(state.calculate_completion_percentage() * 10);
        this->log_timestamp(goal, state);
    }

    void log_timestamp(unsigned short goal, const State &state)
    {
        if (!this->m_goals[goal])
        {
            double timestamp = this->time().count();
            this->m_goals[goal] = true;
            if (this->m_times.find(goal) == this->m_times.end())
                this->m_times.try_emplace(goal, timestamp);
            else
                this->m_times.try_emplace(goal, this->m_times[goal] + timestamp);
            this->m_goals[goal] = true;
            auto n_workers = (unsigned int)state.get_workers_status().size();
            std::cout << "c++;" << omp_get_max_threads() << ";a_star;" << this->m_solver_name << ";" << ((float)goal) / 10 << ";" << state.get_jobs().size() << ";" << state.get_jobs()[0].size() << ";"
                      << n_workers << ";" << std::setprecision(5) << std::scientific
                      << timestamp << std::defaultfloat << ";" << state << ";" << state.get_max_worker_status() << std::endl;
        }
    }

    void enable_goals()
    {
        for (const auto &[key, value] : this->m_goals)
            this->m_goals[key] = false;
    }

    std::map<unsigned short, double> get_timestamps() const
    {
        return this->m_times;
    }
};

#endif // CHRONOMETER_H