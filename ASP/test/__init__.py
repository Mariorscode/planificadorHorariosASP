from clorm import monkey
monkey.patch() # must call this before importing clingo
from clingo import Control


class ClingoTest:
    def clingo_setup(self, *files):
        self.ctrl = Control(['--models=0'], unifier=[
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

    def get_solutions(self):
        return self.ctrl.solve(yield_=True)


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
