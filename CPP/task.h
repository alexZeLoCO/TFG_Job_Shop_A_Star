#ifndef TASK_H
#define TASK_H

#include <vector>
#include <iostream>

#include "vector_ostreams.h"

class Task
{
private:
    unsigned int m_duration;
    unsigned int m_hCost;
    std::vector<unsigned int> m_qualified_workers;

public:
    Task() : Task(0, 0, std::vector<unsigned int>()) {}

    Task(unsigned int duration, unsigned int hCost) : Task(duration, hCost, std::vector<unsigned int>()) {}

    Task(
        unsigned int duration,
        unsigned int hCost,
        std::vector<unsigned int> const &qualified_workers) : m_duration(duration),
                                                              m_hCost(hCost),
                                                              m_qualified_workers(qualified_workers)
    {
    }

    unsigned int get_h_cost() const { return this->m_hCost; }
    unsigned int get_duration() const { return this->m_duration; }
    std::vector<unsigned int> get_qualified_workers() const { return this->m_qualified_workers; }

    Task &operator=(const Task &);
};

std::ostream &operator<<(std::ostream &, const Task &);

#endif // TASK_H