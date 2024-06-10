from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action

from .models import Turn, Worker, CommonWorker, Space, CommonSpace, Tag, ScheduableTask, CommonScheduableTask,TimeTable, Schedule, User

from .serializer import TurnSerializer, WorkerSerializer, CommonWorkerSerializer, SpaceSerializer,CommonSpaceSerializer, TagSerializer, ScheduableTaskSerializer, CommonScheduableTaskSerializer, TimeTableSerializer, ScheduleSerializer, UserSerializer

from clorm import FactBase

from . import Clingo
from . import Terms


class TurnViewSet(ModelViewSet):
    serializer_class = TurnSerializer
    queryset = Turn.objects.all()

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

class CommonWorkerViewSet(ModelViewSet):
    serializer_class = CommonWorkerSerializer
    queryset = CommonWorker.objects.all()

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


class TimeTableViewSet(ModelViewSet,Clingo):
    queryset = TimeTable.objects.all()
    serializer_class = TimeTableSerializer


    @action(detail=False, methods=['get'])
    def generateTimetable(self, request):

        self.clingo_setup()

        self.load_knowledge(FactBase([
            Terms.TurnsPerDay(1),
            Terms.UnavailableDay(day="tuesday"),
            Terms.UnavailableDay(day="wednesday"),
            Terms.UnavailableDay(day="thursday"),
            Terms.UnavailableDay(day="friday"),
            Terms.UnavailableDay(day="saturday"),
            Terms.UnavailableDay(day="sunday"),
            Terms.TaskName(name="task1"),
            Terms.Worker(name="john"),
            Terms.Space(name="space1"),
            Terms.SpaceCapacity(space="space1", capacity=10),
            Terms.SchedulableTask(taskname="task1", worker="john", space="space1"),
            Terms.TaskSize(taskname="task1", size=5)

        ]))

        solutions = list(self.get_solutions())
        solution = solutions[0]


        query = list(solution.facts(atoms=True).query(Terms.Schedule).all())

        return Response({"query": str(query)}, status=status.HTTP_200_OK)

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

class CommonSpaceViewSet(ModelViewSet):
    queryset = CommonSpace.objects.all()
    serializer_class = CommonSpaceSerializer

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


class CommonScheduableTaskViewSet(ModelViewSet):
    queryset = CommonScheduableTask.objects.all()
    serializer_class = CommonScheduableTaskSerializer

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

class scheduleViewSet(ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

class userViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
