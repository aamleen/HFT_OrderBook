from django.urls import path
from .views import TokenListView, OrderBookView, PlaceOrderView, TradeHistoryView, TradeHistoryUserView

urlpatterns = [
    path('tokens/', TokenListView.as_view(), name='token-list'),
    path('order-book/<symbol>/', OrderBookView.as_view(), name='order-book'),
    path('place-order/', PlaceOrderView.as_view(), name='place-order'),
    path('trade-history/<symbol>/', TradeHistoryView.as_view(), name='trade-history'),
    path('trade-history/', TradeHistoryUserView.as_view(), name='trade-history-user'),
]