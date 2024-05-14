from rest_framework import serializers
from .models import Turn, Worker, Space, Tag, ScheduableTask

class TurnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turn
        fields = ['id', 'day', 'start_time', 'is_free_time']

class WorkerSerializer(serializers.ModelSerializer):
    worker_restrictions = TurnSerializer(many=True, read_only=True)
    worker_restrictions_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Turn.objects.all(), write_only=True
    )

    class Meta:
        model = Worker
        fields = ['id', 'name', 'worker_restrictions', 'worker_restrictions_ids']

    def create(self, validated_data):
        worker_restrictions = validated_data.pop('worker_restrictions_ids', [])
        worker = Worker.objects.create(**validated_data)
        worker.worker_restrictions.set(worker_restrictions)
        return worker

    def update(self, instance, validated_data):
        worker_restrictions = validated_data.pop('worker_restrictions_ids', [])
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        instance.worker_restrictions.set(worker_restrictions)
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
