# from django.db import models

# from clorm import Predicate, ConstantStr
# from clorm.clingo import Control

# # Create your models here.

# # models.py
# '''
# teacher(T).
# part(P).
# group(G).
# classroom(C).
# subject(S).
# '''
# from clorm import Predicate, ConstantStr

# class Teacher(Predicate):
#     name: ConstantStr
# class Part(Predicate):
#     name: ConstantStr
# class Group(Predicate):
#     name: ConstantStr
# class Classroom(Predicate):
#     name: ConstantStr
# class Subject(Predicate):
#     name: ConstantStr
# class Day(Predicate):
#     name: ConstantStr
# class turn(Predicate):
#     name: int

# class RestrictionTeacher(Predicate):
#     teacher: ConstantStr
#     hour: int
#     turn: int
# class RestrictionClassroom(Predicate):
#     classroom: ConstantStr
#     hour: int
#     turn: int
# class Assignment(Predicate):
#     subject: ConstantStr
#     part: ConstantStr
#     group: ConstantStr
#     teacher: ConstantStr
#     classroom: ConstantStr
    
    
    
# ctrl = Control(unifier=[Teacher,Part,Group,Classroom,Subject,Day,turn,RestrictionTeacher,RestrictionClassroom,Assignment])
# # ctrl = Control(unifier=[Teacher])

# ctrl.load("./context.lp")
# ctrl.load("./knowledge.lp")

# # Posible en views.py
# from clorm import FactBase
# from django.db import models

# from clorm import Predicate, ConstantStr
# from clorm.clingo import Control

# # Create your models here.

# # models.py
# from clorm import Predicate, ConstantStr

# teacher = [ Teacher(name=n) for n in ["dave", "morri", "michael" ] ] 
# part = [ Part(name=n) for n in ["teorical", "practical" ] ]
# group = [ Group(name=n) for n in ["groupA", "groupB" ] ]
# classroom = [ Classroom(name=n) for n in ["2.11", "3.05" ] ]
# subject = [ Subject(name=n) for n in ["calculo", "programming" ] ]

# # Now, add the new assignment with the desired values

# new_assignment = Assignment(subject="SUBJECTASIGMENT", part="PARTASIGMENT", group="GROUPASIGMENT", teacher="TEACHERASIGMENT", classroom="CLASSROOMASIGMENT")

# new_restrictions = RestrictionTeacher(teacher="RESTRICTIONTEACHER", hour=1, turn=1)

# instance = FactBase(teacher + part + group + classroom + subject + [new_assignment] + [new_restrictions])

# ctrl.add_facts(instance)

# ctrl.ground([("base",[])])


# solution=None
# def on_model(model):
#     global solution     # Note: use `nonlocal` keyword depending on scope
#     solution = model.facts(atoms=True)

# ctrl.solve(on_model=on_model)
# if not solution:
#     raise ValueError("No solution found")


# print(solution)

import re

def check_constraint(schedule_lines):
    # Lista para almacenar las tuplas de tags
    tags_list = []
    
    # Iterar sobre cada línea de la salida del comando
    for line in schedule_lines:
        # Utilizar expresión regular para extraer los elementos relevantes
        match = re.match(r'schedule\((\w+),(\d+),(\w+),(\w+),\"(.*)\"\)', line)
        if match:
            # Extraer los elementos
            day, turn, subject, teacher, classroom = match.groups()
            # Extraer los tags de la materia
            tags_match = re.match(r'(\w+)_(\d+)_\w+', subject)
            if tags_match:
                tag1, tag2 = tags_match.groups()
                tags_list.append((subject, tag1, tag2, teacher, classroom))
    
    # Verificar la restricción
    for i in range(len(tags_list)):
        for j in range(i+1, len(tags_list)):
            if tags_list[i][1:] == tags_list[j][1:]:
                # Si se encuentra una violación, devolver False
                return False
    
    # Si no se encuentra ninguna violación, devolver True
    return True

# Leer el archivo de texto
with open('output.txt', 'r') as file:
    lines = file.readlines()

# Verificar la restricción
constraint_satisfied = check_constraint(lines)

# Imprimir el resultado
if constraint_satisfied:
    print("La restricción se cumple.")
else:
    print("La restricción NO se cumple.")
