# 🛒 Amazona E-Commerce

A full-stack e-commerce web application inspired by Amazon, built with
the MERN stack.

The application provides a complete online shopping experience with user
authentication, product browsing, search, shopping cart, checkout, order
management, and separate admin and seller functionality.

## ✨ Features

### 👤 User

-   User registration and login
-   User profile management
-   Browse and search products
-   Product categories
-   Product ratings and reviews
-   Shopping cart
-   Shipping address management
-   Checkout and payment method selection
-   Order placement, history, and details

### 🧑‍💼 Admin

-   Admin dashboard
-   Manage users
-   Manage products
-   Add and edit products
-   Manage orders
-   View order details

### 🏪 Seller

-   Seller dashboard
-   Manage seller products
-   Manage seller orders

### 💬 Other Features

-   Customer support / chat
-   Map functionality
-   Protected routes
-   Role-based access control
-   Image upload functionality
-   Responsive user interface

## 🛠️ Tech Stack

### Frontend

-   React.js
-   Redux
-   React Router
-   JavaScript
-   CSS
-   Axios

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose

### Development

-   Git
-   GitHub
-   npm
-   ESLint

## 📁 Project Structure

``` text
amazona-ecommerce/
├── backend/
│   ├── models/
│   ├── routers/
│   ├── data.js
│   ├── server.js
│   └── utils.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── actions/
│       ├── components/
│       ├── constants/
│       ├── reducers/
│       └── screens/
├── template/
├── uploads/
├── .gitignore
├── .eslintrc.js
├── package.json
├── Procfile
└── README.md
```

## 🚀 Getting Started

### Prerequisites

-   Node.js
-   npm
-   MongoDB
-   Git

### 1. Clone the repository

``` bash
git clone https://github.com/Manav12Jain/amazona-ecommerce.git
cd amazona-ecommerce
```

### 2. Install dependencies

``` bash
npm install
cd frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

``` env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run the application

From the project root:

``` bash
npm start
```

Then, from the `frontend` directory:

``` bash
npm start
```

## 📌 Main Application Areas

  Area       Description
  ---------- ------------------------------------
  Home       Browse available products
  Product    View product details and ratings
  Search     Search and filter products
  Cart       Manage items before checkout
  Checkout   Complete the purchase process
  Orders     View order history and details
  Profile    Manage user information
  Admin      Manage users, products, and orders
  Seller     Manage seller products and orders
  Support    Customer support functionality

## 🔐 Authentication & Authorization

The application includes authentication and role-based authorization.

Available roles: - User - Seller - Admin

Protected routes prevent unauthorized users from accessing restricted
pages.

## 📦 Backend

The backend is built with Node.js and Express.js and provides APIs for
users, products, orders, authentication, and image uploads.

MongoDB is used for data storage, with Mongoose for database modeling.

## 🎨 Frontend

The frontend is built with React.js and Redux.

The application is organized into actions, components, constants,
reducers, and screens.

## 📷 Screenshots

Add screenshots of the application here to showcase the user interface.

## 🔮 Future Improvements

-   Online payment gateway integration
-   Product wishlist
-   Advanced product filtering
-   Improved search
-   Email notifications
-   Product reviews with images
-   Seller analytics
-   Production deployment

## 👨‍💻 Author

**Manav Jain**

GitHub: [Manav12Jain](https://github.com/Manav12Jain)

## 📄 License

This project is available for educational and development purposes.
