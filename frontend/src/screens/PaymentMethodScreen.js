import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

export default function PaymentMethodScreen(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress.address) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="checkout-page">

      {/* CHECKOUT STEPS */}
      <CheckoutSteps step1 step2 step3 />

      {/* HEADER */}
      <div className="checkout-header">
        <span className="section-label">
          CHECKOUT
        </span>

        <h1>Payment Method</h1>

        <p>
          Choose how you'd like to pay for your order.
        </p>
      </div>

      {/* PAYMENT CARD */}
      <div className="payment-card">

        <div className="payment-card-header">
          <div>
            <h2>Choose Payment Method</h2>
            <p>
              Select your preferred payment option.
            </p>
          </div>

          <div className="secure-badge">
            🔒 Secure Payment
          </div>
        </div>

        <form onSubmit={submitHandler}>

          {/* PAYPAL */}
          <label
            className={`payment-option ${
              paymentMethod === 'PayPal' ? 'selected' : ''
            }`}
          >
            <input
              type="radio"
              id="paypal"
              value="PayPal"
              name="paymentMethod"
              checked={paymentMethod === 'PayPal'}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            />

            <div className="payment-icon paypal-icon">
              P
            </div>

            <div className="payment-info">
              <strong>PayPal</strong>

              <span>
                Pay securely using your PayPal account
              </span>
            </div>

            <div className="payment-check">
              ✓
            </div>
          </label>

          {/* STRIPE */}
          <label
            className={`payment-option ${
              paymentMethod === 'Stripe' ? 'selected' : ''
            }`}
          >
            <input
              type="radio"
              id="stripe"
              value="Stripe"
              name="paymentMethod"
              checked={paymentMethod === 'Stripe'}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            />

            <div className="payment-icon stripe-icon">
              S
            </div>

            <div className="payment-info">
              <strong>Stripe</strong>

              <span>
                Pay securely with your debit or credit card
              </span>
            </div>

            <div className="payment-check">
              ✓
            </div>
          </label>

          {/* CONTINUE */}
          <button
            className="continue-button"
            type="submit"
          >
            Continue to Place Order →
          </button>

        </form>

      </div>

      {/* SECURITY MESSAGE */}
      <div className="checkout-trust">
        🔒 Your payment information is protected with
        secure encryption.
      </div>

    </div>
  );
}