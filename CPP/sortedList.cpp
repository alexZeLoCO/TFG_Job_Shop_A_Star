#include "sortedList.h"

template <typename T>
void SortedList<T>::append(T item)
{
    int current_index = 0;
    while (
        current_index < this->m_data.size() &&
        !this->m_sorter(item, this->m_data[current_index]))
        current_index++;
    this->m_data.emplace_back();
    for (int i = this->m_data.size() - 1; i > current_index; i--)
        this->m_data[i] = this->m_data[i - 1];
    this->m_data[current_index] = item;
}

template <typename T>
T SortedList<T>::pop()
{
    T out = *(this->m_data.begin().base());
    this->m_data.erase(this->m_data.begin());
    return out;
}

template <typename T>
std::size_t SortedList<T>::size() const
{
    return this->m_data.size();
}

template <typename T>
bool SortedList<T>::contains(const T &item) const
{
    return std::find(this->m_data.begin(), this->m_data.end(), item) != this->m_data.end();
}

template <typename T>
bool SortedList<T>::empty() const
{
    return this->m_data.empty();
}

// Pre defs

template class SortedList<int>;
template class SortedList<State>;
