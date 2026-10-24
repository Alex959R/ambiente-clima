from django.db import models


# Create your models here.
class Zona(models.Model):
    nombre_de_zona = models.CharField(max_length=100, unique=True)
    municipio = models.CharField(max_length=100)
    descripcion = models.TextField()
    tipo = models.CharField(
        max_length=50, choices=[("urbana", "Urbana"), ("rural", "Rural")]
    )
    activa = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre_de_zona


class Medicion(models.Model):
    tipo = models.CharField(
        max_length=100,
        choices=[
            ("temperatura", "Temperatura"),
            ("calidad_del_aire", "Calidad del aire"),
            ("lluvia", "Lluvia"),
            ("ruido", "Ruido"),
        ],
    )
    valor = models.FloatField()
    unidad = models.CharField(max_length=50)
    fecha_y_hora = models.DateTimeField()

    zona = models.ForeignKey(Zona, on_delete=models.PROTECT, related_name="mediciones")

    def __str__(self):
        return self.tipo


class Alerta(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    nivel = models.CharField(
        max_length=50, choices=[("bajo", "Bajo"), ("medio", "Medio"), ("alto", "Alto")]
    )
    estado = models.CharField(
        max_length=50, choices=[("activa", "Activa"), ("resuelta", "Resuelta")]
    )
    fecha_y_hora = models.DateTimeField(auto_now_add=True)

    zona = models.ForeignKey(Zona, on_delete=models.PROTECT, related_name="alertas")
    medicion = models.ForeignKey(
        Medicion,
        on_delete=models.SET_NULL,
        null=True,
        related_name="alertas",
        blank=True,
    )

    def __str__(self):
        return self.titulo


class Recomendacion(models.Model):
    texto = models.TextField()
    origen = models.CharField(
        max_length=50, choices=[("manual", "Manual"), ("ia", "IA")]
    )
    fecha_y_hora = models.DateTimeField(auto_now_add=True)

    medicion = models.ForeignKey(
        Medicion, on_delete=models.CASCADE, related_name="recomendaciones"
    )

    def __str__(self):
        return self.texto
