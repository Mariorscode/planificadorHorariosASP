from django.db import models

from clorm import Predicate, ConstantStr
from clorm.clingo import Control

# Create your models here.

# models.py
'''
teacher(T).
part(P).
group(G).
classroom(C).
subject(S).
'''
from clorm import Predicate, ConstantStr

class Teacher(Predicate):
    name: ConstantStr
class Part(Predicate):
    name: ConstantStr
class Group(Predicate):
    name: ConstantStr
class Classroom(Predicate):
    name: ConstantStr
class Subject(Predicate):
    name: ConstantStr
class Day(Predicate):
    name: ConstantStr
class Tourn(Predicate):
    name: int

class RestrictionTeacher(Predicate):
    teacher: ConstantStr
    hour: int
    tourn: int
class RestrictionClassroom(Predicate):
    classroom: ConstantStr
    hour: int
    tourn: int
class Assignment(Predicate):
    subject: ConstantStr
    part: ConstantStr
    group: ConstantStr
    teacher: ConstantStr
    classroom: ConstantStr
    
    
    
ctrl = Control(unifier=[Teacher,Part,Group,Classroom,Subject,Day,Tourn,RestrictionTeacher,RestrictionClassroom,Assignment])
# ctrl = Control(unifier=[Teacher])

ctrl.load("./context.lp")

# Posible en views.py
from clorm import FactBase
from django.db import models

from clorm import Predicate, ConstantStr
from clorm.clingo import Control

# Create your models here.

# models.py
from clorm import Predicate, ConstantStr

teacher = [ Teacher(name=n) for n in ["dave", "morri", "michael" ] ] 
part = [ Part(name=n) for n in ["teorical", "practical" ] ]
group = [ Group(name=n) for n in ["groupA", "groupB" ] ]
classroom = [ Classroom(name=n) for n in ["2.11", "3.05" ] ]
subject = [ Subject(name=n) for n in ["calculo", "programming" ] ]

instance = FactBase(teacher + part + group + classroom + subject)

ctrl.add_facts(instance)

# Ahora, agrega el nuevo assignment con los valores deseados
# new_assignment = Assignment(item="item5", driver="john", time=2)
# ctrl.add_facts([new_assignment])

ctrl.ground([("base",[])])


solution=None
def on_model(model):
    global solution     # Note: use `nonlocal` keyword depending on scope
    solution = model.facts(atoms=True)

ctrl.solve(on_model=on_model)
if not solution:
    raise ValueError("No solution found")


print(solution)