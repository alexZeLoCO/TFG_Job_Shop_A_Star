#ifndef TASK_H
#define TASK_H

#include <stdio.h>

typedef struct TaskStruct
{
    unsigned int duration;
    unsigned int hCost;
    unsigned int qualifiedWorker;
} Task;

void printTask(Task *);
void printJobs(Task *, unsigned int);

#endif // TASK_H