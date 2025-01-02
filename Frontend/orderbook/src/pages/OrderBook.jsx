import { useEffect, useState } from "react";
import api from "../api";
import NavigationBar from "../components/NavigationBar";
import OrderTable from "../components/OrderTable";

function OrderBook() {
  const [bidOrders, setBidOrders] = useState([]);
  const [askOrders, setAskOrders] = useState([]);

  useEffect(() => {
    // Fetch Bid data from the Django API
    api.get('/trading/order-book/REL/')
      .then(response => {
        setBidOrders(response.data['bids']);
        setAskOrders(response.data['asks']);
      })
      .catch(error => {
        console.error('Error fetching bid orders:', error);
      });
  }, []);

  return (
    <>
    <NavigationBar />
      <div className="container mt-5 pt-3">
        <h1 className="text-center display-4">DashBoard</h1>
      </div>
    <div className="row">
      {/* Use OrderTable component for Bid Orders */}
      <OrderTable title="Bid Orders" orders={bidOrders} />

      {/* Use OrderTable component for Ask Orders */}
      <OrderTable title="Ask Orders" orders={askOrders} />
    </div>
    </>
  );
};

export default OrderBook;
