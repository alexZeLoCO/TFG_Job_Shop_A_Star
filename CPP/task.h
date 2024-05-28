#ifndef TASK_H
#define TASK_H

#include <iostream>
#include <vector>

class Task
{
private:
    int duration;
    std::vector<int> qualified_workers;

public:
    Task() : Task(0, {}) {}

    Task(int duration) : Task(duration, {}) {}

    Task(
        int duration,
        std::vector<int> const &qualified_workers) : duration(duration),
                                                     qualified_workers(qualified_workers)
    {
    }

    int get_duration() const { return this->duration; }
    std::vector<int> get_qualified_workers() const { return this->qualified_workers; }
};

std::ostream &operator<<(std::ostream &, const Task &);

#endif // TASK_H
