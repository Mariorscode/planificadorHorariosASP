from clorm import monkey
monkey.patch() # must call this before importing clingo
from clingo import Control


class ClingoScheduler:
    def clingo_setup(self, *files):
        self.ctrl = Control(unifier=[
            Terms.Turn,
            Terms.TurnsPerDay,
            Terms.Day,
            Terms.UnavailableDay,
            # ...
        ])

        if not files:
            self.ctrl.load("engine.lp")
            self.ctrl.load("knowledge.lp")
            return

        for f in files:
            self.ctrl.load(f)

    def load_knowledge(self, facts):
        self.ctrl.add_facts(facts)
        self.ctrl.ground([("base", [])])

    def get_solution(self):
        solution = None

        def on_model(model):
            nonlocal solution
            solution = model.facts(atoms=True)

        self.ctrl.solve(on_model=on_model)
        return solution


from clorm import Predicate, ConstantField, IntegerField

class Terms:
    class Turn(Predicate):
        name = ConstantField
        number = IntegerField

    class TurnsPerDay(Predicate):
        number = IntegerField

    class Day(Predicate):
        name = ConstantField

    class UnavailableDay(Predicate):
        day = ConstantField
