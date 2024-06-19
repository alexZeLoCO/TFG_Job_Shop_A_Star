#! /bin/sh

if [ "$#" -lt "1" ]
	then
	echo "USE: run.sh <n_threads>" >&2
	exit 1
else
	n_thr="$1"
fi

# CSV HEADER
echo "lang;n_threads;function;solver;percentage;n_jobs;n_tasks;n_workers;runtime;schedule;makespan"

filename="../datasets/abz5.csv"
percentage="0.5"

export OMP_NUM_THREADS=$n_thr
perf stat ./main $filename $percentage RECURSIVE # | column -t -s ';'
perf stat ./main $filename $percentage FCFS # | column -t -s ';'
perf stat ./main $filename $percentage BATCH # | column -t -s ';'
perf stat ./main $filename $percentage HDA # | column -t -s ';'
export OMP_NUM_THREADS=4
perf stat ./main $filename $percentage RECURSIVE # | column -t -s ';'
perf stat ./main $filename $percentage FCFS # | column -t -s ';'
perf stat ./main $filename $percentage BATCH # | column -t -s ';'
perf stat ./main $filename $percentage HDA # | column -t -s ';'
export OMP_NUM_THREADS=1
perf stat ./main $filename $percentage RECURSIVE # | column -t -s ';'
perf stat ./main $filename $percentage FCFS # | column -t -s ';'
perf stat ./main $filename $percentage BATCH # | column -t -s ';'
perf stat ./main $filename $percentage HDA # | column -t -s ';'

percentage="0.6"

export OMP_NUM_THREADS=$n_thr
perf stat ./main $filename $percentage RECURSIVE # | column -t -s ';'
perf stat ./main $filename $percentage FCFS # | column -t -s ';'
perf stat ./main $filename $percentage BATCH # | column -t -s ';'
perf stat ./main $filename $percentage HDA # | column -t -s ';'
export OMP_NUM_THREADS=4
perf stat ./main $filename $percentage RECURSIVE # | column -t -s ';'
perf stat ./main $filename $percentage FCFS # | column -t -s ';'
perf stat ./main $filename $percentage BATCH # | column -t -s ';'
perf stat ./main $filename $percentage HDA # | column -t -s ';'
export OMP_NUM_THREADS=1
perf stat ./main $filename $percentage RECURSIVE # | column -t -s ';'
perf stat ./main $filename $percentage FCFS # | column -t -s ';'
perf stat ./main $filename $percentage BATCH # | column -t -s ';'
perf stat ./main $filename $percentage HDA # | column -t -s ';'
