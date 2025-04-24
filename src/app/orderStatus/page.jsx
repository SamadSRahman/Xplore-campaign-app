'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

export default function OrderDetails({router}) {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        //https://xplr.live/api/v1/payment/cashfree/order-status?order_id=82a8d90d-898f-4292-b31c-aade7a79332f
        const res = await fetch(`https://xplr.live/api/v1/payment/cashfree/order-status?order_id=${orderId}`);
        const json = await res.json();
        if (json.success) {
          setOrder(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleRetryPayment = () => {
    router.push(`/payment/retry/${orderId}`);
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!order) {
    return <div className="container">Order not found.</div>;
  }

  const { order_status, transaction, product, variant } = order;

  return (
    <div className="container">
      <h2>Order Summary</h2>
      <div className="status">
        <span className={`badge ${order_status}`}>{order_status.toUpperCase()}</span>
      </div>

      {transaction && (
        <div className="transaction">
          <h3>Payment Details</h3>
          <p><strong>Status:</strong> {transaction.status}</p>
          <p><strong>Amount:</strong> ₹{transaction.amount.toFixed(2)}</p>
          <p><strong>Method:</strong> {transaction.method.card.card_network.toUpperCase()} {transaction.method.card.card_type.replace('_', ' ')}</p>
          <p><strong>Card:</strong> **** **** **** {transaction.method.card.card_number.slice(-4)}</p>
          <p><strong>Bank:</strong> {transaction.method.card.card_bank_name}</p>
          <p><strong>Date:</strong> {new Date(transaction.date).toLocaleString()}</p>
        </div>
      )}

      {product && (
        <div className="products">
          <h3>Products</h3>
         
            <div className="product">
              <img src={product.images[0].url} alt={product.name} />
              <div className="details">
                <p className="name">{product.name}</p>
                <p className="quantity">Qty: {product.quantity}</p>
                <p className="price">₹{variant.price}</p>
              </div>
            </div>
         
        </div>
      )}

      {order_status === 'pending' && (
        <button className="retry-button" onClick={handleRetryPayment}>
          Retry Payment
        </button>
      )}

      <style jsx>{`
        .container {
          max-width: 350px;
          margin: 0 auto;
          padding: 16px;
          font-family: 'Helvetica Neue', sans-serif;
          color: #333;
        }

        h2, h3 {
          margin-bottom: 12px;
        }

        .status {
          margin-bottom: 16px;
        }

        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .badge.shipped {
          background-color: #e0f7fa;
          color: #00796b;
        }

        .badge.pending {
          background-color: #fff3e0;
          color: #f57c00;
        }

        .transaction, .products {
          margin-bottom: 24px;
        }

        .transaction p, .details p {
          margin: 4px 0;
        }

        .products {
          border-top: 1px solid #ddd;
          padding-top: 16px;
        }

        .product {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        .product img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          margin-right: 12px;
        }

        .details .name {
          font-weight: 600;
        }

        .retry-button {
          width: 100%;
          padding: 12px;
          background-color: #1976d2;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
        }

        .retry-button:hover {
          background-color: #1565c0;
        }

        @media (max-width: 480px) {
          .container {
            max-width: 100%;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}
