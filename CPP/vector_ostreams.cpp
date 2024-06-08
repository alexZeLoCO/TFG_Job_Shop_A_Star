#include "vector_ostreams.h"

// Helper function to print vectors
template <typename T>
void print_vector(std::ostream &os, const std::vector<T> &vec)
{
    os << '[';
    for (std::size_t i = 0; i < vec.size(); ++i)
    {
        os << vec[i];
        if (i != vec.size() - 1)
        {
            os << ", ";
        }
    }
    os << ']';
}

// Specialization for vectors of vectors
template <typename T>
void print_vector(std::ostream &os, const std::vector<std::vector<T>> &vec)
{
    os << '[';
    for (std::size_t i = 0; i < vec.size(); ++i)
    {
        os << vec[i];
        if (i != vec.size() - 1)
        {
            os << ", ";
        }
    }
    os << ']';
}

// Overload of the << operator for std::vector
template <typename T>
std::ostream &operator<<(std::ostream &os, const std::vector<T> &vec)
{
    print_vector(os, vec);
    return os;
}