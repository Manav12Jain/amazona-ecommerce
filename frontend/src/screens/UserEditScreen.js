import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { detailsUser, updateUser } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_RESET } from '../constants/userConstants';

export default function UserEditScreen() {
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate('/userlist');
    }

    if (!user) {
      dispatch(detailsUser(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setIsSeller(user.isSeller);
      setIsAdmin(user.isAdmin);
    }
  }, [dispatch, navigate, successUpdate, user, userId]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      updateUser({
        _id: userId,
        name,
        email,
        isSeller,
        isAdmin,
      })
    );
  };

  return (
    <div className="user-edit-page">

      {/* ================= HEADER ================= */}

      <div className="user-edit-header">

        <div>
          <span className="section-label">
            ADMIN PANEL
          </span>

          <h1>Edit User</h1>

          <p>
            Update account information and permissions.
          </p>
        </div>

        <button
          type="button"
          className="back-users-button"
          onClick={() => navigate('/userlist')}
        >
          ← Back to Users
        </button>

      </div>

      {/* ================= LOADING / ERROR ================= */}

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
          className="user-edit-card"
          onSubmit={submitHandler}
        >

          {/* ================= USER INFORMATION ================= */}

          <div className="user-edit-section">

            <div className="user-edit-section-heading">

              <div className="edit-section-icon">
                👤
              </div>

              <div>
                <h2>User Information</h2>

                <p>
                  Update the user's basic account details.
                </p>
              </div>

            </div>

            {/* NAME */}

            <div className="edit-input-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

            </div>

            {/* EMAIL */}

            <div className="edit-input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

          </div>


          {/* ================= PERMISSIONS ================= */}

          <div className="user-edit-section">

            <div className="user-edit-section-heading">

              <div className="edit-section-icon permission-icon">
                🛡
              </div>

              <div>
                <h2>Permissions</h2>

                <p>
                  Control what this user can access.
                </p>
              </div>

            </div>


            {/* SELLER */}

            <label
              className={`permission-option ${
                isSeller ? 'permission-selected' : ''
              }`}
            >

              <input
                type="checkbox"
                id="isSeller"
                checked={isSeller}
                onChange={(e) =>
                  setIsSeller(e.target.checked)
                }
              />

              <div className="permission-content">

                <strong>
                  Seller Account
                </strong>

                <span>
                  Allow this user to sell products
                  on Amazona.
                </span>

              </div>

              <div className="permission-check">
                {isSeller ? '✓' : ''}
              </div>

            </label>


            {/* ADMIN */}

            <label
              className={`permission-option ${
                isAdmin ? 'permission-selected admin-selected' : ''
              }`}
            >

              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) =>
                  setIsAdmin(e.target.checked)
                }
              />

              <div className="permission-content">

                <strong>
                  Administrator
                </strong>

                <span>
                  Give this user access to
                  administrative features.
                </span>

              </div>

              <div className="permission-check">
                {isAdmin ? '✓' : ''}
              </div>

            </label>

          </div>


          {/* ================= ACTIONS ================= */}

          <div className="user-edit-actions">

            <button
              type="button"
              className="cancel-edit-button"
              onClick={() => navigate('/userlist')}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-user-button"
              disabled={loadingUpdate}
            >
              {loadingUpdate
                ? 'Saving...'
                : 'Save Changes →'}
            </button>

          </div>

        </form>

      )}

    </div>
  );
}