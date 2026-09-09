import React, { useEffect } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import { listTopSellers } from '../actions/userActions';
import { Link } from 'react-router-dom';

export default function HomeScreen() {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products = [] } = productList;
  const userTopSellersList = useSelector(
    (state) => state.userTopSellersList
  );

const {
  loading: loadingSellers,
  error: errorSellers,
  users: sellers = [],
} = userTopSellersList;

  useEffect(() => {
    dispatch(listProducts({}));
    dispatch(listTopSellers());
  }, [dispatch]);

  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-small-text">WELCOME TO AMAZONA</span>

          <h1>
            Discover Your
            <span> Perfect Style</span>
          </h1>

          <p>
            Explore quality products from trusted sellers,
            all in one place.
          </p>

          <a href="#featured-products" className="hero-button">
            Shop Now
          </a>
        </div>
      </section>

      {/* TOP SELLERS */}
      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="section-label">TRUSTED BRANDS</span>
            <h2>Top Sellers</h2>
          </div>
        </div>

        {loadingSellers ? (
          <LoadingBox />
        ) : errorSellers ? (
          <MessageBox variant="danger">{errorSellers}</MessageBox>
        ) : (
          <>
            {sellers.length === 0 && (
              <MessageBox>No Seller Found</MessageBox>
            )}

            {sellers.length > 0 && (
              <div className="seller-carousel">
                <Carousel
                  showArrows
                  autoPlay
                  infiniteLoop
                  interval={3500}
                  showThumbs={false}
                  showStatus={false}
                  showIndicators={true}
                >
                  {sellers.map((seller) => (
                    <div key={seller._id} className="seller-slide">
                      <Link to={`/seller/${seller._id}`}>
                        <div className="seller-image-container">
                          <img
                            src={seller.seller.logo}
                            alt={seller.seller.name}
                          />
                        </div>

                        <p className="seller-name">
                          {seller.seller.name}
                        </p>
                      </Link>
                    </div>
                  ))}
                </Carousel>
              </div>
            )}
          </>
        )}
      </section>

      {/* FEATURED PRODUCTS */}
      <section
        className="home-section featured-section"
        id="featured-products"
      >
        <div className="section-heading">
          <div>
            <span className="section-label">HANDPICKED FOR YOU</span>
            <h2>Featured Products</h2>
          </div>

          <span className="product-count">
            {products.length} Products
          </span>
        </div>

        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            {products.length === 0 && (
              <MessageBox>No Product Found</MessageBox>
            )}

            <div className="product-grid">
              {products.map((product) => (
                <Product
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* BOTTOM PROMOTION */}
      <section className="promo-section">
        <div>
          <span>AMAZONA COLLECTION</span>
          <h2>Quality. Style. Value.</h2>
          <p>Everything you need, just a click away.</p>
        </div>

        <a href="#featured-products" className="promo-button">
          Explore Products
        </a>
      </section>

    </div>
  );
}