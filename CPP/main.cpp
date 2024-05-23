#include <iostream>
#include <unordered_map>
#include <vector>
#include <algorithm>
#include <set>

#include "state.cpp"

State a_star(std::vector<std::vector<int>> jobs, int n_workers)
{
    int n_jobs = jobs.size();
    if (n_jobs == 0)
        return State();
    int n_tasks = jobs[0].size();
    if (n_tasks == 0)
        return State();

    std::vector<std::vector<int>> starting_schedule(n_jobs, std::vector<int>(n_tasks, -1));
    std::vector<int> starting_workers_status(n_workers, 0);

    State starting_state(jobs, starting_schedule, starting_workers_status, 0);

    std::unordered_map<State, int, StateHash> g_costs;
    g_costs.emplace(starting_state, 0);
    std::unordered_map<State, int, StateHash> f_costs;
    f_costs.emplace(starting_state, starting_state.get_f_cost());

    auto comparator = [&f_costs](const State &lhs, const State &rhs)
    {
        return f_costs[lhs] < f_costs[rhs];
    };

    std::set<State, decltype(comparator)> open_set(comparator);
    open_set.emplace(starting_state);

    while (open_set.size() > 0)
    {
        State current_state = *open_set.begin();
        open_set.erase(open_set.begin());

        if (current_state.is_goal_state())
            return current_state;

        std::vector<State> neighbor_states = current_state.get_neighbors_of();
        for (State neighbor : neighbor_states)
        {
            int tentative_g_cost = neighbor.get_max_worker_status();

            if (
                g_costs.find(neighbor) == g_costs.end() ||
                tentative_g_cost < g_costs[neighbor])
            {
                g_costs[neighbor] = tentative_g_cost;
                f_costs[neighbor] = tentative_g_cost + neighbor.get_h_cost();
            }
            if (open_set.find(neighbor) == open_set.end())
                open_set.emplace(neighbor);
        }
    }

    return State();
}

int main(int argc, char **argv)
{
    std::vector<std::vector<int>> jobs({{2, 5, 1},
                                        {3, 3, 3}});
    State output = a_star(jobs, 3);
    std::cout << output << std::endl;

    return 0;
}