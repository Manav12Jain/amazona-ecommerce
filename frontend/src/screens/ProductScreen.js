import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createReview, detailsProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants';

export default function ProductScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id: productId } = useParams();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const productReviewCreate = useSelector(
    (state) => state.productReviewCreate
  );

  const {
    loading: loadingReviewCreate,
    error: errorReviewCreate,
    success: successReviewCreate,
  } = productReviewCreate;

  useEffect(() => {
    if (successReviewCreate) {
      window.alert('Review Submitted Successfully');
      setRating(0);
      setComment('');
      dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
    }

    dispatch(detailsProduct(productId));
  }, [dispatch, productId, successReviewCreate]);

  const addToCartHandler = () => {
    navigate(`/cart/${productId}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (comment && rating) {
      dispatch(
        createReview(productId, {
          rating,
          comment,
          name: userInfo.name,
        })
      );
    } else {
      alert('Please enter comment and rating');
    }
  };

  return (
    <div className="product-page">
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {/* Back */}
          <Link to="/" className="back-link">
            ← Back to Products
          </Link>

          {/* Product Main Section */}
          <div className="product-detail-card">

            {/* Product Image */}
            <div className="product-image-section">
              <div className="product-image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-detail-image"
                />
              </div>
            </div>

            {/* Product Information */}
            <div className="product-info-section">

              <span className="product-category">
                {product.category || 'Featured Product'}
              </span>

              <h1 className="product-detail-title">
                {product.name}
              </h1>

              <div className="product-rating">
                <Rating
                  rating={product.rating}
                  numReviews={product.numReviews}
                />
              </div>

              <div className="product-price-large">
                ${product.price}
              </div>

              <div className="product-description">
                <h3>About this product</h3>
                <p>{product.description}</p>
              </div>

              <div className="product-meta">
                <div>
                  <span>Brand</span>
                  <strong>{product.brand}</strong>
                </div>

                <div>
                  <span>Category</span>
                  <strong>{product.category}</strong>
                </div>

                <div>
                  <span>Reviews</span>
                  <strong>{product.numReviews}</strong>
                </div>
              </div>
            </div>

            {/* Purchase Card */}
            <div className="purchase-card">

              <div className="purchase-price">
                <span>Price</span>
                <strong>${product.price}</strong>
              </div>

              <div className="stock-row">
                <span>Availability</span>

                {product.countInStock > 0 ? (
                  <span className="stock-available">
                    ● In Stock
                  </span>
                ) : (
                  <span className="stock-unavailable">
                    ● Out of Stock
                  </span>
                )}
              </div>

              {product.countInStock > 0 && (
                <>
                  <div className="quantity-section">
                    <label htmlFor="quantity">
                      Quantity
                    </label>

                    <select
                      id="quantity"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={addToCartHandler}
                    className="add-cart-button"
                  >
                    🛒 Add to Cart
                  </button>
                </>
              )}

              <div className="seller-box">
                <span>Sold by</span>

                <Link to={`/seller/${product.seller._id}`}>
                  {product.seller.seller.name}
                </Link>

                <Rating
                  rating={product.seller.seller.rating}
                  numReviews={product.seller.seller.numReviews}
                />
              </div>
            </div>
          </div>

          {/* Reviews */}
          <section className="reviews-section">
            <div className="section-heading">
              <div>
                <span>WHAT CUSTOMERS SAY</span>
                <h2>Customer Reviews</h2>
              </div>

              <div className="review-count">
                {product.reviews.length} Reviews
              </div>
            </div>

            {product.reviews.length === 0 && (
              <MessageBox>
                There are no reviews yet. Be the first to review this product!
              </MessageBox>
            )}

            <div className="reviews-grid">
              {product.reviews.map((review) => (
                <div className="review-card" key={review._id}>
                  <div className="review-header">
                    <div className="review-user">
                      <div className="user-avatar">
                        {review.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <strong>{review.name}</strong>
                        <small>
                          {review.createdAt.substring(0, 10)}
                        </small>
                      </div>
                    </div>

                    <Rating
                      rating={review.rating}
                      caption=" "
                    />
                  </div>

                  <p>{review.comment}</p>
                </div>
              ))}
            </div>

            {/* Review Form */}
            <div className="review-form-wrapper">
              {userInfo ? (
                <form
                  className="review-form"
                  onSubmit={submitHandler}
                >
                  <span>SHARE YOUR EXPERIENCE</span>
                  <h2>Write a Customer Review</h2>

                  <div className="form-group">
                    <label htmlFor="rating">
                      Your Rating
                    </label>

                    <select
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">Select rating...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="comment">
                      Your Review
                    </label>

                    <textarea
                      id="comment"
                      placeholder="Tell us what you think about this product..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>

                  <button
                    className="submit-review-button"
                    type="submit"
                    disabled={loadingReviewCreate}
                  >
                    {loadingReviewCreate
                      ? 'Submitting...'
                      : 'Submit Review'}
                  </button>

                  {errorReviewCreate && (
                    <MessageBox variant="danger">
                      {errorReviewCreate}
                    </MessageBox>
                  )}
                </form>
              ) : (
                <div className="signin-review-box">
                  <h3>Want to leave a review?</h3>

                  <p>
                    Sign in to share your experience with other
                    customers.
                  </p>

                  <Link to="/signin">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}