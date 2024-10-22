from unittest import TestCase
from clorm import FactBase

from . import ClingoTest
from . import Terms

class TestTurns(TestCase, ClingoTest):
    def setUp(self):
        self.clingo_setup()

    # If there are no turnsPerDay, there should be no turns
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

    # If there is one unavailableDay and no turns per day there should be no turns
    def test_no_turnsPerDay_with_an_unavailableDay_no_turns(self):
        self.load_knowledge(FactBase([
            Terms.UnavailableDay(day="lunes")
        ]))

        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        solution = solutions[0]

        query = list(solution.facts(atoms=True)
            .query(Terms.Turn)
            .all()
        )

        self.assertEqual(len(query), 0)

    # If there is one turnPerDay and no unavailableDays there should be 7 turns
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
            Terms.Turn(day="lunes", number=1),
            Terms.Turn(day="martes", number=1),
            Terms.Turn(day="miercoles", number=1),
            Terms.Turn(day="jueves", number=1),
            Terms.Turn(day="viernes", number=1),
            Terms.Turn(day="sabado", number=1),
            Terms.Turn(day="domingo", number=1)
        ]

        self.assertCountEqual(query, expected)

    #If there is one turnPerDay and 7 un available days there should be no turns
    def test_1_turnPerDay_and_7_unavailableDays_no_turns(self):
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(1),
            Terms.UnavailableDay(day="lunes"),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo")
        ]))

        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        solution = solutions[0]

        query = list(solution.facts(atoms=True)
            .query(Terms.Turn)
            .all()
        )

        self.assertEqual(len(query), 0)

    # If there are 2 turnsPerDay and 2 unavailableDays there should be 10 turns
    def test_2_turnPerDay_and_2_unavailableDays_10_turns(self):
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo")
        ]))

        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        solution = solutions[0]

        query = list(solution.facts(atoms=True)
            .query(Terms.Turn)
            .all()
        )

        expected = [
            Terms.Turn(day="lunes", number=1),
            Terms.Turn(day="lunes", number=2),
            Terms.Turn(day="martes", number=1),
            Terms.Turn(day="martes", number=2),
            Terms.Turn(day="miercoles", number=1),
            Terms.Turn(day="miercoles", number=2),
            Terms.Turn(day="jueves", number=1),
            Terms.Turn(day="jueves", number=2),
            Terms.Turn(day="viernes", number=1),
            Terms.Turn(day="viernes", number=2)
        ]

        self.assertCountEqual(query, expected)

# Test for schedule
class TestSchedule(TestCase, ClingoTest):
    def setUp(self):
        self.clingo_setup()
        
        
    # a task with an X size can't be scheduled in a space with a smaller capacity
    # task with space 5, space with capacity 10
    def test_task_placed_in_bigger_space(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(1),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
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
            Terms.Schedule(day="lunes", number=1, taskname="task1", worker="john", space="space1")
        ]
        
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        self.assertCountEqual(query, expected)
        
    # a task with an X size can't be scheduled in a space with a smaller capacity
    # task with space 15, space with capacity 10, unsatisfiable
    def test_task_dont_in_space_smaller(self): 
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(1),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.TaskName(name="task1"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.SpaceCapacity(space="space1", capacity=10),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.TaskSize(taskname="task1", size=15)
        
        ]))
        
        solutions = list(self.get_solutions())
        
        self.assertEqual(len(solutions), 0)
        
    # a task with an X size can't be scheduled in a space with a smaller capacity
    # task with space 15, space with capacity 15, satisfiable
    def test_task_space_same_size(self): 
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.TaskName(name="task1"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.SpaceCapacity(space="space1", capacity=15),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.TaskSize(taskname="task1", size=15)
        
        ]))
        
        solutions = list(self.get_solutions())
        solution = solutions[0]
        
        expected = [
            Terms.Schedule(day="lunes", number=1, taskname="task1", worker="john", space="space1")
        ]
        
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        self.assertCountEqual(query, expected)

    #  worker can't work on a day he is unavailable
    def test_restrictions_worker(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.TaskName(name="task1"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.Restrictionworker(worker="john", day="lunes", number=2)
        ]))
        
        expected = [
            Terms.Schedule(day="lunes", number=1, taskname="task1", worker="john", space="space1")
        ]
        
        solutions = list(self.get_solutions())
        
        self.assertEqual(len(solutions), 1)
        
        solution = solutions[0]
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
                
        self.assertCountEqual(query, expected)

    # space can't be used on a day it is unavailable
    def test_restrictions_space(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.TaskName(name="task1"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.Restrictionspace(space="space1", day="lunes", number=2)
        ]))
        
        expected = [
            Terms.Schedule(day="lunes", number=1, taskname="task1", worker="john", space="space1")
        ]
        
        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        
        solution = solutions[0]
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        self.assertCountEqual(query, expected)


    # only schedule numer of task, no more no less
    # three available spaces and two tasks
    def test_onlyschedule_scheduabletask(self):
            
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(3),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.TaskName(name="task1"),
            Terms.TaskName(name="task2"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.SchedulableTask(taskname="task2", worker="john", space="space1")
            
        ]))
        
        solutions = list(self.get_solutions())        
        
        for solution in solutions:
            query = list(solution.facts(atoms=True)
                         .query(Terms.Schedule).all())
            
            self.assertEqual(len(query),2)  
        
    
    # only schedule numer of task, no more no less
    # one available spaces and two tasks, unsatisfiable
    def test_onlyschedule_scheduabletask(self):
            
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(1),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.TaskName(name="task1"),
            Terms.TaskName(name="task2"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.SchedulableTask(taskname="task2", worker="john", space="space1")
            
        ]))
        
        solutions = list(self.get_solutions())
        
        self.assertEqual(len(solutions), 0)
        
    # two tasks with same space can't be scheduled at the same time
    def test_same_space_not_same_time(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.TaskName(name="task1"),
            Terms.TaskName(name="task2"),
            Terms.Worker(name="john"),
            Terms.Worker(name="jane"),
            Terms.Space(name="space1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.SchedulableTask(taskname="task2", worker="jane", space="space1"),
            
        ]))
               
        solutions = list(self.get_solutions())
        for solution in solutions:
            query1 = list(solution.facts(atoms=True)
                .query(Terms.Schedule)
                .where(Terms.Schedule.number == 1)
                .all()
            )
      
            self.assertEqual(len(query1),1)
    
    # task with unknown space shuld get a space with enough capacity for the task and acompplish restrictions
    def test_task_unknonw_space_known_worker_3_different_space_and_asigned_size_and_restriction(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.TaskName(name="task1"),
            Terms.TaskName(name="task2"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.Space(name="space2"),
            Terms.SpaceCapacity(space="space1", capacity=5),
            Terms.SpaceCapacity(space="space2", capacity=10),
            Terms.TaskSize(taskname="task1", size=4),
            Terms.TaskSize(taskname="task2", size=6),
            Terms.Restrictionspace(space="space2", day="lunes", number=1),
            Terms.TaskUnknownSpace(taskname="task2", worker="john"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),            
        ]))
    
        expected = [
            Terms.Schedule(day="lunes", number=1, taskname="task1", worker="john", space="space1"),
            Terms.Schedule(day="lunes", number=2, taskname="task2", worker="john", space="space2"),
        ]
        
        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        
        solution = solutions[0]
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        self.assertCountEqual(query, expected)
        
    # task with unknown worker should get a worker
    def test_task_unknonw_worker(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.TaskName(name="task1"),
            Terms.TaskName(name="task2"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.Space(name="space2"),
            Terms.TaskUnknownWorker(taskname="task2", space="space2"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            
        ]))
        
        expected = [
            Terms.Schedule(day="lunes", number=2, taskname="task2", worker="john", space="space2"),
            Terms.Schedule(day="lunes", number=1, taskname="task1", worker="john", space="space1"),
        ]
        
        solutions = list(self.get_solutions())
        # self.assertEqual(len(solutions), 1)
        
        solution = solutions[0]
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        self.assertCountEqual(query, expected)
        
    # task with unknown worker should get a worker and acompplish restrictions
    def test_task_unknonw_worker_with_restrictions(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.TaskName(name="task1"),
            Terms.TaskName(name="task2"),
            Terms.Worker(name="john"),
            Terms.Worker(name="jane"),
            Terms.Space(name="space1"),
            Terms.Space(name="space2"),
            Terms.Restrictionworker(worker="john", day="lunes", number=2),
            Terms.Restrictionspace(space="space2", day="lunes", number=1),
            Terms.TaskUnknownWorker(taskname="task2", space="space2"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            
        ]))
        
        expected = [
            Terms.Schedule(day="lunes", number=1, taskname="task1", worker="john", space="space1"),
            Terms.Schedule(day="lunes", number=2, taskname="task2", worker="jane", space="space2"),
        ]
        
        # the two solutions are the same, but in different order
        solutions = list(self.get_solutions())
        
        solution = solutions[0]
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        self.assertCountEqual(query, expected)

    # task with unknown worker and space should get a worker and space and acompplish restrictions
    def test_unknow_space_and_worker_with_restrictions(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.TaskName(name="task1"),
            Terms.TaskName(name="task2"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.TaskUnknownWorkerAndSpace(taskname="task2"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            
        ]))

        expected = [
            Terms.Schedule(day="lunes", number=1, taskname="task1", worker="john", space="space1"),
            Terms.Schedule(day="lunes", number=2, taskname="task2", worker="john", space="space1"),
        ]
        
        # the two solutions are the same, but in different order
        solutions = list(self.get_solutions())
        # self.assertEqual(len(solutions), 1)
        
        solution = solutions[0]
                
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        self.assertCountEqual(query, expected)

    # mix of all possible unknowns (worker, space, worker and space)
    def test_mix_of_all_possible_unknowns_and_restrictions(self):
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(3),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.TaskName(name="task1"),
            Terms.TaskName(name="task2"),
            Terms.TaskName(name="task3"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.TaskUnknownWorkerAndSpace(taskname="task2"),
            Terms.TaskUnknownWorker(taskname="task3", space="space1"),
            Terms.TaskUnknownSpace(taskname="task1", worker="john"),            
        ]))
        
        solutions = list(self.get_solutions())
        for solution in solutions:
            query = list(solution.facts(atoms=True)
                .query(Terms.Schedule)
                .where(Terms.Schedule.number == 1)
                .all()
            )
      
            self.assertEqual(len(query),1)


    # two schedules with same time can't have the same tags    
    def test_two_schedule_same_time_not_same_tags(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.Tag(name="groupA"),
            Terms.Tag(name="theory"),
            Terms.Tag(name="1"),
            Terms.TaskName(name="task1"),
            Terms.TaskName(name="task2"),
            Terms.Worker(name="john"),
            Terms.Worker(name="jane"),
            Terms.Space(name="space1"),
            Terms.Space(name="space2"),
            Terms.Tags(taskname="task1", tag="groupA"),
            Terms.Tags(taskname="task1", tag="theory"),
            Terms.Tags(taskname="task1", tag="1"),
            Terms.Tags(taskname="task2", tag="theory"),
            Terms.Tags(taskname="task2", tag="groupA"),
            Terms.Tags(taskname="task2", tag="1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.SchedulableTask(taskname="task2", worker="jane", space="space2"),
            
        ]))
               
        solutions = list(self.get_solutions())
        solution = solutions[0]
        
        solutions = self.get_solutions()
        for solution in solutions:
            query1 = list(solution.facts(atoms=True)
                .query(Terms.Schedule)
                .where(Terms.Schedule.number == 1)
                .all()
            )
      
            self.assertEqual(len(query1),1)
              
    # two schedules with same time can have at least one tag different
    def test_two_schedule_atleast_one_tag_different_can_same_time(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(1),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
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
            Terms.Tags(taskname="task1",tag = "groupA"),
            Terms.Tags(taskname="task1",tag = "theory"),
            Terms.Tags(taskname="task1",tag = "1"),
            Terms.Tags(taskname="task2",tag = "groupA"),
            Terms.Tags(taskname="task2",tag = "practice"),
            Terms.Tags(taskname="task2",tag = "1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.SchedulableTask(taskname="task2", worker="jane", space="space2"),
            
        ]))
        
        expected = [
            Terms.Schedule(day="lunes", number=1, taskname="task1", worker="john", space="space1"),
            Terms.Schedule(day="lunes", number=1, taskname="task2", worker="jane", space="space2")
        ]
        
        
        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        
        solution = solutions[0]
                
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        self.assertCountEqual(query, expected)
    
    # two shedules can be at the same time if they have at least one tag different, and one of them has unknown space and worker
    def test_two_schedule_atleast_one_tag_different_can_same_time_with_unknown_space_and_worker(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(1),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
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
            Terms.Tags(taskname="task1",tag = "groupA"),
            Terms.Tags(taskname="task1",tag = "theory"),
            Terms.Tags(taskname="task1",tag = "1"),
            Terms.Tags(taskname="task2",tag = "groupA"),
            Terms.Tags(taskname="task2",tag = "practice"),
            Terms.Tags(taskname="task2",tag = "1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.TaskUnknownWorkerAndSpace(taskname="task2"),
            
        ]))
        
        expected = [
            Terms.Schedule(day="lunes", number=1, taskname="task1", worker="john", space="space1"),
            Terms.Schedule(day="lunes", number=1, taskname="task2", worker="jane", space="space2")
        ]
        
        
        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        
        solution = solutions[0]
                
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        self.assertCountEqual(query, expected)
    
    # test if there can be a schedule in a free time turn
    def test_there_cannot_be_schedule_in_freeTimeTurn(self):
            
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.TaskName(name="task1"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.FreeTimeTurn(day="lunes", number=2),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            
        ]))
        
        expected = [
            Terms.Schedule(day="lunes", number=1, taskname="task1", worker="john", space="space1"),
        
        ]
        
        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        
        solution = solutions[0]
                
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        self.assertCountEqual(query, expected)
        
    
    # two shedules can be at the same time if they have at least one tag different, and one of them has unknown space and worker, using also free time turn
    def test_two_schedule_atleast_one_tag_different_can_same_time_with_unknown_space_and_worker_with_free_time(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
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
            Terms.Tags(taskname="task1",tag = "groupA"),
            Terms.Tags(taskname="task1",tag = "theory"),
            Terms.Tags(taskname="task1",tag = "1"),
            Terms.Tags(taskname="task2",tag = "groupA"),
            Terms.Tags(taskname="task2",tag = "practice"),
            Terms.Tags(taskname="task2",tag = "1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.TaskUnknownWorkerAndSpace(taskname="task2"),
            Terms.FreeTimeTurn(day="lunes", number=2),
            
        ]))
        
        expected = [
            Terms.Schedule(day="lunes", number=1, taskname="task1", worker="john", space="space1"),
            Terms.Schedule(day="lunes", number=1, taskname="task2", worker="jane", space="space2")
        ]
        
        
        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        
        solution = solutions[0]
                
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        self.assertCountEqual(query, expected)
            
    def test_two_schedule_same_time_not_same_tags_diferent_number(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(2),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.Tag(name="groupA"),
            Terms.Tag(name="theory"),
            Terms.Tag(name="1"),
            Terms.Tag(name="extraTag"),
            Terms.TaskName(name="task1"),
            Terms.TaskName(name="task2"),
            Terms.Worker(name="john"),
            Terms.Worker(name="jane"),
            Terms.Space(name="space1"),
            Terms.Space(name="space2"),
            Terms.Tags(taskname="task1", tag="groupA"),
            Terms.Tags(taskname="task1", tag="theory"),
            Terms.Tags(taskname="task1", tag="1"),
            Terms.Tags(taskname="task1", tag="extraTag"),
            Terms.Tags(taskname="task2", tag="theory"),
            Terms.Tags(taskname="task2", tag="groupA"),
            Terms.Tags(taskname="task2", tag="1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.SchedulableTask(taskname="task2", worker="jane", space="space2"),
            
        ]))
               
        solutions = list(self.get_solutions())
        solution = solutions[0]
        
        solutions = self.get_solutions()
        for solution in solutions:
            query1 = list(solution.facts(atoms=True)
                .query(Terms.Schedule)
                .where(Terms.Schedule.number == 1)
                .all()
            )
      
            self.assertEqual(len(query1),1)
            
             # two schedules with same time can have at least one tag different
    def test_two_schedule_atleast_one_tag_different_can_same_time_diferent_number(self):
        
        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(1),
            Terms.UnavailableDay(day="martes"),
            Terms.UnavailableDay(day="miercoles"),
            Terms.UnavailableDay(day="jueves"),
            Terms.UnavailableDay(day="viernes"),
            Terms.UnavailableDay(day="sabado"),
            Terms.UnavailableDay(day="domingo"),
            Terms.Tag(name="groupA"),
            Terms.Tag(name="theory"),
            Terms.Tag(name="practice"),
            Terms.Tag(name="1"),
            Terms.Tag(name="extraTag"),            
            Terms.TaskName(name="task1"),
            Terms.TaskName(name="task2"),
            Terms.Worker(name="john"),
            Terms.Worker(name="jane"),
            Terms.Space(name="space1"),
            Terms.Space(name="space2"),
            Terms.Tags(taskname="task1",tag = "groupA"),
            Terms.Tags(taskname="task1",tag = "theory"),
            Terms.Tags(taskname="task1",tag = "1"),
            Terms.Tags(taskname="task1",tag = "extraTag"),
            Terms.Tags(taskname="task2",tag = "groupA"),
            Terms.Tags(taskname="task2",tag = "practice"),
            Terms.Tags(taskname="task2",tag = "1"),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.SchedulableTask(taskname="task2", worker="jane", space="space2"),
            
        ]))
        
        expected = [
            Terms.Schedule(day="lunes", number=1, taskname="task1", worker="john", space="space1"),
            Terms.Schedule(day="lunes", number=1, taskname="task2", worker="jane", space="space2")
        ]
        
        
        solutions = list(self.get_solutions())
        self.assertEqual(len(solutions), 1)
        
        solution = solutions[0]
                
        query = solution.facts(atoms=True).query(Terms.Schedule).all()
        
        self.assertCountEqual(query, expected)
  
