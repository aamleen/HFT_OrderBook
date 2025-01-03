// src/pages/TradeHistory.js
import { useEffect, useState } from "react";
import api from "../api";
import NavigationBar from "../components/NavigationBar";

function TradeHistory() {
  const [tradeHistory, setTradeHistory] = useState([]);

  useEffect(() => {
    // Fetch user's trade history
    api.get("/orderbook/trade-history/").then((res) => setTradeHistory(res.data)); // Replace `1` with dynamic user/token ID
  }, []);

  return (
    <>
      <NavigationBar />
      <div className="container mt-5 pt-3 pb-3">
        <h1 className="text-center display-4">My Trade History</h1>
      </div>

      <div className="col card mx-3">
      <table className="table table-striped table-hover table-bordered">
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
          {tradeHistory.length > 0 ? (
              tradeHistory.map((order, index) => (
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
    </>
  );
}

export default TradeHistory;
