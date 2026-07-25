export const invoiceHtml = ({ order, user }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Invoice</title>
    <style>
      body { font-family: Arial, sans-serif; color: #333; padding: 24px; }
      .box { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
      .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th, td { border-bottom: 1px solid #ddd; padding: 8px; text-align: left; }
      .total { font-weight: bold; font-size: 16px; }
    </style>
  </head>
  <body>
    <div class="box">
      <h2>Invoice</h2>
      <div class="row"><strong>Order ID:</strong><span>${order._id}</span></div>
      <div class="row"><strong>Name:</strong><span>${user?.name || "Customer"}</span></div>
      <div class="row"><strong>Email:</strong><span>${user?.email || ""}</span></div>
      <div class="row"><strong>Status:</strong><span>${order.status}</span></div>
      <table>
        <thead>
          <tr><th>Product</th><th>Qty</th><th>Price</th></tr>
        </thead>
        <tbody>
          ${order.items?.map((item) => `
            <tr>
              <td>${item.productId?.name || "Product"}</td>
              <td>${item.quantity}</td>
              <td>${item.priceAtPurchase}</td>
            </tr>`).join("") || ""}
        </tbody>
      </table>
      <div class="row" style="margin-top: 12px;"><span>Subtotal</span><span>${order.totalAmount}</span></div>
      <div class="row"><span>Shipping</span><span>${order.shippingCharge}</span></div>
      <div class="row total"><span>Grand Total</span><span>${order.grandTotal}</span></div>
    </div>
  </body>
</html>
`;
