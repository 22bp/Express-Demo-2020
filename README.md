# Book Management API
Backend API for Book Management application

## Usage
 Go to .env file and update the values to your own
 - Create [MongoDB Cloud Cluster](account.mongodb.com) and get MONGO_URI to connect database
 - Create [mailtrap.io](mailtrap.io) account and get MAILTRAP_USER and MAILTRAP_PASS
 - Create [cloudinary.com](cloudinary.com) account and get CLOUDINARY_URL
 - Generate your SECRET_COOKIE and JWT_SECRET

## Demo
The API is live at [Swagger.io](https://app.swaggerhub.com/apis/huynhdieutuong/book-management/1.0)

- Version: 1.0.0
- Author: Tuong Huynh

## Functionality
### CRUD Books
- Show all books
  - Search books by Title
  - Pagination
- Show a book
- Add book (Require Admin)
- Update book (Require Admin)
- Delete book (Require Admin)

### CRUD Users (Require Admin)
- Show all users
  - Search users by Name
  - Pagination
- Add user
- Show user
- Update user
- Delete user

### CRUD Transactions - Borrow Books (Require Auth)
- Show transactions
  - Show transactions by User (Show all transactions if Admin)
  - Search transactions by Id
  - Pagination
- Show transaction (If user is not own this transaction, don't show)
- Add transaction (Require Admin)
- Update transaction (Require Admin)
- Delete transaction (Require Admin)
- Make finished (Require Admin)

### Authentication
- Register (Unique email)
- Login (JWT Token)

### Profile (Require Auth)
- Get user info
- Update info (name, phone)
- Update avatar
- Change password

### Add To Cart
- Add to cart
- Change quantity (decrease button, increase button, input number)
- Make transaction from cart (Require Auth)
- Auto delete items in cart after made transaction