#include "aStar.h"

void solve(Task *jobs, const unsigned int size, const unsigned int nWorkersStatus)
{
    const unsigned int totalSize = size * size;
    State startingState;
    startingState.size = size;
    startingState.jobs = jobs;

    int *schedule = (int *)malloc(sizeof(int) * totalSize);
    for (int i = 0; i < totalSize; i++)
        *(schedule + i) = -1;
    startingState.schedule = schedule;

    startingState.nWorkerStatus = nWorkersStatus;
    unsigned int *workersStatus = (unsigned int *)malloc(sizeof(unsigned int) * nWorkersStatus);
    for (int i = 0; i < nWorkersStatus; i++)
        *(workersStatus + i) = 0;
    startingState.workersStatus = workersStatus;

    const unsigned int bucketSize = 128;
    const unsigned int nBuckets = calculateWorstMakespan(&startingState);
    Bucket *openSet = (Bucket *)malloc(sizeof(Bucket) * nBuckets);
    for (unsigned int bucketIdx = 0; bucketIdx < nBuckets; bucketIdx++)
    {
        (openSet + bucketIdx)->data = (State *)malloc(sizeof(State) * bucketSize);
        (openSet + bucketIdx)->size = 0;
    }

    add(openSet + calculateFCost(&startingState), &startingState);

    bool foundSolution = false;
    State *goalState;
    while (!foundSolution)
    {
        State *currentState = popElement(openSet);
        /*
        printf("Processing ");
        printState(currentState);
        printf("\n");
        */

        if (isGoal(currentState))
        {
            foundSolution = true;
            goalState = hardCopy(currentState);
        }

        State *neighbors = calculateNeighbors(currentState);
        const unsigned int nNeighbors = calculateNNeighbors(currentState);

        for (unsigned int neighborIdx = 0; neighborIdx < nNeighbors; neighborIdx++)
        {
            State *currentNeighbor = neighbors + neighborIdx;
            add(openSet + calculateFCost(currentNeighbor), currentNeighbor);
            freeState(currentNeighbor);
        }
        free(neighbors);

        freeState(currentState);
        free(currentState);
    }

    printFullState(goalState); // TODO: Check if this is calculated correctly
    freeState(goalState);
    free(goalState);

    freeOpenSet(openSet, nBuckets);
    free(openSet);

    free(schedule);
    free(workersStatus);
}
