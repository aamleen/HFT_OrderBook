// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import api from "../api";
import NavigationBar from "../components/NavigationBar";
import OrderTable from "../components/OrderTable";

function Dashboard() {
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState("REL");

  useEffect(() => {
    // Fetch tokens
    api.get("/orderbook/tokens/").then((res) => setTokens(res.data));
  }, []);


  const [bidOrders, setBidOrders] = useState([]);
  const [askOrders, setAskOrders] = useState([]);

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

  const refresh = () => {
    api.get(`/orderbook/order-book/${selectedToken}/`)
      .then(response => {
        setBidOrders(response.data['bids']);
        setAskOrders(response.data['asks']);
      })
      .catch(error => {
        console.error('Error fetching bid orders:', error);
      });
  };

  const [order_type, setType] = useState("bid");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    const payload = { order_type, price, quantity, token: selectedToken , timestamp: timestamp}; // Replace `1` with dynamic token ID
    try {
      const res = await api.post("/orderbook/place-order/", payload);
    } catch (err) {
      console.error(err);
    }
    // Refresh the order book for the selected token
    api.get(`/orderbook/order-book/${selectedToken}/`)
      .then(response => {
        setBidOrders(response.data['bids']);
        setAskOrders(response.data['asks']);
      })
      .catch(error => {
        console.error('Error fetching bid orders:', error);
      });

  };  

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
        <h1 className="text-center display-4">DashBoard</h1>
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
    </div>

      {/* Create two divs side-by-side, left and right. On the left, show the orderbook and on right show the option to buy/selld */}
      <div className="container-fluid mt-3 pt-3">
        <div className="row pl-5 gx-5">
          <div className="col-md-7 card mx-3">
            <div className="row">            
            {/* ORDER_BOOK Frontend view */}
            <div div className="col-md-10 "> 
            <h2 className="text-center pt-2 pb-3">Order Book</h2>
            </div>
            <div div className="col-md-2  pt-2 pb-3">
            <button class="btn btn-primary" onClick={refresh}><span class="glyphicon glyphicon-refresh"></span> Refresh</button>
            </div>
            </div>
            {/* <a href="#" class="btn btn-info btn-lg">
              <span class="glyphicon glyphicon-refresh"></span> Refresh
            </a> */}
            <div className="row">
              {/* Use OrderTable component for Bid Orders */}
              <OrderTable title="Bid Orders" orders={bidOrders} />

              {/* Use OrderTable component for Ask Orders */}
              <OrderTable title="Ask Orders" orders={askOrders} />
            </div>
          </div>

          {/* ORDER-PLACEMENT frontend */}
          <div className="col-md-4 card mx-3">
            <h2 className="text-center pt-2 pb-3">Buy/Sell</h2>
      
            <form onSubmit={handleSubmit}>
              <div class="mb-3">
                <label for="trade" class="form-label">Trade</label>
                <input type="text" id="trade" class="form-control" disabled="True" placeholder={selectedToken}/>
              </div>
              <div className="mb-3">
              <label htmlFor="order_type" className="form-label">Type:</label>
                <select className="form-control" value={order_type} onChange={(e) => setType(e.target.value)}>
                  <option value="bid">Bid</option>
                  <option value="ask">Ask</option>
                </select>
              </div>
              <div className="mb-3">
              <label htmlFor="price" className="form-label">Price:</label>
                <input className="form-control" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div className="mb-3">
              <label htmlFor="quantity" className="form-label">Quantity:</label>
                <input className="form-control" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
              </div>
              <div className="mb-3">
              <button className="btn btn-primary" type="submit">Place Order</button>
              </div>
            </form>
          </div>
        </div>
    </div>
    </>
  );
}

export default Dashboard;
