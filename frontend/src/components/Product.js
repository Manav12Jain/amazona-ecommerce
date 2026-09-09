import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

export default function Product(props) {
  const { product } = props;

  return (
    <div className="product-card">

      {/* PRODUCT IMAGE */}
      <Link
        to={`/product/${product._id}`}
        className="product-image-container"
      >
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
        />
      </Link>

      {/* PRODUCT INFORMATION */}
      <div className="product-card-body">

        <Link to={`/product/${product._id}`}>
          <h2 className="product-name">
            {product.name}
          </h2>
        </Link>

        <Rating
          rating={product.rating}
          numReviews={product.numReviews}
        />

        <div className="product-bottom">

          <div className="product-price">
            ${product.price}
          </div>

          <Link
            className="product-seller"
            to={`/seller/${product.seller._id}`}
          >
            {product.seller.seller.name}
          </Link>

        </div>

        <Link
          to={`/product/${product._id}`}
          className="view-product-button"
        >
          View Product
        </Link>

      </div>
    </div>
  );
}