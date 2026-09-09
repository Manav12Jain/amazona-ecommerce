import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signin } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function SigninScreen(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="signin-page">
      <div className="signin-container">

        {/* Left branding section */}
        <div className="signin-brand">
          <div className="brand-content">
            <div className="brand-badge">AMAZONA</div>

            <h1>
              Welcome
              <br />
              <span>Back.</span>
            </h1>

            <p>
              Sign in to continue shopping from your favorite sellers
              and discover products you'll love.
            </p>

            <div className="brand-features">
              <div>✓ Trusted sellers</div>
              <div>✓ Quality products</div>
              <div>✓ Secure checkout</div>
            </div>
          </div>
        </div>

        {/* Sign in form */}
        <div className="signin-form-wrapper">
          <form className="signin-form" onSubmit={submitHandler}>

            <div className="signin-heading">
              <span className="section-label">WELCOME BACK</span>
              <h2>Sign In</h2>
              <p>Enter your details to access your account.</p>
            </div>

            {loading && <LoadingBox />}

            {error && (
              <MessageBox variant="danger">
                {error}
              </MessageBox>
            )}

            <div className="input-group">
              <label htmlFor="email">Email address</label>

              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <div className="password-label">
                <label htmlFor="password">Password</label>
                <span>Required</span>
              </div>

              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="signin-button" type="submit">
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>

            <div className="signin-divider">
              <span>NEW TO AMAZONA?</span>
            </div>

            <div className="register-box">
              <p>
                Create an account to start shopping,
                track orders and more.
              </p>

              <Link to={`/register?redirect=${redirect}`}>
                Create your account
              </Link>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}