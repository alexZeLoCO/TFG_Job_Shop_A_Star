CC=g++
PROD_FLAGS=-Ofast
DEV_FLAGS=-Wshadow -Wall -O0 -g -pg -fsanitize=address -fsanitize=undefined
OMP_FLAGS=-fopenmp

dev: main.cpp dev_state.o dev_sortedList.o dev_llSortedList.o dev_task.o dev_kernelFoo.o dev_job_processors.o dev_vector_ostreams.o chronometer.h aStarSolver.h fcfsSolver.h batchSolver.h recursiveSolver.h hdaSolver.h randomSolver.h optional.h
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) main.cpp dev_state.o dev_sortedList.o dev_kernelFoo.o dev_llSortedList.o dev_task.o dev_job_processors.o dev_vector_ostreams.o -o main

dev_kernelFoo.o : kernelFoo.cpp kernelFoo.h
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) -c kernelFoo.cpp -o dev_kernelFoo.o

dev_sortedList.o : sortedList.cpp sortedList.h state.h
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) -c sortedList.cpp -o dev_sortedList.o

dev_state.o: state.cpp state.h task.h
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) -c state.cpp -o dev_state.o

dev_task.o: task.cpp task.h
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) -c task.cpp -o dev_task.o

dev_llSortedList.o : llSortedList.cpp llSortedList.h state.h
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) -c llSortedList.cpp -o dev_llSortedList.o

dev_job_processors.o: job_processors.cpp job_processors.h vector_ostreams.h chronometer.h task.h state.h  
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) -c job_processors.cpp -o dev_job_processors.o

dev_vector_ostreams.o: vector_ostreams.cpp
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) -c vector_ostreams.cpp -o dev_vector_ostreams.o

prod: main.cpp prod_state.o prod_sortedList.o prod_llSortedList.o prod_kernelFoo.o prod_task.o prod_job_processors.o prod_vector_ostreams.o chronometer.h aStarSolver.h fcfsSolver.h batchSolver.h recursiveSolver.h hdaSolver.h randomSolver.h optional.h
	$(CC) $(PROD_FLAGS) $(OMP_FLAGS) main.cpp prod_state.o prod_kernelFoo.o prod_sortedList.o prod_llSortedList.o prod_task.o prod_job_processors.o prod_vector_ostreams.o -o main

prod_kernelFoo.o : kernelFoo.cpp kernelFoo.h
	$(CC) $(PROD_FLAGS) $(OMP_FLAGS) -c kernelFoo.cpp -o prod_kernelFoo.o

prod_sortedList.o : sortedList.cpp sortedList.h state.h
	$(CC) $(PROD_FLAGS) $(OMP_FLAGS) -c sortedList.cpp -o prod_sortedList.o

prod_state.o: state.cpp state.h task.h
	$(CC) $(PROD_FLAGS) $(OMP_FLAGS) -c state.cpp -o prod_state.o

prod_task.o: task.cpp task.h
	$(CC) $(PROD_FLAGS) $(OMP_FLAGS) -c task.cpp -o prod_task.o

prod_llSortedList.o : llSortedList.cpp llSortedList.h state.h
	$(CC) $(PROD_FLAGS) $(OMP_FLAGS) -c llSortedList.cpp -o prod_llSortedList.o

prod_job_processors.o: job_processors.cpp job_processors.h vector_ostreams.h chronometer.h task.h state.h  
	$(CC) $(PROD_FLAGS) $(OMP_FLAGS) -c job_processors.cpp -o prod_job_processors.o

prod_vector_ostreams.o: vector_ostreams.cpp vector_ostreams.h
	$(CC) $(PROD_FLAGS) $(OMP_FLAGS) -c vector_ostreams.cpp -o prod_vector_ostreams.o

omp : ompTest.cpp dev_sortedList.o dev_state.o dev_task.o
	$(CC) $(DEV_FLAGS) $(OMP_FLAGS) ompTest.cpp dev_sortedList.o dev_state.o dev_task.o -o omp

clean:
	rm -f main omp **.o **.gch **.out vgcore*
