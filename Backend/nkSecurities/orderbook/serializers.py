from rest_framework import serializers
from .models import Order, Trade, Token
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )
        return user

class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True, many=False)
    class Meta:
        model = Order
        fields = ['id', 'user', 'price', 'quantity', 'order_type', 'timestamp', 'token']
        extra_kwargs = {
            'user': {'read_only': True},
        }

class TradeSerializer(serializers.ModelSerializer):
    bid_user = serializers.CharField(
        source="bid_user.username", read_only=True)
    ask_user = serializers.CharField(
        source="ask_user.username", read_only=True)
    class Meta:
        model = Trade
        fields = ['id', 'bid_user', 'ask_user', 'price', 'quantity', 'timestamp', 'token']
        extra_kwargs = {
            'bid_user': {'read_only': True},
            'ask_user': {'read_only': True},
        }

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ['name', 'symbol']