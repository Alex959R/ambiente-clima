from rest_framework import serializers
from .models import Alerta, Medicion, Recomendacion, Zona


class ZonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zona
        fields = "__all__"


class MedicionSerializer(serializers.ModelSerializer):

    medicion_zona = serializers.CharField(source="zona.nombre_de_zona", read_only=True)

    class Meta:
        model = Medicion
        fields = "__all__"


class AlertaSerializer(serializers.ModelSerializer):

    alerta_zona = serializers.CharField(source="zona.nombre_de_zona", read_only=True)

    class Meta:

        model = Alerta
        fields = "__all__"


class RecomendacionSerializer(serializers.ModelSerializer):

    class Meta:

        model = Recomendacion
        fields = "__all__"
