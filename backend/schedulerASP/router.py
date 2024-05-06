from rest_framework.routers import DefaultRouter 
from .views import TurnViewSet, WorkerViewSet, SpaceViewSet, TagViewSet, ScheduableTaskViewSet

router = DefaultRouter()

router.register(prefix='turns', basename='turns', viewset=TurnViewSet)
router.register(prefix='workers', basename='workers', viewset=WorkerViewSet)
router.register(prefix='spaces', basename='spaces', viewset=SpaceViewSet)
router.register(prefix='tags', basename='tags', viewset=TagViewSet)
router.register(prefix='scheduable_tasks', basename='scheduable_tasks', viewset=ScheduableTaskViewSet)
