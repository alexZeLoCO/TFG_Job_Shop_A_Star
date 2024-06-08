import csv

from typing import List
from Task import Task


def read_from_file(filename: str) -> List[List[Task]]:
    jobs: List[List[Task]] = []
    with open(filename) as csvfile:
        spamreader = csv.reader(csvfile, delimiter=';')
        for job_idx, tasks in enumerate(spamreader):
            jobs.append([])
            is_worker: bool = True
            for task in tasks:
                if (is_worker):
                    worker: int = int(task)
                    is_worker: bool = False
                else:
                    jobs[job_idx].append(Task(int(task), (int(worker),)))
                    is_worker: bool = True
    return jobs


def cut(jobs: List[List[Task]], percentage: float) -> List[List[Task]]:
    percentage: float = min(max(percentage, 0), 1)
    jobs_to_keep: int = int(len(jobs) * percentage)
    tasks_to_keep: int = int(len(jobs[0]) * percentage)
    new_jobs: List[List[Task]] = []

    for job_idx in range(0, jobs_to_keep, 1):
        new_jobs.append([])
        for task_idx in range(0, tasks_to_keep, 1):
            new_jobs[job_idx].append(jobs[job_idx][task_idx])

    return new_jobs
