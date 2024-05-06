from django.db import models

# Create your models here.


class Turn(models.Model):
    day = models.CharField(max_length=70, blank=False, default='')
    startTime = models.CharField(max_length=70, blank=False, default='')
    is_free_time = models.BooleanField(default=False)
    

class Worker(models.Model):
    name =models.CharField(max_length=70, blank=False, default='')
    worker_restrictions = models.ManyToManyField(Turn) 
    
class Space(models.Model):
    name = models.CharField(max_length=70, blank=False, default='')
    space_capacity = models.IntegerField(default=0)
    space_restrictions = models.ManyToManyField(Turn)
    
        
class Tag(models.Model):
    name = models.CharField(max_length=70, blank=False, default='')
    
class ScheduableTask(models.Model):
    # revisar
    name = models.CharField(max_length=70, blank=False, default='')
    task_size = models.IntegerField(default=0)
    task_restrictions = models.ManyToManyField(Turn, blank=True, null=True)
    task_tags = models.ManyToManyField(Tag, blank=True, null=True)
    task_workers = models.ManyToManyField(Worker, blank=True, null=True)
    task_spaces = models.ManyToManyField(Space, blank=True, null=True)

    
