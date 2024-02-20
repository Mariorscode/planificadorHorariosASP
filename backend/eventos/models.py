from django.db import models

# Create your models here.
class Evento(models.Model):
    nombre = models.CharField(max_length=100)
    duracion = models.IntegerField()    
