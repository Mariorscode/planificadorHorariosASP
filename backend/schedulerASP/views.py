from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
# from .models import Turn, Worker, Space, Tag, ScheduableTask
# from .serializer import TurnSerializer, WorkerSerializer, SpaceSerializer, TagSerializer, ScheduableTaskSerializer, TimeTableSerializer, TimeTable, Space

from .models import Turn, Worker, Space, Tag, ScheduableTask, TimeTable, Schedule, User   

from .serializer import TurnSerializer, WorkerSerializer, SpaceSerializer, TagSerializer, ScheduableTaskSerializer, TimeTableSerializer, ScheduleSerializer, UserSerializer

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
class TimeTableViewSet(ModelViewSet):
    queryset = TimeTable.objects.all()
    serializer_class = TimeTableSerializer

class SpaceViewSet(ModelViewSet):
    queryset = Space.objects.all()
    serializer_class = SpaceSerializer

class TagViewSet(ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class ScheduableTaskViewSet(ModelViewSet):
    queryset = ScheduableTask.objects.all()
    serializer_class = ScheduableTaskSerializer
    
class scheduleViewSet(ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    
class userViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

