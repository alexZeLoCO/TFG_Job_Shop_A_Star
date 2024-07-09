#ifndef OPEN_SET_H
#define OPEN_SET_H

#include "state.h"

typedef struct OpenSetBucket
{
    int size;
    State *data;
} Bucket;

void add(Bucket *, State *);
bool isEmpty(Bucket *, unsigned int);

State *popElementFromBucket(Bucket *);
State *popElement(Bucket *);

void freeOpenSet(Bucket *, unsigned int);

#endif // OPEN_SET_H