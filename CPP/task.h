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
    unsigned int m_qualified_worker;

public:
    Task() : Task(0, 0, 0) {}

    Task(unsigned int duration, unsigned int hCost) : Task(duration, hCost, 0) {}

    Task(
        unsigned int duration,
        unsigned int hCost,
        unsigned int const &qualified_worker) : m_duration(duration),
                                                m_hCost(hCost),
                                                m_qualified_worker(qualified_worker)
    {
    }

    unsigned int get_h_cost() const { return this->m_hCost; }
    unsigned int get_duration() const { return this->m_duration; }
    unsigned int get_qualified_worker() const { return this->m_qualified_worker; }

    Task &operator=(const Task &);
};

std::ostream &operator<<(std::ostream &, const Task &);

#endif // TASK_H