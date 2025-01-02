import { useState } from "react";
import api from "../api";
import NavigationBar from "../components/NavigationBar";

function OrderPlacement() {
  const [order_type, setType] = useState("bid");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    print(timestamp);
    const payload = { order_type, price, quantity, token , timestamp: timestamp}; 
    try {
      const res = await api.post("/orderbook/place-order/", payload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="container mt-5 pt-3 pb-3">
        <h1 className="text-center display-4">Order Placement</h1>
      </div>

      <div className="container mt-5 pt-3 pb-3">
      <form onSubmit={handleSubmit}>
      <div className="mb-3 px-3">
        <label for="token" class="form-label">Trade Token</label>
        <input type="text" class="form-control" onChange={(e) => setToken(e.target.value)} value={token} required />
      </div>
      <div className="mb-3 px-3">
      <label htmlFor="order_type" className="form-label">Type:</label>
        <select className="form-control" value={order_type} onChange={(e) => setType(e.target.value)}>
          <option value="bid">Bid</option>
          <option value="ask">Ask</option>
        </select>
      </div>
      <div className="mb-3 px-3">
      <label htmlFor="price" className="form-label">Price:</label>
        <input className="form-control" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div className="mb-3 px-3">
      <label htmlFor="quantity" className="form-label">Quantity:</label>
        <input className="form-control" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
      </div>
      <button type="submit">Place Order</button>
    </form>
    </div>
    </>
  );
}

export default OrderPlacement;
