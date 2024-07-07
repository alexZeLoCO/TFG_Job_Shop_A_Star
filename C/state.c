#include "state.h"

unsigned int calculateHCost(State this)
{
    unsigned int maxHCost = 0;
    for (unsigned int jobIdx = 0; jobIdx < this.size; jobIdx++)
    {
        unsigned int taskIdx = 0;
        const Task *currentJob = this.jobs + jobIdx * this.size;
        while (taskIdx < this.size && *(this.schedule + taskIdx) != -1)
            taskIdx++;
        if (taskIdx < this.size && maxHCost < (currentJob + taskIdx)->hCost)
            maxHCost = (currentJob + taskIdx)->hCost;
    }
    return maxHCost;
}

unsigned int calculateGCost(State this)
{
    unsigned int maxGCost = 0;
    for (unsigned int workerStatusIdx = 0; workerStatusIdx < this.nWorkerStatus; workerStatusIdx++)
        if (*(this.workersStatus + workerStatusIdx) > maxGCost)
            maxGCost = *(this.workersStatus + workerStatusIdx);
    return maxGCost;
}

unsigned int calculateFCost(State this)
{
    return calculateGCost(this) + calculateHCost(this);
}

unsigned int calculateNeighbors(State this, State *dst)
{
    // There will never be more than size neighbors
    dst = (State *)malloc(sizeof(State) * this.size);

    unsigned int unfinishedJobsCounter = 0;
    for (unsigned int jobIdx = 0; jobIdx < this.size; jobIdx++)
    {
        const Task *currentJob = this.jobs + jobIdx * this.size;
        const int *currentJobSchedule = this.schedule + jobIdx * this.size;

        unsigned int taskIdx = 0;
        while (taskIdx < this.size && *(currentJobSchedule + taskIdx) != -1)
            taskIdx++;

        if (taskIdx < this.size)
        {
            Task firstUnscheduledTask = *(currentJob + taskIdx);

            unsigned int taskStartTime = taskIdx > 0
                                             ? (*(currentJobSchedule + taskIdx - 1) + (currentJob + taskIdx - 1)->duration)
                                             : 0;
            unsigned int workerStartTime = *(this.workersStatus + firstUnscheduledTask.qualifiedWorker);
            unsigned int actualStartTime = taskStartTime > workerStartTime ? taskStartTime : workerStartTime;

            int *newSchedule = (int *)malloc(sizeof(int) * this.size * this.size);
            memcpy(newSchedule, this.schedule, this.size * this.size);
            *(newSchedule + jobIdx * this.size + taskIdx) = actualStartTime;

            unsigned int *newWorkerStatus = (unsigned int *)malloc(sizeof(unsigned int *) * this.nWorkerStatus);
            memcpy(newWorkerStatus, this.workersStatus, this.nWorkerStatus);
            *(newWorkerStatus + firstUnscheduledTask.qualifiedWorker) = actualStartTime + firstUnscheduledTask.duration;

            State newState;
            newState.size = this.size;
            newState.jobs = this.jobs;
            newState.schedule = newSchedule;
            newState.workersStatus = newWorkerStatus;
            newState.nWorkerStatus = this.nWorkerStatus;
            newState.hCost = calculateHCost(newState);

            *(dst + unfinishedJobsCounter++) = newState;
        }
    }
    return unfinishedJobsCounter;
}
