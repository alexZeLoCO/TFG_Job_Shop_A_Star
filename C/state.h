#ifndef STATE_H
#define STATE_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "task.h"
#include <stdbool.h>

typedef struct StateStruct
{
    unsigned int size;
    Task *jobs;    // size * size
    int *schedule; // size * size
    unsigned int *workersStatus; // nWorkersStatus
    unsigned int nWorkerStatus;
} State;

State *hardCopy(State *);

unsigned int calculateHCost(State *);
unsigned int calculateGCost(State *);
unsigned int calculateFCost(State *);

unsigned int calculateWorstMakespan(State *);

State *calculateNeighbors(State *);
unsigned int calculateNNeighbors(State *);

bool isGoal(State *);

void printState(State *);
void printFullState(State *);

void freeState(State *);

#endif // STATE_H