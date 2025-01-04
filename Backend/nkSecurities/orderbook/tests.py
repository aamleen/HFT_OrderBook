from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Token, Order, Trade

class TradingAppTests(APITestCase):
    '''Test cases for the trading app to ensure that the APIs are working as expected'''
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username="testuser", password="password123")
        self.token = Token.objects.create(name="Reliance", symbol="REL")

        # Login and get token
        response = self.client.post('/token/', {
            'username': 'testuser',
            'password': 'password123'
        })
        self.access_token = response.data['access']

    def authenticate(self):
        '''Authenticate the client with the access token'''
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

    def test_user_registration(self):
        '''Tests the user registration API'''
        response = self.client.post('/user/register/', {
            'username': 'newuser',
            'password': 'newpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_login(self):
        '''Tests the user login API'''
        response = self.client.post('/token/', {
            'username': 'testuser',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_place_order(self):
        '''Tests the place order API by placing a bid order'''
        self.authenticate()
        response = self.client.post('/orderbook/place-order/', {
            'price': 100.5,
            'quantity': 10,
            'order_type': 'bid',
            'token': self.token.symbol
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)

    def test_get_order_book(self):
        '''Tests the order book API'''
        self.authenticate()
        # Create sample orders
        Order.objects.create(user=self.user, price=100, quantity=10, order_type='ASK', token=self.token)
        Order.objects.create(user=self.user, price=95, quantity=5, order_type='BID', token=self.token)
        
        response = self.client.get(f'/orderbook/order-book/{self.token.symbol}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('bids', response.data)
        self.assertIn('asks', response.data)

    def test_trade_execution(self):
        '''Tests the trade execution logic by placing a bid and ask order'''
        self.authenticate()
        # Create an opposing order
        Order.objects.create(user=self.user, price=100, quantity=10, order_type='ASK', token=self.token)

        # Place a matching bid
        response = self.client.post('/orderbook/place-order/', {
            'price': 100,
            'quantity': 10,
            'order_type': 'bid',
            'token': self.token.symbol
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post('/orderbook/place-order/', {
            'price': 101,
            'quantity': 15,
            'order_type': 'ask',
            'token': self.token.symbol
        }, format='json')
        self.assertEqual(Trade.objects.count(), 1)

    def test_get_trade_history(self):
        '''Tests the trade history API for a token'''
        self.authenticate()
        # Create a sample trade
        trade = Trade.objects.create(
            price=100.00,
            quantity=10,
            bid_user=self.user,
            ask_user=self.user,
            token=self.token
        )

        response = self.client.get(f'/orderbook/trade-history/{self.token.symbol}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(float(response.data[0]['price']), float(trade.price))
