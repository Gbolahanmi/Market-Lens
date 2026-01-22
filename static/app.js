// API base URL
const API_BASE_URL = window.location.origin;

// Search for stock price
async function searchStock() {
    const symbol = document.getElementById('stockSymbol').value.trim().toUpperCase();
    const resultDiv = document.getElementById('stockResult');
    
    if (!symbol) {
        resultDiv.innerHTML = '<div class="error">Please enter a stock symbol</div>';
        return;
    }
    
    resultDiv.innerHTML = '<div class="loading">Loading stock data...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/stock/${symbol}`);
        const data = await response.json();
        
        if (data.success) {
            const changeClass = data.change >= 0 ? 'positive' : 'negative';
            const changeSymbol = data.change >= 0 ? '▲' : '▼';
            
            resultDiv.innerHTML = `
                <div class="stock-info">
                    <div class="stock-header">
                        <div>
                            <div class="stock-symbol">${data.symbol}</div>
                            <div class="stock-change ${changeClass}">
                                ${changeSymbol} ${data.change.toFixed(2)} (${data.change_percent})
                            </div>
                        </div>
                        <div class="stock-price">$${data.price.toFixed(2)}</div>
                    </div>
                    <div class="stock-details">
                        <div class="detail-item">
                            <span class="detail-label">Volume</span>
                            <span class="detail-value">${formatNumber(data.volume)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Latest Trading Day</span>
                            <span class="detail-value">${data.latest_trading_day}</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<div class="error">${data.error}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">Error fetching stock data: ${error.message}</div>`;
    }
}

// Get company information
async function getCompanyInfo() {
    const symbol = document.getElementById('companySymbol').value.trim().toUpperCase();
    const resultDiv = document.getElementById('companyResult');
    
    if (!symbol) {
        resultDiv.innerHTML = '<div class="error">Please enter a stock symbol</div>';
        return;
    }
    
    resultDiv.innerHTML = '<div class="loading">Loading company information...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/company/${symbol}`);
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `
                <div class="company-info">
                    <div class="company-header">
                        <div class="company-name">${data.name}</div>
                        <div class="company-meta">${data.symbol} | ${data.exchange}</div>
                    </div>
                    <div class="company-description">${data.description || 'No description available'}</div>
                    <div class="company-stats">
                        <div class="detail-item">
                            <span class="detail-label">Sector</span>
                            <span class="detail-value">${data.sector || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Industry</span>
                            <span class="detail-value">${data.industry || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Market Cap</span>
                            <span class="detail-value">${formatMarketCap(data.market_cap)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">P/E Ratio</span>
                            <span class="detail-value">${data.pe_ratio || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Dividend Yield</span>
                            <span class="detail-value">${data.dividend_yield ? (parseFloat(data.dividend_yield) * 100).toFixed(2) + '%' : 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">52 Week High</span>
                            <span class="detail-value">${data.week_52_high ? '$' + parseFloat(data.week_52_high).toFixed(2) : 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">52 Week Low</span>
                            <span class="detail-value">${data.week_52_low ? '$' + parseFloat(data.week_52_low).toFixed(2) : 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Address</span>
                            <span class="detail-value">${data.address || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<div class="error">${data.error}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">Error fetching company data: ${error.message}</div>`;
    }
}

// Create a new alert
async function createAlert() {
    const symbol = document.getElementById('alertSymbol').value.trim().toUpperCase();
    const condition = document.getElementById('alertCondition').value;
    const targetPrice = parseFloat(document.getElementById('alertPrice').value);
    
    if (!symbol || !targetPrice || targetPrice <= 0) {
        alert('Please fill in all alert fields correctly');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/alerts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                symbol: symbol,
                condition: condition,
                target_price: targetPrice
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Clear form
            document.getElementById('alertSymbol').value = '';
            document.getElementById('alertPrice').value = '';
            
            // Show success message
            const alertsList = document.getElementById('alertsList');
            alertsList.innerHTML = '<div class="success">Alert created successfully!</div>' + alertsList.innerHTML;
            
            // Reload alerts
            setTimeout(loadAlerts, 1000);
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        alert(`Error creating alert: ${error.message}`);
    }
}

// Load all alerts
async function loadAlerts() {
    const alertsList = document.getElementById('alertsList');
    alertsList.innerHTML = '<div class="loading">Loading alerts...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/alerts`);
        const data = await response.json();
        
        if (data.success) {
            if (data.alerts.length === 0) {
                alertsList.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No alerts created yet</p>';
            } else {
                alertsList.innerHTML = data.alerts.map(alert => `
                    <div class="alert-item ${alert.triggered ? 'alert-triggered' : ''}">
                        <div class="alert-info">
                            <div class="alert-symbol">${alert.symbol}</div>
                            <div class="alert-condition">
                                Alert when price goes ${alert.condition} $${alert.target_price.toFixed(2)}
                                ${alert.triggered ? '✓ Triggered!' : ''}
                            </div>
                            <div style="font-size: 0.85rem; color: #999; margin-top: 5px;">
                                Created: ${new Date(alert.created_at).toLocaleString()}
                            </div>
                        </div>
                        <button class="delete-btn" onclick="deleteAlert(${alert.id})">Delete</button>
                    </div>
                `).join('');
            }
        } else {
            alertsList.innerHTML = `<div class="error">${data.error}</div>`;
        }
    } catch (error) {
        alertsList.innerHTML = `<div class="error">Error loading alerts: ${error.message}</div>`;
    }
}

// Delete an alert
async function deleteAlert(alertId) {
    if (!confirm('Are you sure you want to delete this alert?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/alerts/${alertId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadAlerts();
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        alert(`Error deleting alert: ${error.message}`);
    }
}

// Check alerts against current prices
async function checkAlerts() {
    const triggeredAlertsDiv = document.getElementById('triggeredAlerts');
    triggeredAlertsDiv.innerHTML = '<div class="loading">Checking alerts...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/alerts/check`);
        const data = await response.json();
        
        if (data.success) {
            if (data.triggered_alerts.length === 0) {
                triggeredAlertsDiv.innerHTML = '<div class="success">No alerts triggered at this time</div>';
            } else {
                triggeredAlertsDiv.innerHTML = '<h3 style="margin-bottom: 15px;">🔔 Triggered Alerts:</h3>' + 
                    data.triggered_alerts.map(alert => `
                        <div class="triggered-alert">
                            <strong>${alert.symbol}</strong>: Price went ${alert.condition} $${alert.target_price.toFixed(2)}
                            <br>Current Price: $${alert.current_price.toFixed(2)}
                        </div>
                    `).join('');
            }
            
            // Reload alerts list to update triggered status
            loadAlerts();
        } else {
            triggeredAlertsDiv.innerHTML = `<div class="error">${data.error}</div>`;
        }
    } catch (error) {
        triggeredAlertsDiv.innerHTML = `<div class="error">Error checking alerts: ${error.message}</div>`;
    }
}

// Utility functions
function formatNumber(num) {
    if (!num) return 'N/A';
    return parseInt(num).toLocaleString();
}

function formatMarketCap(cap) {
    if (!cap) return 'N/A';
    const num = parseInt(cap);
    if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
    return '$' + num.toLocaleString();
}

// Allow Enter key to submit forms
document.getElementById('stockSymbol').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchStock();
});

document.getElementById('companySymbol').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') getCompanyInfo();
});

document.getElementById('alertPrice').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') createAlert();
});

// Load alerts on page load
window.addEventListener('DOMContentLoaded', loadAlerts);
