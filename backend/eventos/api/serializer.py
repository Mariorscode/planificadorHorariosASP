from rest_framework.serializers import ModelSerializer
from eventos.models import Evento

class EventoSerializer(ModelSerializer):
    class Meta:
        model = Evento
        fields =  ['nombre', 'duracion']  