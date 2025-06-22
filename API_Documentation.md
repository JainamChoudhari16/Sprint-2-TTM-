# Train Ticket Management System - API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Train Management](#train-management)
4. [Booking Management](#booking-management)
5. [Food Ordering](#food-ordering)
6. [Admin Operations](#admin-operations)
7. [Frontend Integration Guide](#frontend-integration-guide)
8. [Testing with Swagger](#testing-with-swagger)

---

## Base URL
```
http://localhost:8080
```

## Authentication
All protected endpoints require JWT Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Authentication

### 1.1 User Registration
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "aadhaar": "123456789012",
  "password": "password123"
}
```

**Response:**
```json
// Success (200)
"User registered successfully!"

// Error (400)
"Username is already taken!"
"Email is already in use!"
```

**Frontend Integration:**
```typescript
// auth.service.ts
register(user: User): Observable<boolean> {
  return this.http.post<any>(`${this.API_URL}/register`, user).pipe(
    tap(() => {}),
    tap(() => true),
    catchError(() => of(false))
  );
}

// Component usage
this.authService.register(userData).subscribe(
  success => {
    if (success) {
      console.log('Registration successful');
      this.router.navigate(['/login']);
    } else {
      console.log('Registration failed');
    }
  }
);
```

### 1.2 User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
// Success (200)
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "role": "ROLE_USER",
  "username": "john_doe"
}

// Error (401)
"Invalid credentials"
```

**Frontend Integration:**
```typescript
// auth.service.ts
login$(username: string, password: string): Observable<boolean> {
  return this.http.post<any>(`${this.API_URL}/login`, { username, password }).pipe(
    tap(res => {
      if (res && res.token) {
        sessionStorage.setItem('jwt', res.token);
        // Handle navigation based on role
      }
    }),
    tap(() => true),
    catchError(() => of(false))
  );
}

// Component usage
this.authService.login$(username, password).subscribe(
  success => {
    if (success) {
      console.log('Login successful');
    } else {
      console.log('Login failed');
    }
  }
);
```

---

## 2. User Management

### 2.1 Get User Profile
**Endpoint:** `GET /api/user/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
// Success (200)
{
  "id": 1,
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "aadhaar": "123456789012",
  "role": "ROLE_USER"
}
```

**Frontend Integration:**
```typescript
// user.service.ts
getProfile(): Observable<User> {
  return this.http.get<User>(this.API_URL);
}

// Component usage
this.userService.getProfile().subscribe(
  user => {
    console.log('User profile:', user);
    this.userProfile = user;
  }
);
```

### 2.2 Update User Profile
**Endpoint:** `PUT /api/user/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "mobile": "9876543211",
  "email": "john.updated@example.com"
}
```

**Response:**
```json
// Success (200)
{
  "id": 1,
  "username": "john_doe",
  "name": "John Updated",
  "email": "john.updated@example.com",
  "mobile": "9876543211",
  "aadhaar": "123456789012",
  "role": "ROLE_USER"
}
```

**Frontend Integration:**
```typescript
// user.service.ts
updateProfile(user: User): Observable<User> {
  return this.http.put<User>(this.API_URL, user);
}

// Component usage
this.userService.updateProfile(updatedUser).subscribe(
  user => {
    console.log('Profile updated:', user);
    this.userProfile = user;
  }
);
```

---

## 3. Train Management

### 3.1 Search Trains
**Endpoint:** `GET /api/trains/search`

**Query Parameters:**
- `source` (string): Source station
- `destination` (string): Destination station  
- `date` (string): Journey date (YYYY-MM-DD format)

**Example:** `GET /api/trains/search?source=Mumbai&destination=Delhi&date=2024-01-15`

**Response:**
```json
// Success (200)
[
  {
    "id": 1,
    "trainNumber": "12345",
    "trainName": "Rajdhani Express",
    "source": "Mumbai",
    "destination": "Delhi",
    "departureTime": "2024-01-15T16:00:00",
    "arrivalTime": "2024-01-16T08:00:00",
    "totalSeats": 500,
    "availableSeats": 150,
    "fare": 2500.0
  }
]
```

**Frontend Integration:**
```typescript
// train.service.ts
searchTrains(source: string, destination: string, date: string): Observable<Train[]> {
  return this.http.get<Train[]>(`${this.API_URL}/search`, {
    params: { source, destination, date }
  });
}

// Component usage
this.trainService.searchTrains(source, destination, date).subscribe(
  trains => {
    console.log('Available trains:', trains);
    this.availableTrains = trains;
  }
);
```

---

## 4. Booking Management

### 4.1 Create Booking
**Endpoint:** `POST /api/bookings`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "trainId": 1,
  "journeyDate": "2024-01-15",
  "passengers": [
    {
      "name": "John Doe",
      "age": 30,
      "gender": "Male"
    },
    {
      "name": "Jane Doe", 
      "age": 28,
      "gender": "Female"
    }
  ]
}
```

**Response:**
```json
// Success (201)
{
  "id": 1,
  "userId": 1,
  "username": "john_doe",
  "train": {
    "id": 1,
    "trainNumber": "12345",
    "trainName": "Rajdhani Express",
    "source": "Mumbai",
    "destination": "Delhi",
    "departureTime": "2024-01-15T16:00:00",
    "arrivalTime": "2024-01-16T08:00:00",
    "totalSeats": 500,
    "availableSeats": 148,
    "fare": 2500.0
  },
  "journeyDate": "2024-01-15",
  "seatsBooked": 2,
  "totalFare": 5000.0,
  "passengers": [
    {
      "name": "John Doe",
      "age": 30,
      "gender": "Male"
    },
    {
      "name": "Jane Doe",
      "age": 28,
      "gender": "Female"
    }
  ]
}

// Error (400)
"Not enough seats available"
"Train not found"
```

**Frontend Integration:**
```typescript
// booking.service.ts
bookTicket(request: BookingRequest): Observable<Booking> {
  return this.http.post<Booking>(this.API_URL, request);
}

// Component usage
const bookingRequest = {
  trainId: selectedTrain.id,
  journeyDate: selectedDate,
  passengers: passengerDetails
};

this.bookingService.bookTicket(bookingRequest).subscribe(
  booking => {
    console.log('Booking created:', booking);
    this.router.navigate(['/booking-confirmation']);
  },
  error => {
    console.error('Booking failed:', error);
  }
);
```

### 4.2 Get My Bookings
**Endpoint:** `GET /api/bookings`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
// Success (200)
[
  {
    "id": 1,
    "userId": 1,
    "username": "john_doe",
    "train": {
      "id": 1,
      "trainNumber": "12345",
      "trainName": "Rajdhani Express",
      "source": "Mumbai",
      "destination": "Delhi",
      "departureTime": "2024-01-15T16:00:00",
      "arrivalTime": "2024-01-16T08:00:00",
      "totalSeats": 500,
      "availableSeats": 148,
      "fare": 2500.0
    },
    "journeyDate": "2024-01-15",
    "seatsBooked": 2,
    "totalFare": 5000.0,
    "passengers": [...]
  }
]
```

**Frontend Integration:**
```typescript
// booking.service.ts
getMyBookings(): Observable<Booking[]> {
  return this.http.get<Booking[]>(this.API_URL);
}

// Component usage
this.bookingService.getMyBookings().subscribe(
  bookings => {
    console.log('My bookings:', bookings);
    this.myBookings = bookings;
  }
);
```

### 4.3 Cancel Booking
**Endpoint:** `DELETE /api/bookings/{id}`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
// Success (204)
// No content

// Error (404)
"Booking not found"
```

**Frontend Integration:**
```typescript
// booking.service.ts
cancelBooking(id: number): Observable<void> {
  return this.http.delete<void>(`${this.API_URL}/${id}`);
}

// Component usage
this.bookingService.cancelBooking(bookingId).subscribe(
  () => {
    console.log('Booking cancelled successfully');
    this.loadMyBookings(); // Refresh the list
  }
);
```

---

## 5. Food Ordering

### 5.1 Get Food Items
**Endpoint:** `GET /api/food/items`

**Response:**
```json
// Success (200)
[
  {
    "id": 1,
    "name": "Masala Dosa",
    "description": "Crispy dosa with potato filling",
    "price": 120.0,
    "available": true
  },
  {
    "id": 2,
    "name": "Idli Sambar",
    "description": "Soft idlis with sambar",
    "price": 80.0,
    "available": true
  }
]
```

**Frontend Integration:**
```typescript
// food.service.ts
getFoodItems(): Observable<FoodItem[]> {
  return this.http.get<FoodItem[]>('/api/food/items');
}

// Component usage
this.foodService.getFoodItems().subscribe(
  items => {
    console.log('Food items:', items);
    this.foodItems = items;
  }
);
```

### 5.2 Place Food Order
**Endpoint:** `POST /api/food/order`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "bookingId": 1,
  "orderItems": [
    {
      "foodItemId": 1,
      "quantity": 2
    },
    {
      "foodItemId": 2,
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
// Success (201)
{
  "id": 1,
  "bookingId": 1,
  "username": "john_doe",
  "orderTime": "2024-01-15T10:30:00",
  "totalAmount": 320.0,
  "status": "PENDING",
  "orderItems": [
    {
      "foodItemId": 1,
      "foodItemName": "Masala Dosa",
      "quantity": 2,
      "price": 120.0
    },
    {
      "foodItemId": 2,
      "foodItemName": "Idli Sambar",
      "quantity": 1,
      "price": 80.0
    }
  ]
}

// Error (400)
"Booking not found"
"User not authorized to order for this booking"
"Food item Masala Dosa is not available."
```

**Frontend Integration:**
```typescript
// food.service.ts
placeOrder(order: Omit<FoodOrder, 'id' | 'orderDate' | 'status'>): Observable<FoodOrder> {
  const payload = {
    bookingId: order.bookingId,
    orderItems: order.items.map(item => ({
      foodItemId: item.foodItemId,
      quantity: item.quantity
    }))
  };
  return this.http.post<FoodOrder>(`${this.API_URL}/order`, payload);
}

// Component usage
const foodOrder = {
  bookingId: currentBooking.id,
  items: selectedFoodItems
};

this.foodService.placeOrder(foodOrder).subscribe(
  order => {
    console.log('Food order placed:', order);
    this.router.navigate(['/food-order-confirmation']);
  }
);
```

### 5.3 Get Food Order History
**Endpoint:** `GET /api/food/history`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
// Success (200)
[
  {
    "id": 1,
    "bookingId": 1,
    "username": "john_doe",
    "orderTime": "2024-01-15T10:30:00",
    "totalAmount": 320.0,
    "status": "PENDING",
    "orderItems": [...]
  }
]
```

**Frontend Integration:**
```typescript
// food.service.ts
getOrdersByUserId(userId: string): Observable<FoodOrder[]> {
  return this.http.get<FoodOrder[]>(`${this.API_URL}/history`);
}

// Component usage
this.foodService.getOrdersByUserId(currentUserId).subscribe(
  orders => {
    console.log('Food order history:', orders);
    this.foodOrders = orders;
  }
);
```

---

## 6. Admin Operations

### 6.1 Create Train (Admin Only)
**Endpoint:** `POST /api/admin/trains`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "trainNumber": "12345",
  "trainName": "Rajdhani Express",
  "source": "Mumbai",
  "destination": "Delhi",
  "departureTime": "2024-01-15T16:00:00",
  "arrivalTime": "2024-01-16T08:00:00",
  "totalSeats": 500,
  "fare": 2500.0
}
```

**Response:**
```json
// Success (200)
{
  "id": 1,
  "trainNumber": "12345",
  "trainName": "Rajdhani Express",
  "source": "Mumbai",
  "destination": "Delhi",
  "departureTime": "2024-01-15T16:00:00",
  "arrivalTime": "2024-01-16T08:00:00",
  "totalSeats": 500,
  "availableSeats": 500,
  "fare": 2500.0
}
```

### 6.2 Get All Trains (Admin Only)
**Endpoint:** `GET /api/admin/trains`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
// Success (200)
[
  {
    "id": 1,
    "trainNumber": "12345",
    "trainName": "Rajdhani Express",
    "source": "Mumbai",
    "destination": "Delhi",
    "departureTime": "2024-01-15T16:00:00",
    "arrivalTime": "2024-01-16T08:00:00",
    "totalSeats": 500,
    "availableSeats": 150,
    "fare": 2500.0
  }
]
```

### 6.3 Update Train (Admin Only)
**Endpoint:** `PUT /api/admin/trains/{id}`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as Create Train

**Response:** Same as Create Train

### 6.4 Delete Train (Admin Only)
**Endpoint:** `DELETE /api/admin/trains/{id}`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
// Success (204)
// No content
```

### 6.5 Get All Users (Admin Only)
**Endpoint:** `GET /api/admin/users`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
// Success (200)
[
  {
    "id": 1,
    "username": "john_doe",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "aadhaar": "123456789012",
    "role": "ROLE_USER"
  }
]
```

---

## 7. Frontend Integration Guide

### 7.1 Setting up HTTP Interceptor
The JWT interceptor is already configured to automatically attach the token to all API requests:

```typescript
// jwt.interceptor.ts
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = sessionStorage.getItem('jwt');
    if (jwt && req.url.startsWith('/api/')) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${jwt}`
        }
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
```

### 7.2 Error Handling
Implement global error handling for API responses:

```typescript
// error.interceptor.ts
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid
          sessionStorage.removeItem('jwt');
          sessionStorage.removeItem('currentUser');
          window.location.href = '/login';
        }
        return throwError(() => error);
      })
    );
  }
}
```

### 7.3 Service Usage Examples

#### Authentication Flow:
```typescript
// login.component.ts
onSubmit() {
  this.authService.login$(this.username, this.password).subscribe(
    success => {
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Invalid credentials';
      }
    }
  );
}
```

#### Train Search:
```typescript
// train-search.component.ts
searchTrains() {
  this.trainService.searchTrains(
    this.searchForm.value.source,
    this.searchForm.value.destination,
    this.searchForm.value.date
  ).subscribe(
    trains => {
      this.availableTrains = trains;
    },
    error => {
      console.error('Search failed:', error);
    }
  );
}
```

#### Booking Flow:
```typescript
// book-ticket.component.ts
bookTicket() {
  const bookingRequest = {
    trainId: this.selectedTrain.id,
    journeyDate: this.journeyDate,
    passengers: this.passengerDetails
  };

  this.bookingService.bookTicket(bookingRequest).subscribe(
    booking => {
      this.bookingConfirmation = booking;
      this.router.navigate(['/booking-success']);
    },
    error => {
      this.errorMessage = error.error || 'Booking failed';
    }
  );
}
```

### 7.4 Environment Configuration
Create environment files for different deployment stages:

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
```

Update services to use environment configuration:

```typescript
// auth.service.ts
private readonly API_URL = `${environment.apiUrl}/auth`;
```

---

## 8. Testing with Swagger

### 8.1 Access Swagger UI
1. Start your Spring Boot application
2. Open browser and navigate to: `http://localhost:8080/swagger-ui.html`
3. You'll see the interactive API documentation

### 8.2 Testing Authentication
1. First, use the `/api/auth/register` endpoint to create a user
2. Then use `/api/auth/login` to get a JWT token
3. Click the "Authorize" button at the top of Swagger UI
4. Enter your token in format: `Bearer <your-jwt-token>`
5. Now you can test all protected endpoints

### 8.3 Testing Protected Endpoints
1. After authorization, all protected endpoints will include the JWT token
2. You can test each endpoint directly from the Swagger UI
3. Request/response examples are provided for each endpoint
4. You can modify request parameters and see real responses

### 8.4 API Documentation
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`
- **OpenAPI YAML**: `http://localhost:8080/v3/api-docs.yaml`

---

## 9. Default Admin Credentials

When the application starts, a default admin user is created:

```
Username: admin
Password: password
Role: ROLE_ADMIN
```

Use these credentials to test admin endpoints.

---

## 10. Database Access

### H2 Console
- **URL**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:traindb`
- **Username**: `sa`
- **Password**: (leave empty)

---

## 11. Common HTTP Status Codes

- **200**: Success
- **201**: Created (for POST requests)
- **204**: No Content (for DELETE requests)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

---

## 12. Development Setup

### Backend Setup:
```bash
cd Backend
mvn spring-boot:run
```

### Frontend Setup:
```bash
cd Frontend
npm install
npm start
```

### Testing the Integration:
1. Backend runs on `http://localhost:8080`
2. Frontend runs on `http://localhost:4200`
3. Frontend will communicate with backend via HTTP
4. JWT tokens are automatically handled by the interceptor

---

This documentation covers all the APIs, their usage, and frontend integration patterns for the Train Ticket Management System. 