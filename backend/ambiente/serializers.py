from django.utils import timezone
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

    def validate_fecha_y_hora(self, value):
        if value > timezone.now():
            raise serializers.ValidationError(
                "la fecha y hora no puede ser del futuro "
            )
        return value

    def validate(self, data):
        tipo = data.get("tipo")
        valor = data.get("valor")
        if self.instance:
            if tipo is None:
                tipo = self.instance.tipo
            if valor is None:
                valor = self.instance.valor

        if tipo == "temperatura" and not (-50 <= valor <= 50):
            raise serializers.ValidationError(
                {
                    "valor": "El valor de temperatura debe estar entre -50 y 50 grados Celsius."
                }
            )
        elif tipo == "calidad_del_aire" and not (
            0 <= valor <= 500
        ):
            raise serializers.ValidationError(
                {"valor": "El valor de calidad del aire debe estar entre 0 y 500 AQI."}
            )
        elif tipo == "lluvia" and not (0 <= valor <= 100):
            raise serializers.ValidationError(
                {"valor": "El valor de lluvia debe estar entre 0 y 100 mm."}
            )
        elif tipo == "ruido" and not (0 <= valor <= 150):
            raise serializers.ValidationError(
                {"valor": "El valor de ruido debe estar entre 0 y 150 dB."}
            )
        return data


class AlertaSerializer(serializers.ModelSerializer):

    alerta_zona = serializers.CharField(source="zona.nombre_de_zona", read_only=True)

    class Meta:

        model = Alerta
        fields = "__all__"


class RecomendacionSerializer(serializers.ModelSerializer):

    class Meta:

        model = Recomendacion
        fields = "__all__"
