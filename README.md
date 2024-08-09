# TFG - A* - Job Shop Scheduling Problem

For my thesis, I enrolled in an investigation about the A* algorithm.
The main objectives of this investigation were:

1. Learning about the inner workings of the A* algorithm.
2. Finding out the benefits of parallel computing applied to the A* algorithm.
3. Transpiling a C++ A* algorithm to VHDL using HLS, disregarding all FPGA related optimizations.

## Job Shop Scheduling Problem

The A* algorithm is capable of solving many different problems.
The Job Shop Scheduling Problem (JSP) is a well-known problem that involves a graph search.
As input, the JSP takes a list of jobs.
Each of these jobs is made out of a list of tasks.
Each task is made out of the duration it takes to complete and the ID of the worker that has to fulfill it.

Therefore,

```typescript
type task = {
  duration: number;
  workerId: number;
};

type Job = Task[];

type JSPInput = Job[];
```

Given this input, the program has to return a schedule indicating the instant in which each task shall be started so that all jobs are finished in the least amount of time.

## A* Algorithm

### Open Set

The A* algorithm begins with a starting state, in this case the empty schedule.
This starting state is added to a list known as `open_set` which will contain the states in the 'frontier'.

### Costs

Each state has a `g_cost` which corresponds to the cost it takes to reach the state and an `h_cost` which corresponds to the estimated cost it takes to reach the goal state from this state.
In the case of the JSP, the `g_cost` is simply the time it takes to reach to this state and the `h_cost` is an estimate of the time left to complete all tasks.
There are several different ways of calculating the `h_cost`.
The function used to calculate this is known as a 'heuristic function' because it returns an estimate of the value we seek.
Depending on the heuristic function used, the algorithm may return optimal solutions.

### Neighbors

Each state has a list of neighbors which correspond to the next possible schedules.
For example:

The state with schedule:
```typescript
[
  [ 0, 1, -1],
  [ 0, -1, -1]
]
```

Will have two neighbor states:
```typescript
[
  [0, 1, 3],
  [0, -1, -1]
]
```
and
:
```typescript
[
  [0, 1, -1],
  [0, 3, -1]
]
```

### Iterations

The algorithm iterates over the states in the `open_set`, which is sorted by `f_cost` (`g_cost + h_cost`) so that the state with the lowest cost is extracted first.
On each iteration, the algorithm will:

1. Remove the head state from the `open_set` (i.e. the one with the lowest `f_cost`).
2. Check if this state is the goal state (if so, it returns).
3. Calculate the neighbors of the state.
4. Add the neighbors to the `open_set`.

> **_NOTE:_**  There are other steps in the A* algorithm that have been omitted in this description.
> This decision has been taken because of the problem we are trying to solve.
> For example, the JSP does not require us to check loops on the graph.

## Heuristics

Two different heuristics have been developed on this investigation.
One of them is slow and expected to return the optimal solution.
The other one is faster but is unlikely to return the optimal solution (particularly in big input datasets).

The optimal one:
$$h_{cost} = \max_{0 < j < J}{\sum_{t = J_{j, 0}}^{T}{D(T_{j, t})}}$$

The fast one:
$$h_{cost} = \sum_{j = 0}^J{\sum_{t = J_k}^{T}{D(T_{j, t})}}$$

Furthermore, we compared these two heuristics to $h_{cost} = 0$ which is simply the Dijkstra algorithm.

## Parallelism

Four different parallel algorithms were developed on this investigation.

### FCFS

This algorithm uses a shared `open_set` between several threads.
Threads process states as they are added to the `open_set`.

The runtime of this algorithm increases with the number of threads because the more threads,
the more states are explored and the more states are explored, the bigger the `open_set` gets.
This makes working with the `open_set` take longer and longer, almost halting the algorithm after several iterations.

Furthermore, as this algorithm has no sincronization between threads, two iterations may return different results.

### Batch

This algorithm works similarly to FCFS but all threads will wait for their teammates to finish exploring their current state before
running a new iteration.

Runtimewise, this algorithm behaves similarly to FCFS, too many states are explored too soon.
Unlike FCFS, this algorithm does have sincronization between threads so it will always return the same result.

### Recursive

This algorithm runs the A* algorithm for each neighbor of the starting state.
This is useful when paired with faster algorithms like the HDA* or algorithms that have no sincronization like FCFS.

If the number of neighbors of the starting state is higher than the number of threads,
this algorithm will take at least twice the time it would take other algorithms
as it has to run for each neighbor.

### HDA*

This algorithm attacks the main bottleneck of the algorithm, the `open_set`.
HDA* uses a hash function to distribute states between different `open_sets`,
each one being 'owned' by a thread.

This algorithm works wonderfully with multiple threads as each one has its `open_set`,
this means that no `open_set` ever gets too big.

## FPGA

HLS was used to transpile this program to VHDL.
The results were lacking, slower than singlehtread executions.

Therefore, HLS is no silver bullet (as expected), and programmers need to pay attention to FPGA specific optimizations to target II and the resulting VHDL program spat out by HLS.
