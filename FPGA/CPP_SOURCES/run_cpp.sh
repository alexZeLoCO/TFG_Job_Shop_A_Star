#! /bin/sh

if [ "$#" -lt "1" ]
	then
	echo "USE: run.sh <n_threads>" >&2
	exit 1
else
	n_thr="$1"
fi

# CSV HEADER
echo "lang;n_threads;function;solver;percentage;n_jobs;n_tasks;n_workers;runtime;schedule;makespan;min_makespan;max_makespan"

filename="../datasets/abz5.csv"
percentage="0.4"
fastNIters="100"
optimalNIters="5"
zeroNIters="5"


export OMP_NUM_THREADS=$n_thr
./mainZero $filename $percentage RECURSIVE $zeroNIters # | column -t -s ';'
./mainZero $filename $percentage FCFS $zeroNIters # | column -t -s ';'
./mainZero $filename $percentage BATCH $zeroNIters # | column -t -s ';'
./mainZero $filename $percentage HDA $zeroNIters # | column -t -s ';'
export OMP_NUM_THREADS=4
./mainZero $filename $percentage RECURSIVE $zeroNIters # | column -t -s ';'
./mainZero $filename $percentage FCFS $zeroNIters # | column -t -s ';'
./mainZero $filename $percentage BATCH $zeroNIters # | column -t -s ';'
./mainZero $filename $percentage HDA $zeroNIters # | column -t -s ';'
export OMP_NUM_THREADS=1
./mainZero $filename $percentage FCFS $zeroNIters # | column -t -s ';'

export OMP_NUM_THREADS=$n_thr
./mainOptimal $filename $percentage RECURSIVE $optimalNIters # | column -t -s ';'
./mainOptimal $filename $percentage FCFS $optimalNIters # | column -t -s ';'
./mainOptimal $filename $percentage BATCH $optimalNIters # | column -t -s ';'
./mainOptimal $filename $percentage HDA $optimalNIters # | column -t -s ';'
export OMP_NUM_THREADS=4
./mainOptimal $filename $percentage RECURSIVE $optimalNIters # | column -t -s ';'
./mainOptimal $filename $percentage FCFS $optimalNIters # | column -t -s ';'
./mainOptimal $filename $percentage BATCH $optimalNIters # | column -t -s ';'
./mainOptimal $filename $percentage HDA $optimalNIters # | column -t -s ';'
export OMP_NUM_THREADS=1
./mainOptimal $filename $percentage FCFS $optimalNIters # | column -t -s ';'

export OMP_NUM_THREADS=$n_thr
./mainFast $filename $percentage RECURSIVE $fastNIters # | column -t -s ';'
./mainFast $filename $percentage FCFS $fastNIters # | column -t -s ';'
./mainFast $filename $percentage BATCH $fastNIters # | column -t -s ';'
./mainFast $filename $percentage HDA $fastNIters # | column -t -s ';'
export OMP_NUM_THREADS=4
./mainFast $filename $percentage RECURSIVE $fastNIters # | column -t -s ';'
./mainFast $filename $percentage FCFS $fastNIters # | column -t -s ';'
./mainFast $filename $percentage BATCH $fastNIters # | column -t -s ';'
./mainFast $filename $percentage HDA $fastNIters # | column -t -s ';'
export OMP_NUM_THREADS=1
./mainFast $filename $percentage FCFS $fastNIters # | column -t -s ';'

# When using RANDOM the executable does not matter
./mainZero $filename $percentage RANDOM 100 # | column -t -s ';'

