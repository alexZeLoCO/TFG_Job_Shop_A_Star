CC=g++
PROD_FLAGS=-Ofast
DEV_FLAGS=-Wshadow -Wall -O0 -g -pg -fsanitize=address -fsanitize=undefined
OMP_FLAGS=-fopenmp

dev: main.cpp dev_state.o dev_sortedList.o dev_task.o
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) main.cpp dev_state.o dev_sortedList.o dev_task.o -o main

dev_sortedList.o : sortedList.cpp sortedList.h state.h
	$(CC) $(DEV_FLAGS) -c sortedList.cpp -o dev_sortedList.o

dev_state.o: state.cpp state.h task.h
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) -c state.cpp -o dev_state.o

dev_task.o: task.cpp task.h
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) -c task.cpp -o dev_task.o

prod: main.cpp prod_state.o prod_sortedList.o prod_task.o
	$(CC) $(PROD_FLAGS) $(OMP_FLAGS) main.cpp prod_state.o prod_sortedList.o prod_task.o -o main

prod_sortedList.o : sortedList.cpp sortedList.h state.h
	$(CC) $(PROD_FLAGS) -c sortedList.cpp -o prod_sortedList.o

prod_state.o: state.cpp state.h task.h
	$(CC) $(PROD_FLAGS) $(OMP_FLAGS) -c state.cpp -o prod_state.o

prod_task.o: task.cpp task.h
	$(CC) $(PROD_FLAGS) $(OMP_FLAGS) -c task.cpp -o prod_task.o

omp : ompTest.cpp dev_sortedList.o dev_state.o task.h
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) ompTest.cpp dev_sortedList.o dev_state.o -o omp

clean:
	rm -f main omp **.o **.gch
