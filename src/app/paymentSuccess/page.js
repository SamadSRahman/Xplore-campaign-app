// components/PaymentSuccess.js
'use client';
import Link from 'next/link';

export default function PaymentSuccess() {
  return (
    <div className="overlay">
      <div className="card">
        <div className="icon-circle">
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
            aria-hidden="true"
          >
            <circle cx="26" cy="26" r="25" fill="none" stroke="#4CAF50" strokeWidth="2"/>
            <path
              fill="none"
              stroke="#4CAF50"
              strokeWidth="4"
              d="M14 27 l8 8 l16 -16"
            />
          </svg>
        </div>
        <h2 className="title">Payment Successful!</h2>
        <p className="message">
          Thank you for your purchase. Your transaction has been completed, and a receipt has been emailed to you.
        </p>
       
        
      </div>
      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 1000;
        }
        .card {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          max-width: 400px;
          width: 100%;
          text-align: center;
          animation: fadeInUp 0.4s ease-out;
        }
        .icon-circle {
          width: 80px;
          height: 80px;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e8f5e9;
          border-radius: 50%;
        }
        .icon {
          width: 40px;
          height: 40px;
        }
        .title {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #333;
        }
        .message {
          font-size: 1rem;
          color: #666;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }
        .button {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          background: #4CAF50;
          color: #fff;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.2s ease;
        }
        .button:hover {
          background: #43A047;
        }

        /* Responsive tweaks */
        @media (max-width: 480px) {
          .card {
            padding: 1.5rem;
          }
          .title {
            font-size: 1.25rem;
          }
          .message {
            font-size: 0.9rem;
          }
        }

        /* Simple entrance animation */
        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
