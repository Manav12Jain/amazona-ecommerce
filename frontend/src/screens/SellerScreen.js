import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import { detailsUser } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import Rating from '../components/Rating';

export default function SellerScreen() {
  const { id: sellerId } = useParams();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const productList = useSelector((state) => state.productList);
  const {
    loading: loadingProducts,
    error: errorProducts,
    products = [],
  } = productList;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(detailsUser(sellerId));
    dispatch(listProducts({ seller: sellerId }));
  }, [dispatch, sellerId]);

  return (
    <div className="seller-page">

      {/* ================= SELLER HEADER ================= */}

      {loading ? (

        <LoadingBox />

      ) : error ? (

        <MessageBox variant="danger">
          {error}
        </MessageBox>

      ) : (

        <div className="seller-hero">

          <div className="seller-hero-main">

            {/* LOGO */}

            <div className="seller-logo-wrapper">

              <img
                className="seller-logo"
                src={user.seller.logo}
                alt={user.seller.name}
              />

            </div>

            {/* SELLER INFORMATION */}

            <div className="seller-info">

              <span className="section-label">
                VERIFIED SELLER
              </span>

              <h1>
                {user.seller.name}
              </h1>

              <div className="seller-rating">

                <Rating
                  rating={user.seller.rating}
                  numReviews={user.seller.numReviews}
                />

              </div>

              <p className="seller-description">
                {user.seller.description}
              </p>

              <a
                className="seller-contact"
                href={`mailto:${user.email}`}
              >
                ✉ Contact Seller
              </a>

            </div>

          </div>

          {/* SELLER STATS */}

          <div className="seller-stats">

            <div className="seller-stat">

              <strong>
                {products.length}
              </strong>

              <span>
                Products
              </span>

            </div>

            <div className="seller-stat">

              <strong>
                ★ {user.seller.rating || 0}
              </strong>

              <span>
                Rating
              </span>

            </div>

            <div className="seller-stat">

              <strong>
                {user.seller.numReviews || 0}
              </strong>

              <span>
                Reviews
              </span>

            </div>

          </div>

        </div>

      )}

      {/* ================= PRODUCTS ================= */}

      <div className="seller-products-section">

        <div className="seller-products-header">

          <div>

            <span className="section-label">
              STORE COLLECTION
            </span>

            <h2>
              Products from {user?.seller?.name || 'this seller'}
            </h2>

            <p>
              Explore the latest products from this seller.
            </p>

          </div>

          <div className="seller-product-count">
            {products.length} Products
          </div>

        </div>

        {loadingProducts ? (

          <LoadingBox />

        ) : errorProducts ? (

          <MessageBox variant="danger">
            {errorProducts}
          </MessageBox>

        ) : products.length === 0 ? (

          <div className="seller-empty">

            <div className="seller-empty-icon">
              🛍
            </div>

            <h3>
              No products available
            </h3>

            <p>
              This seller hasn't added any products yet.
            </p>

            <Link
              to="/"
              className="seller-back-button"
            >
              Continue Shopping →
            </Link>

          </div>

        ) : (

          <div className="seller-products-grid">

            {products.map((product) => (

              <Product
                key={product._id}
                product={product}
              />

            ))}

          </div>

        )}

      </div>

    </div>
  );
}