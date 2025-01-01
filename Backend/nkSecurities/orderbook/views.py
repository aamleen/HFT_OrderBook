from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from .models import Token, Order, Trade
from .serializers import TokenSerializer, OrderSerializer, TradeSerializer, UserSerializer
from rest_framework import generics, viewsets
from django.contrib.auth.models import User


class TokenListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        tokens = Token.objects.all()
        serializer = TokenSerializer(tokens, many=True)
        print(serializer.data)
        return Response(serializer.data)

class OrderBookView(APIView):
    permission_classes = [AllowAny]
    serializer_class = OrderSerializer
    def get(self, request, symbol):
        try:
            token = Token.objects.get(symbol=symbol)
        except Token.DoesNotExist:
            return Response({"error": "Token not found"}, status=HTTP_400_BAD_REQUEST)

        bids = Order.objects.filter(token=token, order_type='bid').order_by('-price')
        asks = Order.objects.filter(token=token, order_type='ask').order_by('price')
        return Response({
            "bids": OrderSerializer(bids, many=True).data,
            "asks": OrderSerializer(asks, many=True).data
        })
    
class PlaceOrderView(APIView):
    permission_classes = [AllowAny]
    # serializer_class = OrderSerializer
    # queryset = Order.objects.all()
    def post(self, request):
        # print the user who is placing the order. Request does not have user field
        print('Request made by: ',self.request.user)

        try:
            token = Token.objects.get(symbol=request.data['token'])
            request.data['token'] = token.id
        except Token.DoesNotExist:
            return Response({"error": "Token not found"}, status=HTTP_400_BAD_REQUEST)

        # add user field to the request data
        request.data['user'] = self.request.user

        serializer = OrderSerializer(data=request.data)
        # print(request.data)
        if serializer.is_valid():
            user = User.objects.get(username=self.request.user)
            order = serializer.save(user=user)

            # Match Orders Logic
            executed_trades = self.match_orders(order)
            # return Response(serializer.data, status=HTTP_201_CREATED)
            return Response(TradeSerializer(executed_trades, many=True).data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def match_orders(self, order):
        if order.order_type == 'bid':
            matches = Order.objects.filter(
                token=order.token,
                order_type='ask',
                price__gte=order.price
            ).order_by('price', 'timestamp')
        else:
            matches = Order.objects.filter(
                token=order.token,
                order_type='bid',
                price__lte=order.price
            ).order_by('-price', 'timestamp')

        executed_trades = []

        for match in matches:
            trade_qty = min(order.quantity, match.quantity)

            # Create Trade
            if order.order_type == 'bid':
                trade = Trade.objects.create(
                    token=order.token,
                    price=match.price,
                    quantity=trade_qty,
                    bid_user=order.user,
                    ask_user=match.user,
                )
            else:
                trade = Trade.objects.create(
                    token=order.token,
                    price=match.price,
                    quantity=trade_qty,
                    bid_user=match.user,
                    ask_user=order.user,
                )

            executed_trades.append(trade)

            # Adjust quantities
            match.quantity -= trade_qty
            order.quantity -= trade_qty

            if match.quantity == 0:
                match.delete()
            else:
                match.save()

            if order.quantity == 0:
                break

        if order.quantity > 0:
            order.save()
        else:
            order.delete()
        
        return executed_trades

# class PlaceOrderView(APIView):
#     permission_classes = [AllowAny]


#     def post(self, request):
#         serializer = OrderSerializer(data=request.data)
#         if serializer.is_valid():
#             order = serializer.save(user=request.user)

#             # Match Orders Logic
#             self.match_orders(order)
#             return Response(serializer.data, status=HTTP_201_CREATED)
#         return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

#     def match_orders(self, order):
#         opposite_type = 'ask' if order.order_type == 'bid' else 'bid'
#         matches = Order.objects.filter(
#             token=order.token,
#             order_type=opposite_type,
#             price__lte=order.price if order.order_type == 'bid' else order.price,
#         ).order_by('timestamp')

#         for match in matches:
#             trade_qty = min(order.quantity, match.quantity)

#             # Create Trade
#             Trade.objects.create(
#                 token=order.token,
#                 price=match.price,
#                 quantity=trade_qty,
#                 bid_user=order.user if order.order_type == 'bid' else match.user,
#                 ask_user=match.user if order.order_type == 'ask' else order.user,
#             )

#             # Adjust quantities
#             match.quantity -= trade_qty
#             order.quantity -= trade_qty

#             if match.quantity == 0:
#                 match.delete()
#             else:
#                 match.save()

#             if order.quantity == 0:
#                 break

#         if order.quantity > 0:
#             order.save()

class TradeHistoryView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, symbol):
        try:
            token = Token.objects.get(symbol=symbol)
        except Token.DoesNotExist:
            return Response({"error": "Token not found"}, status=HTTP_400_BAD_REQUEST)

        trades = Trade.objects.filter(token=token).order_by('-timestamp')
        serializer = TradeSerializer(trades, many=True)
        return Response(serializer.data)
    
class TradeHistoryUserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            user = User.objects.get(username=self.request.user)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=HTTP_400_BAD_REQUEST)
        trades = Trade.objects.filter(bid_user=request.user).order_by('-timestamp')
        serializer = TradeSerializer(trades, many=True)
        return Response(serializer.data)
    

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]