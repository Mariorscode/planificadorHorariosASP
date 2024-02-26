# views.py
from django.shortcuts import render

from .serializers import AssignmentSerializer


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from clorm import FactBase, ConstantStr
from clorm.clingo import Control
from .models import Driver, Item, Assignment
from .serializers import AssignmentSerializer
from rest_framework import serializers

def solve_asp_program():
    ctrl = Control(unifier=[Driver, Item, Assignment])
    try:
        ctrl.load("./quickstart.lp")
    except RuntimeError as e:
        print(f"Error cargando el programa ASP: {e}")
        raise

    drivers = [Driver(name=n) for n in ["dave", "morri", "michael"]]
    items = [Item(name=f"item{i}") for i in range(1, 6)]
    instance = FactBase(drivers + items)

    ctrl.add_facts(instance)
    ctrl.ground([("base", [])])

    solutions = []
    def on_model(model):
        nonlocal solutions
        solution = model.facts(atoms=True)
        solutions.append(solution)

    ctrl.solve(on_model=on_model)
    if not solutions:
        raise ValueError("No solution found")

    return solutions

@csrf_exempt
def solve_program(request):
    if request.method == 'GET':
        solutions = solve_asp_program()
        print(solutions)    
        
#   # Convertir el resultado a un formato que puede ser serializado (comentado para hacer pruebas)
    #     formatted_result = []
    #     for solution in solutions:
    #         formatted_result.extend([{'item': str(a.item), 'driver': str(a.driver), 'time': a.time} for a in solution])

    #     return JsonResponse(formatted_result, safe=False)
    # else:
    #     return HttpResponse(status=405)
    

''''
# Este ejemplo devuelve correctamente la petición pero result está hardcoded por lo que no es válido

class AssignmentSerializer(serializers.Serializer):
    item = serializers.CharField()
    driver = serializers.CharField()
    time = serializers.IntegerField()
@csrf_exempt
def solve_program(request):
    if request.method == 'GET':
        result = [
            {'item': 'item1', 'driver': 'dave', 'time': 1},
            {'item': 'item2', 'driver': 'morri', 'time': 2},
            {'item': 'item3', 'driver': 'michael', 'time': 3},
            {'item': 'item4', 'driver': 'dave', 'time': 4},
            {'item': 'item5', 'driver': 'morri', 'time': 5},
        ]
        serializer = AssignmentSerializer(data=result, many=True)
        if serializer.is_valid():
            return JsonResponse(serializer.data, safe=False)
        else:
            return JsonResponse({'error': 'Invalid data'}, status=400)
    else:
        return HttpResponse(status=405)

'''
