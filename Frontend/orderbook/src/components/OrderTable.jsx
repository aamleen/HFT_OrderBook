import React from 'react';

const OrderTable = ({ title, orders, bg_mode }) => {
  // This component displays a table of orders with columns for price, quantity, user, and total. Used in the OrderBook component to display the buy and sell orders.
  return (
    <div className={`col card bg-${bg_mode} mx-3 pb-3`}>
      <h2>{title}</h2>
      <table className="table table-striped table-hover table-bordered">
        <thead>
          <tr>
            <th>Price</th>
            <th>Quantity</th>
            <th>User</th>
            {/* <th>Total</th> */}
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={index}>
                <td>{order.price}</td>
                <td>{order.quantity}</td>
                <td>{order.user['username']}</td>
                {/* <td>{order.total}</td> */}
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
  );
};

export default OrderTable;
