import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  detailsUser,
  updateUserProfile,
} from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [sellerName, setSellerName] = useState('');
  const [sellerLogo, setSellerLogo] = useState('');
  const [sellerDescription, setSellerDescription] = useState('');

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdateProfile = useSelector(
    (state) => state.userUpdateProfile
  );

  const {
    success: successUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
  } = userUpdateProfile;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(detailsUser(userInfo._id));
    } else {
      setName(user.name);
      setEmail(user.email);

      if (user.seller) {
        setSellerName(user.seller.name || '');
        setSellerLogo(user.seller.logo || '');
        setSellerDescription(user.seller.description || '');
      }
    }
  }, [dispatch, userInfo._id, user]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Password and Confirm Password Are Not Matched');
      return;
    }

    dispatch(
      updateUserProfile({
        userId: user._id,
        name,
        email,
        password,
        sellerName,
        sellerLogo,
        sellerDescription,
      })
    );
  };

  return (
    <div className="profile-page">

      {/* HEADER */}
      <div className="profile-header">
        <div>
          <span className="section-label">YOUR ACCOUNT</span>

          <h1>My Profile</h1>

          <p>
            Manage your personal information and account settings.
          </p>
        </div>

        <div className="profile-avatar">
          {name ? name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">
          {error}
        </MessageBox>
      ) : (
        <div className="profile-layout">

          {/* MAIN PROFILE CARD */}
          <div className="profile-card">

            <div className="profile-card-header">
              <div>
                <h2>Personal Information</h2>
                <p>
                  Update your name and email address.
                </p>
              </div>

              <div className="profile-icon">
                👤
              </div>
            </div>

            <form onSubmit={submitHandler}>

              {loadingUpdate && (
                <LoadingBox />
              )}

              {errorUpdate && (
                <MessageBox variant="danger">
                  {errorUpdate}
                </MessageBox>
              )}

              {successUpdate && (
                <MessageBox variant="success">
                  Profile Updated Successfully
                </MessageBox>
              )}

              {/* NAME */}
              <div className="profile-field">
                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="profile-field">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

              {/* PASSWORD SECTION */}
              <div className="profile-section-divider">
                <span>SECURITY</span>
              </div>

              <div className="profile-field">
                <label htmlFor="password">
                  New Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <small>
                  Leave blank if you don't want to change
                  your password.
                </small>
              </div>

              <div className="profile-field">
                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />
              </div>

              {/* SELLER SECTION */}
              {user.isSeller && (
                <>
                  <div className="profile-section-divider">
                    <span>SELLER INFORMATION</span>
                  </div>

                  <div className="seller-box">

                    <div className="seller-box-header">
                      <div>
                        <h3>Seller Profile</h3>
                        <p>
                          Manage your seller information.
                        </p>
                      </div>

                      <span className="seller-badge">
                        SELLER
                      </span>
                    </div>

                    <div className="profile-field">
                      <label htmlFor="sellerName">
                        Seller Name
                      </label>

                      <input
                        id="sellerName"
                        type="text"
                        placeholder="Enter seller name"
                        value={sellerName}
                        onChange={(e) =>
                          setSellerName(e.target.value)
                        }
                      />
                    </div>

                    <div className="profile-field">
                      <label htmlFor="sellerLogo">
                        Seller Logo URL
                      </label>

                      <input
                        id="sellerLogo"
                        type="text"
                        placeholder="Enter logo URL"
                        value={sellerLogo}
                        onChange={(e) =>
                          setSellerLogo(e.target.value)
                        }
                      />
                    </div>

                    <div className="profile-field">
                      <label htmlFor="sellerDescription">
                        Seller Description
                      </label>

                      <textarea
                        id="sellerDescription"
                        placeholder="Tell customers about your store"
                        value={sellerDescription}
                        onChange={(e) =>
                          setSellerDescription(
                            e.target.value
                          )
                        }
                        rows="4"
                      />
                    </div>

                  </div>
                </>
              )}

              {/* UPDATE BUTTON */}
              <div className="profile-actions">
                <button
                  className="profile-update-button"
                  type="submit"
                  disabled={loadingUpdate}
                >
                  {loadingUpdate
                    ? 'Updating...'
                    : 'Save Changes →'}
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT SIDE INFO */}
          <div className="profile-sidebar">

            <div className="profile-info-card">

              <span className="section-label">
                ACCOUNT
              </span>

              <h2>Account Settings</h2>

              <div className="account-info-row">
                <span>Account type</span>

                <strong>
                  {user.isSeller
                    ? 'Seller'
                    : 'Customer'}
                </strong>
              </div>

              <div className="account-info-row">
                <span>Name</span>

                <strong>
                  {name}
                </strong>
              </div>

              <div className="account-info-row">
                <span>Email</span>

                <strong className="account-email">
                  {email}
                </strong>
              </div>

            </div>

            <div className="profile-security-card">

              <div className="security-icon">
                🔒
              </div>

              <h3>Your information is secure</h3>

              <p>
                Your account information is protected
                and only accessible to you.
              </p>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}