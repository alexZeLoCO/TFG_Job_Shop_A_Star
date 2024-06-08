#include <chrono>
#ifndef CHRONOMETER_H
#define CHRONOMETER_H

class Chronometer
{
private:
    std::chrono::_V2::system_clock::time_point start_time;
    std::chrono::_V2::system_clock::time_point end_time;

public:
    Chronometer() = default;

    void start() { this->start_time = std::chrono::high_resolution_clock::now(); }
    void stop() { this->end_time = std::chrono::high_resolution_clock::now(); }
    std::chrono::duration<double> time() const
    {
        return this->end_time != std::chrono::_V2::system_clock::time_point()
                   ? this->end_time - this->start_time
                   : std::chrono::high_resolution_clock::now() - this->start_time;
    }
};

#endif // CHRONOMETER_H