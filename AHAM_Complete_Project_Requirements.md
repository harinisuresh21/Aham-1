# AHAM --- E-Commerce Website Functional & Technical Requirements

**Project:** AHAM\
**Product Type:** Natural / traditional / ancient-style wellness, food,
turmeric, oils and related products\
**Team Size:** 4 developers\
**Frontend:** React\
**Backend:** Python + FastAPI\
**Authentication:** Firebase Authentication (recommended)\
**Database:** PostgreSQL (recommended)\
**Storage:** Firebase Storage or S3-compatible object storage for
product images\
**Payments:** Not integrated in Phase 1 --- Cash on Delivery (COD) only\
**Notifications:** Admin email when a new order is placed

------------------------------------------------------------------------

# 1. Project Overview

AHAM is an e-commerce web application for selling natural, traditional
and ancient-style products such as:

-   Natural turmeric products
-   Traditional oils
-   Natural food products
-   Herbal / wellness products
-   Other AHAM-branded products

The platform will have two primary roles:

1.  **Customer/User**
2.  **Administrator/Admin**

Customers can browse products, view product details and reviews, add
products to cart, place COD orders and manage their account.

Admins have complete management access over users, products, orders,
reviews and other operational data.

Payment gateway integration is **out of scope for Phase 1**. Customers
will place orders using **Cash on Delivery**.

------------------------------------------------------------------------

# 2. Primary Goals

The application should:

-   Provide a clean and modern shopping experience.
-   Allow customers to register/login securely.
-   Support Google OAuth login.
-   Support manual email/password authentication.
-   Provide role-based access control.
-   Allow customers to browse and search products.
-   Allow customers to add/update/remove cart items.
-   Allow customers to place COD orders.
-   Notify the admin when an order is placed.
-   Allow customers to review products.
-   Allow admins to manage users.
-   Allow admins to create, update and delete products.
-   Allow admins to upload product images.
-   Allow admins to change product prices and stock.
-   Allow admins to manage orders and order status.
-   Keep business logic in the FastAPI backend.
-   Keep the database normalized and maintainable.
-   Make the application production-ready and scalable.

------------------------------------------------------------------------

# 3. Recommended Architecture

## 3.1 High-Level Architecture

``` text
                    ┌─────────────────────┐
                    │       Customer      │
                    │       Browser       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     React Frontend  │
                    │                     │
                    │ Pages / Components  │
                    │ Auth State          │
                    │ Cart State          │
                    │ API Client          │
                    └──────────┬──────────┘
                               │ HTTPS
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    │                     │
                    │ Authentication      │
                    │ Users               │
                    │ Products            │
                    │ Cart                │
                    │ Orders              │
                    │ Reviews             │
                    │ Admin APIs          │
                    └──────┬───────┬──────┘
                           │       │
                 ┌─────────┘       └──────────┐
                 ▼                            ▼
        ┌─────────────────┐          ┌─────────────────┐
        │   PostgreSQL    │          │ Image Storage   │
        │                 │          │ Firebase/S3     │
        │ Users           │          │                 │
        │ Products        │          │ Product Images  │
        │ Orders          │          │                 │
        │ Reviews         │          └─────────────────┘
        └─────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Email Service  │
                  │                 │
                  │ Admin Order     │
                  │ Notification    │
                  └─────────────────┘
```

------------------------------------------------------------------------

# 4. Technology Decisions

## 4.1 Frontend

Use:

-   React
-   React Router
-   Axios or Fetch
-   Context API / Zustand for client state
-   Tailwind CSS or another agreed UI system
-   Form validation using React Hook Form + Zod if desired

Frontend responsibilities:

-   UI rendering
-   Routing
-   Form handling
-   Client-side validation
-   Authentication state display
-   Cart UI
-   Product browsing
-   Admin dashboard UI
-   API communication

Frontend must **not** contain sensitive business logic.

------------------------------------------------------------------------

# 4.2 Backend

Use:

-   Python
-   FastAPI
-   SQLAlchemy
-   Alembic
-   Pydantic
-   PostgreSQL
-   JWT/session verification
-   Email service

Backend responsibilities:

-   Authentication verification
-   Authorization
-   Business logic
-   Database operations
-   Product management
-   Cart management
-   Order creation
-   Order validation
-   Review validation
-   Admin authorization
-   Email notifications
-   API validation
-   Error handling

------------------------------------------------------------------------

# 4.3 Authentication

Recommended approach:

**Firebase Authentication + FastAPI authorization + PostgreSQL
application user records.**

Firebase handles:

-   Google OAuth
-   Email/password registration
-   Email/password login
-   Password reset
-   Authentication tokens

PostgreSQL stores application-level information such as:

-   User ID
-   Firebase UID
-   Name
-   Email
-   Phone
-   Role
-   Address
-   Account status
-   Created date
-   Updated date

Important:

Firebase authentication does **not** replace the application user table.

------------------------------------------------------------------------

# 5. User Roles

## 5.1 USER

A normal customer can:

-   Register
-   Login
-   Logout
-   Login using Google
-   View products
-   Search products
-   Filter products
-   View product details
-   View reviews
-   Add reviews
-   Edit own reviews if allowed
-   Add products to cart
-   Change cart quantities
-   Remove products from cart
-   Manage profile
-   Manage delivery address
-   Place COD orders
-   View own orders
-   View order details
-   Cancel eligible orders

A user must never be able to:

-   Access admin APIs
-   Modify another user
-   Modify product data
-   Change product price
-   Change stock
-   Modify another user's order
-   Delete reviews belonging to other users
-   Change their own role

------------------------------------------------------------------------

# 5.2 ADMIN

Admin has full management access.

Admin can:

-   View dashboard
-   View users
-   Create users if required
-   Update users
-   Disable users
-   Delete users where permitted
-   Change user roles
-   View products
-   Create products
-   Update products
-   Delete products
-   Upload product images
-   Change prices
-   Change stock
-   Change product status
-   Manage categories
-   View all orders
-   Update order status
-   View customer/order information
-   Manage reviews
-   Remove inappropriate reviews
-   View operational statistics

Admin APIs must always perform backend authorization checks.

Hiding an admin page in React is **not sufficient security**.

------------------------------------------------------------------------

# 6. Core Modules

The project should be divided into these modules:

1.  Authentication
2.  User/Profile
3.  Product Catalog
4.  Categories
5.  Product Images
6.  Search & Filtering
7.  Reviews & Ratings
8.  Cart
9.  Checkout
10. COD Orders
11. Order Management
12. Admin Dashboard
13. User Management
14. Email Notifications
15. Error Handling & Logging
16. Security
17. Testing
18. Deployment

------------------------------------------------------------------------

# 7. Database Design

Recommended PostgreSQL tables:

``` text
users
addresses
categories
products
product_images
reviews
carts
cart_items
orders
order_items
order_status_history
```

Optional future tables:

``` text
coupons
wishlist
notifications
audit_logs
product_variants
```

------------------------------------------------------------------------

# 8. Users Table

Suggested fields:

``` text
users
------------------------------
id                  UUID PK
firebase_uid        VARCHAR UNIQUE
email               VARCHAR UNIQUE
full_name           VARCHAR
phone               VARCHAR
role                ENUM(USER, ADMIN)
is_active           BOOLEAN
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Rules:

-   `firebase_uid` must be unique.
-   Email must be unique.
-   Default role must be USER.
-   Only an authorized admin can change a user's role.
-   Frontend must never be trusted for role assignment.

------------------------------------------------------------------------

# 9. Addresses Table

``` text
addresses
------------------------------
id                  UUID PK
user_id             UUID FK
full_name           VARCHAR
phone               VARCHAR
address_line_1      TEXT
address_line_2      TEXT
city                VARCHAR
state               VARCHAR
postal_code         VARCHAR
country             VARCHAR
is_default          BOOLEAN
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

A user can have multiple addresses.

For Phase 1, checkout can allow the customer to select an existing
address or enter a delivery address.

------------------------------------------------------------------------

# 10. Categories

Example categories:

``` text
Turmeric
Oils
Food
Herbal Products
Wellness
Traditional Products
```

Suggested fields:

``` text
categories
------------------------------
id                  UUID PK
name                VARCHAR UNIQUE
slug                VARCHAR UNIQUE
description         TEXT
image_url           TEXT
is_active           BOOLEAN
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

------------------------------------------------------------------------

# 11. Products

Suggested fields:

``` text
products
------------------------------
id                  UUID PK
category_id         UUID FK
name                VARCHAR
slug                VARCHAR UNIQUE
description         TEXT
short_description   TEXT
price               DECIMAL
compare_at_price    DECIMAL NULL
stock_quantity      INTEGER
sku                 VARCHAR UNIQUE
unit                VARCHAR
weight              VARCHAR
is_active           BOOLEAN
is_featured         BOOLEAN
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Example:

``` text
Name: Aham Natural Turmeric Powder
Price: ₹399
Stock: 100
Unit: 250g
Category: Turmeric
```

Never use floating-point values for money.

Use `DECIMAL/NUMERIC`.

------------------------------------------------------------------------

# 12. Product Images

A product may contain multiple images.

``` text
product_images
------------------------------
id                  UUID PK
product_id          UUID FK
image_url           TEXT
alt_text            VARCHAR
display_order       INTEGER
is_primary          BOOLEAN
created_at          TIMESTAMP
```

Admin should be able to:

-   Upload image
-   Delete image
-   Set primary image
-   Reorder images

------------------------------------------------------------------------

# 13. Product Requirements

Every product should support:

-   Product name
-   Description
-   Short description
-   Price
-   Optional comparison/original price
-   Stock quantity
-   SKU
-   Category
-   Weight/quantity
-   Unit
-   Product images
-   Active/inactive status
-   Featured status
-   Created date
-   Updated date

Product detail page should display:

-   Product image gallery
-   Product name
-   Price
-   Availability
-   Description
-   Quantity selector
-   Add to Cart
-   Buy/Order option
-   Reviews
-   Average rating
-   Related products

------------------------------------------------------------------------

# 14. Product Search

Customers should be able to search products by:

-   Product name
-   Category
-   Description

Example:

``` text
GET /api/v1/products?search=turmeric
```

Backend should handle search.

Do not load the entire product database into React and filter only on
the frontend.

------------------------------------------------------------------------

# 15. Product Filtering

Initial filters:

-   Category
-   Price range
-   Availability
-   Featured products
-   Rating

Example:

``` text
GET /api/v1/products?category=turmeric&min_price=100&max_price=1000
```

------------------------------------------------------------------------

# 16. Pagination

Products should be paginated.

Example:

``` text
GET /api/v1/products?page=1&page_size=20
```

Response:

``` json
{
  "items": [],
  "page": 1,
  "page_size": 20,
  "total": 100,
  "total_pages": 5
}
```

Avoid returning thousands of products in a single API response.

------------------------------------------------------------------------

# 17. Reviews & Ratings

Customers can review products.

Review fields:

``` text
reviews
------------------------------
id                  UUID PK
product_id         UUID FK
user_id             UUID FK
rating              INTEGER
title               VARCHAR
comment             TEXT
is_approved         BOOLEAN
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Rating must be:

``` text
1 to 5
```

Backend must validate this.

------------------------------------------------------------------------

# 18. Review Rules

Recommended rules:

-   User must be logged in to create a review.
-   User should only review products they purchased.
-   One review per user per product unless editing is allowed.
-   User can edit their own review.
-   User cannot edit another user's review.
-   Admin can remove/hide reviews.
-   Admin can moderate inappropriate content.
-   Review rating must be 1--5.

For Phase 1, review approval can either be automatic or admin-moderated.

Recommended:

``` text
is_approved = true
```

for normal reviews, with admin ability to hide/delete inappropriate
reviews.

------------------------------------------------------------------------

# 19. Average Rating

Do not permanently trust a rating value stored in the frontend.

Backend should calculate:

``` text
average_rating
review_count
```

Example:

``` json
{
  "average_rating": 4.6,
  "review_count": 127
}
```

------------------------------------------------------------------------

# 20. Cart

Cart is associated with a user.

Tables:

``` text
carts
------------------------------
id
user_id
created_at
updated_at
```

``` text
cart_items
------------------------------
id
cart_id
product_id
quantity
created_at
updated_at
```

------------------------------------------------------------------------

# 21. Cart Rules

When adding an item:

1.  User must be authenticated.
2.  Product must exist.
3.  Product must be active.
4.  Product must be in stock.
5.  Quantity must be greater than 0.
6.  Quantity cannot exceed available stock.

If the same product is added twice:

``` text
Do not create duplicate cart rows.
Increase the existing quantity.
```

Example:

``` text
Current cart:
Turmeric × 2

Add Turmeric × 1

Result:
Turmeric × 3
```

------------------------------------------------------------------------

# 22. Cart Price Security

The frontend must never be trusted for final pricing.

Bad:

``` text
Frontend sends:
price = 399
```

Backend should instead:

``` text
product_id
quantity
```

Then fetch the current price from PostgreSQL.

------------------------------------------------------------------------

# 23. Checkout

Phase 1 checkout:

``` text
Cart
  ↓
Delivery Address
  ↓
Order Summary
  ↓
Cash on Delivery
  ↓
Place Order
```

No online payment gateway.

------------------------------------------------------------------------

# 24. COD Order

When user clicks:

``` text
Place Order
```

Backend should:

1.  Authenticate user.
2.  Load cart.
3.  Verify cart is not empty.
4.  Fetch current product prices.
5.  Verify product availability.
6.  Validate quantities.
7.  Create order.
8.  Create order items.
9.  Store price snapshot for each item.
10. Calculate subtotal.
11. Calculate shipping if applicable.
12. Calculate total.
13. Mark payment method as COD.
14. Reduce/reserve stock according to agreed business rule.
15. Clear cart.
16. Create order status history.
17. Send admin email notification.
18. Return order confirmation.

This should be performed transactionally.

------------------------------------------------------------------------

# 25. Important Order Price Rule

Order items must store the price at the time of purchase.

Example:

``` text
Product current price = ₹500

Customer orders product

order_item.unit_price = ₹500
```

If admin later changes the product price to:

``` text
₹600
```

the old order must still show:

``` text
₹500
```

Never calculate old order totals using the current product price.

------------------------------------------------------------------------

# 26. Orders Table

Suggested:

``` text
orders
------------------------------
id                  UUID PK
user_id             UUID FK
order_number       VARCHAR UNIQUE
status              ENUM
payment_method      ENUM
payment_status      ENUM
subtotal             DECIMAL
shipping_amount      DECIMAL
total_amount        DECIMAL
delivery_name       VARCHAR
delivery_phone      VARCHAR
delivery_address    TEXT
delivery_city       VARCHAR
delivery_state      VARCHAR
delivery_postal_code VARCHAR
notes               TEXT
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

For COD:

``` text
payment_method = COD
payment_status = PENDING
```

------------------------------------------------------------------------

# 27. Order Items

``` text
order_items
------------------------------
id                  UUID PK
order_id            UUID FK
product_id          UUID FK
product_name        VARCHAR
sku                 VARCHAR
quantity            INTEGER
unit_price          DECIMAL
total_price         DECIMAL
created_at          TIMESTAMP
```

Store product name and price snapshots so historical orders remain
accurate even if products change later.

------------------------------------------------------------------------

# 28. Order Status

Recommended statuses:

``` text
PENDING
CONFIRMED
PROCESSING
SHIPPED
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
FAILED
```

Initial flow:

``` text
PENDING
   ↓
CONFIRMED
   ↓
PROCESSING
   ↓
SHIPPED
   ↓
OUT_FOR_DELIVERY
   ↓
DELIVERED
```

Cancellation:

``` text
PENDING → CANCELLED
CONFIRMED → CANCELLED
```

Exact allowed transitions should be enforced by the backend.

------------------------------------------------------------------------

# 29. Order Status History

Recommended:

``` text
order_status_history
------------------------------
id
order_id
old_status
new_status
changed_by
reason
created_at
```

This provides an audit trail.

Example:

``` text
PENDING → CONFIRMED
Changed by: Admin
Time: 2026-08-18 10:30
```

------------------------------------------------------------------------

# 30. Admin Email Notification

When an order is successfully created:

``` text
Subject:
New AHAM Order — #AHM-10023
```

Email should include:

-   Order number
-   Customer name
-   Customer phone
-   Delivery address
-   Products
-   Quantities
-   Subtotal
-   Shipping
-   Total
-   Payment method = COD
-   Order timestamp

Important:

The email should be sent **after the order is successfully persisted**.

If email sending fails, the order should not disappear.

Recommended approach:

``` text
Create order
   ↓
Commit transaction
   ↓
Attempt email notification
   ↓
Log email failure if any
```

Future enhancement:

Use a background task/queue for email notifications.

------------------------------------------------------------------------

# 31. Authentication Requirements

## Registration

Fields:

``` text
Full Name
Email
Password
Confirm Password
Phone
```

Flow:

``` text
React
  ↓
Firebase Auth
  ↓
Create Firebase user
  ↓
Backend syncs/creates application user
  ↓
PostgreSQL users table
```

------------------------------------------------------------------------

# 32. Google OAuth

Login:

``` text
Continue with Google
```

Flow:

``` text
User
 ↓
Google
 ↓
Firebase Authentication
 ↓
Firebase ID Token
 ↓
React
 ↓
FastAPI
 ↓
Verify Firebase token
 ↓
Find/create user in PostgreSQL
 ↓
Authorize request
```

------------------------------------------------------------------------

# 33. Manual Login

For email/password:

``` text
Email
Password
```

Firebase handles credential validation.

FastAPI should validate the Firebase ID token attached to API requests.

Do not store raw passwords in PostgreSQL.

------------------------------------------------------------------------

# 34. Authentication Middleware

Protected requests should contain an authentication token.

Example:

``` http
Authorization: Bearer <firebase_id_token>
```

FastAPI authentication dependency:

``` text
get_current_user()
```

Admin dependency:

``` text
require_admin()
```

Conceptually:

``` python
@router.get("/admin/users")
def get_users(
    current_user = Depends(require_admin)
):
    ...
```

------------------------------------------------------------------------

# 35. Authorization

There are two separate concepts:

### Authentication

"Who are you?"

### Authorization

"What are you allowed to do?"

Example:

``` text
Authenticated user + USER role
→ Can view own orders

Authenticated user + ADMIN role
→ Can view all orders
```

Never rely only on frontend route protection.

------------------------------------------------------------------------

# 36. API Structure

Recommended:

``` text
/api/v1/auth
/api/v1/users
/api/v1/products
/api/v1/categories
/api/v1/cart
/api/v1/orders
/api/v1/reviews
/api/v1/admin/users
/api/v1/admin/products
/api/v1/admin/orders
/api/v1/admin/reviews
```

------------------------------------------------------------------------

# 37. Example API Endpoints

## Products

``` http
GET    /api/v1/products
GET    /api/v1/products/{id}
POST   /api/v1/admin/products
PATCH  /api/v1/admin/products/{id}
DELETE /api/v1/admin/products/{id}
```

## Categories

``` http
GET    /api/v1/categories
POST   /api/v1/admin/categories
PATCH  /api/v1/admin/categories/{id}
DELETE /api/v1/admin/categories/{id}
```

## Cart

``` http
GET    /api/v1/cart
POST   /api/v1/cart/items
PATCH  /api/v1/cart/items/{id}
DELETE /api/v1/cart/items/{id}
DELETE /api/v1/cart
```

## Orders

``` http
POST   /api/v1/orders
GET    /api/v1/orders
GET    /api/v1/orders/{id}
POST   /api/v1/orders/{id}/cancel
```

## Admin Orders

``` http
GET    /api/v1/admin/orders
GET    /api/v1/admin/orders/{id}
PATCH  /api/v1/admin/orders/{id}/status
```

## Reviews

``` http
GET    /api/v1/products/{id}/reviews
POST   /api/v1/products/{id}/reviews
PATCH  /api/v1/reviews/{id}
DELETE /api/v1/reviews/{id}
```

## Admin Users

``` http
GET    /api/v1/admin/users
GET    /api/v1/admin/users/{id}
PATCH  /api/v1/admin/users/{id}
DELETE /api/v1/admin/users/{id}
PATCH  /api/v1/admin/users/{id}/role
```

------------------------------------------------------------------------

# 38. Standard API Response Format

Use a consistent response structure where practical.

Success:

``` json
{
  "success": true,
  "message": "Product created successfully",
  "data": {}
}
```

Error:

``` json
{
  "success": false,
  "message": "Product not found",
  "error_code": "PRODUCT_NOT_FOUND"
}
```

Do not expose internal stack traces to users.

------------------------------------------------------------------------

# 39. Error Handling

Backend should handle:

``` text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
429 Too Many Requests
500 Internal Server Error
```

Examples:

``` text
401 → User is not authenticated
403 → User authenticated but not admin
404 → Product does not exist
409 → Duplicate SKU
422 → Invalid input
500 → Unexpected server failure
```

------------------------------------------------------------------------

# 40. Frontend Pages

Customer pages:

``` text
/
 /products
 /products/:slug
 /categories/:slug
 /login
 /register
 /profile
 /cart
 /checkout
 /orders
 /orders/:id
```

Additional:

``` text
/search
/about
/contact
/faq
```

Admin pages:

``` text
/admin
/admin/products
/admin/products/new
/admin/products/:id/edit
/admin/categories
/admin/users
/admin/orders
/admin/orders/:id
/admin/reviews
```

------------------------------------------------------------------------

# 41. Homepage

Homepage should contain:

1.  Header
2.  AHAM logo
3.  Navigation
4.  Search
5.  Login/account
6.  Cart
7.  Hero section
8.  Featured products
9.  Categories
10. Best sellers
11. Natural/traditional brand story
12. Customer reviews
13. Call to action
14. Footer

------------------------------------------------------------------------

# 42. Product Listing Page

Should support:

-   Product grid
-   Search
-   Category filter
-   Price filter
-   Availability filter
-   Sorting
-   Pagination

Sorting examples:

``` text
Price: Low → High
Price: High → Low
Newest
Top Rated
Featured
```

------------------------------------------------------------------------

# 43. Product Details Page

Display:

``` text
Images
Product name
Rating
Reviews count
Price
Original price if applicable
Discount if applicable
Stock status
Quantity selector
Add to Cart
Description
Product information
Reviews
Related products
```

------------------------------------------------------------------------

# 44. Cart Page

Display:

``` text
Product
Image
Price
Quantity
Subtotal
Remove
```

Summary:

``` text
Subtotal
Shipping
Total
```

Button:

``` text
Proceed to Checkout
```

------------------------------------------------------------------------

# 45. Checkout Page

Sections:

``` text
1. Delivery Address
2. Order Items
3. Order Summary
4. Payment Method
5. Place Order
```

Payment method:

``` text
Cash on Delivery
```

Clearly display:

``` text
Payment will be collected at delivery.
```

------------------------------------------------------------------------

# 46. Order Confirmation

After successful order:

``` text
Order Placed Successfully

Order Number:
#AHM-10023

Payment:
Cash on Delivery

Total:
₹1,299
```

Buttons:

``` text
View Order
Continue Shopping
```

------------------------------------------------------------------------

# 47. User Profile

Customer can manage:

``` text
Name
Phone
Email
Addresses
Default address
```

Email should generally not be arbitrarily changed if Firebase identity
is tied to it. Handle identity changes through the authentication
provider.

------------------------------------------------------------------------

# 48. My Orders

Display:

``` text
Order Number
Date
Items
Total
Status
Payment Method
```

User can click an order to see details.

------------------------------------------------------------------------

# 49. Admin Dashboard

Dashboard should provide:

``` text
Total Users
Total Products
Total Orders
Pending Orders
Delivered Orders
Total COD Order Value
Low Stock Products
Recent Orders
```

Optional charts:

``` text
Orders per day
Orders per month
Top products
Revenue/order value trends
```

For COD, label metrics as **Order Value** rather than treating them as
collected revenue until payment is actually received.

------------------------------------------------------------------------

# 50. Admin Product Management

Admin should be able to:

### Create

-   Name
-   Category
-   Description
-   Price
-   Stock
-   SKU
-   Weight
-   Unit
-   Images
-   Active status
-   Featured status

### Update

All above fields.

### Delete

Products should preferably be soft-deleted/deactivated if they appear in
historical orders.

Recommended:

``` text
is_active = false
```

rather than immediately destroying historical product references.

------------------------------------------------------------------------

# 51. Admin User Management

Admin should see:

``` text
Name
Email
Phone
Role
Status
Created At
```

Actions:

``` text
View
Update
Activate
Deactivate
Change Role
Delete where safe
```

Important:

Do not allow an admin to accidentally remove the last active
administrator without confirmation/business safeguards.

------------------------------------------------------------------------

# 52. Admin Order Management

Admin should see:

``` text
Order Number
Customer
Date
Total
Payment Method
Payment Status
Order Status
```

Admin can:

``` text
View order
Confirm
Process
Ship
Mark out for delivery
Mark delivered
Cancel
```

Status changes must be validated by the backend.

------------------------------------------------------------------------

# 53. Admin Review Management

Admin can:

``` text
View reviews
Filter reviews
Approve
Hide
Delete
```

Display:

``` text
Customer
Product
Rating
Comment
Date
Status
```

------------------------------------------------------------------------

# 54. Image Upload

Admin product image upload flow:

``` text
Admin selects image
        ↓
Frontend validates type/size
        ↓
Upload to storage
        ↓
Receive image URL
        ↓
Send image metadata to FastAPI
        ↓
Store URL in product_images
```

Allowed formats:

``` text
JPEG
PNG
WEBP
```

Recommended maximum file size should be defined by the team, e.g. 5 MB
per image.

Images should be optimized/compressed before production use.

------------------------------------------------------------------------

# 55. Security Requirements

Minimum requirements:

-   HTTPS in production
-   Firebase token verification
-   Role-based authorization
-   Input validation
-   SQL injection protection through SQLAlchemy
-   CORS configured correctly
-   Rate limiting for sensitive APIs
-   Secure error responses
-   No passwords stored by the application database
-   No secrets committed to Git
-   Environment variables for credentials
-   Admin APIs protected
-   File upload validation
-   Server-side price validation
-   Server-side stock validation

------------------------------------------------------------------------

# 56. Environment Variables

Example:

``` env
DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
ADMIN_EMAIL=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USERNAME=
EMAIL_PASSWORD=
FRONTEND_URL=
```

Never commit:

``` text
.env
service account JSON
private keys
email passwords
database passwords
API keys
```

------------------------------------------------------------------------

# 57. Project Structure

## Backend

Recommended:

``` text
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── firebase.py
│   │
│   ├── db/
│   │   ├── session.py
│   │   └── base.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── category.py
│   │   ├── cart.py
│   │   ├── order.py
│   │   └── review.py
│   │
│   ├── schemas/
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── cart.py
│   │   ├── order.py
│   │   └── review.py
│   │
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── products.py
│   │       ├── categories.py
│   │       ├── cart.py
│   │       ├── orders.py
│   │       ├── reviews.py
│   │       └── admin/
│   │           ├── users.py
│   │           ├── products.py
│   │           ├── orders.py
│   │           └── reviews.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── product_service.py
│   │   ├── cart_service.py
│   │   ├── order_service.py
│   │   ├── review_service.py
│   │   └── email_service.py
│   │
│   └── utils/
│
├── alembic/
├── tests/
├── requirements.txt
└── .env.example
```

------------------------------------------------------------------------

# 58. Frontend Structure

``` text
frontend/
│
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── ProductCard/
│   │   ├── ProductGrid/
│   │   ├── Rating/
│   │   ├── CartItem/
│   │   └── ProtectedRoute/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Products/
│   │   ├── ProductDetails/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Orders/
│   │   └── Profile/
│   │
│   ├── admin/
│   │   ├── Dashboard/
│   │   ├── Products/
│   │   ├── Categories/
│   │   ├── Users/
│   │   ├── Orders/
│   │   └── Reviews/
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── productApi.js
│   │   ├── cartApi.js
│   │   └── orderApi.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   │
│   ├── routes/
│   ├── hooks/
│   ├── utils/
│   └── App.jsx
│
├── package.json
└── .env.example
```

------------------------------------------------------------------------

# 59. Recommended Team Split

The project has 4 developers.

Do **not** split the project only as "frontend person / backend person".

Instead, split by feature ownership so each developer owns an end-to-end
module.

------------------------------------------------------------------------

# TEAM MEMBER 1 --- Authentication + User Management

## Responsibilities

Own:

``` text
Authentication
User Profile
Addresses
Role Management
Frontend Auth
Backend Auth
```

### Backend

Implement:

-   Firebase integration
-   Token verification
-   User synchronization
-   `users` table
-   `addresses` table
-   Authentication dependencies
-   `get_current_user`
-   `require_admin`
-   User profile APIs
-   Address APIs
-   Admin user APIs

### Frontend

Implement:

-   Login page
-   Registration page
-   Google login
-   Logout
-   Auth state
-   Protected routes
-   User profile
-   Address management
-   Admin user management UI

### APIs

``` text
GET    /users/me
PATCH  /users/me

GET    /users/me/addresses
POST   /users/me/addresses
PATCH  /users/me/addresses/{id}
DELETE /users/me/addresses/{id}

GET    /admin/users
GET    /admin/users/{id}
PATCH  /admin/users/{id}
PATCH  /admin/users/{id}/role
PATCH  /admin/users/{id}/status
```

### Deliverable

A user should be able to:

``` text
Register
Login with email/password
Login with Google
Logout
View profile
Update profile
Add address
Edit address
Delete address
Set default address
```

Admin should be able to:

``` text
View users
Update users
Change role
Activate/deactivate users
```

------------------------------------------------------------------------

# TEAM MEMBER 2 --- Product Catalog + Reviews

## Responsibilities

Own:

``` text
Products
Categories
Images
Search
Filters
Reviews
Ratings
```

### Backend

Implement:

-   Product model
-   Category model
-   Product image model
-   Review model
-   Product APIs
-   Category APIs
-   Search
-   Filters
-   Pagination
-   Review APIs
-   Rating aggregation

### Frontend

Implement:

-   Product listing
-   Product card
-   Product details
-   Search
-   Filters
-   Sorting
-   Product image gallery
-   Review section
-   Rating component
-   Admin product pages
-   Admin category pages
-   Admin review pages

### APIs

``` text
GET    /products
GET    /products/{id}
GET    /products/{id}/reviews

POST   /products/{id}/reviews
PATCH  /reviews/{id}
DELETE /reviews/{id}

POST   /admin/products
PATCH  /admin/products/{id}
DELETE /admin/products/{id}

POST   /admin/categories
PATCH  /admin/categories/{id}
DELETE /admin/categories/{id}
```

### Deliverable

Admin should be able to:

``` text
Create product
Upload images
Set price
Set stock
Edit product
Deactivate product
Create category
Edit category
Manage reviews
```

Customers should be able to:

``` text
Browse
Search
Filter
View details
Read reviews
Submit reviews
```

------------------------------------------------------------------------

# TEAM MEMBER 3 --- Cart + Checkout + Orders

## Responsibilities

Own the entire shopping transaction flow:

``` text
Cart
Checkout
COD
Order creation
Order history
Order status
```

### Backend

Implement:

-   Cart model
-   Cart item model
-   Order model
-   Order item model
-   Order status history
-   Cart APIs
-   Checkout APIs
-   Order APIs
-   COD logic
-   Stock validation
-   Price snapshot
-   Transaction handling

### Frontend

Implement:

-   Cart page
-   Cart item component
-   Quantity updates
-   Checkout
-   Address selection
-   COD selection
-   Order confirmation
-   My Orders
-   Order Details
-   Cancel Order

### APIs

``` text
GET    /cart
POST   /cart/items
PATCH  /cart/items/{id}
DELETE /cart/items/{id}

POST   /orders
GET    /orders
GET    /orders/{id}
POST   /orders/{id}/cancel
```

### Deliverable

Customer should be able to:

``` text
Add product
Change quantity
Remove product
Checkout
Select address
Place COD order
See confirmation
See order history
View order details
Cancel eligible order
```

------------------------------------------------------------------------

# TEAM MEMBER 4 --- Admin Dashboard + Notifications + Integration

## Responsibilities

Own:

``` text
Admin Dashboard
Admin Orders
Email Notifications
Cross-module integration
Testing
Deployment support
```

### Backend

Implement:

-   Admin dashboard APIs
-   Admin order APIs
-   Order status updates
-   Email service
-   Admin notification
-   Dashboard statistics
-   Logging
-   Audit-related functionality where applicable

### Frontend

Implement:

-   Admin dashboard
-   Admin order management
-   Order detail view
-   Status update UI
-   Dashboard metrics
-   Low stock alerts
-   Recent orders

### APIs

``` text
GET    /admin/dashboard
GET    /admin/orders
GET    /admin/orders/{id}
PATCH  /admin/orders/{id}/status
GET    /admin/reviews
PATCH  /admin/reviews/{id}
DELETE /admin/reviews/{id}
```

### Email

Implement:

``` text
New Order Email
```

Email should contain:

``` text
Order Number
Customer
Phone
Address
Items
Quantities
Total
COD
```

### Deliverable

Admin can:

``` text
Login
View dashboard
See new orders
Open order
Update order status
See order history
See low-stock products
Receive order email
```

------------------------------------------------------------------------

# 60. Team Integration Rules

All 4 developers must follow the same conventions.

## Git Branching

Use:

``` text
main
develop
feature/*
bugfix/*
```

Example:

``` text
feature/auth
feature/products
feature/cart-orders
feature/admin-dashboard
```

Never directly push unfinished work to `main`.

------------------------------------------------------------------------

# 61. Pull Request Rules

Every PR should include:

``` text
What changed?
Why?
API changes?
Database changes?
Screenshots if UI?
Testing performed?
Known limitations?
```

Example:

``` text
## What changed
Implemented product creation API.

## Database
Added products table.

## API
POST /api/v1/admin/products

## Testing
Tested:
- Valid product
- Duplicate SKU
- Negative price
- Missing category

## Screenshots
Attached.
```

------------------------------------------------------------------------

# 62. Commit Convention

Use meaningful commits.

Good:

``` text
feat(auth): add Google login
feat(products): add product creation API
feat(cart): implement quantity update
feat(orders): create COD order flow
fix(products): validate duplicate SKU
fix(auth): handle expired Firebase token
```

Bad:

``` text
changes
update
final
done
new code
```

------------------------------------------------------------------------

# 63. API Documentation

FastAPI automatically provides:

``` text
Swagger UI
```

Every developer must document:

-   Endpoint
-   Request
-   Response
-   Authentication
-   Possible errors

Use meaningful Pydantic schemas.

------------------------------------------------------------------------

# 64. Database Migration Rules

Use Alembic.

Never manually modify production database structure.

Example:

``` bash
alembic revision --autogenerate -m "create products table"
alembic upgrade head
```

Every schema change must have a migration.

------------------------------------------------------------------------

# 65. Database Ownership

Before development begins, agree on:

-   UUID strategy
-   Timestamp strategy
-   Naming conventions
-   Foreign key behavior
-   Enum handling
-   Soft delete strategy
-   Index strategy

Recommended:

``` text
Primary keys → UUID
Money → NUMERIC/DECIMAL
Timestamps → timezone-aware
```

------------------------------------------------------------------------

# 66. Important Database Indexes

Consider indexes on:

``` text
users.email
users.firebase_uid
products.slug
products.sku
products.category_id
products.is_active
reviews.product_id
reviews.user_id
orders.user_id
orders.order_number
orders.status
order_items.order_id
cart_items.cart_id
```

------------------------------------------------------------------------

# 67. Order Transaction

Order creation is one of the most important backend operations.

Use a database transaction.

Conceptually:

``` text
BEGIN

Validate user
Validate cart
Validate products
Validate stock

Create order
Create order items
Update stock
Clear cart
Create status history

COMMIT
```

If a critical database operation fails:

``` text
ROLLBACK
```

Do not leave half-created orders.

------------------------------------------------------------------------

# 68. Stock Management

Example:

``` text
Product stock = 10

Customer orders quantity = 3

Remaining stock = 7
```

Backend must validate stock at checkout.

Do not rely on:

``` text
Frontend says stock = 10
```

The database is authoritative.

For concurrent orders, use appropriate database transaction/locking
strategy so two customers cannot oversell the same limited stock.

------------------------------------------------------------------------

# 69. Product Deletion

Do not hard-delete products that are referenced by historical orders
unless the database design explicitly supports it.

Recommended:

``` text
is_active = false
```

This means:

``` text
Product no longer appears in store
```

but old orders remain valid.

------------------------------------------------------------------------

# 70. Admin Security

Admin route:

``` text
/admin/*
```

Frontend should check role.

But backend must independently check role.

Example:

``` text
GET /api/v1/admin/products
```

Request:

``` text
USER token
```

Backend:

``` text
Verify token
 ↓
Find user
 ↓
Check role
 ↓
USER?
 → 403

ADMIN?
 → Continue
```

------------------------------------------------------------------------

# 71. CORS

Configure FastAPI CORS with known frontend origins.

Development:

``` text
http://localhost:3000
```

or the selected React dev port.

Production:

``` text
https://your-aham-domain.com
```

Do not use:

``` text
allow_origins=["*"]
```

for a production authenticated application unless there is a specific
reason and the security implications are understood.

------------------------------------------------------------------------

# 72. Logging

Backend should log:

-   Server errors
-   Order creation failures
-   Email failures
-   Authentication failures where appropriate
-   Admin actions
-   Unexpected exceptions

Do not log:

-   Passwords
-   Firebase private keys
-   Tokens
-   Sensitive secrets

------------------------------------------------------------------------

# 73. Testing Strategy

Testing is not only a final phase.

Each developer should test their module.

## Backend Unit Tests

Examples:

``` text
Product creation
Duplicate SKU
Invalid price
Invalid stock
Review rating > 5
Review rating < 1
Unauthorized admin endpoint
Cart quantity validation
Order creation
Insufficient stock
Order cancellation
```

## Integration Tests

Test complete flows:

``` text
Login
 ↓
Browse
 ↓
Add cart
 ↓
Checkout
 ↓
Place COD order
 ↓
Order appears in admin
 ↓
Admin changes status
```

------------------------------------------------------------------------

# 74. Frontend Testing

Test:

-   Loading states
-   Empty states
-   Error states
-   Form validation
-   Authentication redirects
-   Admin route protection
-   Cart updates
-   Checkout
-   Mobile responsiveness

------------------------------------------------------------------------

# 75. UI/UX Requirements

AHAM should have a natural, premium, traditional visual identity.

Possible design direction:

``` text
Natural
Minimal
Premium
Warm
Traditional
Modern
Trustworthy
```

Avoid making the site look overly generic.

Recommended sections:

``` text
Natural product imagery
Traditional textures
Clean typography
Simple product cards
Clear pricing
Visible reviews
Strong CTA buttons
Mobile-first layout
```

The exact branding/colors should be finalized separately by the design
owner.

------------------------------------------------------------------------

# 76. Responsive Design

Must support:

``` text
Mobile
Tablet
Laptop
Desktop
```

Important screens:

-   Homepage
-   Product listing
-   Product details
-   Cart
-   Checkout
-   Login
-   Admin dashboard

Do not design only for desktop.

------------------------------------------------------------------------

# 77. Loading States

Every API-driven UI should have a loading state.

Example:

``` text
Loading products...
```

Use skeleton loaders where appropriate.

Avoid blank screens.

------------------------------------------------------------------------

# 78. Empty States

Examples:

Cart:

``` text
Your cart is empty.
Explore our products.
```

Orders:

``` text
You haven't placed any orders yet.
```

Reviews:

``` text
No reviews yet.
Be the first to review this product.
```

------------------------------------------------------------------------

# 79. Error States

Examples:

``` text
Unable to load products.
Please try again.
```

For checkout:

``` text
We couldn't place your order.
Please review your cart and try again.
```

Never expose raw backend stack traces.

------------------------------------------------------------------------

# 80. SEO Basics

For customer-facing pages:

-   Meaningful page titles
-   Meta descriptions
-   Product-friendly URLs
-   Slugs
-   Image alt text
-   Semantic HTML

Example:

``` text
/products/organic-turmeric-powder
```

instead of:

``` text
/products/123
```

For a future production SEO strategy, consider whether a React SPA alone
is sufficient or whether SSR/SSG should be introduced later.

------------------------------------------------------------------------

# 81. Accessibility

Minimum requirements:

-   Alt text
-   Keyboard navigation
-   Proper form labels
-   Visible focus states
-   Sufficient contrast
-   Semantic buttons
-   Accessible error messages

Do not use:

``` html
<div onClick={...}>
```

when a semantic button is appropriate.

------------------------------------------------------------------------

# 82. Security Checklist

Before production:

-   [ ] HTTPS enabled
-   [ ] Firebase token verification working
-   [ ] Admin authorization enforced server-side
-   [ ] No password stored in PostgreSQL
-   [ ] Environment variables configured
-   [ ] Secrets removed from Git history
-   [ ] CORS restricted
-   [ ] SQLAlchemy parameterization used
-   [ ] File upload validation implemented
-   [ ] File size limits implemented
-   [ ] Product price validated server-side
-   [ ] Stock validated server-side
-   [ ] Order transaction implemented
-   [ ] Rate limiting considered
-   [ ] Error messages sanitized
-   [ ] Sensitive logs removed
-   [ ] Admin routes tested with normal USER token

------------------------------------------------------------------------

# 83. Definition of Done

A feature is complete only when:

-   Backend API implemented
-   Pydantic schema implemented
-   Database model implemented
-   Alembic migration created
-   Frontend integrated
-   Authentication/authorization handled
-   Loading state handled
-   Error state handled
-   Validation implemented
-   Tests written
-   Swagger documentation available
-   PR reviewed
-   Feature tested against latest `develop`

------------------------------------------------------------------------

# 84. Development Order

Recommended order:

## Phase 1 --- Foundation

``` text
Repository
Environment
FastAPI setup
React setup
PostgreSQL
Firebase
Alembic
Base API structure
CI/basic checks
```

## Phase 2 --- Authentication

``` text
Google OAuth
Email/password
User synchronization
Roles
Protected routes
```

## Phase 3 --- Product Catalog

``` text
Categories
Products
Images
Product listing
Product details
Search
Filters
```

## Phase 4 --- Reviews

``` text
Review creation
Rating
Review display
Admin moderation
```

## Phase 5 --- Cart

``` text
Cart
Cart items
Quantity
Stock validation
```

## Phase 6 --- Orders

``` text
Checkout
COD
Order creation
Order history
Order details
Cancellation
```

## Phase 7 --- Admin

``` text
Dashboard
Users
Products
Orders
Reviews
Categories
```

## Phase 8 --- Notifications

``` text
Admin order email
Error logging
Email failure handling
```

## Phase 9 --- Testing

``` text
Unit tests
Integration tests
Frontend tests
Security testing
Responsive testing
```

## Phase 10 --- Deployment

``` text
Frontend deployment
Backend deployment
Database deployment
Firebase configuration
Storage
Email
Domain
HTTPS
Production testing
```

------------------------------------------------------------------------

# 85. Suggested Sprint Plan

## Sprint 1 --- Foundation + Authentication

Team Member 1:

``` text
Firebase Auth
Users
Roles
Profile
```

Team Member 2:

``` text
Product DB
Categories
Basic product APIs
```

Team Member 3:

``` text
Cart DB
Cart APIs
```

Team Member 4:

``` text
Project foundation
Admin layout
Email service foundation
Dashboard skeleton
```

------------------------------------------------------------------------

## Sprint 2 --- Main Shopping Experience

Team Member 1:

``` text
Addresses
Protected routes
```

Team Member 2:

``` text
Product UI
Search
Filters
Reviews
```

Team Member 3:

``` text
Cart UI
Checkout
Order APIs
```

Team Member 4:

``` text
Admin products
Admin orders
Dashboard APIs
```

------------------------------------------------------------------------

## Sprint 3 --- Integration

Everyone:

``` text
Integrate modules
Fix API contracts
Fix authentication
Fix order flow
Fix admin permissions
```

Main end-to-end flow:

``` text
Register/Login
 ↓
Browse products
 ↓
Product details
 ↓
Add cart
 ↓
Checkout
 ↓
COD
 ↓
Place order
 ↓
Email admin
 ↓
Admin sees order
 ↓
Admin updates status
 ↓
Customer sees updated status
```

------------------------------------------------------------------------

# 86. Final End-to-End User Journey

## Customer

``` text
Open AHAM
   ↓
Homepage
   ↓
Browse Products
   ↓
Search / Filter
   ↓
Open Product
   ↓
Read Reviews
   ↓
Add to Cart
   ↓
Open Cart
   ↓
Checkout
   ↓
Login if required
   ↓
Select Delivery Address
   ↓
Select Cash on Delivery
   ↓
Review Order
   ↓
Place Order
   ↓
Order Created
   ↓
Admin Email Sent
   ↓
Order Confirmation
   ↓
My Orders
```

------------------------------------------------------------------------

# 87. Final Admin Journey

``` text
Admin Login
   ↓
Admin Dashboard
   ↓
View New Order
   ↓
Open Order
   ↓
Verify Customer
   ↓
Confirm Order
   ↓
Processing
   ↓
Shipped
   ↓
Out for Delivery
   ↓
Delivered
```

Admin can independently manage:

``` text
Users
Products
Categories
Reviews
Orders
Stock
Prices
```

------------------------------------------------------------------------

# 88. Phase 1 Scope --- Must Have

The following are mandatory:

-   [ ] Google login
-   [ ] Email/password login
-   [ ] User role
-   [ ] Admin role
-   [ ] User profile
-   [ ] Address management
-   [ ] Product listing
-   [ ] Product details
-   [ ] Product search
-   [ ] Product filtering
-   [ ] Categories
-   [ ] Product images
-   [ ] Cart
-   [ ] Checkout
-   [ ] COD
-   [ ] Order creation
-   [ ] Order history
-   [ ] Order details
-   [ ] Order cancellation rules
-   [ ] Product reviews
-   [ ] Ratings
-   [ ] Admin dashboard
-   [ ] Admin user management
-   [ ] Admin product management
-   [ ] Admin category management
-   [ ] Admin order management
-   [ ] Admin review management
-   [ ] Stock management
-   [ ] Price management
-   [ ] Admin email notification
-   [ ] Responsive UI
-   [ ] Backend authorization
-   [ ] Error handling
-   [ ] Testing

------------------------------------------------------------------------

# 89. Explicitly Out of Scope for Phase 1

Do not spend sprint time implementing:

``` text
Online payment gateway
Razorpay
Stripe
UPI integration
Credit/debit cards
Wallet
Coupons
Subscriptions
Wishlist
Advanced recommendation engine
AI chatbot
Loyalty program
Referral system
Complex shipping provider integration
Multi-vendor marketplace
International payments
```

These can become Phase 2/3 features.

------------------------------------------------------------------------

# 90. Future Phase 2 Features

Possible additions:

``` text
Razorpay
UPI
Online card payments
Coupons
Wishlist
Product variants
Discount campaigns
Inventory alerts
Shipping partner integration
SMS notifications
WhatsApp notifications
Customer support
Wishlist
Advanced analytics
Sales reports
Export orders to CSV
Invoice generation
GST invoice
```

------------------------------------------------------------------------

# 91. Important Team Rule

Before coding a feature, the owner must define:

``` text
1. Database changes
2. API endpoints
3. Request schema
4. Response schema
5. Authentication requirements
6. Authorization requirements
7. Error cases
8. Frontend screens
9. Loading state
10. Empty state
11. Testing cases
```

This prevents four developers from building incompatible pieces.

------------------------------------------------------------------------

# 92. API Contract Rule

Before frontend and backend integration, agree on the API contract.

Example:

``` http
GET /api/v1/products
```

Response:

``` json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Natural Turmeric Powder",
        "slug": "natural-turmeric-powder",
        "price": 399,
        "stock_quantity": 25,
        "primary_image_url": "https://...",
        "average_rating": 4.7,
        "review_count": 42
      }
    ],
    "page": 1,
    "page_size": 20,
    "total": 42
  }
}
```

Frontend should build against agreed contracts rather than guessing
backend responses.

------------------------------------------------------------------------

# 93. Shared Responsibilities

Although each person owns features, all developers share responsibility
for:

-   Code quality
-   Security
-   Testing
-   Git hygiene
-   API consistency
-   Database consistency
-   Documentation
-   Code review
-   Integration
-   Bug fixing

Feature ownership does not mean "I only fix my code."

If an integration issue affects multiple modules, the owners should
solve it together.

------------------------------------------------------------------------

# 94. Final Acceptance Test

The project should not be considered MVP-complete until this scenario
works:

``` text
1. New customer opens AHAM.
2. Customer signs in using Google.
3. Backend verifies Firebase token.
4. User record is created in PostgreSQL.
5. Customer browses products.
6. Customer searches for turmeric.
7. Customer opens a product.
8. Customer views reviews.
9. Customer adds product to cart.
10. Customer changes quantity.
11. Customer proceeds to checkout.
12. Customer selects delivery address.
13. Customer selects COD.
14. Backend validates current price and stock.
15. Backend creates order transactionally.
16. Order items contain price snapshots.
17. Cart is cleared.
18. Customer sees order confirmation.
19. Admin receives order email.
20. Admin logs into dashboard.
21. Admin sees the new order.
22. Admin opens order details.
23. Admin changes order status.
24. Customer sees updated order status.
25. Admin changes product price.
26. Existing order still displays the old price.
27. Customer creates a product review.
28. Admin can view/moderate the review.
29. Normal USER cannot access admin APIs.
30. Admin can manage users/products/orders/reviews.
```

------------------------------------------------------------------------

# 95. Recommended Ownership Summary

  -----------------------------------------------------------------------
  Developer               Primary Ownership       Secondary
  ----------------------- ----------------------- -----------------------
  Developer 1             Authentication +        RBAC
                          Users + Addresses       

  Developer 2             Products + Categories + Search/Filters
                          Images + Reviews        

  Developer 3             Cart + Checkout + COD + Stock
                          Orders                  

  Developer 4             Admin Dashboard + Admin Integration/Testing
                          Orders + Email          
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 96. First Task for the Team

Before writing feature code, conduct a short technical kickoff.

Agree on:

``` text
Database schema
API naming
Authentication flow
Role model
Folder structure
Git strategy
Environment variables
API response format
Error format
Money representation
UUID strategy
Timestamp strategy
Image storage
Email provider
Deployment target
```

Then create the initial repository and assign each developer their
feature branch.

------------------------------------------------------------------------

# 97. MVP Definition

AHAM MVP means:

> A customer can securely log in, browse AHAM products, search/filter
> products, view reviews, add products to a cart, provide a delivery
> address, place a Cash-on-Delivery order, receive an order
> confirmation, and view order history; while an authorized
> administrator can manage users, products, categories, reviews, stock
> and orders and receive an email notification for new orders.

Once this flow works reliably end-to-end, the team can move to payments,
advanced analytics, shipping integrations and other Phase 2 features.

------------------------------------------------------------------------

# 98. Final Engineering Principle

Build AHAM as a real production application rather than a college/demo
project.

The frontend should be treated as an untrusted client.

The backend should own:

``` text
Authentication verification
Authorization
Pricing
Stock
Order totals
Order creation
Review permissions
Admin permissions
```

The database should be the source of truth for:

``` text
Users
Products
Prices
Stock
Orders
Reviews
```

And every critical operation should be validated on the backend.

**Build the MVP cleanly first. Add advanced features only after the core
shopping and admin flows are stable.**
