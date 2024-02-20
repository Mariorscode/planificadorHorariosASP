from rest_framework.routers import DefaultRouter 
from eventos.api.views import EventoViewSet  

router_evento = DefaultRouter() 

router_evento.register(prefix='eventos', basename='eventos', viewset=EventoViewSet)