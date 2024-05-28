from clorm import monkey
monkey.patch() # must call this before importing clingo
from clingo import Control


class Clingo:
    def clingo_setup(self, *files):
        self.ctrl = Control(['--models=0'], unifier=[
            Terms.Turn,
            Terms.TurnsPerDay,
            Terms.Day,
            Terms.UnavailableDay,
            Terms.Schedule,
            Terms.Worker,
            Terms.Space,
            Terms.SpaceCapacity,
            Terms.TaskName,
            Terms.Tag,
            Terms.SchedulableTask,
            Terms.Restrictionworker,
            Terms.Restrictionspace,
            Terms.TaskSize,
            Terms.Spacecapacity,
            Terms.Tag,
            Terms.Tags,
            Terms.TaskUnknownSpace,
            Terms.TaskUnknownWorker,
            Terms.TaskUnknownWorkerAndSpace,
            Terms.FreeTimeTurn,
            # ...
        ])
        
        if not files:
            
            self.ctrl.load("ASP/engine.lp")
            self.ctrl.load("ASP/knowledge.lp")
            return

        for f in files:
            self.ctrl.load(f)

    def load_knowledge(self, facts):
        self.ctrl.add_facts(facts)
        self.ctrl.ground([("base", [])])

    def get_solutions(self):
        return self.ctrl.solve(yield_=True)


from clorm import Predicate, ConstantField, IntegerField

class Terms:
    class Turn(Predicate):
        day = ConstantField
        number = IntegerField

    class TurnsPerDay(Predicate):
        number = IntegerField

    class Day(Predicate):
        name = ConstantField

    class UnavailableDay(Predicate):
        day = ConstantField

    class Schedule(Predicate):
        day = ConstantField
        number = IntegerField
        taskname = ConstantField
        worker = ConstantField
        space = ConstantField
    
    class Worker(Predicate):
        name = ConstantField

    class Space(Predicate):
        name = ConstantField
    
    class SpaceCapacity(Predicate):
        space = ConstantField
        capacity = IntegerField
    
    class TaskName(Predicate):
        name = ConstantField
    
    class Tag(Predicate):
        name = ConstantField
        
    #class tags con list de tag
    
    class SchedulableTask(Predicate):
        taskname = ConstantField
        worker = ConstantField
        space = ConstantField
    
    class Restrictionworker(Predicate):
        worker = ConstantField
        day = ConstantField
        number = IntegerField

    
    class Restrictionspace(Predicate):
        space = ConstantField
        day = ConstantField
        number = IntegerField
        
    class TaskSize(Predicate):
        taskname = ConstantField
        size = IntegerField
        
    class Spacecapacity(Predicate):
        space = ConstantField
        size = IntegerField
    
    class Tag(Predicate):
        name = ConstantField    
        
    class Tags(Predicate):
        taskname = ConstantField
        tag = ConstantField
      

    class TaskUnknownSpace(Predicate):
        taskname = ConstantField
        worker = ConstantField   
    
    class TaskUnknownWorker(Predicate):
        taskname = ConstantField
        space = ConstantField
        
    class TaskUnknownWorkerAndSpace(Predicate):
        taskname = ConstantField
        
    class FreeTimeTurn(Predicate):
        day = ConstantField
        number = IntegerField