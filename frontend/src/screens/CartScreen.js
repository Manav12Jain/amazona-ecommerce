import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import MessageBox from '../components/MessageBox';

export default function CartScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: productId } = params;

  const { search } = useLocation();
  const qtyInUrl = new URLSearchParams(search).get('qty');
  const qty = qtyInUrl ? Number(qtyInUrl) : 1;

  const cart = useSelector((state) => state.cart);
  const { cartItems, error } = cart;

  const dispatch = useDispatch();

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  const totalItems = cartItems.reduce((a, c) => a + c.qty, 0);

  const subtotal = cartItems.reduce(
    (a, c) => a + c.price * c.qty,
    0
  );

  return (
    <div className="cart-page">

      {/* Header */}
      <div className="cart-header">
        <div>
          <p className="section-label">YOUR SHOPPING BAG</p>
          <h1>Shopping Cart</h1>
        </div>

        <Link to="/" className="continue-shopping">
          ← Continue Shopping
        </Link>
      </div>

      {error && (
        <MessageBox variant="danger">
          {error}
        </MessageBox>
      )}

      {cartItems.length === 0 ? (
        /* Empty Cart */
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h2>Your cart is empty</h2>

          <p>
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link to="/" className="primary cart-shop-button">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">

          {/* Cart Items */}
          <div className="cart-items-section">

            <div className="cart-items-header">
            <span>
            {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}
            </span>
            </div>

            <div className="cart-items">

              {cartItems.map((item) => (
                <div className="cart-item" key={item.product}>

                  {/* Product Image */}
                  <Link to={`/product/${item.product}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-product-image"
                    />
                  </Link>

                  {/* Product Information */}
                  <div className="cart-product-info">

                    <Link
                      to={`/product/${item.product}`}
                      className="cart-product-name"
                    >
                      {item.name}
                    </Link>

                    <p className="cart-stock">
                      ✓ In Stock
                    </p>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        removeFromCartHandler(item.product)
                      }
                    >
                      Remove
                    </button>

                  </div>

                  {/* Quantity */}
                  <div className="cart-quantity">

                    <label>Quantity</label>

                    <select
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(
                            item.product,
                            Number(e.target.value)
                          )
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map(
                        (x) => (
                          <option
                            key={x + 1}
                            value={x + 1}
                          >
                            {x + 1}
                          </option>
                        )
                      )}
                    </select>

                  </div>

                  {/* Price */}
                  <div className="cart-item-price">
                    ${item.price}
                  </div>

                </div>
              ))}

            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary">

            <div className="summary-header">
              <h2>Order Summary</h2>
            </div>

            <div className="summary-row">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">FREE</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <button
              type="button"
              onClick={checkoutHandler}
              className="primary checkout-button"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout →
            </button>

            <div className="secure-checkout">
              🔒 Secure checkout
            </div>

          </div>

        </div>
      )}

    </div>
  );
}