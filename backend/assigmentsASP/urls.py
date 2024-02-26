# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('solve/', views.solve_program, name='solve_program'),
]
