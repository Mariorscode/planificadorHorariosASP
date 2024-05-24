from rest_framework.routers import DefaultRouter 
from .views import TurnViewSet, WorkerViewSet, TimeTableViewSet, SpaceViewSet, CommonSpaceViewSet, TagViewSet, ScheduableTaskViewSet, scheduleViewSet, userViewSet

router = DefaultRouter()

router.register(prefix='turns', basename='turns', viewset=TurnViewSet)
router.register(prefix='workers', basename='workers', viewset=WorkerViewSet)
router.register(prefix='timetables', basename='timetables', viewset=TimeTableViewSet)
router.register(prefix='spaces', basename='spaces', viewset=SpaceViewSet)
router.register(prefix='commonspaces', basename='commonspaces', viewset=CommonSpaceViewSet)
router.register(prefix='tags', basename='tags', viewset=TagViewSet)
router.register(prefix='scheduabletasks', basename='scheduabletasks', viewset=ScheduableTaskViewSet)
router.register(prefix='schedules', basename='schedules', viewset=scheduleViewSet)
router.register(prefix='users', basename='users', viewset=userViewSet)

