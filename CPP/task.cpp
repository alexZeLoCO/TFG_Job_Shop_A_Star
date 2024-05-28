#include "task.h"

std::ostream &operator<<(std::ostream &output_stream, const Task &the_task)
{
    output_stream << "(" << the_task.get_duration() << ", [ ";
    for (const int qualified_worker : the_task.get_qualified_workers())
        output_stream << qualified_worker << " ";
    output_stream << "])";
    return output_stream;
}
