#include "openSet.h"

void add(Bucket *this, State *element)
{
    *(this->data + this->size) = *hardCopy(element);
    this->size++;
}

State *popElementFromBucket(Bucket *this)
{
    State *out = hardCopy(this->data);
    for (unsigned int elementIdx = 0; elementIdx < this->size - 1; elementIdx++)
        *(this->data + elementIdx) = *(this->data + elementIdx + 1);
    this->size -= 1;
    // freeState(this->data + this->size);
    return out;
}

State *popElement(Bucket *openSet)
{
    Bucket *currentBucket = openSet;
    while (currentBucket->size == 0)
        currentBucket++;
    return popElementFromBucket(currentBucket);
}

bool isEmpty(Bucket *openSet, unsigned int size)
{
    if (size == 0)
        return true;
    if (openSet->size > 0)
        return false;
    return isEmpty(openSet + 1, size - 1);
}

void freeOpenSet(Bucket *openSet, unsigned int size)
{
    if (size != 0)
    {
        freeOpenSet(openSet + 1, size - 1);
        for (unsigned int stateIdx = 0; stateIdx < openSet->size; stateIdx++)
            freeState(openSet->data + stateIdx);
        free(openSet->data);
    }
}
