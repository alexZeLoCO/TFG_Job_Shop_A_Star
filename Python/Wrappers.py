from functools import wraps
import time


def timeit(func):
    @wraps(func)
    def timeit_wrapper(*args, **kwargs):
        n_jobs: int = len(args[0])
        n_tasks: int = len(args[0][0])
        n_workers: int = args[1]
        func(*args, **kwargs)
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        total_time = end_time - start_time
        print(
            (f"py;1;{func.__name__};{args};{n_jobs};{n_tasks};"
             f"{n_workers};{total_time:1.5E};{result}")
        )
        return result
    return timeit_wrapper
