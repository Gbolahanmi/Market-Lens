# Market-Lens 📈

A modern web application to get real stock prices, set personalized alerts, and explore detailed company information.

## Features

- **📊 Real-Time Stock Prices**: Get up-to-date stock prices for any publicly traded company
- **🔔 Personalized Alerts**: Set price alerts to notify you when stocks reach your target prices
- **🏢 Company Information**: Explore detailed company profiles, financials, and market data

## Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Database**: SQLite
- **API**: Alpha Vantage for stock market data

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Gbolahanmi/Market-Lens.git
   cd Market-Lens
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Alpha Vantage API key:
   ```
   ALPHA_VANTAGE_API_KEY=your_api_key_here
   ```
   
   Get a free API key from: https://www.alphavantage.co/support/#api-key

4. Run the application:
   ```bash
   python app.py
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

### Getting Stock Prices

1. Enter a stock symbol (e.g., AAPL, GOOGL, MSFT) in the "Real-Time Stock Prices" section
2. Click "Get Price" to see the current price, change, and volume

### Viewing Company Information

1. Enter a stock symbol in the "Company Information" section
2. Click "Get Details" to see comprehensive company information including:
   - Company description
   - Sector and industry
   - Market cap, P/E ratio, dividend yield
   - 52-week high and low
   - Company address

### Creating Price Alerts

1. In the "Price Alerts" section, enter:
   - Stock symbol
   - Condition (price above or below)
   - Target price
2. Click "Create Alert"
3. Use "Check Alerts Now" to manually check if any alerts have been triggered
4. Use "Refresh Alerts" to see all your active alerts

## API Endpoints

- `GET /api/stock/<symbol>` - Get real-time stock price
- `GET /api/company/<symbol>` - Get company information
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create a new alert
- `DELETE /api/alerts/<id>` - Delete an alert
- `GET /api/alerts/check` - Check all alerts against current prices

## Database Schema

### Alerts Table
- `id`: Primary key
- `symbol`: Stock symbol
- `condition`: 'above' or 'below'
- `target_price`: Target price for the alert
- `created_at`: Timestamp when alert was created
- `triggered`: Boolean indicating if alert has been triggered

## Notes

- The free Alpha Vantage API has rate limits (5 requests per minute, 500 per day)
- For demo purposes, you can use the API key 'demo' which works with limited symbols
- Stock data may be delayed by 15-20 minutes
- Alerts need to be manually checked using the "Check Alerts Now" button

## Future Enhancements

- Real-time alert notifications
- Historical price charts
- Portfolio tracking
- Multiple watchlists
- Email/SMS notifications for triggered alerts
- WebSocket support for real-time price updates

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
