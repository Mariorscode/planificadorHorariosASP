from django.db import models

from clorm import Predicate, ConstantStr
from clorm.clingo import Control

# Create your models here.

# models.py
from clorm import Predicate, ConstantStr

class Driver(Predicate):
    name: ConstantStr

class Item(Predicate):
    name: ConstantStr

class Assignment(Predicate):
    item: ConstantStr
    driver: ConstantStr
    time: int


'''

Codigo anterior que funciona al hacer la ejecución "python3 models.py" 

class Driver(Predicate):
    name: ConstantStr

class Item(Predicate):
    name: ConstantStr

class Assignment(Predicate):
    item: ConstantStr
    driver: ConstantStr
    time: int
    
ctrl = Control(unifier=[Driver,Item,Assignment])
ctrl.load("./quickstart.lp")

# Posible en views.py
from clorm import FactBase

drivers = [ Driver(name=n) for n in ["dave", "morri", "michael" ] ]
items = [ Item(name="item{}".format(i)) for i in range(1,6) ]
instance = FactBase(drivers + items)

ctrl.add_facts(instance)
ctrl.ground([("base",[])])


solution=None
def on_model(model):
    global solution     # Note: use `nonlocal` keyword depending on scope
    solution = model.facts(atoms=True)

ctrl.solve(on_model=on_model)
if not solution:
    raise ValueError("No solution found")


print(solution)
'''