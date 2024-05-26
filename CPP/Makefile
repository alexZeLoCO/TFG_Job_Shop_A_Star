CC=g++
PROD_FLAGS=-Ofast
DEV_FLAGS=-Wall -O0 -g -pg
OMP_FLAGS=-fopenmp

dev: main.cpp dev_state.o dev_sortedList.o
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) main.cpp dev_state.o dev_sortedList.o -o main

dev_sortedList.o : sortedList.cpp sortedList.h dev_state.o
	$(CC) $(DEV_FLAGS) -c sortedList.cpp dev_state.o -o dev_sortedList.o

dev_state.o: state.cpp state.h
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) -c state.cpp -o dev_state.o

prod: main.cpp prod_state.o prod_sortedList.o
	$(CC) $(PROD_FLAGS) $(OMP_FLAGS) main.cpp prod_state.o prod_sortedList.o -o main

prod_sortedList.o : sortedList.cpp sortedList.h state.h
	$(CC) $(PROD_FLAGS) -c sortedList.cpp -o prod_sortedList.o

prod_state.o: state.cpp state.h
	$(CC) $(PROD_FLAGS) $(OMP_FLAGS) -c state.cpp -o prod_state.o

omp : ompTest.cpp dev_sortedList.o dev_state.o
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) ompTest.cpp dev_sortedList.o dev_state.o -o omp

clean:
	rm -f main omp **.o **.gch
