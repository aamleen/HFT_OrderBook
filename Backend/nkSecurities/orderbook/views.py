from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from .models import Token, Order, Trade
from .serializers import TokenSerializer, OrderSerializer, TradeSerializer, UserSerializer
from rest_framework import generics
from django.contrib.auth.models import User


class TokenListView(APIView):
    def get(self, request):
        tokens = Token.objects.all()
        serializer = TokenSerializer(tokens, many=True)
        return Response(serializer.data)
  

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
