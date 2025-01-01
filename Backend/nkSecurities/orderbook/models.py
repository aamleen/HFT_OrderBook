from django.contrib.auth.models import User
from django.db import models

class Order(models.Model):
    ORDER_TYPE_CHOICES = [
        ('bid', 'Bid'),
        ('ask', 'Ask'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    order_type = models.CharField(max_length=3, choices=ORDER_TYPE_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order_type.upper()} - {self.price} x {self.quantity}"

class Trade(models.Model):
    bid_user = models.ForeignKey(User, related_name='bid_trades', on_delete=models.CASCADE)
    ask_user = models.ForeignKey(User, related_name='ask_trades', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trade: {self.price} x {self.quantity}"
    
    
class Token(models.Model):
    name = models.CharField(max_length=50, unique=True)
    symbol = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.symbol
