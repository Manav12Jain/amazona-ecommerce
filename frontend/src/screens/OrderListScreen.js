import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { deleteOrder, listOrders } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';

export default function OrderListScreen() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const sellerMode = pathname.indexOf('/seller') >= 0;

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders = [] } = orderList;

  const orderDelete = useSelector((state) => state.orderDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = orderDelete;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: ORDER_DELETE_RESET });

    if (userInfo) {
      dispatch(
        listOrders({
          seller: sellerMode ? userInfo._id : '',
        })
      );
    }
  }, [dispatch, sellerMode, successDelete, userInfo]);

  const deleteHandler = (order) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      dispatch(deleteOrder(order._id));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="orders-page">

      {/* ================= HEADER ================= */}
      <div className="orders-header">

        <div className="orders-header-content">
          <span className="section-label">
            {sellerMode ? 'SELLER CENTER' : 'YOUR ACCOUNT'}
          </span>

          <h1>
            {sellerMode ? 'Order Management' : 'My Orders'}
          </h1>

          <p>
            {sellerMode
              ? 'View and manage all customer orders.'
              : 'Track and manage your recent orders.'}
          </p>
        </div>

        <div className="orders-count">
          <strong>{orders.length}</strong>
          <span>Orders</span>
        </div>

      </div>

      {/* ================= DELETE STATUS ================= */}

      {loadingDelete && <LoadingBox />}

      {errorDelete && (
        <MessageBox variant="danger">
          {errorDelete}
        </MessageBox>
      )}

      {/* ================= MAIN ================= */}

      {loading ? (
        <LoadingBox />

      ) : error ? (

        <MessageBox variant="danger">
          {error}
        </MessageBox>

      ) : orders.length === 0 ? (

        /* ================= EMPTY STATE ================= */

        <div className="orders-empty">

          <div className="orders-empty-icon">
            📦
          </div>

          <h2>No orders yet</h2>

          <p>
            {sellerMode
              ? 'There are no customer orders yet.'
              : "You haven't placed any orders yet."}
          </p>

          {!sellerMode && (
            <button
              className="primary"
              type="button"
              onClick={() => navigate('/')}
            >
              Start Shopping →
            </button>
          )}

        </div>

      ) : (

        /* ================= ORDERS CARD ================= */

        <div className="orders-card">

          {/* TABLE HEADER */}

          <div className="orders-table-header">

            <div>ORDER</div>

            <div>
              {sellerMode ? 'CUSTOMER' : 'DATE'}
            </div>

            <div>TOTAL</div>

            <div>PAYMENT</div>

            <div>DELIVERY</div>

            <div>ACTION</div>

          </div>

          {/* ORDER ROWS */}

          {orders.map((order) => (

            <div
              className="order-row"
              key={order._id}
            >

              {/* ORDER */}

              <div className="order-id">

                <span className="order-icon">
                  #
                </span>

                <div>
                  <strong>
                    {order._id.slice(-8)}
                  </strong>

                  <span>
                    Order ID
                  </span>
                </div>

              </div>

              {/* CUSTOMER / DATE */}

              <div className="order-date">

                {sellerMode ? (

                  <>
                    <strong>
                      {order.user?.name || 'Unknown'}
                    </strong>

                    <span>
                      {order.user?.email || ''}
                    </span>
                  </>

                ) : (

                  <>
                    <strong>
                      {formatDate(order.createdAt)}
                    </strong>

                    <span>
                      {formatTime(order.createdAt)}
                    </span>
                  </>

                )}

              </div>

              {/* TOTAL */}

              <div className="order-total">
                ${order.totalPrice.toFixed(2)}
              </div>

              {/* PAYMENT */}

              <div>

                {order.isPaid ? (

                  <span className="status-badge success">
                    ✓ Paid
                  </span>

                ) : (

                  <span className="status-badge pending">
                    • Unpaid
                  </span>

                )}

              </div>

              {/* DELIVERY */}

              <div>

                {order.isDelivered ? (

                  <span className="status-badge success">
                    ✓ Delivered
                  </span>

                ) : (

                  <span className="status-badge processing">
                    • Processing
                  </span>

                )}

              </div>

              {/* ACTION */}

              <div className="order-actions">

                <button
                  type="button"
                  className="order-details-button"
                  onClick={() =>
                    navigate(`/order/${order._id}`)
                  }
                >
                  View Details →
                </button>

                {sellerMode && (

                  <button
                    type="button"
                    className="order-delete-button"
                    onClick={() =>
                      deleteHandler(order)
                    }
                  >
                    Delete
                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}