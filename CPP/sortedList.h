#ifndef SORTED_LIST_H
#define SORTED_LIST_H

#include <functional>
#include <algorithm>
#include <iterator>

#include "state.h"

template <class T>
class SortedList
{
private:
    static const int STARTING_VECTOR_CAPACITY = 128;

    std::vector<T> m_data;
    std::function<bool(const T &, const T &)> m_sorter;

public:
    explicit SortedList(std::function<bool(const T &, const T &)> const &sorter) : m_sorter(sorter)
    {
        this->m_data.reserve(STARTING_VECTOR_CAPACITY);
    }

    void append(T);
    T pop();
    size_t size() const;
    bool contains(const T &) const;
    bool empty() const;
};

#endif // SORTED_LIST_H