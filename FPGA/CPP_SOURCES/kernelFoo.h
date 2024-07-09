#ifndef KERNEL_FOO_H
#define KERNEL_FOO_H

#include <vector>
#include <unordered_map>

#include "task.h"
#include "state.h"
#include "sortedList.h"

State get_state(SortedList<State> &open_set, const bool &found_goal_state);

void add_neighbors(
    const std::vector<State> &neighbors,
    std::unordered_map<State, unsigned int, StateHash, StateEqual> &g_costs,
    std::unordered_map<State, unsigned int, StateHash, StateEqual> &f_costs,
    SortedList<State> &open_set);

void kernel_foo(const std::vector<std::vector<Task>> &, const std::size_t, const std::size_t, unsigned int &);

#endif // KERNEL_FOO_H