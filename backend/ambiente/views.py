from rest_framework import viewsets
from .models import Alerta, Medicion, Recomendacion, Zona
from .serializers import AlertaSerializer, MedicionSerializer, RecomendacionSerializer, ZonaSerializer

# Create your views here.

class ZonaViewSet(viewsets.ModelViewSet):
    queryset = Zona.objects.all().order_by('nombre_de_zona')
    serializer_class = ZonaSerializer

class MedicionViewSet(viewsets.ModelViewSet):
    queryset = Medicion.objects.all().order_by('fecha_y_hora')
    serializer_class = MedicionSerializer

class AlertaViewSet(viewsets.ModelViewSet):
    queryset = Alerta.objects.all().order_by('fecha_y_hora')
    serializer_class = AlertaSerializer

class RecomendacionViewSet(viewsets.ModelViewSet):
    queryset = Recomendacion.objects.all().order_by('fecha_y_hora')   
    serializer_class = RecomendacionSerializer