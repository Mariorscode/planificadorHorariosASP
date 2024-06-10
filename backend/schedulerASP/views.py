from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action

from .models import Turn, Worker, CommonWorker, Space, CommonSpace, Tag, ScheduableTask, CommonScheduableTask, TimeTable, Schedule, User
from .serializer import TurnSerializer, WorkerSerializer, CommonWorkerSerializer, SpaceSerializer, CommonSpaceSerializer, TagSerializer, ScheduableTaskSerializer, CommonScheduableTaskSerializer, TimeTableSerializer, ScheduleSerializer, UserSerializer

from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from clorm import FactBase

from . import Clingo
from . import Terms

from django.contrib.auth import get_user_model
from collections import defaultdict
from operator import itemgetter
from datetime import datetime

class TurnViewSet(ModelViewSet):
    serializer_class = TurnSerializer
    queryset = Turn.objects.all()
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def create_multiple(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            # Si se recibe una lista de turnos
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response({'error': 'Expected a list of items'}, status=status.HTTP_400_BAD_REQUEST)

class WorkerViewSet(ModelViewSet):
    serializer_class = WorkerSerializer
    queryset = Worker.objects.all()
    
    @action(detail=False, methods=['post'])
    def create_multiple(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response({'error': 'Expected a list of items'}, status=status.HTTP_400_BAD_REQUEST)
        
class CommonWorkerFilter(filters.FilterSet):
    user_id = filters.NumberFilter(field_name='user_id')
    

    class Meta:
        model = CommonWorker
        fields = ['user_id']

class CommonWorkerViewSet(ModelViewSet):
    serializer_class = CommonWorkerSerializer
    queryset = CommonWorker.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = CommonWorkerFilter
        
    @action(detail=False, methods=['post'])
    def create_multiple(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response({'error': 'Expected a list of items'}, status=status.HTTP_400_BAD_REQUEST)    
        

class TimeTableFilter(filters.FilterSet):
    user_id = filters.NumberFilter(field_name='user_id')

    class Meta:
        model = TimeTable
        fields = ['user_id']

class TimeTableViewSet(ModelViewSet, Clingo):
    queryset = TimeTable.objects.all()
    serializer_class = TimeTableSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = TimeTableFilter
    
    permission_classes = [AllowAny]
    
    DAYS_OF_WEEK = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]
    
    def convert_start_time_to_number(turns):
    # Ordenar los turnos por `startTime`
        turns.sort(key=lambda x: datetime.strptime(x['startTime'], '%H:%M'))
    # Asignar un número secuencial a cada turno
        for number, turn in enumerate(turns, start=1):
         turn['number'] = number
        return turns

    @action(detail=False, methods=['get'])
    def generateTimetable(self, request):
        
        timetable_id = request.query_params.get('timetable_id')

        timetable_id = 18
        turnsDuration = 0

        if not timetable_id:
            return Response({"error": "timetable_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        # poner: 
            # Terms.TurnsPerDay, #
            # Terms.UnavailableDay, #
            # Terms.Schedule, # 
            # Terms.Worker, # 
            # Terms.Space, #
            # Terms.SpaceCapacity, #
            # Terms.TaskName, # 
            # Terms.SchedulableTask,#
            # Terms.Restrictionworker,#
            # Terms.Restrictionspace,#
            # Terms.TaskSize,#
            # Terms.Spacecapacity,#
            # Terms.Tag,#
            # Terms.Tags,#
            # Terms.TaskUnknownSpace, #
            # Terms.TaskUnknownWorker, #
            # Terms.TaskUnknownWorkerAndSpace, #
            # Terms.FreeTimeTurn, #
            
        
        fact_list = [
            # Terms.TurnsPerDay(2),
            # Terms.UnavailableDay(day="tuesday"),
            # Terms.UnavailableDay(day="wednesday"),
            # Terms.UnavailableDay(day="thursday"),
            # Terms.UnavailableDay(day="friday"),
            # Terms.UnavailableDay(day="saturday"),
            # Terms.UnavailableDay(day="sunday"),
            # Terms.TaskName(name="task1"),
            # Terms.TaskName(name="task2"),
            # Terms.Worker(name="john"),
            # Terms.Space(name="space1"),
            # Terms.SpaceCapacity(space="space1", capacity=10),
            # Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            # Terms.SchedulableTask(taskname="task2", worker="john", space="space1"),
            # Terms.TaskSize(taskname="task1", size=5)
        ]
         
        
        timeTables = TimeTable.objects.filter(id=timetable_id)
        
        for timetable in timeTables:
            fact_list.append(Terms.TurnsPerDay(timetable.turnsPerDay))
            turnsDuration = timetable.turnsDuration
            
        turns = Turn.objects.filter(timeTable_id=timetable_id)
        
        available_days = set(turn.day for turn in turns)
        unavailable_days = [day for day in self.DAYS_OF_WEEK if day not in available_days]

        for day in unavailable_days:
            fact_list.append(Terms.UnavailableDay(day=day))

        for turn in turns:
            if turn.is_free_time == True:
                fact_list.append(Terms.FreeTimeTurn(day=turn.day, number=int(turn.startTime)))
       
        workers = Worker.objects.filter(timtable_id=timetable_id)
        
        for worker in workers:
            fact_list.append(Terms.Worker(name=worker.name))
            for restriction in worker.restrictionsWorker.all():
                restrictionWorkerTurns = Turn.objects.filter(id=restriction) 
                for restrictionWorkerTurns in restrictionWorkerTurns:
                    fact_list.append(Terms.Restrictionworker(worker=worker.name, day=restrictionWorkerTurns.day, number=restrictionWorkerTurns.startTime))
                    
        spaces = Space.objects.filter(timeTable_id=timetable_id)
        
        for space in spaces:
            fact_list.append(Terms.Space(name=space.name))
            fact_list.append(Terms.SpaceCapacity(space=space.name, capacity=space.space_capacity))
            for restriction in space.restrictionsSpace.all():
                restrictionSpaceTurns = Turn.objects.filter(id=restriction)
                for restrictionSpaceTurns in restrictionSpaceTurns:
                    fact_list.append(Terms.Restrictionspace(space=space.name, day=restrictionSpaceTurns.day, number=restrictionSpaceTurns.startTime))
                    
        scheduableTasks = ScheduableTask.objects.all()
        
        tags = []
        for scheduableTask in scheduableTasks:
            fact_list.append(Terms.TaskName(name=scheduableTask.name))
            fact_list.append(Terms.TaskSize(taskname=scheduableTask.name, size=scheduableTask.task_size))
            
            # for tag in scheduableTask.task_tags:
            #     if tag not in tags:
            #         tags.append(tag)
            #         fact_list.append(Terms.Tag(name=tag))    
            #         fact_list.append(Terms.Tags(taskname=scheduableTask.name, tag=tag))
                    
                
            if scheduableTask.task_spaces.name == None & scheduableTask.task_worker.name == None:
                fact_list.append(Terms.TaskUnknownWorkerAndSpace(taskname=scheduableTask.name))
            elif scheduableTask.task_worker.name == None:
                fact_list.append(Terms.TaskUnknownWorker(taskname=scheduableTask.name))
            elif scheduableTask.task_spaces.name == None:
                fact_list.append(Terms.TaskUnknownSpace(taskname=scheduableTask.name))
            else:
              fact_list.append(Terms.SchedulableTask(taskname=scheduableTask.name, worker=scheduableTask.task_worker.name, space=scheduableTask.task_spaces.name))
              
        
        self.clingo_setup()
  
        self.load_knowledge(FactBase(fact_list))

        solutions = list(self.get_solutions())
        all_solutions = []

        for index, solution in enumerate(solutions):
            query = list(solution.facts(atoms=True).query(Terms.Schedule).all())
            solution_dict = {
                'solution_id': index + 1,  # Identificador de la solución
                'schedules': [str(q) for q in query]
            }
            all_solutions.append(solution_dict)

        return Response({"solutions": all_solutions}, status=status.HTTP_200_OK)
        
    

class SpaceViewSet(ModelViewSet):
    queryset = Space.objects.all()
    serializer_class = SpaceSerializer
    
    @action(detail=False, methods=['post'])
    def create_multiple(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response({'error': 'Expected a list of items'}, status=status.HTTP_400_BAD_REQUEST)
    

class CommonSpaceFilter(filters.FilterSet):
    user_id = filters.NumberFilter(field_name='user_id')

    class Meta:
        model = CommonSpace
        fields = ['user_id']

class CommonSpaceViewSet(ModelViewSet):
    queryset = CommonSpace.objects.all()
    serializer_class = CommonSpaceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CommonSpaceFilter
    
    @action(detail=False, methods=['post'])
    def create_multiple(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response({'error': 'Expected a list of items'}, status=status.HTTP_400_BAD_REQUEST)
    

        
class TagViewSet(ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class CommonScheduableTaskFilter(filters.FilterSet):
    user_id = filters.NumberFilter(field_name='user_id')
    class Meta:
        model = CommonScheduableTask
        fields = ['user_id']
                  
class CommonScheduableTaskViewSet(ModelViewSet):
    queryset = CommonScheduableTask.objects.all()
    serializer_class = CommonScheduableTaskSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CommonScheduableTaskFilter
    
    
    @action(detail=False, methods=['post'])
    def create_multiple(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response({'error': 'Expected a list of items'}, status=status.HTTP_400_BAD_REQUEST)
        
class ScheduableTaskViewSet(ModelViewSet):
    queryset = ScheduableTask.objects.all()
    serializer_class = ScheduableTaskSerializer
    
    
    @action(detail=False, methods=['post'])
    def create_multiple(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response({'error': 'Expected a list of items'}, status=status.HTTP_400_BAD_REQUEST)
    
class ScheduleFilter(filters.FilterSet):
    timeTable_schedule = filters.NumberFilter(field_name='timeTable_schedule')
    class Meta:
        model = Schedule
        fields = ['timeTable_schedule']
    
class scheduleViewSet(ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ScheduleFilter
    permission_classes = [AllowAny]
    
      
    @action(detail=False, methods=['post'])
    def create_multiple(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response({'error': 'Expected a list of items'}, status=status.HTTP_400_BAD_REQUEST)
# class UserViewSet(ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]
    
    
#     class Meta:
#         model = User
#         fields = ['id', 'name', 'email', 'password']
#         extra_kwargs = {'password': {'write_only': True}}

User = get_user_model()

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')
            user = User.objects.create_user(username=username, password=password, email=email)
            
            # Modifica la respuesta para incluir el ID del usuario creado
            data = {
                'id': user.id,
                'username': username,
                'email': email,
                # Otros campos si es necesario
            }
            
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['get'])
    def get_user_by_username(self, request):
        username = request.query_params.get('username')
        if username:
            try:
                user = User.objects.get(username=username)
                serializer = self.get_serializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Please provide a username'}, status=status.HTTP_400_BAD_REQUEST)



class Home(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)