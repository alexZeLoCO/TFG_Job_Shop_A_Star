CC=gcc
FLAGS=-Wshadow -Wall -O0 -g -pg -fsanitize=address -fsanitize=undefined

main: main.c state.o task.o openSet.o aStar.o
	$(CC) main.c state.o task.o openSet.o aStar.o -o main $(FLAGS)

aStar.o : aStar.c task.o state.o aStar.h
	$(CC) -c aStar.c -o aStar.o $(FLAGS)

openSet.o : openSet.c state.o openSet.h
	$(CC) -c openSet.c -o openSet.o $(FLAGS)

state.o : state.c task.o state.h
	$(CC) -c state.c -o state.o $(FLAGS)

task.o : task.c task.h
	$(CC) -c task.c -o task.o $(FLAGS)

clean :
	rm *.o main *.gch vgcore* gmon.out
