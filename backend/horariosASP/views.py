from django.http import HttpResponse
from clorm import FactBase
from clorm.clingo import Control
from horariosASP.models import Driver, Item, Assignment

def consultar_estudiantes(request):
    # Create a FactBase with drivers and items
    drivers = [Driver(name=n) for n in ["dave", "morri", "michael"]]
    items = [Item(name="item{}".format(i)) for i in range(1, 6)]
    instance = FactBase(drivers + items)

    # Use Clingo Control to run the solver
    ctrl = Control(unifier=[Driver, Item, Assignment])
    ctrl.load('backend/horariosASP/quickstart.lp')
    ctrl.add_facts(instance)
    ctrl.ground([("base", [])])

    # Callback function to process each model
    def on_model(model):
        # Process the model and save results to the Django models
        for assignment in model.facts(atoms=True):
            Assignment.objects.create(
                item=Item.objects.get(name=assignment.item),
                driver=Driver.objects.get(name=assignment.driver),
                time=assignment.time
            )

    # Run the solver
    solution = ctrl.solve(on_model=on_model)

    if not solution:
        raise ValueError("No solution found")

    # Query the results using Django ORM
    output = ""
    for driver in Driver.objects.all():
        assignments = Assignment.objects.filter(driver=driver).order_by('time')
        if not assignments:
            output += f"Driver {driver.name} is not working today\n"
        else:
            output += f"Driver {driver.name} must deliver:\n"
            for assignment in assignments:
                output += f"\tItem {assignment.item.name} at time {assignment.time}\n"

    # Return the output as an HttpResponse
    return HttpResponse(output)
