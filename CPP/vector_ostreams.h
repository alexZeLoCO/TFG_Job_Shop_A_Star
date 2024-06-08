#ifndef VECTOR_OSTREAMS_H
#define VECTOR_OSTREAMS_H

#include <iostream>
#include <vector>

// Overload of the << operator for std::vector
template <typename T>
std::ostream &operator<<(std::ostream &, const std::vector<T> &);

// Helper function to print vectors
template <typename T>
void print_vector(std::ostream &, const std::vector<T> &);

// Specialization for vectors of vectors
template <typename T>
void print_vector(std::ostream &, const std::vector<std::vector<T>> &);

#endif // VECTOR_OSTREAMS_H