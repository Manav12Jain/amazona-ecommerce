import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  createProduct,
  deleteProduct,
  listProducts,
} from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
} from '../constants/productConstants';

export default function ProductListScreen() {
  const navigate = useNavigate();

  const { pageNumber = 1 } = useParams();
  const { pathname } = useLocation();

  const sellerMode = pathname.indexOf('/seller') >= 0;

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      navigate(`/product/${createdProduct._id}/edit`);
    }

    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    }

    dispatch(
      listProducts({
        seller: sellerMode ? userInfo._id : '',
        pageNumber,
      })
    );
  }, [
    createdProduct,
    dispatch,
    navigate,
    sellerMode,
    successCreate,
    successDelete,
    userInfo._id,
    pageNumber,
  ]);

  const deleteHandler = (product) => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      dispatch(deleteProduct(product._id));
    }
  };

  const createHandler = () => {
    dispatch(createProduct());
  };

  return (
    <div className="admin-products-page">

      {/* HEADER */}
      <div className="products-page-header">
        <div>
          <div className="products-eyebrow">
            {sellerMode ? 'SELLER PANEL' : 'ADMIN PANEL'}
          </div>

          <h1>Products</h1>

          <p>
            Manage your products, pricing, categories and inventory.
          </p>
        </div>

        <button
          type="button"
          className="create-product-button"
          onClick={createHandler}
          disabled={loadingCreate}
        >
          <i className="fa fa-plus"></i>
          {loadingCreate ? 'Creating...' : 'Create Product'}
        </button>
      </div>

      {/* STATUS MESSAGES */}
      {loadingDelete && <LoadingBox />}

      {errorDelete && (
        <MessageBox variant="danger">
          {errorDelete}
        </MessageBox>
      )}

      {loadingCreate && !errorCreate && <LoadingBox />}

      {errorCreate && (
        <MessageBox variant="danger">
          {errorCreate}
        </MessageBox>
      )}

      {/* PRODUCTS */}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">
          {error}
        </MessageBox>
      ) : (
        <>
          {/* PRODUCT COUNT */}
          <div className="products-toolbar">
            <div>
              <strong>
                {products.length}
              </strong>{' '}
              products shown
            </div>

            <div className="products-page-info">
              Page {page} of {pages}
            </div>
          </div>

          {/* PRODUCT TABLE */}
          <div className="products-table-card">
            <div className="products-table-wrapper">
              <table className="products-table">

                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>PRICE</th>
                    <th>CATEGORY</th>
                    <th>BRAND</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="empty-products"
                      >
                        <div className="empty-products-icon">
                          <i className="fa fa-cube"></i>
                        </div>

                        <strong>No products found</strong>

                        <span>
                          Create your first product to get started.
                        </span>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id}>

                        {/* PRODUCT */}
                        <td>
                          <div className="product-name-cell">

                            <div className="product-image-wrapper">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="product-list-image"
                              />
                            </div>

                            <div className="product-name-info">
                              <strong>{product.name}</strong>

                              <span>
                                ID: {product._id.substring(0, 8)}...
                              </span>
                            </div>

                          </div>
                        </td>

                        {/* PRICE */}
                        <td>
                          <strong className="product-price">
                            ${Number(product.price).toFixed(2)}
                          </strong>
                        </td>

                        {/* CATEGORY */}
                        <td>
                          <span className="product-category">
                            {product.category}
                          </span>
                        </td>

                        {/* BRAND */}
                        <td>
                          <span className="product-brand">
                            {product.brand}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td>
                          <div className="product-actions">

                            <button
                              type="button"
                              className="product-action edit-action"
                              onClick={() =>
                                navigate(
                                  `/product/${product._id}/edit`
                                )
                              }
                            >
                              <i className="fa fa-pencil"></i>
                              Edit
                            </button>

                            <button
                              type="button"
                              className="product-action delete-action"
                              onClick={() =>
                                deleteHandler(product)
                              }
                            >
                              <i className="fa fa-trash"></i>
                              Delete
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>
          </div>

          {/* PAGINATION */}
          {pages > 1 && (
            <div className="products-pagination">

              <span className="pagination-label">
                Pages
              </span>

              <div className="pagination-buttons">
                {[...Array(pages).keys()].map((x) => (
                  <Link
                    className={
                      x + 1 === page
                        ? 'pagination-number active'
                        : 'pagination-number'
                    }
                    key={x + 1}
                    to={`/productlist/pageNumber/${x + 1}`}
                  >
                    {x + 1}
                  </Link>
                ))}
              </div>

            </div>
          )}

        </>
      )}
    </div>
  );
}