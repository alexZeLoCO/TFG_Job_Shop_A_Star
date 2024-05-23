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

        std::cout << "CURRENT STATE IS NOW "  << current_state << std::endl;

        if (current_state.is_goal_state())
            return current_state;

        std::vector<State> neighbor_states = current_state.get_neighbors_of();
        std::cout << "NEIGHBORS OF CURRENT STATE:" << std::endl;
        for (int neighbor_idx = 0 ; neighbor_idx < neighbor_states.size() ; neighbor_idx++)
        {
            std::cout << "NEIGHBOR_" << neighbor_idx << ": " <<
                neighbor_states[neighbor_idx] << std::endl;
        }
        for (State neighbor : neighbor_states)
        {
            std::cout << "PROCESSING NEIGHBOR: " << neighbor << std::endl;
            int tentative_g_cost = neighbor.get_max_worker_status();

            if (
                g_costs.find(neighbor) == g_costs.end() ||
                tentative_g_cost < g_costs[neighbor])
            {
                std::cout << "UPDATE DATA" << std::endl;
                g_costs[neighbor] = tentative_g_cost;
                f_costs[neighbor] = tentative_g_cost + neighbor.get_h_cost();
            }
            if (open_set.find(neighbor) == open_set.end())
            {
                std::cout << "NEIGHBOR ADDED TO OPEN SET" << std::endl;
                open_set.emplace(neighbor);
            }
        }
    }

    return State();
}

int main(int argc, char **argv)
{
    const std::vector<std::vector<int>> jobs({{2, 5, 1},
                                        {3, 3, 3}});

    std::cout << "PROGRAM START" << std::endl;
    const State output = a_star(jobs, 2);
    std::cout << "PROGRAM RESULT:\n" << output << std::endl;

    return 0;
}