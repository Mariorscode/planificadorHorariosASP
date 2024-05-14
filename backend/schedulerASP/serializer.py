from rest_framework import serializers
from .models import Turn, Worker, Space, Tag, ScheduableTask

class TurnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turn
        fields = ['id', 'day', 'startTime', 'is_free_time']

class WorkerSerializer(serializers.ModelSerializer):
    restrictionsWorker = TurnSerializer(many=True, read_only=True)
    restrictionsWorker_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Turn.objects.all(), write_only=True, required=False
    )

    class Meta:
        model = Worker
        fields = ['id', 'name', 'restrictionsWorker', 'restrictionsWorker_ids']

    def create(self, validated_data):
        turns_data = validated_data.pop('restrictionsWorker_ids', [])
        worker = Worker.objects.create(**validated_data)
        worker.restrictionsWorker.add(*turns_data)
        return worker

    def update(self, instance, validated_data):
        restrictionsWorker = validated_data.pop('restrictionsWorker_ids', [])
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        instance.restrictionsWorker.set(restrictionsWorker)
        return instance

class SpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = ['id', 'name', 'space_capacity', 'space_restrictions']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class ScheduableTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduableTask
        fields = ['id', 'name', 'task_size', 'task_restrictions', 'task_tags', 'task_workers', 'task_spaces']
