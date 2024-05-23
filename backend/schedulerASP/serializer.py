from rest_framework import serializers
from .models import Turn, Worker, Space, Tag, ScheduableTask, TimeTable, Schedule, User 

# class TurnSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Turn
#         fields = ['id', 'day', 'startTime', 'is_free_time']

# class WorkerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Worker
#         fields = ['id', 'name', 'restrictionsWorker']
        
#     # restrictionsWorker = TurnSerializer(many=True, read_only=True)
#     # restrictionsWorker_ids = serializers.PrimaryKeyRelatedField(
#     #     many=True, queryset=Turn.objects.all(), write_only=True, required=False
#     # )


#     # def create(self, validated_data):
#     #     turns_data = validated_data.pop('restrictionsWorker_ids', [])
#     #     worker = Worker.objects.create(**validated_data)
#     #     worker.restrictionsWorker.add(*turns_data)
#     #     return worker

#     # def update(self, instance, validated_data):
#     #     restrictionsWorker = validated_data.pop('restrictionsWorker_ids', [])
#     #     instance.name = validated_data.get('name', instance.name)
#     #     instance.save()
#     #     instance.restrictionsWorker.set(restrictionsWorker)
#     #     return instance

# class SpaceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Space
#         fields = ['id', 'name', 'space_capacity', 'space_restrictions']

# class TagSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Tag
#         fields = ['id', 'name']

# class ScheduableTaskSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ScheduableTask
#         fields = ['id', 'name', 'task_size', 'task_restrictions', 'task_tags', 'task_workers', 'task_spaces']


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
        fields = ['id', 'name', 'restrictionsWorker']

class SpaceSerializer(serializers.ModelSerializer):
    # restrictionsSpace = TurnSerializer(many=True, read_only=True)

    class Meta:
        model = Space
        fields = ['id', 'name', 'space_capacity', 'restrictionsSpace', 'user_id']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class ScheduableTaskSerializer(serializers.ModelSerializer):
    # task_restrictions = TurnSerializer(many=True, read_only=True)
    # task_tags = TagSerializer(many=True, read_only=True)
    # task_worker = WorkerSerializer(read_only=True)
    # task_spaces = SpaceSerializer(read_only=True)

    class Meta:
        model = ScheduableTask
        fields = ['id', 'name', 'task_size', 'task_restrictions', 'task_tags', 'task_worker', 'task_spaces']
        

class ScheduleSerializer(serializers.ModelSerializer):
    # turn_schedule = TurnSerializer(read_only=True)
    # space_schedule = SpaceSerializer(read_only=True)
    # worker_schedule = WorkerSerializer(read_only=True)
    # timeTable_schedule = TimeTableSerializer(read_only=True)

    class Meta:
        model = Schedule
        fields = ['id', 'day', 'number', 'schedule_space', 'schedule_worker','timeTable_schedule']
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user