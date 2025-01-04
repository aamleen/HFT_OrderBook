// src/pages/TradeHistory.js
import { useEffect, useState } from "react";
import api from "../api";
import NavigationBar from "../components/NavigationBar";

function TradeHistory() {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [error, setError] = useState(null);

  const handleError = (error, error_msg) => {
    if (error.response && error.response.data) {
      setError(error.response.data.error || error_msg);
    } else {
      setError('An unexpected error occurred. Please try again later.');
    }
    // set timeout to clear the error message
    setTimeout(() => {
      setError(null);
    }, 1000
    );
  };

  useEffect(() => {
    // Fetch user's trade history
    api.get("/orderbook/trade-history/").then((res) => setTradeHistory(res.data)).catch(error => {
      handleError(error, 'Error fetching trade history:');
    });
  }, []);

  return (
    <>
      <NavigationBar />
      <div className="container mt-5 pt-3 pb-3">
      {error && (
            <div className="alert alert-warning" role="alert">
                <strong>Warning!</strong> {error}
            </div>
        )}
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
