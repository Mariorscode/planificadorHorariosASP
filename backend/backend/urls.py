"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
# from eventos.api.router import router_evento
from schedulerASP.router import router
# from AssigmentsASP import AssigmentsASP


urlpatterns = [
    path('admin/', admin.site.urls),
    # path('horarios/', include('horariosASP.urls')),
    # path('eventos/', include(router_evento.urls)),
    # path('assigmentsASP/', include('assigmentsASP.urls')),
    path('schedulerASP/', include(router.urls)),
]

# urlpatterns = [
#     path('turns/', views.TurnList.as_view(), name='turn-list'),
#     path('turns/<int:pk>/', views.TurnDetail.as_view(), name='turn-detail'),
#     path('workers/', views.WorkerList.as_view(), name='worker-list'),
#     path('workers/<int:pk>/', views.WorkerDetail.as_view(), name='worker-detail'),
#     path('spaces/', views.SpaceList.as_view(), name='space-list'),
#     path('spaces/<int:pk>/', views.SpaceDetail.as_view(), name='space-detail'),
#     path('tags/', views.TagList.as_view(), name='tag-list'),
#     path('tags/<int:pk>/', views.TagDetail.as_view(), name='tag-detail'),
#     path('scheduable-tasks/', views.ScheduableTaskList.as_view(), name='scheduable-task-list'),
#     path('scheduable-tasks/<int:pk>/', views.ScheduableTaskDetail.as_view(), name='scheduable-task-detail'),
# ]

