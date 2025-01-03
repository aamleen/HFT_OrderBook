import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/DashBoard"
import OrderBook from "./pages/OrderBook"
import OrderPlacement from "./pages/OrderPlacement"
import TradeHistory from "./pages/TradeHistory"
import ProtectedRoute from "./components/ProtectedRoute"
import NotFound from "./components/NotFound"
import NavigationBar from "./components/NavigationBar"
// import css
// import "./App.css"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {

  // add background color to the body
  // document.body.style.backgroundColor = "#f8f9fa";
  document.body.style = 'background: #d5d8dc;';


  return (
    <BrowserRouter>
      <Routes>
        {/* Home DashBoard Page */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />            
            </ProtectedRoute>
          }
        />

        {/* Detailed OrderBook Page */}
        <Route
          path="/orderBook"
          element={
            <ProtectedRoute>
              <OrderBook />
            </ProtectedRoute>
          }
        />

        {/* Page to Bid/Ask Trade */}
        <Route
          path="/orderPlacement"
          element={
            <ProtectedRoute>
              <OrderPlacement />
            </ProtectedRoute>
          }
        />

        {/* Page to view personal Trade History */}
        <Route
          path="/tradeHistory"
          element={
            <ProtectedRoute>
              <TradeHistory />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/" element={<Dashboard />} />
        <Route path="/orderBook" element={<OrderBook />} />
        <Route path="/orderPlacement" element={<OrderPlacement />} />
        <Route path="/tradeHistory" element={<TradeHistory />} />        */}

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;