// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import api from "../api";
import NavigationBar from "../components/NavigationBar";
import OrderTable from "../components/OrderTable";

function Dashboard() {
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState("REL");
  const [tradeHistory, setTradeHistory] = useState([]);
  const [executedTrades, setExecutedTrades] = useState([]);
  // const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Fetch tokens
    api.get("/orderbook/tokens/").then((res) => setTokens(res.data));
  }, []);


  const [bidOrders, setBidOrders] = useState([]);
  const [askOrders, setAskOrders] = useState([]);  

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

  useEffect(() => {
    // Fetch Bid data from the Django API
    refresh();
  }, []);

  const [order_type, setType] = useState("bid");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    const payload = { order_type, price, quantity, token: selectedToken , timestamp: timestamp}; // Replace `1` with dynamic token ID
    try {
      const res = await api.post("/orderbook/place-order/", payload);
      console.log(res.data);
      setExecutedTrades([...executedTrades, ...res.data]);  
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
      {/* Div to show the selected trade */}
    <div className="container mt-3">
      <h3 className="text-bg-light">{selectedToken}</h3>
    </div>
    </div>

    

      {/* Create two divs side-by-side, left and right. On the left, show the orderbook and on right show the option to buy/selld */}
      <div className="container-fluid mt-3 pt-3">
        <div className="row pl-5 gx-5">
          <div className="col-md-7 card shadow p-3 mb-5 bg-body rounded mx-3">
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
              <OrderTable title="Bid Orders" orders={bidOrders} bg_mode={"danger"}/>

              {/* Use OrderTable component for Ask Orders */}
              <OrderTable title="Ask Orders" orders={askOrders} bg_mode={"success"}/>
            </div>
          </div>

          {/* ORDER-PLACEMENT frontend */}
          <div className="col-md-4 card shadow p-3 mb-5 mx-3  rounded bg-warning bg-gradient" >
            <h2 className="text-center pt-2 pb-3">Buy/Sell</h2>
      
            <form onSubmit={handleSubmit}>
              <div class="mb-3">
                <label for="trade" class="form-label fw-bold">Trade</label>
                <input type="text" id="trade" class="form-control" disabled="True" placeholder={selectedToken}/>
              </div>
              <div className="mb-3">
              <label htmlFor="order_type" className="form-label fw-bold">Type:</label>
                <select className="form-control" value={order_type} onChange={(e) => setType(e.target.value)}>
                  <option value="bid">Bid</option>
                  <option value="ask">Ask</option>
                </select>
              </div>
              <div className="mb-3">
              <label htmlFor="price" className="form-label fw-bold">Price:</label>
                <input className="form-control" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div className="mb-3">
              <label htmlFor="quantity" className="form-label fw-bold">Quantity:</label>
                <input className="form-control" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
              </div>
              <div className="mb-3">
              <button className="btn btn-primary  fw-bolder" type="submit">Place Order</button>
              </div>
            </form>
          </div>
        </div>
        {/* EXECUTED-ORDERS row, below orderbook and buy/sell */}
        <div className="row mt-5 gx-5">
          <div className="col-md-11 card shadow p-3 mb-5 bg-body rounded mx-3">
          <table className="table table-striped table-hover table-bordered table-info">
            <thead>
              <tr>
                <th>Token</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Timestamp</th>
                <th>Bid User</th>
                <th>Ask User</th>
              </tr>
            </thead>
            <tbody>
              {executedTrades.length > 0 ? (
                  executedTrades.map((order, index) => (
                      <tr key={index}>
                      <td>{order.token}</td>
                      <td>{order.price}</td>
                      <td>{order.quantity}</td>
                      <td>{order.timestamp}</td>
                      <td>{order.bid_user}</td>
                      <td>{order.ask_user}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No orders available</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
    
      </div>
    </div>
    </>
  );
}

export default Dashboard;
