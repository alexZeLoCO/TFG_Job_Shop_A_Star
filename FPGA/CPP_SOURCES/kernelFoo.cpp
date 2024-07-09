#include "kernelFoo.h"

void kernel_foo(
    const std::vector<std::vector<Task>> &jobs,
    const std::size_t size,
    const std::size_t nWorkers,
    unsigned int &makespan)
{
    const std::vector<std::vector<int>> starting_schedule(size, std::vector<int>(size, -1));
    const std::vector<int> starting_workers_status(nWorkers, 0);
    const State starting_state(jobs, starting_schedule, starting_workers_status);

    std::unordered_map<State, unsigned int, StateHash, StateEqual> g_costs;
    g_costs[starting_state] = 0;
    std::unordered_map<State, unsigned int, StateHash, StateEqual> f_costs;
    f_costs[starting_state] = starting_state.get_f_cost();

    const auto comparator = [&f_costs](const State &lhs, const State &rhs)
    {
        return f_costs[lhs] < f_costs[rhs];
    };

    SortedList<State> open_set(comparator);
    open_set.append(starting_state);

    State goal_state;
    bool found_goal_state = false;

    // O(n^2 + 2n + n^2 + n * (l + n + n^2 + k)) or O(n^2 + n + 2n^2 + n^2 * (l + n + n^2 + k))
    while (!found_goal_state)
    {
        State current_state = get_state(open_set, found_goal_state);

        if (current_state.is_goal_state())
        {
            goal_state = current_state;
            found_goal_state = true;
            break;
        }

        const std::vector<State> neighbor_states = current_state.get_neighbors_of(); // O(2n + n^2) or (n + 2n^2)
        add_neighbors(neighbor_states, g_costs, f_costs, open_set);
    }
    makespan = goal_state.get_g_cost();
}

State get_state(
    SortedList<State> &open_set,
    const bool &found_goal_state)
{
    bool has_state;
    State current_state;
    do
    {
        has_state = !open_set.empty();
        if (has_state)
        {
            current_state = open_set.pop(); // O(1)
        }
    } while (!has_state && !found_goal_state);
    return current_state;
}

void add_neighbors(
    const std::vector<State> &neighbors,
    std::unordered_map<State, unsigned int, StateHash, StateEqual> &g_costs,
    std::unordered_map<State, unsigned int, StateHash, StateEqual> &f_costs,
    SortedList<State> &open_set)
{
    for (const State &neighbor : neighbors)
    {
        const unsigned int tentative_g_cost = neighbor.get_g_cost();
        if (g_costs.find(neighbor) == g_costs.end() || tentative_g_cost < g_costs[neighbor])
        {
            g_costs[neighbor] = tentative_g_cost;
            f_costs[neighbor] = tentative_g_cost + neighbor.get_h_cost();
            open_set.append(neighbor);
        }
    }
}