import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingAddressScreen(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [lat, setLat] = useState(shippingAddress.lat);
  const [lng, setLng] = useState(shippingAddress.lng);

  const userAddressMap = useSelector((state) => state.userAddressMap);
  const { address: addressMap } = userAddressMap;

  if (!userInfo) {
    navigate('/signin');
  }

  const [fullName, setFullName] = useState(
    shippingAddress.fullName || ''
  );

  const [address, setAddress] = useState(
    shippingAddress.address || ''
  );

  const [city, setCity] = useState(
    shippingAddress.city || ''
  );

  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );

  const [country, setCountry] = useState(
    shippingAddress.country || ''
  );

  const submitHandler = (e) => {
    e.preventDefault();

    const newLat = addressMap ? addressMap.lat : lat;
    const newLng = addressMap ? addressMap.lng : lng;

    if (addressMap) {
      setLat(addressMap.lat);
      setLng(addressMap.lng);
    }

    let moveOn = true;

    if (!newLat || !newLng) {
      moveOn = window.confirm(
        'You did not set your location on map. Continue?'
      );
    }

    if (moveOn) {
      dispatch(
        saveShippingAddress({
          fullName,
          address,
          city,
          postalCode,
          country,
          lat: newLat,
          lng: newLng,
        })
      );

      navigate('/payment');
    }
  };

  const chooseOnMap = () => {
    dispatch(
      saveShippingAddress({
        fullName,
        address,
        city,
        postalCode,
        country,
        lat,
        lng,
      })
    );

    navigate('/map');
  };

  return (
    <div className="checkout-page">

      {/* CHECKOUT STEPS */}
      <CheckoutSteps step1 step2 />

      {/* PAGE HEADER */}
      <div className="checkout-header">
        <span className="section-label">
          CHECKOUT
        </span>

        <h1>Shipping Address</h1>

        <p>
          Where should we deliver your order?
        </p>
      </div>

      {/* FORM CARD */}
      <div className="shipping-card">

        <div className="shipping-card-header">
          <div>
            <h2>Delivery Information</h2>
            <p>
              Enter the address where you'd like your order delivered.
            </p>
          </div>

          <div className="secure-badge">
            🔒 Secure
          </div>
        </div>

        <form onSubmit={submitHandler}>

          {/* FULL NAME */}
          <div className="shipping-input">
            <label htmlFor="fullName">
              Full Name
            </label>

            <input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* ADDRESS */}
          <div className="shipping-input">
            <label htmlFor="address">
              Street Address
            </label>

            <input
              type="text"
              id="address"
              placeholder="House number, street, area"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* CITY + POSTAL */}
          <div className="shipping-row">

            <div className="shipping-input">
              <label htmlFor="city">
                City
              </label>

              <input
                type="text"
                id="city"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="shipping-input">
              <label htmlFor="postalCode">
                Postal Code
              </label>

              <input
                type="text"
                id="postalCode"
                placeholder="Enter postal code"
                value={postalCode}
                onChange={(e) =>
                  setPostalCode(e.target.value)
                }
                required
              />
            </div>

          </div>

          {/* COUNTRY */}
          <div className="shipping-input">
            <label htmlFor="country">
              Country
            </label>

            <input
              type="text"
              id="country"
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>

          {/* MAP */}
          <div className="location-section">

            <div>
              <h3>📍 Delivery Location</h3>

              <p>
                Choose your exact location on the map
                for more accurate delivery.
              </p>
            </div>

            <button
              type="button"
              className="map-button"
              onClick={chooseOnMap}
            >
              Choose on Map
            </button>

          </div>

          {/* CONTINUE */}
          <button
            className="continue-button"
            type="submit"
          >
            Continue to Payment →
          </button>

        </form>

      </div>

      {/* TRUST MESSAGE */}
      <div className="checkout-trust">
        <span>🔒</span>
        Your information is secure and will only be used
        to deliver your order.
      </div>

    </div>
  );
}