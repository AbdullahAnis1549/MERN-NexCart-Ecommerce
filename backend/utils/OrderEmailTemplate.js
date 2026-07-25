/**
 * Order Confirmation Email — HTML Template
 * Order place hone ke baad user ko ye beautiful email jaati hai
 */
export const orderConfirmationEmail = ({ userName, orderId, items, shippingAddress, paymentMethod, totalAmount, shippingCharge, grandTotal }) => {
  const itemRows = items.map((item) => `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; color: #333;">${item.name}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; text-align:center; color: #333;">${item.quantity}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; text-align:right; color: #333;">Rs. ${item.price.toLocaleString()}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; text-align:right; font-weight:600; color: #333;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join("");

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4; padding: 30px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 35px 40px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700; letter-spacing:-0.5px;">🎉 Order Confirmed!</h1>
                <p style="color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:15px;">Shukriya ${userName}, aap ka order place ho gaya!</p>
              </td>
            </tr>

            <!-- Order ID Banner -->
            <tr>
              <td style="background:#f8f7ff; padding: 16px 40px; border-bottom: 1px solid #eeebff;">
                <p style="margin:0; font-size:14px; color:#888;">Order ID</p>
                <p style="margin:4px 0 0; font-size:15px; font-weight:700; color:#667eea; font-family: monospace;">#${orderId}</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px 40px;">

                <!-- Items Table -->
                <h2 style="margin:0 0 16px; font-size:17px; color:#222; font-weight:600;">📦 Order Items</h2>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <thead>
                    <tr style="background:#f8f8f8;">
                      <th style="padding: 10px 12px; text-align:left; font-size:13px; color:#666; font-weight:600; border-bottom: 2px solid #eee;">Product</th>
                      <th style="padding: 10px 12px; text-align:center; font-size:13px; color:#666; font-weight:600; border-bottom: 2px solid #eee;">Qty</th>
                      <th style="padding: 10px 12px; text-align:right; font-size:13px; color:#666; font-weight:600; border-bottom: 2px solid #eee;">Price</th>
                      <th style="padding: 10px 12px; text-align:right; font-size:13px; color:#666; font-weight:600; border-bottom: 2px solid #eee;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemRows}
                  </tbody>
                </table>

                <!-- Totals -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                  <tr>
                    <td style="padding: 6px 0; color: #666; font-size:14px;">Items Total</td>
                    <td style="padding: 6px 0; text-align:right; color:#333; font-size:14px;">Rs. ${totalAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #666; font-size:14px;">Shipping Charges</td>
                    <td style="padding: 6px 0; text-align:right; color:#333; font-size:14px;">${shippingCharge === 0 ? '<span style="color:#22c55e;">FREE</span>' : `Rs. ${shippingCharge.toLocaleString()}`}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0 6px; font-weight:700; font-size:16px; color:#222; border-top: 2px solid #eee;">Grand Total</td>
                    <td style="padding: 12px 0 6px; text-align:right; font-weight:700; font-size:18px; color:#667eea; border-top: 2px solid #eee;">Rs. ${grandTotal.toLocaleString()}</td>
                  </tr>
                </table>

                <!-- Shipping + Payment Info -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px; border-top: 1px solid #f0f0f0; padding-top: 24px;">
                  <tr>
                    <td width="50%" style="vertical-align:top; padding-right: 12px;">
                      <p style="margin:0 0 6px; font-size:13px; font-weight:600; color:#888; text-transform:uppercase; letter-spacing:0.5px;">📍 Delivery Address</p>
                      <p style="margin:0; font-size:14px; color:#333; line-height:1.5;">${shippingAddress}</p>
                    </td>
                    <td width="50%" style="vertical-align:top; padding-left: 12px;">
                      <p style="margin:0 0 6px; font-size:13px; font-weight:600; color:#888; text-transform:uppercase; letter-spacing:0.5px;">💳 Payment Method</p>
                      <p style="margin:0;">
                        <span style="display:inline-block; background:${paymentMethod === 'COD' ? '#fef3c7' : '#d1fae5'}; color:${paymentMethod === 'COD' ? '#92400e' : '#065f46'}; padding: 4px 12px; border-radius:20px; font-size:13px; font-weight:600;">
                          ${paymentMethod === 'COD' ? '💵 Cash On Delivery' : '✅ Online Paid'}
                        </span>
                      </p>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f8f8f8; padding: 20px 40px; text-align:center; border-top: 1px solid #eee;">
                <p style="margin:0; font-size:13px; color:#999;">Koi sawal ho toh hum se rabta karein.</p>
                <p style="margin:6px 0 0; font-size:12px; color:#bbb;">© 2025 My Shop. Shukriya aap ki khareedari ke liye! 🛒</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  return html;
};
