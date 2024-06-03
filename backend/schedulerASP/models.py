from django.db import models

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=70, blank=False, default='')
    password = models.CharField(max_length=70, blank=False, default='')
    email = models.CharField(max_length=70, blank=False, default='')
    
    def __str__(self):
        return self.name
class TimeTable(models.Model):
    name = models.CharField(max_length=70, blank=False, default='')
    turnsDuration = models.IntegerField(default=0)
    turnsPerDay = models.IntegerField(default=0)
    start_time = models.CharField(max_length=70, blank=False, default='')
    user_id = models.ForeignKey(User, related_name='timetables', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name + " " + str(self.turnsDuration) + " " + str(self.turnsPerDay)

class Turn(models.Model):
    day = models.CharField(max_length=70, blank=False, default='')
    startTime = models.CharField(max_length=70, blank=False, default='')
    is_free_time = models.BooleanField(default=False)
    timeTable_id = models.ForeignKey(TimeTable, related_name='turns', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.day} at {self.startTime} (Free time: {self.is_free_time})"

class Worker(models.Model):
    name = models.CharField(max_length=70, blank=False, default='')
    restrictionsWorker = models.ManyToManyField(Turn, related_name='workers', blank=True, null=True)
    timtable_id = models.ForeignKey(TimeTable, related_name='workers', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name + " " + str(self.restrictionsWorker)
    
class CommonWorker(models.Model):
    name = models.CharField(max_length=70, blank=False, default='')
    user_id = models.ForeignKey(User, related_name='workers', on_delete=models.CASCADE, null=True)
    
    def __str__(self):
        return self.name 

class Space(models.Model):
    name = models.CharField(max_length=70, blank=False, default='')
    space_capacity = models.IntegerField(default=0, blank=True, null=True)
    restrictionsSpace = models.ManyToManyField(Turn, related_name='spaces', blank=True, null=True)
    timeTable_id = models.ForeignKey(TimeTable, related_name='spaces', on_delete=models.CASCADE, null=True)
    
    def __str__(self):
        return self.name + " " + str(self.space_capacity) + " " + str(self.restrictionsSpace)
    
class CommonSpace(models.Model):
    name = models.CharField(max_length=70, blank=False, default='')
    space_capacity = models.IntegerField(default=0,blank=True, null=True)
    user_id = models.ForeignKey(User, related_name='spaces', on_delete=models.CASCADE, null=True)
    
    def __str__(self):
        return self.name + " " + str(self.space_capacity) + " " + str(self.restrictionsSpace)
  
        
class Tag(models.Model):
    name = models.CharField(max_length=70, blank=False, default='')
    
    
    def __str__(self):
        return self.name
    
class ScheduableTask(models.Model):
    name = models.CharField(max_length=70, blank=False, default='')
    task_size = models.IntegerField(default=0, blank=True, null=True)
    task_restrictions = models.ManyToManyField(Turn,related_name='task_restrictions', blank=True, null=True)
    # task_tags = models.ManyToManyField(Tag, blank=True, null=True, related_name='task_tags')
    # task_tags = models.CharField(max_length=70, blank=False, default='')
    task_tags = models.JSONField(default=list)
    task_worker = models.ForeignKey(Worker, blank=True, null=True, related_name='scheduable_tasks', on_delete=models.SET_NULL)
    task_spaces = models.ForeignKey(Space, blank=True, null=True, related_name='scheduable_tasks', on_delete=models.SET_NULL)
    timeTable_id = models.ForeignKey(TimeTable, related_name='scheduable_tasks', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name
    
class CommonScheduableTask(models.Model):
    
    name = models.CharField(max_length=70, blank=False, default='')
    task_size = models.IntegerField(default=0, blank=True, null=True)
    user_id = models.ForeignKey(User, related_name='scheduable_tasks', on_delete=models.CASCADE, null=True)
    
    def __str__(self):
        return self.name
    
    
    
#quizas no dejar con restricciones para que no afecte al alterar los otros elementos a los schedule, unica restriccion con timetable
# class schedule(models.Model):
#     name  =  models.CharField(max_length=70, blank=False, default='')
#     turn_schedule = models.ForeignKey(Turn, related_name='turn_schedule', on_delete=models.CASCADE)
#     space_schedule = models.ForeignKey(Space, related_name='space_schedule', on_delete=models.CASCADE)
#     worker_schedule = models.ForeignKey(Worker, related_name='worker_schedule', on_delete=models.CASCADE)
#     timeTable_schedule = models.ForeignKey(TimeTable, related_name='timeTable_schedule', on_delete=models.CASCADE)
    
class Schedule(models.Model):
    name = models.CharField(max_length=70, blank=False, default='')
    day = models.CharField(max_length=70, blank=False, default='')
    number = models.IntegerField(default=0)
    schedule_space = models.CharField(max_length=70, blank=False, default='')
    schedule_worker = models.CharField(max_length=70, blank=False, default='')
    timeTable_schedule = models.ForeignKey(TimeTable, related_name='timeTable_schedule', on_delete=models.CASCADE)
    

    