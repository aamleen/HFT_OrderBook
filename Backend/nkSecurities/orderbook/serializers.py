from rest_framework import serializers
from .models import Order, Trade
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'user', 'price', 'quantity', 'order_type', 'timestamp']
        extra_kwargs = {
            'user': {'read_only': True},
        }

class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = ['id', 'bid_user', 'ask_user', 'price', 'quantity', 'timestamp']
        extra_kwargs = {
            'bid_user': {'read_only': True},
            'ask_user': {'read_only': True},
        }
