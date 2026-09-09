import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, cartItems } = cart;

  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, success, error, order } = orderCreate;

  useEffect(() => {
    if (!paymentMethod) {
      navigate('/payment');
    }
  }, [paymentMethod, navigate]);

  const toPrice = (num) => Number(num.toFixed(2));

  const itemsPrice = toPrice(
    cartItems.reduce((a, c) => a + c.qty * c.price, 0)
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;

  const taxPrice = toPrice(0.15 * itemsPrice);

  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        ...cart,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        orderItems: cartItems,
      })
    );
  };

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [dispatch, navigate, order, success]);

  return (
    <div className="checkout-page">

      {/* CHECKOUT STEPS */}
      <CheckoutSteps step1 step2 step3 step4 />

      {/* PAGE HEADER */}
      <div className="checkout-header">
        <span className="section-label">
          FINAL REVIEW
        </span>

        <h1>Place Your Order</h1>

        <p>
          Review your order details before placing your order.
        </p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="place-order-layout">

        {/* LEFT SIDE */}
        <div className="place-order-details">

          {/* SHIPPING */}
          <div className="review-card">

            <div className="review-card-header">

              <div>
                <div className="review-number">
                  01
                </div>

                <div>
                  <h2>Shipping Address</h2>

                  <p>
                    Delivery information
                  </p>
                </div>
              </div>

            </div>

            <div className="review-content">

              <strong>
                {shippingAddress.fullName}
              </strong>

              <p>
                {shippingAddress.address}
                <br />

                {shippingAddress.city},{' '}
                {shippingAddress.postalCode}
                <br />

                {shippingAddress.country}
              </p>

            </div>

          </div>

          {/* PAYMENT */}
          <div className="review-card">

            <div className="review-card-header">

              <div>
                <div className="review-number">
                  02
                </div>

                <div>
                  <h2>Payment Method</h2>

                  <p>
                    Selected payment option
                  </p>
                </div>
              </div>

            </div>

            <div className="payment-review">

              <div className="payment-review-icon">
                {paymentMethod === 'PayPal' ? 'P' : 'S'}
              </div>

              <div>
                <strong>
                  {paymentMethod}
                </strong>

                <p>
                  Secure payment
                </p>
              </div>

            </div>

          </div>

          {/* ORDER ITEMS */}
          <div className="review-card">

            <div className="review-card-header">

              <div>
                <div className="review-number">
                  03
                </div>

                <div>
                  <h2>Order Items</h2>

                  <p>
                    {cartItems.length}{' '}
                    {cartItems.length === 1
                      ? 'product'
                      : 'products'}
                  </p>
                </div>
              </div>

            </div>

            <div className="order-items-list">

              {cartItems.map((item) => (

                <div
                  className="review-item"
                  key={item.product}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="review-item-info">

                    <Link
                      to={`/product/${item.product}`}
                    >
                      {item.name}
                    </Link>

                    <span>
                      {item.qty} × ${item.price}
                    </span>

                  </div>

                  <strong>
                    ${(item.qty * item.price).toFixed(2)}
                  </strong>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="place-order-summary">

          <div className="summary-title">

            <span className="section-label">
              YOUR ORDER
            </span>

            <h2>
              Order Summary
            </h2>

          </div>

          {/* ITEMS */}
          <div className="summary-row">

            <span>
              Items
            </span>

            <strong>
              ${itemsPrice.toFixed(2)}
            </strong>

          </div>

          {/* SHIPPING */}
          <div className="summary-row">

            <span>
              Shipping
            </span>

            <strong
              className={
                shippingPrice === 0
                  ? 'free-shipping'
                  : ''
              }
            >
              {shippingPrice === 0
                ? 'FREE'
                : `$${shippingPrice.toFixed(2)}`}
            </strong>

          </div>

          {/* TAX */}
          <div className="summary-row">

            <span>
              Tax
            </span>

            <strong>
              ${taxPrice.toFixed(2)}
            </strong>

          </div>

          <div className="summary-divider" />

          {/* TOTAL */}
          <div className="place-order-total">

            <span>
              Total
            </span>

            <strong>
              ${totalPrice.toFixed(2)}
            </strong>

          </div>

          {/* BUTTON */}
          <button
            type="button"
            className="place-order-button"
            onClick={placeOrderHandler}
            disabled={
              cartItems.length === 0 || loading
            }
          >
            {loading
              ? 'Placing Order...'
              : 'Place Order →'}
          </button>

          <div className="order-security">
            🔒 Secure & encrypted checkout
          </div>

          {loading && <LoadingBox />}

          {error && (
            <MessageBox variant="danger">
              {error}
            </MessageBox>
          )}

        </div>

      </div>

    </div>
  );
}