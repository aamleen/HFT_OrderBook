from django.contrib import admin
from .models import Token, Order, Trade

# Register your models here.
admin.site.register(Token)
admin.site.register(Order)
admin.site.register(Trade)