#ifndef OPTIONAL_H
#define OPTIONAL_H

#include "chronometer.h"

template <typename T>
class Optional
{
private:
    T m_value;
    bool m_hasValue;

public:
    Optional() : m_hasValue(false) {}
    explicit Optional(const T &value) : m_value(value), m_hasValue(true) {}
    ~Optional() = default;

    bool has_value() const
    {
        return this->m_hasValue;
    }

    T value() const
    {
        return this->m_value;
    }
};

#endif // OPTIONAL_H