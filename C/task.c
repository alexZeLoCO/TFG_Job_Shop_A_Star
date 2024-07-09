#include "task.h"

void printTask(Task *this)
{
    printf("Task(duration: %d, qualifiedWorker: %d, hCost: %d)", this->duration, this->qualifiedWorker, this->hCost);
}

void printJobs(Task *this, unsigned int size)
{
    for (unsigned int jobIdx = 0; jobIdx < size; jobIdx++)
    {
        printf("Job %d: ", jobIdx);
        for (unsigned int taskIdx = 0; taskIdx < size; taskIdx++)
        {
            printf("\t");
            printTask(this + jobIdx * size + taskIdx);
        }
        printf("\n");
    }
}