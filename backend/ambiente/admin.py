from django.contrib import admin

# Register your models here.

from .models import Zona, Medicion, Alerta, Recomendacion

admin.site.register(Zona)
admin.site.register(Medicion)
admin.site.register(Alerta)
admin.site.register(Recomendacion)