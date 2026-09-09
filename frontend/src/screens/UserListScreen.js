import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser, listUsers } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_DETAILS_RESET } from '../constants/userConstants';

export default function UserListScreen() {
  const navigate = useNavigate();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users = [] } = userList;

  const userDelete = useSelector((state) => state.userDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = userDelete;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listUsers());

    dispatch({
      type: USER_DETAILS_RESET,
    });
  }, [dispatch, successDelete]);

  const deleteHandler = (user) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${user.name}?`
      )
    ) {
      dispatch(deleteUser(user._id));
    }
  };

  return (
    <div className="users-page">

      {/* ================= HEADER ================= */}

      <div className="users-header">

        <div>
          <span className="section-label">
            ADMIN PANEL
          </span>

          <h1>User Management</h1>

          <p>
            Manage customers, sellers and administrators.
          </p>
        </div>

        <div className="users-count">
          <strong>{users.length}</strong>
          <span>Users</span>
        </div>

      </div>

      {/* ================= STATUS ================= */}

      {loadingDelete && <LoadingBox />}

      {errorDelete && (
        <MessageBox variant="danger">
          {errorDelete}
        </MessageBox>
      )}

      {successDelete && (
        <MessageBox variant="success">
          User Deleted Successfully
        </MessageBox>
      )}

      {/* ================= CONTENT ================= */}

      {loading ? (

        <LoadingBox />

      ) : error ? (

        <MessageBox variant="danger">
          {error}
        </MessageBox>

      ) : users.length === 0 ? (

        /* ================= EMPTY STATE ================= */

        <div className="users-empty">

          <div className="users-empty-icon">
            👥
          </div>

          <h2>No users found</h2>

          <p>
            There are currently no users to display.
          </p>

        </div>

      ) : (

        /* ================= USERS CARD ================= */

        <div className="users-card">

          {/* TABLE HEADER */}

          <div className="users-table-header">

            <div>USER</div>
            <div>ROLE</div>
            <div>SELLER</div>
            <div>ADMIN</div>
            <div>ACTIONS</div>

          </div>

          {/* USERS */}

          {users.map((user) => (

            <div
              className="user-row"
              key={user._id}
            >

              {/* USER */}

              <div className="user-info">

                <div className="user-avatar">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : '?'}
                </div>

                <div className="user-details">

                  <strong>
                    {user.name}
                  </strong>

                  <span>
                    {user.email}
                  </span>

                  <small>
                    ID: {user._id.slice(-8)}
                  </small>

                </div>

              </div>

              {/* ROLE */}

              <div>

                {user.isAdmin ? (

                  <span className="user-role admin-role">
                    🛡 Admin
                  </span>

                ) : user.isSeller ? (

                  <span className="user-role seller-role">
                    🏪 Seller
                  </span>

                ) : (

                  <span className="user-role customer-role">
                    👤 Customer
                  </span>

                )}

              </div>

              {/* SELLER */}

              <div>

                {user.isSeller ? (

                  <span className="user-status yes-status">
                    ✓ Yes
                  </span>

                ) : (

                  <span className="user-status no-status">
                    — No
                  </span>

                )}

              </div>

              {/* ADMIN */}

              <div>

                {user.isAdmin ? (

                  <span className="user-status admin-status">
                    ✓ Yes
                  </span>

                ) : (

                  <span className="user-status no-status">
                    — No
                  </span>

                )}

              </div>

              {/* ACTIONS */}

              <div className="user-actions">

                <button
                  type="button"
                  className="user-edit-button"
                  onClick={() =>
                    navigate(`/user/${user._id}/edit`)
                  }
                >
                  ✎ Edit
                </button>

                <button
                  type="button"
                  className="user-delete-button"
                  onClick={() =>
                    deleteHandler(user)
                  }
                >
                  🗑 Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}