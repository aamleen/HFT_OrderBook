import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/DashBoard"
import OrderBook from "./pages/OrderBook"
import TradeHistory from "./pages/TradeHistory"
import OrderPlacement from "./pages/OrderPlacement"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/orderBook" element={<OrderBook />} />
        <Route path="/tradeHistory" element={<TradeHistory />} />
        <Route path="/orderPlacement" element={<OrderPlacement />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App