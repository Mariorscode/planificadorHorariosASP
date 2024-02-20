from django.contrib import admin
from eventos.models import Evento 
# Register your models here.

@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'duracion')