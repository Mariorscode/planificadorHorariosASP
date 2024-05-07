from unittest import TestCase
from clorm import FactBase

from . import ClingoScheduler
from . import Terms

class TestTurns(TestCase, ClingoScheduler):
    def setUp(self):
        self.clingo_setup()

    def test_no_turnsPerDay_no_turns(self):
        self.load_knowledge(FactBase([]))
        solution = self.get_solution()

        query = list(solution
            .query(Terms.Turn)
            .all()
        )

        self.assertEqual(len(query), 0)

    def test_no_turnsPerDay_with_an_unavailableDay_no_turns(self):
        self.load_knowledge(FactBase([
            Terms.UnavailableDay(day="monday")
        ]))

        solution = self.get_solution()

        query = list(solution
            .query(Terms.Turn)
            .all()
        )

        self.assertEqual(len(query), 0)

    def test_1_turnPerDay_and_no_unavailableDays_7_turns(self):
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(1)
        ]))

        solution = self.get_solution()

        query = list(solution
            .query(Terms.Turn)
            .all()
        )

        expected = [
            Terms.Turn(name="monday", number=1),
            Terms.Turn(name="tuesday", number=1),
            Terms.Turn(name="wednesday", number=1),
            Terms.Turn(name="thursday", number=1),
            Terms.Turn(name="friday", number=1),
            Terms.Turn(name="saturday", number=1),
            Terms.Turn(name="sunday", number=1)
        ]

        self.assertCountEqual(query, expected)

    def test_1_turnPerDay_and_7_unavailableDays_no_turns(self):
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(1),
            Terms.UnavailableDay(day="monday"),
            Terms.UnavailableDay(day="tuesday"),
            Terms.UnavailableDay(day="wednesday"),
            Terms.UnavailableDay(day="thursday"),
            Terms.UnavailableDay(day="friday"),
            Terms.UnavailableDay(day="saturday"),
            Terms.UnavailableDay(day="sunday")
        ]))

        solution = self.get_solution()

        query = list(solution
            .query(Terms.Turn)
            .all()
        )

        self.assertEqual(len(query), 0)

    def test_2_turnPerDay_and_2_unavailableDays_10_turns(self):
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="saturday"),
            Terms.UnavailableDay(day="sunday")
        ]))

        solution = self.get_solution()

        query = list(solution
            .query(Terms.Turn)
            .all()
        )

        expected = [
            Terms.Turn(name="monday", number=1),
            Terms.Turn(name="monday", number=2),
            Terms.Turn(name="tuesday", number=1),
            Terms.Turn(name="tuesday", number=2),
            Terms.Turn(name="wednesday", number=1),
            Terms.Turn(name="wednesday", number=2),
            Terms.Turn(name="thursday", number=1),
            Terms.Turn(name="thursday", number=2),
            Terms.Turn(name="friday", number=1),
            Terms.Turn(name="friday", number=2)
        ]

        self.assertCountEqual(query, expected)


class TestSchedule(TestCase, ClingoScheduler):
    def setUp(self):
        self.clingo_setup()

        # Only monday is available
        self.facts = FactBase([
            Terms.UnavailableDay(day="tuesday"),
            Terms.UnavailableDay(day="wednesday"),
            Terms.UnavailableDay(day="thursday"),
            Terms.UnavailableDay(day="friday"),
            Terms.UnavailableDay(day="saturday"),
            Terms.UnavailableDay(day="sunday")
        ])

    # ToDo: Add more tests
    # You have the base facts in self.facts, but other facts can be
    # added later en each test with self.facts.add([fact1, fact2, ...])
    # Remember to call self.load_knowledge(self.facts) afterwords
