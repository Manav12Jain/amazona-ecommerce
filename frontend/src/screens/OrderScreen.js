import Axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import {
  deliverOrder,
  detailsOrder,
  payOrder,
} from '../actions/orderActions';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from '../constants/orderConstants';

export default function OrderScreen(props) {
  const params = useParams();
  const { id: orderId } = params;

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;

  const dispatch = useDispatch();

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data } = await Axios.get('/api/config/paypal');

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;

      script.onload = () => {
        setSdkReady(true);
      };

      document.body.appendChild(script);
    };

    if (
      !order ||
      successPay ||
      successDeliver ||
      (order && order._id !== orderId)
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(detailsOrder(orderId));
    } else {
      if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [
    dispatch,
    orderId,
    sdkReady,
    successPay,
    successDeliver,
    order,
  ]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
  };

  if (loading) {
    return <LoadingBox />;
  }

  if (error) {
    return (
      <div className="order-page">
        <MessageBox variant="danger">{error}</MessageBox>
      </div>
    );
  }

  return (
    <div className="order-page">

      {/* ==============================
          FIX ORDER SUMMARY POSITION
      =============================== */}


      {/* ==============================
          HEADER
      =============================== */}

      <div className="order-header">

        <div>
          <span className="section-label">
            ORDER DETAILS
          </span>

          <h1>Order Details</h1>

          <p>
            Order #{order._id}
          </p>
        </div>

        <Link
          to="/"
          className="continue-shopping-link"
        >
          ← Continue Shopping
        </Link>

      </div>


      {/* ==============================
          SUCCESS BANNER
      =============================== */}

      <div className="order-success-banner">

        <div className="success-icon">
          ✓
        </div>

        <div>
          <h2>
            Order Confirmed
          </h2>

          <p>
            Your order has been successfully placed.
          </p>
        </div>

      </div>


      {/* ==============================
          MAIN ORDER LAYOUT
      =============================== */}

      <div className="order-layout">

        {/* ============================
            LEFT SIDE
        ============================= */}

        <div className="order-main">

          {/* ==========================
              SHIPPING
          =========================== */}

          <div className="order-section-card">

            <div className="order-section-header">

              <div className="order-section-title">

                <div className="order-number">
                  01
                </div>

                <div>
                  <h2>
                    Shipping Address
                  </h2>

                  <span>
                    Delivery information
                  </span>
                </div>

              </div>

              <span
                className={
                  order.isDelivered
                    ? 'status-badge success'
                    : 'status-badge pending'
                }
              >
                {order.isDelivered
                  ? '✓ Delivered'
                  : '● Processing'}
              </span>

            </div>


            <div className="order-divider"></div>


            <div className="shipping-details">

              <strong>
                {order.shippingAddress.fullName}
              </strong>

              <p>
                {order.shippingAddress.address}
                <br />

                {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode}
                <br />

                {order.shippingAddress.country}
              </p>

            </div>


            {order.isDelivered ? (
              <div className="order-status success-status">
                ✓ Delivered at {order.deliveredAt}
              </div>
            ) : (
              <div className="order-status pending-status">
                ⏳ Your order is being processed
              </div>
            )}

          </div>


          {/* ==========================
              PAYMENT
          =========================== */}

          <div className="order-section-card">

            <div className="order-section-header">

              <div className="order-section-title">

                <div className="order-number">
                  02
                </div>

                <div>
                  <h2>
                    Payment Method
                  </h2>

                  <span>
                    Selected payment option
                  </span>
                </div>

              </div>


              <span
                className={
                  order.isPaid
                    ? 'status-badge success'
                    : 'status-badge pending'
                }
              >
                {order.isPaid
                  ? '✓ Paid'
                  : '● Unpaid'}
              </span>

            </div>


            <div className="order-divider"></div>


            <div className="payment-method-display">

              <div className="payment-method-icon">
                {order.paymentMethod === 'PayPal'
                  ? 'P'
                  : 'S'}
              </div>

              <div>

                <strong>
                  {order.paymentMethod}
                </strong>

                <span>
                  {order.isPaid
                    ? `Paid at ${order.paidAt}`
                    : 'Payment required'}
                </span>

              </div>

            </div>


            {/* PAYMENT */}

            {!order.isPaid && (
              <div className="payment-box">

                <div className="payment-box-title">
                  Complete your payment
                </div>


                {!sdkReady ? (
                  <LoadingBox />
                ) : (
                  <>

                    {errorPay && (
                      <MessageBox variant="danger">
                        {errorPay}
                      </MessageBox>
                    )}


                    {loadingPay && (
                      <LoadingBox />
                    )}


                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />

                  </>
                )}

              </div>
            )}

          </div>


          {/* ==========================
              ORDER ITEMS
          =========================== */}

          <div className="order-section-card">

            <div className="order-section-header">

              <div className="order-section-title">

                <div className="order-number">
                  03
                </div>

                <div>
                  <h2>
                    Order Items
                  </h2>

                  <span>
                    {order.orderItems.length}{' '}
                    {order.orderItems.length === 1
                      ? 'product'
                      : 'products'}
                  </span>

                </div>

              </div>

            </div>


            <div className="order-divider"></div>


            <div className="order-items">

              {order.orderItems.map((item) => (

                <div
                  className="order-item"
                  key={item.product}
                >

                  <Link
                    to={`/product/${item.product}`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </Link>


                  <div className="order-item-info">

                    <Link
                      to={`/product/${item.product}`}
                      className="order-item-name"
                    >
                      {item.name}
                    </Link>

                    <span>
                      Quantity: {item.qty}
                    </span>

                  </div>


                  <div className="order-item-price">
                    $
                    {(
                      item.qty * item.price
                    ).toFixed(2)}
                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>


        {/* ==============================
            RIGHT SIDE
            YOUR ORDER
        =============================== */}

        <aside className="order-summary-card">

          <span className="section-label">
            YOUR ORDER
          </span>

          <h2>
            Order Summary
          </h2>


          <div className="summary-row">

            <span>
              Items
            </span>

            <strong>
              ${order.itemsPrice.toFixed(2)}
            </strong>

          </div>


          <div className="summary-row">

            <span>
              Shipping
            </span>

            <strong
              className={
                order.shippingPrice === 0
                  ? 'free'
                  : ''
              }
            >
              {order.shippingPrice === 0
                ? 'FREE'
                : `$${order.shippingPrice.toFixed(2)}`}
            </strong>

          </div>


          <div className="summary-row">

            <span>
              Tax
            </span>

            <strong>
              ${order.taxPrice.toFixed(2)}
            </strong>

          </div>


          <div className="summary-divider"></div>


          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ${order.totalPrice.toFixed(2)}
            </strong>

          </div>


          {/* ==========================
              ADMIN DELIVERY
          =========================== */}

          {userInfo &&
            userInfo.isAdmin &&
            order.isPaid &&
            !order.isDelivered && (

              <div className="admin-delivery-box">

                <span>
                  ADMIN ACTION
                </span>


                {loadingDeliver && (
                  <LoadingBox />
                )}


                {errorDeliver && (
                  <MessageBox variant="danger">
                    {errorDeliver}
                  </MessageBox>
                )}


                <button
                  type="button"
                  className="admin-deliver-button"
                  onClick={deliverHandler}
                >
                  ✓ Mark as Delivered
                </button>

              </div>

            )}


          <div className="secure-checkout">
            🔒 Secure & encrypted checkout
          </div>

        </aside>

      </div>

    </div>
  );
}