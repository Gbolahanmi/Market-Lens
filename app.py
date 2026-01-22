"""
Market-Lens Flask Backend
Provides real stock prices, personalized alerts, and detailed company information.
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import sqlite3
from datetime import datetime
import json

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# Configuration
ALPHA_VANTAGE_API_KEY = os.getenv('ALPHA_VANTAGE_API_KEY', 'demo')
ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query'

# Database initialization
def init_db():
    """Initialize the SQLite database for alerts."""
    conn = sqlite3.connect('market_lens.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT NOT NULL,
            condition TEXT NOT NULL,
            target_price REAL NOT NULL,
            created_at TEXT NOT NULL,
            triggered INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    """Serve the main HTML page."""
    return send_from_directory('static', 'index.html')

@app.route('/api/stock/<symbol>', methods=['GET'])
def get_stock_price(symbol):
    """Get real-time stock price for a given symbol."""
    try:
        params = {
            'function': 'GLOBAL_QUOTE',
            'symbol': symbol.upper(),
            'apikey': ALPHA_VANTAGE_API_KEY
        }
        
        response = requests.get(ALPHA_VANTAGE_BASE_URL, params=params)
        data = response.json()
        
        if 'Global Quote' in data and data['Global Quote']:
            quote = data['Global Quote']
            return jsonify({
                'success': True,
                'symbol': quote.get('01. symbol', symbol),
                'price': float(quote.get('05. price', 0)),
                'change': float(quote.get('09. change', 0)),
                'change_percent': quote.get('10. change percent', '0%'),
                'volume': quote.get('06. volume', '0'),
                'latest_trading_day': quote.get('07. latest trading day', '')
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Stock symbol not found or API limit reached'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/company/<symbol>', methods=['GET'])
def get_company_info(symbol):
    """Get detailed company information for a given symbol."""
    try:
        params = {
            'function': 'OVERVIEW',
            'symbol': symbol.upper(),
            'apikey': ALPHA_VANTAGE_API_KEY
        }
        
        response = requests.get(ALPHA_VANTAGE_BASE_URL, params=params)
        data = response.json()
        
        if 'Symbol' in data:
            return jsonify({
                'success': True,
                'symbol': data.get('Symbol', ''),
                'name': data.get('Name', ''),
                'description': data.get('Description', ''),
                'sector': data.get('Sector', ''),
                'industry': data.get('Industry', ''),
                'market_cap': data.get('MarketCapitalization', ''),
                'pe_ratio': data.get('PERatio', ''),
                'dividend_yield': data.get('DividendYield', ''),
                'week_52_high': data.get('52WeekHigh', ''),
                'week_52_low': data.get('52WeekLow', ''),
                'address': data.get('Address', ''),
                'exchange': data.get('Exchange', '')
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Company information not found or API limit reached'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Get all alerts."""
    try:
        conn = sqlite3.connect('market_lens.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM alerts ORDER BY created_at DESC')
        alerts = cursor.fetchall()
        conn.close()
        
        alert_list = []
        for alert in alerts:
            alert_list.append({
                'id': alert[0],
                'symbol': alert[1],
                'condition': alert[2],
                'target_price': alert[3],
                'created_at': alert[4],
                'triggered': bool(alert[5])
            })
        
        return jsonify({
            'success': True,
            'alerts': alert_list
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/alerts', methods=['POST'])
def create_alert():
    """Create a new price alert."""
    try:
        data = request.json
        symbol = data.get('symbol', '').upper()
        condition = data.get('condition', '')  # 'above' or 'below'
        target_price = float(data.get('target_price', 0))
        
        if not symbol or not condition or target_price <= 0:
            return jsonify({
                'success': False,
                'error': 'Invalid alert parameters'
            }), 400
        
        conn = sqlite3.connect('market_lens.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO alerts (symbol, condition, target_price, created_at)
            VALUES (?, ?, ?, ?)
        ''', (symbol, condition, target_price, datetime.now().isoformat()))
        conn.commit()
        alert_id = cursor.lastrowid
        conn.close()
        
        return jsonify({
            'success': True,
            'alert_id': alert_id,
            'message': f'Alert created for {symbol}'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/alerts/<int:alert_id>', methods=['DELETE'])
def delete_alert(alert_id):
    """Delete an alert."""
    try:
        conn = sqlite3.connect('market_lens.db')
        cursor = conn.cursor()
        cursor.execute('DELETE FROM alerts WHERE id = ?', (alert_id,))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Alert deleted'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/alerts/check', methods=['GET'])
def check_alerts():
    """Check all alerts against current prices."""
    try:
        conn = sqlite3.connect('market_lens.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM alerts WHERE triggered = 0')
        alerts = cursor.fetchall()
        
        triggered_alerts = []
        
        for alert in alerts:
            alert_id, symbol, condition, target_price, created_at, triggered = alert
            
            # Get current price
            params = {
                'function': 'GLOBAL_QUOTE',
                'symbol': symbol,
                'apikey': ALPHA_VANTAGE_API_KEY
            }
            
            response = requests.get(ALPHA_VANTAGE_BASE_URL, params=params)
            data = response.json()
            
            if 'Global Quote' in data and data['Global Quote']:
                current_price = float(data['Global Quote'].get('05. price', 0))
                
                # Check if alert condition is met
                is_triggered = False
                if condition == 'above' and current_price >= target_price:
                    is_triggered = True
                elif condition == 'below' and current_price <= target_price:
                    is_triggered = True
                
                if is_triggered:
                    cursor.execute('UPDATE alerts SET triggered = 1 WHERE id = ?', (alert_id,))
                    triggered_alerts.append({
                        'id': alert_id,
                        'symbol': symbol,
                        'condition': condition,
                        'target_price': target_price,
                        'current_price': current_price
                    })
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'triggered_alerts': triggered_alerts
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
