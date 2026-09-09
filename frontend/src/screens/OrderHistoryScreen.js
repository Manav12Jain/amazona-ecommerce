import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listOrderMine } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function OrderHistoryScreen(props) {
  const navigate = useNavigate();

  const orderMineList = useSelector((state) => state.orderMineList);
  const { loading, error, orders } = orderMineList;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listOrderMine());
  }, [dispatch]);

  return (
    <div className="order-history-page">

      {/* HEADER */}
      <div className="order-history-header">
        <div>
          <span className="section-label">
            YOUR ACCOUNT
          </span>

          <h1>My Orders</h1>

          <p>
            Track and manage your recent orders.
          </p>
        </div>

        <div className="order-count">
          <strong>{orders ? orders.length : 0}</strong>
          <span>Orders</span>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">
          {error}
        </MessageBox>
      ) : orders.length === 0 ? (

        /* EMPTY STATE */
        <div className="order-history-empty">

          <div className="empty-order-icon">
            📦
          </div>

          <h2>No orders yet</h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <button
            type="button"
            className="primary"
            onClick={() => navigate('/')}
          >
            Start Shopping →
          </button>

        </div>

      ) : (

        /* ORDERS */
        <div className="order-history-card">

          {/* TABLE HEADER */}
          <div className="order-history-table-header">
            <div>ORDER</div>
            <div>DATE</div>
            <div>TOTAL</div>
            <div>PAYMENT</div>
            <div>DELIVERY</div>
            <div>ACTION</div>
          </div>

          {/* ORDER ROWS */}
          {orders.map((order) => (

            <div
              className="order-history-row"
              key={order._id}
            >

              {/* ORDER */}
              <div className="history-order-id">

                <div className="history-order-icon">
                  #
                </div>

                <div>
                  <strong>
                    {order._id.slice(-8)}
                  </strong>

                  <span>
                    Order ID
                  </span>
                </div>

              </div>

              {/* DATE */}
              <div className="history-date">

                <strong>
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </strong>

                <span>
                  {new Date(
                    order.createdAt
                  ).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>

              </div>

              {/* TOTAL */}
              <div className="history-total">
                ${order.totalPrice.toFixed(2)}
              </div>

              {/* PAYMENT */}
              <div>

                {order.isPaid ? (

                  <span className="history-status paid">
                    ✓ Paid
                  </span>

                ) : (

                  <span className="history-status unpaid">
                    • Unpaid
                  </span>

                )}

              </div>

              {/* DELIVERY */}
              <div>

                {order.isDelivered ? (

                  <span className="history-status delivered">
                    ✓ Delivered
                  </span>

                ) : (

                  <span className="history-status processing">
                    • Processing
                  </span>

                )}

              </div>

              {/* ACTION */}
              <div>

                <button
                  type="button"
                  className="history-details-button"
                  onClick={() =>
                    navigate(`/order/${order._id}`)
                  }
                >
                  View Details →
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}