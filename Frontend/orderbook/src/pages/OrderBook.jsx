import { useEffect, useState } from "react";
import api from "../api";
import NavigationBar from "../components/NavigationBar";
import OrderTable from "../components/OrderTable";

function OrderBook() {
  const [bidOrders, setBidOrders] = useState([]);
  const [askOrders, setAskOrders] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState("REL");

  useEffect(() => {
      // Fetch tokens
      api.get("/orderbook/tokens/").then((res) => setTokens(res.data));
    }, []);

  useEffect(() => {
    // Fetch Bid data from the Django API
    api.get(`/orderbook/order-book/${selectedToken}/`)
      .then(response => {
        setBidOrders(response.data['bids']);
        setAskOrders(response.data['asks']);
      })
      .catch(error => {
        console.error('Error fetching bid orders:', error);
      });
  }, []);

  // Function to handle dropdown item click
    const handleDropDownClick = (item) => {
      setSelectedToken(item);
      api.get(`/orderbook/order-book/${item}/`)
        .then(response => {
          setBidOrders(response.data['bids']);
          setAskOrders(response.data['asks']);
        })
        .catch(error => {
          console.error('Error fetching bid orders:', error);
        });    
    };  

  return (
    <>
    <NavigationBar />
      <div className="container mt-5 pt-3">
        <h1 className="text-center display-4">OrderBook</h1>
      </div>
      <div className="btn-group px-5">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Select Trade
      </button>
      <ul className="dropdown-menu">
        {tokens.map((item) => (
          <li key={item.id}>
            <a className="dropdown-item" onClick={() => handleDropDownClick(item.symbol)}>
              {item.symbol} {/* Adjust according to your item structure */}
            </a>
          </li>
        ))}
      </ul>
      {/* Div to show the selected trade */}
    <div className="container mt-3">
      <h3 className="text-bg-light">{selectedToken}</h3>
    </div>
    </div>
    <div className="row mt-5">
      {/* Use OrderTable component for Bid Orders */}
      <OrderTable title="Bid Orders" orders={bidOrders} bg_mode={"danger"}/>

      {/* Use OrderTable component for Ask Orders */}
      <OrderTable title="Ask Orders" orders={askOrders} bg_mode={"success"}/>
    </div>
    </>
  );
};

export default OrderBook;
