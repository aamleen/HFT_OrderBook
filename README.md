# nkSecurities Orderbook System

A full-stack trading platform enabling users to view order books, place trades, and manage trade history for selected tokens.

---

## Features

### Backend (`nkSecurities`)
- **User Management**: Secure user registration and authentication with JWT tokens.
- **Order Book**: View current bids and asks for tokens in real time.
- **Order Placement**: Place bid/ask orders with automatic matching if conditions are met.
- **Trade History**: View token-specific or user-specific trade histories.
- **Pre-configured Data**: Includes a superuser account, pre-added trade tokens, and trade records for demonstration.

### Frontend (`orderbook`)
- **Dashboard**: Dropdown to select tokens and view transaction history.
- **Order Book**: Display real-time bid and ask data for the selected token.
- **Order Placement**: Allows users to place bid/ask orders and execute trades instantly if matched.
- **Trade History**: Displays the user’s complete trade history.
- **Authentication**: Login, logout, and user registration pages.
- **Navbar**: Provides easy navigation between pages with a username display and logout option.

---

## Pre-configured Setup

- **Superuser Account**:  
  - **Username**: `aamleen_nk_securities`  
  - **Password**: `nk55secure`
- **Pre-added Data**: Two trade tokens and sample trade records are included for demonstration.

---
## Running the Project

### Backend
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend/nkSecurities
   ```
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Apply migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```
4. Run the development server:
```bash
python manage.py runserver
```
### Frontend
1. Navigate to the `Frontend/orderbook` directory:
```bash
cd Frontend/orderbook
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

### Running tests on Backend
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend/nkSecurities
   ```
2. Run the Tests:
```bash
python manage.py test
```
---

## Directory Structure

```
.
├── Backend/
│   ├── nkSecurities/
│   │   ├── nkSecurities/        # Django project root
│   │   ├── orderbook/           # Django app for order book functionality
│   │   ├── db.sqlite3           # SQLite database (for development)
│   │   └── manage.py            # Django project manager
│   └── requirements.txt         # Backend dependencies
│
├── Frontend/
│   ├── orderbook/               # React application for the frontend
│   │   ├── src/
│   │   │   ├── components/      # Reusable React components
│   │   │   ├── pages/           # Individual pages for routes
│   │   │   ├── styling/         # CSS/SCSS styling files
│   │   │   └── App.jsx          # Main application file
│   │   ├── public/              # Public assets
│   │   ├── package.json         # Frontend dependencies
│   │   └── vite.config.js       # Vite configuration for the React app
│
├── README.md                    # Project documentation
```
---
## API Endpoints

### Authentication
- **Register User**: `POST /user/register/`
- **Obtain Token**: `POST /token/`
- **Refresh Token**: `POST /token/refresh/`

### Order Book
- **View Tokens**: `GET /tokens/`
- **Order Book for Token**: `GET /order-book/<symbol>/`
- **Place Order**: `POST /place-order/`

### Trade History
- **Trade History for Token**: `GET /trade-history/<symbol>/`
- **User Trade History**: `GET /trade-history/`

### Other
- **Admin Interface**: `/admin/`
- **REST Framework Login**: `/api-auth/`

---

## Frontend Routes

| Route              | Description                                   |
|--------------------|-----------------------------------------------|
| `/`                | Dashboard with trade token selection         |
| `/orderBook`       | Displays the complete order book for a token |
| `/orderPlacement`  | Allows placing bid/ask orders                |
| `/tradeHistory`    | Displays the user’s trade history            |
| `/login`           | User login page                              |
| `/logout`          | User logout                                  |
| `/register`        | User registration                            |

---

## JWT Authentication & Security
###  Why JWT?
JWT (JSON Web Token) provides a stateless authentication mechanism where the server doesn’t need to store session data. Tokens are:

* **Compact:** Easy to transfer between the client and server.
* **Secure:** Encoded with algorithms like HMAC or RSA for integrity.

### Two Tokens
* **Access Token:** Short-lived token used to authenticate requests.
* **Refresh Token:** Long-lived token used to obtain a new access token without requiring the user to log in again.
### Protected Routes
Frontend routes are protected by checking for a valid access token. If expired: 
The refresh token is used to get a new access token.
If both tokens are invalid, the user is redirected to the login page.

This approach ensures: Minimal server load due to stateless tokens.
Enhanced security with token expiry mechanisms.