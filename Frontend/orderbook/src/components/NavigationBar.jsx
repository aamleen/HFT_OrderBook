import { Link } from "react-router-dom";
import { USER_NAME } from "../constants";

function NavigationBar() {
  const username = localStorage.getItem(USER_NAME);

  return (
    
    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-success bg-gradient">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">OrderBook</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link text-light fw-bold active" aria-current="page" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light fw-bold" href="/orderBook">Order Book</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light fw-bold" href="/tradeHistory">Trade History</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light fw-bold" href="/orderPlacement">Buy/Sell</a>
            </li>
          </ul>
        </div>
        {/* <a href="#" class="btn btn-info btn-lg">
          <span class="glyphicon glyphicon-user"></span> User 
        </a> */}
        {/* create dropdown logout button using above glyphicon */}
        <div className="dropdown">
          <button className="btn btn-info btn-lg dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
            <span className="glyphicon glyphicon-user"></span> {username}
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a className="dropdown-item" href="/logout">Logout</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
