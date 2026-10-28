from django.urls import path, include
from .views import ZonaViewSet, MedicionViewSet, AlertaViewSet, RecomendacionViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'zonas', ZonaViewSet)
router.register(r'mediciones', MedicionViewSet)
router.register(r'alertas', AlertaViewSet)
router.register(r'recomendaciones', RecomendacionViewSet)

urlpatterns = [
    path('', include(router.urls)), 
]