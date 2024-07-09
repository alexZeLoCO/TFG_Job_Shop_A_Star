#ifndef SORTED_LIST_H
#define SORTED_LIST_H

#include <functional>
#include <algorithm>
#include <iterator>
#include <deque>

#include "state.h"
#include "vector_ostreams.h"

constexpr int STARTING_VECTOR_CAPACITY = 128;

template <typename T>
class SortedList
{
private:
    std::deque<T> m_data;
    std::function<bool(const T &, const T &)> m_sorter;

public:
    explicit SortedList(std::function<bool(const T &, const T &)> const &sorter) : m_sorter(sorter)
    {
        // this->m_data.reserve(STARTING_VECTOR_CAPACITY);
    }

    std::deque<T> get_data() const { return this->m_data; }

    void append(T);
    T pop();
    std::size_t size() const;
    bool contains(const T &) const;
    bool empty() const;
};

template <typename T>
std::ostream &operator<<(std::ostream &, const SortedList<T> &);

#endif // SORTED_LIST_H