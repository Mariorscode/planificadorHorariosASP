from rest_framework import serializers
from .models import Turn, Worker, CommonWorker, Space,CommonSpace , Tag, ScheduableTask, CommonScheduableTask, TimeTable, Schedule, User

class TimeTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeTable
        fields = ['id', 'name', 'turnsDuration', 'turnsPerDay']

class TurnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turn
        fields = ['id', 'day', 'startTime', 'is_free_time', 'timeTable_id']

class WorkerSerializer(serializers.ModelSerializer):
    # restrictionsWorker = TurnSerializer(many=True, read_only=True)

    class Meta:
        model = Worker
        fields = ['id', 'name', 'restrictionsWorker', 'timtable_id']
        
class CommonWorkerSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CommonWorker
        fields = ['id', 'name', 'user_id']


class SpaceSerializer(serializers.ModelSerializer):
    # restrictionsSpace = TurnSerializer(many=True, read_only=True)

    class Meta:
        model = Space
        fields = ['id', 'name', 'space_capacity', 'restrictionsSpace', 'timeTable_id']
        
class CommonSpaceSerializer(serializers.ModelSerializer):
    # restrictionsSpace = TurnSerializer(many=True, read_only=True)

    class Meta:
        model = CommonSpace
        fields = ['id', 'name', 'space_capacity', 'user_id']        


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class ScheduableTaskSerializer(serializers.ModelSerializer):


    class Meta:
        model = ScheduableTask
        fields = ['id', 'name', 'task_size', 'task_restrictions', 'task_tags', 'task_worker', 'task_spaces', 'timeTable_id']
        
class CommonScheduableTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommonScheduableTask
        fields = ['id', 'name','task_size', 'user_id']
        

class ScheduleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Schedule
        fields = ['id', 'day', 'number', 'schedule_space', 'schedule_worker','timeTable_schedule']
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
        
    # def create(self, validated_data):
    #     user = User.objects.create_user(**validated_data)
    #     return user