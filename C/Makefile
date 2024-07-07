CC=gcc
FLAGS=-O0 -g -pg

main: main.c state.o task.o
	$(CC) main.c state.o task.o -o main $(FLAGS)

state.o : state.c task.o state.h
	$(CC) -c state.c task.o -o state.o $(FLAGS)

task.o : task.c task.h
	$(CC) -c task.c -o task.o $(FLAGS)
