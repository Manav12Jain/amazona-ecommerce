import {
  CART_ADD_ITEM,
  CART_ADD_ITEM_FAIL,
  CART_EMPTY,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_LOAD_USER_ITEMS,
} from '../constants/cartConstants';

const getInitialCartItems = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');

    // No user logged in
    if (!userInfo) {
      return [];
    }

    const user = JSON.parse(userInfo);

    if (!user || !user._id) {
      return [];
    }

    // Get this user's cart
    const cartKey = `cartItems_${user._id}`;
    const savedCart = localStorage.getItem(cartKey);

    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};

const initialState = {
  cartItems: getInitialCartItems(),
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {

    // Load cart after signin
    case CART_LOAD_USER_ITEMS:
      return {
        ...state,
        error: '',
        cartItems: action.payload || [],
      };

    // Add product
    case CART_ADD_ITEM: {
      const item = action.payload;

      const existItem = state.cartItems.find(
        (x) => x.product === item.product
      );

      if (existItem) {
        return {
          ...state,
          error: '',
          cartItems: state.cartItems.map((x) =>
            x.product === item.product ? item : x
          ),
        };
      }

      return {
        ...state,
        error: '',
        cartItems: [
          ...state.cartItems,
          item,
        ],
      };
    }

    // Remove product
    case CART_REMOVE_ITEM:
      return {
        ...state,
        error: '',
        cartItems: state.cartItems.filter(
          (x) => x.product !== action.payload
        ),
      };

    // Save shipping address
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };

    // Save payment method
    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };

    // Add-to-cart error
    case CART_ADD_ITEM_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // Empty Redux cart
    case CART_EMPTY:
      return {
        ...state,
        error: '',
        cartItems: [],
      };

    default:
      return state;
  }
};