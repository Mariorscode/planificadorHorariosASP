from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Turn, Worker, Space, Tag, ScheduableTask
from .serializer import TurnSerializer, WorkerSerializer, SpaceSerializer, TagSerializer, ScheduableTaskSerializer

class TurnViewSet(ModelViewSet):
    serializer_class = TurnSerializer
    queryset = Turn.objects.all()

class WorkerViewSet(ModelViewSet):
    serializer_class = WorkerSerializer
    queryset = Worker.objects.all()
    
class SpaceViewSet(ModelViewSet):
    serializer_class = SpaceSerializer
    queryset = Space.objects.all()
    
class TagViewSet(ModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()

class ScheduableTaskViewSet(ModelViewSet):
    serializer_class = ScheduableTaskSerializer
    queryset = ScheduableTask.objects.all()

