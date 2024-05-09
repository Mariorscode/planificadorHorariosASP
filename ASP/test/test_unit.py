from unittest import TestCase
from clorm import FactBase

from . import ClingoTest
from . import Terms

class TestTurns(TestCase, ClingoTest):
    def setUp(self):
        self.clingo_setup()

    def test_no_turnsPerDay_no_turns(self):
        self.load_knowledge(FactBase([]))

        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        solution = solutions[0]

        query = list(solution.facts(atoms=True)
            .query(Terms.Turn)
            .all()
        )

        self.assertEqual(len(query), 0)

    def test_no_turnsPerDay_with_an_unavailableDay_no_turns(self):
        self.load_knowledge(FactBase([
            Terms.UnavailableDay(day="monday")
        ]))

        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        solution = solutions[0]

        query = list(solution.facts(atoms=True)
            .query(Terms.Turn)
            .all()
        )

        self.assertEqual(len(query), 0)

    def test_1_turnPerDay_and_no_unavailableDays_7_turns(self):
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(1)
        ]))

        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        solution = solutions[0]

        query = list(solution.facts(atoms=True)
            .query(Terms.Turn)
            .all()
        )

        expected = [
            Terms.Turn(day="monday", number=1),
            Terms.Turn(day="tuesday", number=1),
            Terms.Turn(day="wednesday", number=1),
            Terms.Turn(day="thursday", number=1),
            Terms.Turn(day="friday", number=1),
            Terms.Turn(day="saturday", number=1),
            Terms.Turn(day="sunday", number=1)
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

        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        solution = solutions[0]

        query = list(solution.facts(atoms=True)
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

        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        solution = solutions[0]

        query = list(solution.facts(atoms=True)
            .query(Terms.Turn)
            .all()
        )

        expected = [
            Terms.Turn(day="monday", number=1),
            Terms.Turn(day="monday", number=2),
            Terms.Turn(day="tuesday", number=1),
            Terms.Turn(day="tuesday", number=2),
            Terms.Turn(day="wednesday", number=1),
            Terms.Turn(day="wednesday", number=2),
            Terms.Turn(day="thursday", number=1),
            Terms.Turn(day="thursday", number=2),
            Terms.Turn(day="friday", number=1),
            Terms.Turn(day="friday", number=2)
        ]

        self.assertCountEqual(query, expected)


class TestSchedule(TestCase, ClingoTest):
    def setUp(self):
        self.clingo_setup()

    def test_2_schedule_dont_same_tags_same_day(self):
        
        pass
        
    def test_same_worker_dont_different_turn(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(1),
            Terms.UnavailableDay(day="tuesday"),
            Terms.UnavailableDay(day="wednesday"),
            Terms.UnavailableDay(day="thursday"),
            Terms.UnavailableDay(day="friday"),
            Terms.UnavailableDay(day="saturday"),
            Terms.UnavailableDay(day="sunday"),
            Terms.TaskName(name="task1"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            
        ]))
        
        solutions = list(self.get_solutions())
        solution = solutions[0]
        
        
        query1 = list(solution.facts(atoms=True)
            .query(Terms.Schedule)
            .where(Terms.Schedule.number == 1)
            .all()
        )
        query2 = list(solution.facts(atoms=True)
            .query(Terms.Schedule)
            .where(Terms.Schedule.number == 1)
            .all()
        )
                
        self.assertEqual(len(query1),1)
        
        self.assertEqual(len(query2),1)
        
        # query10=fb.query(Pet).where(Pet[0] == "dave").order_by(Pet[1])
        
    def test_task_dont_in_space_smaller(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(1),
            Terms.UnavailableDay(day="tuesday"),
            Terms.UnavailableDay(day="wednesday"),
            Terms.UnavailableDay(day="thursday"),
            Terms.UnavailableDay(day="friday"),
            Terms.UnavailableDay(day="saturday"),
            Terms.UnavailableDay(day="sunday"),
            Terms.TaskName(name="task1"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.SpaceCapacity(space="space1", capacity=10),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.TaskSize(taskname="task1", size=5)
        
        ]))
        
        solutions = list(self.get_solutions())
        solution = solutions[0]
        
        expected = [
            Terms.Schedule(day="monday", number=1, taskname="task1", worker="john", space="space1")
        ]
        
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        self.assertCountEqual(query, expected)
        
    def test_restrictions_worker(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(1),
            Terms.UnavailableDay(day="tuesday"),
            Terms.UnavailableDay(day="wednesday"),
            Terms.UnavailableDay(day="thursday"),
            Terms.UnavailableDay(day="friday"),
            Terms.UnavailableDay(day="saturday"),
            Terms.UnavailableDay(day="sunday"),
            Terms.TaskName(name="task1"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.Restrictionworker(worker="john", day="monday", number=2)
        ]))
        
        expected = [
            Terms.Schedule(day="monday", number=1, taskname="task1", worker="john", space="space1")
        ]
        
        solutions = list(self.get_solutions())
        solution = solutions[0]
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        self.assertCountEqual(query, expected)

    def test_restrictions_space(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="tuesday"),
            Terms.UnavailableDay(day="wednesday"),
            Terms.UnavailableDay(day="thursday"),
            Terms.UnavailableDay(day="friday"),
            Terms.UnavailableDay(day="saturday"),
            Terms.UnavailableDay(day="sunday"),
            Terms.TaskName(name="task1"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.Restrictionspace(space="space1", day="monday", number=2)
        ]))
        
        expected = [
            Terms.Schedule(day="monday", number=1, taskname="task1", worker="john", space="space1")
        ]
        
        solutions = list(self.get_solutions())
        solution = solutions[0]
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        self.assertCountEqual(query, expected)


    # revisar (se colocan solo la cantidad de schedule que hay)
    def test_onlyschedule_scheduabletask(self):
            
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="tuesday"),
            Terms.UnavailableDay(day="wednesday"),
            Terms.UnavailableDay(day="thursday"),
            Terms.UnavailableDay(day="friday"),
            Terms.UnavailableDay(day="saturday"),
            Terms.UnavailableDay(day="sunday"),
            Terms.TaskName(name="task1"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1")
        ]))
        
        solutions = list(self.get_solutions())
        solution = solutions[1]
        query = list(solution.facts(atoms=True).query(Terms.Schedule).all())
        
        self.assertEqual(len(query),1)

    def test_same_sapce_not_same_time(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="tuesday"),
            Terms.UnavailableDay(day="wednesday"),
            Terms.UnavailableDay(day="thursday"),
            Terms.UnavailableDay(day="friday"),
            Terms.UnavailableDay(day="saturday"),
            Terms.UnavailableDay(day="sunday"),
            Terms.TaskName(name="task1"),
            Terms.TaskName(name="task2"),
            Terms.Worker(name="john"),
            Terms.Worker(name="jane"),
            Terms.Space(name="space1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.SchedulableTask(taskname="task2", worker="jane", space="space1"),
            
        ]))
               
        solutions = list(self.get_solutions())
        solution = solutions[0]
        
        
        query1 = list(solution.facts(atoms=True)
            .query(Terms.Schedule)
            .where(Terms.Schedule.number == 1)
            .all()
        )
        query2 = list(solution.facts(atoms=True)
            .query(Terms.Schedule)
            .where(Terms.Schedule.number == 2)
            .all()
        )
                
        self.assertEqual(len(query1),1)
        
        self.assertEqual(len(query2),1)
        
    def test_two_schedule_same_time_not_same_tags(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="tuesday"),
            Terms.UnavailableDay(day="wednesday"),
            Terms.UnavailableDay(day="thursday"),
            Terms.UnavailableDay(day="friday"),
            Terms.UnavailableDay(day="saturday"),
            Terms.UnavailableDay(day="sunday"),
            Terms.Tag(name="groupA"),
            Terms.Tag(name="theory"),
            Terms.Tag(name="1"),
            Terms.TaskName(name="task1"),
            Terms.TaskName(name="task2"),
            Terms.Worker(name="john"),
            Terms.Worker(name="jane"),
            Terms.Space(name="space1"),
            Terms.Tags(taskname="task1", tag1="groupA", tag2="theory",tag3="1"),
            Terms.Tags(taskname="task2", tag1="groupA", tag2="theory",tag3="1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.SchedulableTask(taskname="task2", worker="jane", space="space1"),
            
        ]))
               
        solutions = list(self.get_solutions())
        solution = solutions[0]
        
        
        query1 = list(solution.facts(atoms=True)
            .query(Terms.Schedule)
            .where(Terms.Schedule.number == 1)
            .all()
        )
        query2 = list(solution.facts(atoms=True)
            .query(Terms.Schedule)
            .where(Terms.Schedule.number == 2)
            .all()
        )
                
        self.assertEqual(len(query1),1)
        
        self.assertEqual(len(query2),1)

    def test_two_schedule_atleast_one_tag_different_can_same_time(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(1),
            Terms.UnavailableDay(day="tuesday"),
            Terms.UnavailableDay(day="wednesday"),
            Terms.UnavailableDay(day="thursday"),
            Terms.UnavailableDay(day="friday"),
            Terms.UnavailableDay(day="saturday"),
            Terms.UnavailableDay(day="sunday"),
            Terms.Tag(name="groupA"),
            Terms.Tag(name="theory"),
            Terms.Tag(name="practice"),
            Terms.Tag(name="1"),
            Terms.TaskName(name="task1"),
            Terms.TaskName(name="task2"),
            Terms.Worker(name="john"),
            Terms.Worker(name="jane"),
            Terms.Space(name="space1"),
            Terms.Space(name="space2"),
            Terms.Tags(taskname="task1", tag1="groupA", tag2="theory",tag3="1"),
            Terms.Tags(taskname="task2", tag1="groupA", tag2="practice",tag3="1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.SchedulableTask(taskname="task2", worker="jane", space="space2"),
            
        ]))
        
        expected = [
            Terms.Schedule(day="monday", number=1, taskname="task1", worker="john", space="space1"),
            Terms.Schedule(day="monday", number=1, taskname="task2", worker="jane", space="space2")
        ]
               
        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        solution = solutions[0]

        query = list(solution.facts(atoms=True)
            .query(Terms.Schedule)
            .all()
        )

        self.assertCountEqual(query, expected)
        
       


    # ToDo: Add more tests
    # You have the base facts in self.facts, but other facts can be
    # added later en each test with self.facts.add([fact1, fact2, ...])
    # Remember to call self.load_knowledge(self.facts) afterwords
