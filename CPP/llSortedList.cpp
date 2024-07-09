#include "llSortedList.h"

void LLSortedList::append(const State &item)
{
    this->m_data[item.get_f_cost()].push_back(item);
    this->m_size += 1;
}

State LLSortedList::pop()
{
    for (std::vector<State> &bucket : this->m_data)
        if (!bucket.empty())
        {
            auto iter = bucket.begin();
            State out = *iter.base();
            bucket.erase(iter);
            this->m_size -= 1;
            return out;
        }
    return State();
}
