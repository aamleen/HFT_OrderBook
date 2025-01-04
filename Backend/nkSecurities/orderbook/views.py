from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from .models import Token, Order, Trade
from .serializers import TokenSerializer, OrderSerializer, TradeSerializer, UserSerializer
from rest_framework import generics, viewsets
from django.contrib.auth.models import User


class TokenListView(APIView):
    '''List all Trade tokens'''
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tokens = Token.objects.all()
        serializer = TokenSerializer(tokens, many=True)
        return Response(serializer.data)

class OrderBookView(APIView):
    '''List all bid and ask orders for a token'''
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    def get(self, request, symbol):
        '''GET request to get all bid and ask orders for a token'''
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
    '''Place an order'''
    permission_classes = [IsAuthenticated]
    # serializer_class = OrderSerializer
    # queryset = Order.objects.all()
    def post(self, request):
        '''POST request to place an order, after checking if the order is valid'''
        # print the user who is placing the order. Request does not have user field
        print('Request made by: ', self.request.user)

        try:
            token = Token.objects.get(symbol=request.data['token'])
            request.data['token'] = token.id
        except Token.DoesNotExist:
            return Response({"error": "Token not found"}, status=HTTP_400_BAD_REQUEST)

        # add user field to the request data, after authentication to get the user who is placing the order
        request.data['user'] = self.request.user        

        # check if the order is valid
        if not self.check_order(request):
            return Response({"error": "Invalid order"}, status=HTTP_400_BAD_REQUEST)
        
        try:
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
        except Exception as e:
            print(e)
            return Response({"error": "Internal Server Error"}, status=HTTP_400_BAD_REQUEST)
    
    def check_order(self, request):
        '''Check if the order is valid'''
        try:
            if float(request.data['price']) <= 0.0:
                print('Price is less than 0')
                return False
            # check if quantity is float or negative
            if float(request.data['quantity']) <= 0.0 or not float(request.data['quantity']).is_integer():
                print('Quantity is less than 0 or not an integer')
                return False
            if request.data['order_type'] not in ['bid', 'ask']:
                print('Order type is not bid or ask')
                return False
            return True
        except Exception as e:
            print(e)
            return False

    def match_orders(self, order):
        '''Match orders logic'''
        try:
            # Get all orders that can be matched, based on the order type and then sort them by price and timestamp
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

            executed_trades = [] # List to store executed trades by the current order

            for match in matches:
                trade_qty = min(order.quantity, match.quantity)

                # Create Trade as per the order type to decide the bid_user and ask_user
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

            # Save the order if quantity is left, else delete the order
            if order.quantity > 0:
                order.save()
            else:
                order.delete()
            
            return executed_trades
        except Exception as e:
            print(e)
            return []

class TradeHistoryView(APIView):
    '''List all trades for a token'''
    permission_classes = [IsAuthenticated]
    def get(self, request, symbol):
        '''GET request to get all trades for a token'''
        try:
            token = Token.objects.get(symbol=symbol)
        except Token.DoesNotExist:
            return Response({"error": "Token not found"}, status=HTTP_400_BAD_REQUEST)

        try:
            trades = Trade.objects.filter(token=token).order_by('-timestamp')
            serializer = TradeSerializer(trades, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({"error": "Internal Server Error"}, status=HTTP_400_BAD_REQUEST)
    
class TradeHistoryUserView(APIView):
    '''List all trades: bid and ask both, for a user'''
    permission_classes = [IsAuthenticated]
    def get(self, request):
        '''GET request to get all trades for a user'''
        try:
            user = User.objects.get(username=self.request.user)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=HTTP_400_BAD_REQUEST)
        
        try:
            trades_bid = Trade.objects.filter(bid_user=user).order_by('-timestamp')
            trades_ask = Trade.objects.filter(ask_user=user).order_by('-timestamp')
            trades = trades_bid | trades_ask
            serializer = TradeSerializer(trades, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({"error": "Internal Server Error"}, status=HTTP_400_BAD_REQUEST)    

class CreateUserView(generics.CreateAPIView):
    '''View to Register a new user'''
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]