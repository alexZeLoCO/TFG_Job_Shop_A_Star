from functools import wraps
import time

from State import State


def timeit(func):
    @wraps(func)
    def timeit_wrapper(*args, **kwargs):
        n_jobs: int = len(args[0])
        n_tasks: int = len(args[0][0])
        n_workers: int = args[1]
        func(*args, **kwargs)
        start_time = time.perf_counter()
        result: State = func(*args, **kwargs)
        end_time = time.perf_counter()
        total_time = end_time - start_time
        print(
            (f"py;1;{func.__name__};{args};{n_jobs};{n_tasks};"
             f"{n_workers};{total_time:1.5E};{result.schedule};"
             f"{max(result.workers_status)}")
        )
        return result
    return timeit_wrapper


def singleton(class_):
    instances = {}

    def getinstance(*args, **kwargs):
        if class_ not in instances:
            instances[class_] = class_(*args, **kwargs)
        return instances[class_]
    return getinstance
