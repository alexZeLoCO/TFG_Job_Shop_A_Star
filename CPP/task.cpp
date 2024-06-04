#include "task.h"

Task &Task::operator=(const Task &other)
{
    this->m_duration = other.get_duration();
    this->m_qualified_workers = other.get_qualified_workers();
    return *this;
}

std::ostream &operator<<(std::ostream &out_stream, const Task &task)
{
    out_stream << task.get_duration();
    return out_stream;
}
