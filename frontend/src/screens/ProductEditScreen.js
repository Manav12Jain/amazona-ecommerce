import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { detailsProduct, updateProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

export default function ProductEditScreen() {
  const navigate = useNavigate();
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successUpdate) {
      navigate('/productlist');
      return;
    }

    if (!product || product._id !== productId) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch(detailsProduct(productId));
    } else {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setBrand(product.brand);
      setDescription(product.description);
    }
  }, [
    product,
    dispatch,
    productId,
    successUpdate,
    navigate,
  ]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        category,
        brand,
        countInStock,
        description,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const bodyFormData = new FormData();
    bodyFormData.append('image', file);

    setLoadingUpload(true);
    setErrorUpload('');

    try {
      const { data } = await Axios.post(
        '/api/uploads',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setImage(data);
      setLoadingUpload(false);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };

  return (
    <div className="product-edit-page">

      {/* ================= HEADER ================= */}

      <div className="product-edit-header">

        <div>
          <span className="section-label">
            SELLER PANEL
          </span>

          <h1>
            Edit Product
          </h1>

          <p>
            Update your product information, pricing and inventory.
          </p>
        </div>

        <button
          type="button"
          className="back-product-button"
          onClick={() => navigate('/productlist')}
        >
          ← Back to Products
        </button>

      </div>


      {/* ================= STATUS ================= */}

      {loadingUpdate && <LoadingBox />}

      {errorUpdate && (
        <MessageBox variant="danger">
          {errorUpdate}
        </MessageBox>
      )}


      {loading ? (

        <LoadingBox />

      ) : error ? (

        <MessageBox variant="danger">
          {error}
        </MessageBox>

      ) : (

        <form
          className="product-edit-card"
          onSubmit={submitHandler}
        >

          {/* ================= BASIC INFORMATION ================= */}

          <div className="product-edit-section">

            <div className="product-section-heading">

              <div className="product-section-icon">
                📦
              </div>

              <div>
                <h2>Product Information</h2>

                <p>
                  Enter the basic details of your product.
                </p>
              </div>

            </div>


            <div className="product-form-grid">

              {/* NAME */}

              <div className="product-input-group full-width">

                <label htmlFor="name">
                  Product Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

              </div>


              {/* PRICE */}

              <div className="product-input-group">

                <label htmlFor="price">
                  Price
                </label>

                <div className="price-input">

                  <span>$</span>

                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />

                </div>

              </div>


              {/* STOCK */}

              <div className="product-input-group">

                <label htmlFor="countInStock">
                  Inventory
                </label>

                <input
                  id="countInStock"
                  type="number"
                  min="0"
                  placeholder="Enter stock quantity"
                  value={countInStock}
                  onChange={(e) =>
                    setCountInStock(e.target.value)
                  }
                  required
                />

              </div>


              {/* CATEGORY */}

              <div className="product-input-group">

                <label htmlFor="category">
                  Category
                </label>

                <input
                  id="category"
                  type="text"
                  placeholder="e.g. Electronics"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  required
                />

              </div>


              {/* BRAND */}

              <div className="product-input-group">

                <label htmlFor="brand">
                  Brand
                </label>

                <input
                  id="brand"
                  type="text"
                  placeholder="e.g. Apple"
                  value={brand}
                  onChange={(e) =>
                    setBrand(e.target.value)
                  }
                  required
                />

              </div>

            </div>

          </div>


          {/* ================= PRODUCT IMAGE ================= */}

          <div className="product-edit-section">

            <div className="product-section-heading">

              <div className="product-section-icon image-section-icon">
                🖼
              </div>

              <div>
                <h2>Product Image</h2>

                <p>
                  Add an image URL or upload an image from your computer.
                </p>
              </div>

            </div>


            <div className="image-edit-layout">

              {/* IMAGE PREVIEW */}

              <div className="product-image-preview">

                {image ? (

                  <img
                    src={image}
                    alt={name || 'Product preview'}
                  />

                ) : (

                  <div className="no-image-preview">
                    <span>🖼</span>
                    <p>No image</p>
                  </div>

                )}

              </div>


              {/* IMAGE CONTROLS */}

              <div className="image-controls">

                <div className="product-input-group">

                  <label htmlFor="image">
                    Image URL
                  </label>

                  <input
                    id="image"
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={image}
                    onChange={(e) =>
                      setImage(e.target.value)
                    }
                  />

                </div>


                <div className="upload-divider">
                  <span>OR</span>
                </div>


                <div className="product-input-group">

                  <label htmlFor="imageFile">
                    Upload Image
                  </label>

                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={uploadFileHandler}
                  />

                </div>

                {loadingUpload && (
                  <LoadingBox />
                )}

                {errorUpload && (
                  <MessageBox variant="danger">
                    {errorUpload}
                  </MessageBox>
                )}

              </div>

            </div>

          </div>


          {/* ================= DESCRIPTION ================= */}

          <div className="product-edit-section">

            <div className="product-section-heading">

              <div className="product-section-icon description-icon">
                ✎
              </div>

              <div>
                <h2>Description</h2>

                <p>
                  Tell customers what makes this product special.
                </p>
              </div>

            </div>


            <div className="product-input-group">

              <label htmlFor="description">
                Product Description
              </label>

              <textarea
                id="description"
                rows="6"
                placeholder="Enter a detailed product description..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                required
              />

            </div>

          </div>


          {/* ================= ACTIONS ================= */}

          <div className="product-edit-actions">

            <button
              type="button"
              className="cancel-product-button"
              onClick={() => navigate('/productlist')}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-product-button"
              disabled={loadingUpdate || loadingUpload}
            >
              {loadingUpdate
                ? 'Saving...'
                : 'Save Product →'}
            </button>

          </div>

        </form>

      )}

    </div>
  );
}