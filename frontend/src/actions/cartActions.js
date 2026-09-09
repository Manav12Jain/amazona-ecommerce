import Axios from 'axios';

import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_ADD_ITEM_FAIL,
  CART_LOAD_USER_ITEMS,
} from '../constants/cartConstants';


// ========================================
// GET USER-SPECIFIC CART KEY
// ========================================

const getCartKey = (userInfo) => {
  return userInfo
    ? `cartItems_${userInfo._id}`
    : 'cartItems_guest';
};


// ========================================
// ADD TO CART
// ========================================

export const addToCart = (productId, qty) => async (
  dispatch,
  getState
) => {
  try {
    const { data } = await Axios.get(
      `/api/products/${productId}`
    );

    const {
      cart: { cartItems },
      userSignin: { userInfo },
    } = getState();

    // ========================================
    // ONLY ONE SELLER PER ORDER
    // ========================================

    if (
      cartItems.length > 0 &&
      data.seller._id !== cartItems[0].seller._id
    ) {
      dispatch({
        type: CART_ADD_ITEM_FAIL,
        payload: `Can't Add To Cart. Buy only from ${cartItems[0].seller.seller.name} in this order`,
      });

      return;
    }

    // ========================================
    // ADD PRODUCT
    // ========================================

    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        product: data._id,
        seller: data.seller,
        qty,
      },
    });

    // ========================================
    // SAVE USER-SPECIFIC CART
    // ========================================

    localStorage.setItem(
      getCartKey(userInfo),
      JSON.stringify(
        getState().cart.cartItems
      )
    );

  } catch (error) {
    dispatch({
      type: CART_ADD_ITEM_FAIL,
      payload:
        error.response &&
        error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


// ========================================
// REMOVE FROM CART
// ========================================

export const removeFromCart = (productId) => (
  dispatch,
  getState
) => {
  const {
    userSignin: { userInfo },
  } = getState();

  dispatch({
    type: CART_REMOVE_ITEM,
    payload: productId,
  });

  // Save updated user-specific cart
  localStorage.setItem(
    getCartKey(userInfo),
    JSON.stringify(
      getState().cart.cartItems
    )
  );
};


// ========================================
// SAVE SHIPPING ADDRESS
// ========================================

export const saveShippingAddress = (data) => (
  dispatch
) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem(
    'shippingAddress',
    JSON.stringify(data)
  );
};


// ========================================
// SAVE PAYMENT METHOD
// ========================================

export const savePaymentMethod = (data) => (
  dispatch
) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });
};

export const loadUserCart = () => (dispatch, getState) => {
  const {
    userSignin: { userInfo },
  } = getState();

  if (!userInfo || !userInfo._id) {
    dispatch({
      type: CART_LOAD_USER_ITEMS,
      payload: [],
    });
    return;
  }

  const cartKey = `cartItems_${userInfo._id}`;
  const savedCart = localStorage.getItem(cartKey);

  dispatch({
    type: CART_LOAD_USER_ITEMS,
    payload: savedCart ? JSON.parse(savedCart) : [],
  });
};