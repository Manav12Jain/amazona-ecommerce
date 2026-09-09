import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { register } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function RegisterScreen(props) {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Password and confirm password are not match');
    } else {
      dispatch(register(name, email, password));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="signin-page">
      <div className="signin-container">

        {/* LEFT BRANDING */}
        <div className="signin-brand">
          <div className="brand-content">

            <div className="brand-badge">
              AMAZONA
            </div>

            <h1>
              Start Your
              <br />
              <span>Journey.</span>
            </h1>

            <p>
              Create your Amazona account and discover
              quality products from trusted sellers.
            </p>

            <div className="brand-features">
              <div>✓ Discover great products</div>
              <div>✓ Shop from trusted sellers</div>
              <div>✓ Easy & secure checkout</div>
            </div>

          </div>
        </div>

        {/* REGISTER FORM */}
        <div className="signin-form-wrapper">
          <form
            className="signin-form register-form"
            onSubmit={submitHandler}
          >

            <div className="signin-heading">
              <span className="section-label">
                JOIN AMAZONA
              </span>

              <h2>Create Account</h2>

              <p>
                Create your account to start shopping.
              </p>
            </div>

            {loading && <LoadingBox />}

            {error && (
              <MessageBox variant="danger">
                {error}
              </MessageBox>
            )}

            {/* NAME */}
            <div className="input-group">
              <label htmlFor="name">
                Full name
              </label>

              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <label htmlFor="email">
                Email address
              </label>

              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                type="password"
                id="password"
                placeholder="Create a password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="input-group">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                type="password"
                id="confirmPassword"
                placeholder="Re-enter your password"
                value={confirmPassword}
                required
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />
            </div>

            {/* REGISTER BUTTON */}
            <button
              className="signin-button"
              type="submit"
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>

            {/* DIVIDER */}
            <div className="signin-divider">
              <span>ALREADY A CUSTOMER?</span>
            </div>

            {/* SIGN IN */}
            <div className="register-box">
              <p>
                Already have an Amazona account?
              </p>

              <Link to={`/signin?redirect=${redirect}`}>
                Sign in to your account
              </Link>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}