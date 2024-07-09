#include <iostream>
#include <omp.h>

#include "sortedList.h"

int main()
{
    SortedList<int> numbers([](const int &a, const int &b)
                            { return a < b; });

    for (int i = 0; i < 10; i += 2)
        numbers.append(i);

    for (int i = 1; i < 10; i += 2)
        numbers.append(i);

    bool has_number = !numbers.empty();
    bool target_found = false;
    const int target_number = 8 * 2e4;

#pragma omp parallel shared(numbers, has_number, target_found, target_number)
    while (!target_found && has_number)
    {
        int current_number;

#pragma omp critical(numbers)
        if (numbers.empty())
            has_number = false;

        if (has_number)
        {
#pragma omp critical(numbers)
            current_number = numbers.pop();

#pragma omp critical(io)
            std::cout << "Thread " << omp_get_thread_num() << " is processing item " << current_number << std::endl;

            int limit = 2e6;
            for (int i = 0; i < limit; i++)
            {
                int new_number = current_number * i;
                if (new_number == target_number)
                    target_found = true;
                else
#pragma omp critical(numbers)
                    numbers.append(new_number);
            }
        }
    }
    std::cout << "Target has been found" << std::endl;
}
