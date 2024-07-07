#ifndef STATE_H
#define STATE_H

#include <stdlib.h>
#include <string.h>

#include "task.h"

typedef struct StateStruct
{
    unsigned int size;
    Task *jobs;    // size * size
    int *schedule; // size * size
    unsigned int hCost;
    unsigned int *workersStatus;
    unsigned int nWorkerStatus;
} State;

unsigned int calculateHCost(State);
unsigned int calculateGCost(State);
unsigned int calculateFCost(State);

unsigned int calculateNeighbors(State, State *);

#endif // STATE_H