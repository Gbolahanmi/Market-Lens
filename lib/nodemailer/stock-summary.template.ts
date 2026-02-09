export const STOCK_SUMMARY_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="x-apple-disable-message-reformatting">
    <title>Your Stock Summary - MarketLens</title>
    <style type="text/css">
        @media (prefers-color-scheme: dark) {
            .email-container {
                background-color: #141414 !important;
                border: 1px solid #30333A !important;
            }
            .dark-text {
                color: #ffffff !important;
            }
            .dark-text-secondary {
                color: #9ca3af !important;
            }
            .dark-text-muted {
                color: #6b7280 !important;
            }
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: 0 !important;
            }
            .mobile-padding {
                padding: 24px !important;
            }
            .mobile-title {
                font-size: 24px !important;
                line-height: 1.3 !important;
            }
            .mobile-text {
                font-size: 14px !important;
                line-height: 1.5 !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #050505;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container" style="max-width: 600px; background-color: #141414; border-radius: 8px; border: 1px solid #30333A;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="left" style="padding: 40px 40px 20px 40px;">
                            <img src="https://ik.imagekit.io/a6fkjou7d/logo.png?updatedAt=1756378431634" alt="MarketLens Logo" width="150" style="max-width: 100%; height: auto;">
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 40px 40px 40px;">
                            
                            <!-- Title -->
                            <h1 class="mobile-title dark-text" style="margin: 0 0 10px 0; font-size: 28px; font-weight: 700; color: #FDD458; line-height: 1.2;">
                                Stock Summary
                            </h1>
                            
                            <!-- Subtitle -->
                            <p class="mobile-text dark-text-muted" style="margin: 0 0 30px 0; font-size: 14px; line-height: 1.5; color: #6b7280;">
                                {{date}} • {{stockCount}} stocks tracked
                            </p>
                            
                            <!-- Table -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px; border-collapse: collapse;">
                                <tr style="background-color: #1f2937; border-bottom: 2px solid #30333A;">
                                    <th style="padding: 12px; text-align: left; color: #9ca3af; font-weight: 600; font-size: 12px;">Symbol</th>
                                    <th style="padding: 12px; text-align: left; color: #9ca3af; font-weight: 600; font-size: 12px;">Company</th>
                                    <th style="padding: 12px; text-align: right; color: #9ca3af; font-weight: 600; font-size: 12px;">Price</th>
                                    <th style="padding: 12px; text-align: right; color: #9ca3af; font-weight: 600; font-size: 12px;">Change</th>
                                </tr>
                                {{stockRows}}
                            </table>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://marketlens.app" style="display: block; width: 100%; background: linear-gradient(135deg, #FDD458 0%, #E8BA40 100%); color: #000000; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; text-align: center; box-sizing: border-box;">
                                            View Dashboard
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Footer -->
                            <div style="text-align: center; border-top: 1px solid #30333A; padding-top: 20px;">
                                <p style="margin: 0 0 8px 0; font-size: 12px; line-height: 1.5; color: #6b7280;">
                                    This is an automated summary from MarketLens
                                </p>
                                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #6b7280;">
                                    © 2025 MarketLens. All rights reserved.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
