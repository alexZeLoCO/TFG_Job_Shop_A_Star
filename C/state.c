#include "state.h"

State *hardCopy(State *this)
{
    State *newState = (State *)malloc(sizeof(State));
    newState->nWorkerStatus = this->nWorkerStatus;
    newState->size = this->size;
    newState->jobs = this->jobs; // Jobs are never freed until the end

    unsigned int *newWorkersStatus = (unsigned int *)malloc(sizeof(unsigned int) * this->nWorkerStatus);
    for (unsigned int i = 0; i < this->nWorkerStatus; i++)
        *(newWorkersStatus + i) = *(this->workersStatus + i);
    newState->workersStatus = newWorkersStatus;

    const unsigned int totalSize = this->size * this->size;
    int *newSchedule = (int *)malloc(sizeof(int) * totalSize);
    for (int i = 0; i < totalSize; i++)
        *(newSchedule + i) = *(this->schedule + i);
    newState->schedule = newSchedule;

    return newState;
}

unsigned int calculateHCost(State *this)
{
    unsigned int maxHCost = 0;
    for (unsigned int jobIdx = 0; jobIdx < this->size; jobIdx++)
    {
        unsigned int taskIdx = 0;
        const Task *currentJob = this->jobs + jobIdx * this->size;
        const int *currentScheduledJob = this->schedule + jobIdx * this->size;
        while (taskIdx < this->size && *(currentScheduledJob + taskIdx) != -1)
            taskIdx++;
        if (taskIdx < this->size && maxHCost < (currentJob + taskIdx)->hCost)
            maxHCost = (currentJob + taskIdx)->hCost;
    }
    return maxHCost;
}

unsigned int calculateGCost(State *this)
{
    unsigned int maxGCost = 0;
    for (unsigned int workerStatusIdx = 0; workerStatusIdx < this->nWorkerStatus; workerStatusIdx++)
        if (*(this->workersStatus + workerStatusIdx) > maxGCost)
            maxGCost = *(this->workersStatus + workerStatusIdx);
    return maxGCost;
}

unsigned int calculateFCost(State *this)
{
    return calculateGCost(this) + calculateHCost(this);
}

unsigned int calculateWorstMakespan(State *this)
{
    const unsigned int totalSize = this->size * this->size;
    unsigned int makespan = 0;
    for (int taskIdx = 0; taskIdx < totalSize; taskIdx++)
        makespan += (this->jobs + taskIdx)->duration;
    return makespan;
}

State *calculateNeighbors(State *this)
{
    // There will never be more than size neighbors
    State *neighbors = (State *)malloc(sizeof(State) * this->size);

    unsigned int unfinishedJobsCounter = 0;
    for (unsigned int jobIdx = 0; jobIdx < this->size; jobIdx++)
    {
        const Task *currentJob = this->jobs + jobIdx * this->size;
        const int *currentJobSchedule = this->schedule + jobIdx * this->size;

        unsigned int taskIdx = 0;
        while (taskIdx < this->size && *(currentJobSchedule + taskIdx) != -1)
            taskIdx++;

        if (taskIdx < this->size)
        {
            Task firstUnscheduledTask = *(currentJob + taskIdx);

            unsigned int taskStartTime = taskIdx > 0
                                             ? (*(currentJobSchedule + taskIdx - 1) + (currentJob + taskIdx - 1)->duration)
                                             : 0;
            unsigned int workerStartTime = *(this->workersStatus + firstUnscheduledTask.qualifiedWorker);
            unsigned int actualStartTime = taskStartTime > workerStartTime ? taskStartTime : workerStartTime;

            State *newState = hardCopy(this);
            *(newState->schedule + jobIdx * this->size + taskIdx) = actualStartTime;
            *(newState->workersStatus + firstUnscheduledTask.qualifiedWorker) = actualStartTime + firstUnscheduledTask.duration;

            *(neighbors + unfinishedJobsCounter++) = *newState;
        }
    }
    return neighbors;
}

unsigned int calculateNNeighbors(State *this)
{
    unsigned int neighborCount = 0;
    for (unsigned int jobIdx = 0; jobIdx < this->size; jobIdx++)
        if (*(this->schedule + jobIdx * this->size + this->size - 1) == -1)
            neighborCount += 1;
    return neighborCount;
}

bool isGoal(State *this)
{
    return calculateNNeighbors(this) == 0;
}

void printState(State *this)
{
    const unsigned int gCost = calculateGCost(this);
    const unsigned int hCost = calculateHCost(this);
    const unsigned int fCost = gCost + hCost;
    printf("State(gCost: %d, hCost: %d, fCost: %d)", gCost, hCost, fCost);
}

void printFullState(State *this)
{
    printState(this);
    printf("\n");
    for (unsigned int jobIdx = 0; jobIdx < this->size; jobIdx++)
    {
        int *currentJob = this->schedule + jobIdx * this->size;
        for (unsigned int taskIdx = 0; taskIdx < this->size; taskIdx++)
            printf("%d ", *(currentJob + taskIdx));
        printf("\n");
    }
}

void freeState(State *this)
{
    free(this->schedule);
    free(this->workersStatus);
}
