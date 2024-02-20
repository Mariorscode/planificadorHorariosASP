from rest_framework.viewsets import ModelViewSet
from eventos.models import Evento
from eventos.api.serializer import EventoSerializer 

class EventoViewSet(ModelViewSet):
    serializer_class = EventoSerializer
    queryset = Evento.objects.all()