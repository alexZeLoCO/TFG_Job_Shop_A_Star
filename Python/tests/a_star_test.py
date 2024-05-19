import unittest

from main import a_star


class AStarTests(unittest.TestCase):

    def test_00(self) -> None:
        jobs = [[2, 5, 1], [3, 3, 3]]
        n_workers = 2

        expected_schedule = [[0, 2, 7], [0, 3, 6]]

        self.assertEqual(a_star(jobs, n_workers), expected_schedule)


if __name__ == '__main__':
    unittest.main()
