#! /bin/sh

if [ "$#" -lt "1" ]
	then
	echo "USE: run.sh <n_threads>" >&2
	exit 1
else
	n_thr="$1"
fi

export OMP_NUM_THREADS=$n_thr
./main # | column -t -s ';'
export OMP_NUM_THREADS=4
./main # | column -t -s ';'
export OMP_NUM_THREADS=1
./main # | column -t -s ';'
