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

public:
    Chronometer() : Chronometer(std::map<unsigned short, bool>()) {}
    explicit Chronometer(const std::map<unsigned short, bool> &goals) : m_goals(goals) {}

    void start() { this->m_start_time = std::chrono::high_resolution_clock::now(); }
    std::chrono::duration<double> time() const
    {
        return std::chrono::high_resolution_clock::now() - this->m_start_time;
    }

    void process_iteration(const State &state)
    {
        auto goal = (unsigned short)(state.calculate_completion_percentage() * 10);
        if (!this->m_goals[goal])
        {
            this->m_goals[goal] = true;
            auto n_workers = (unsigned int)state.get_workers_status().size();
            std::cout << "c++;" << omp_get_max_threads() << ";a_star;" << ((float)goal) / 10 << ";" << state.get_jobs().size() << ";" << state.get_jobs()[0].size() << ";"
                      << n_workers << ";" << std::setprecision(5) << std::scientific
                      << this->time().count() << std::defaultfloat << ";" << state << ";" << state.get_max_worker_status() << std::endl;
        }
    }
};

#endif // CHRONOMETER_H