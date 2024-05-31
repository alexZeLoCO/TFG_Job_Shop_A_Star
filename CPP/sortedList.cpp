#include "sortedList.h"

template <typename T>
void SortedList<T>::append(T item)
{
    typename std::vector<T>::iterator pos = this->m_data.begin();
    typename std::vector<T>::iterator end = this->m_data.end();
    while (
        pos < end &&
        !this->m_sorter(item, *pos))
    {
        pos++;
    }
    if (pos == end || !(item == *pos))
        this->m_data.insert(pos, item);
}

template <typename T>
T SortedList<T>::pop()
{
    T out = *(this->m_data.begin());
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

template <typename T>
std::ostream &operator<<(std::ostream &output_stream, const SortedList<T> &the_list)
{
    output_stream << "[ ";
    for (const T &item : the_list.get_data())
        output_stream << item << " ";
    output_stream << "]";
    return output_stream;
}

// Pre defs

template class SortedList<int>;
template class SortedList<State>;
template std::ostream &operator<<(std::ostream &, const SortedList<int> &);
template std::ostream &operator<<(std::ostream &, const SortedList<State> &);
