from typing import List
import unittest

from Task import Task
from main import a_star


class AStarTests(unittest.TestCase):

    def test_00(self) -> None:
        jobs: List[List[Task]] = [
            [Task(2), Task(5), Task(1)],
            [Task(3), Task(3), Task(3)]
        ]
        n_workers = 1

        expected_schedule = [
            [[0, 2, 7], [8, 11, 14]],
            [[8, 10, 15], [0, 3, 6]]
        ]

        self.assertIn(a_star(jobs, n_workers), expected_schedule)

    def test_01(self) -> None:
        jobs = [
            [Task(2), Task(5), Task(1)],
            [Task(3), Task(3), Task(3)]
        ]
        n_workers = 2

        expected_schedule = [
            [[0, 2, 7], [0, 3, 6]]
        ]

        self.assertIn(a_star(jobs, n_workers), expected_schedule)

    def test_02(self) -> None:
        jobs = [
            [Task(2), Task(5), Task(1)],
            [Task(3), Task(3), Task(3)]
        ]
        n_workers = 3

        expected_schedule = [
            [[0, 2, 7], [0, 3, 6]]
        ]

        self.assertIn(a_star(jobs, n_workers), expected_schedule)

    def test_10(self) -> None:
        jobs = [
            [Task(2), Task(5)],
            [Task(3), Task(3)]
        ]
        n_workers = 1

        expected_schedule = [
            [[0, 2], [7, 10]],
            [[6, 8], [0, 3]]
        ]

        self.assertIn(a_star(jobs, n_workers), expected_schedule)

    def test_11(self) -> None:
        jobs = [
            [Task(2), Task(5)],
            [Task(3), Task(3)]
        ]
        n_workers = 2

        expected_schedule = [
            [[0, 2], [0, 3]]
        ]

        self.assertIn(a_star(jobs, n_workers), expected_schedule)

    def test_12(self) -> None:
        jobs = [
            [Task(2), Task(5)],
            [Task(3), Task(3)]
        ]
        n_workers = 3

        expected_schedule = [
            [[0, 2], [0, 3]]
        ]

        self.assertIn(a_star(jobs, n_workers), expected_schedule)

    def test_20(self) -> None:
        jobs = [
            [Task(2, (0,)), Task(5, (1,))],
            [Task(3, (0,)), Task(3, (0,))]
        ]
        n_workers = 1

        expected_schedule = [
            [[0, 2], [2, 5]],
            [[3, 5], [0, 5]],
            [[6, 8], [0, 3]]
        ]

        self.assertIn(a_star(jobs, n_workers), expected_schedule)

    def test_21(self) -> None:
        jobs = [
            [Task(2, (0,)), Task(5, (1,))],
            [Task(3, (0,)), Task(3, (0,))]
        ]
        n_workers = 2

        expected_schedule = [
            [[0, 2], [0, 3]]
        ]

        self.assertIn(a_star(jobs, n_workers), expected_schedule)


if __name__ == '__main__':
    unittest.main()
