#ifndef LL_SORTED_LIST_H
#define LL_SORTED_LIST_H

#include <vector>

#include "state.h"
#include "vector_ostreams.h"

constexpr unsigned int BUCKETSIZE = 128;

class LLSortedList
{
private:
    std::vector<std::vector<State>> m_data;
    unsigned int m_size = 0;

public:
    explicit LLSortedList(const unsigned int nBuckets)
    {
        this->m_data.reserve(nBuckets);
        for (std::vector<State> &bucket : this->m_data)
            bucket.reserve(BUCKETSIZE);
    }

    std::vector<std::vector<State>> get_data() const { return this->m_data; }

    void append(const State &);
    State pop();
    std::size_t size() const { return this->m_size; };
    bool empty() const { return this->size() == 0; };
};

#endif // LL_SORTED_LIST_H