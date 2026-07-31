# Camproxi — Agent Portal API Documentation

> All protected Agent endpoints require the `jwt` cookie containing the agent's authentication token.
> Endpoints ensure that agents can only modify data and listings they own.
> Authentication guards enforce roles: `AGENT`, `VENDOR`, or `SERVICE_PROVIDER`.

---

## 1. Authentication & Profile
**Base Route:** `/api/agent`  
**Guard:** Public (for register, login, logout) | `AgentAuthGuard` (for profile endpoints)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/agent/register` | Public | Register a new agent and sets `jwt` cookie. Requires `campusName` in body. |
| `POST` | `/api/agent/login` | Public | Authenticate agent and sets `jwt` cookie |
| `POST` | `/api/agent/logout` | Public | Clear the `jwt` cookie |
| `GET` | `/api/agent/profile` | `AgentAuthGuard` | Fetch complete profile of logged-in agent |
| `GET` | `/api/agent/me` | `AgentAuthGuard` | Alias for `/api/agent/profile` |
| `PATCH`| `/api/agent/profile/update` | `AgentAuthGuard` | Update profile (supports `profileImage` upload) |
| `DELETE`| `/api/agent/profile` | `AgentAuthGuard` | Delete agent account and clear cookie |
| `GET` | `/api/agent/student/:id` | `AgentAuthGuard` | Fetch public profile of a student |
| `POST` | `/api/agent/send-verification` | `AgentAuthGuard` | Sends a 6-digit OTP to the agent's email. |
| `POST` | `/api/agent/verify-email` | `AgentAuthGuard` | Verifies email. Body: `{ "otp": "string" }` |
| `POST` | `/api/agent/send-phone-verification` | `AgentAuthGuard` | Sends a 6-digit OTP to the agent's phone via SMS. |
| `POST` | `/api/agent/verify-phone` | `AgentAuthGuard` | Verifies phone. Body: `{ "otp": "string" }` |

> [!NOTE]  
> The agent's `isverified` flag will only be set to `true` when BOTH `emailVerified` and `phoneVerified` are strictly true.

### Profile Response
When an agent fetches their profile (`/api/agent/profile` or `/api/agent/me`), the populated `school` data uses the updated `code` and `campus` arrays:
```json
{
  "id": "ObjectId",
  "firstName": "string",
  "lastName": "string",
  "username": "string",
  "companyName": "string",
  "category": "AGENT | VENDOR | SERVICE_PROVIDER",
  "email": "string",
  "phone": "string",
  "schoolId": "ObjectId",
  "school": {
    "id": "ObjectId",
    "name": "string",
    "code": "string (e.g., 'FUTMINNA')",
    "campus": [
      {
        "name": "string",
        "location": { "latitude": "number", "longitude": "number" }
      }
    ]
  },
  "bio": "string",
  "profileImage": { "url": "string", "public_id": "string" }
}
```

---

## 2. Properties (Agent Only)
**Base Route:** `/api/agent/properties`  
**Guards:** `AgentAuthGuard`, `RolesGuard`  
**Role Constraint:** `AGENT`

| Method | Path | Auth/Roles | Description |
|--------|------|------------|-------------|
| `POST` | `/api/agent/properties` | `AgentAuthGuard` + `Roles(AGENT)` | Create a new property (multipart images) |
| `GET` | `/api/agent/properties` | `AgentAuthGuard` + `Roles(AGENT)` | List properties owned by the logged-in agent |
| `GET` | `/api/agent/properties/:id` | `AgentAuthGuard` + `Roles(AGENT)`| Fetch single property owned by agent |
| `PATCH`| `/api/agent/properties/:id` | `AgentAuthGuard` + `Roles(AGENT)`| Update a property |
| `DELETE`| `/api/agent/properties/:id`| `AgentAuthGuard` + `Roles(AGENT)`| Delete a property |
| `GET` | `/api/agent/properties/fetch/students/:schoolId` | `StudentAuthGuard` (Student context) | Student endpoint to get school's properties |

### Expected Property Response
```json
{
  "id": "ObjectId",
  "propertyId": "string",
  "name": "string",
  "address": "string",
  "roomType": "string",
  "amenities": ["string"],
  "description": "string",
  "price": "number",
  "unitQuantity": "number",
  "location": { "lat": "number", "lng": "number" },
  "isVacant": "boolean",
  "status": "string",
  "averageRating": "number",
  "totalReviews": "number",
  "agentId": "ObjectId",
  "schoolId": "ObjectId",
  "images": [
    {
      "url": "string",
      "public_id": "string",
      "isCover": "boolean"
    }
  ]
}
```

---

## 3. Products (Vendors Only)
**Base Route:** `/api/agent/products`  
**Guards:** `AgentAuthGuard`, `RolesGuard`  
**Role Constraint:** `VENDOR`

| Method | Path | Auth/Roles | Description |
|--------|------|------------|-------------|
| `POST` | `/api/agent/products` | `AgentAuthGuard` + `Roles(VENDOR)` | Create a product (multipart images) |
| `GET` | `/api/agent/products` | `AgentAuthGuard` + `Roles(VENDOR)` | List products owned by vendor |
| `GET` | `/api/agent/products/:id` | `AgentAuthGuard` + `Roles(VENDOR)`| Fetch single product owned by vendor |
| `PATCH`| `/api/agent/products/:id` | `AgentAuthGuard` + `Roles(VENDOR)`| Update a product |
| `DELETE`| `/api/agent/products/:id`| `AgentAuthGuard` + `Roles(VENDOR)`| Delete a product |

### Expected Product Response
```json
{
  "id": "ObjectId",
  "productId": "string",
  "name": "string",
  "businessCategory": "string",
  "description": "string",
  "price": "number",
  "isAvailable": "boolean",
  "status": "string",
  "delivery": {
    "option": "CAMPUS | PICKUP | HOME",
    "price": "number",
    "duration": "number"
  },
  "averageRating": "number",
  "totalReviews": "number",
  "agentId": "ObjectId",
  "schoolId": "ObjectId",
  "images": [
    {
      "url": "string",
      "public_id": "string",
      "isCover": "boolean"
    }
  ]
}
```

---

## 4. Services (Service Providers Only)
**Base Route:** `/api/agent/services`  
**Guards:** `AgentAuthGuard`, `RolesGuard`  
**Role Constraint:** `SERVICE_PROVIDER`

| Method | Path | Auth/Roles | Description |
|--------|------|------------|-------------|
| `POST` | `/api/agent/services` | `AgentAuthGuard` + `Roles(SERVICE_PROVIDER)` | Create a new service (multipart images) |
| `GET` | `/api/agent/services` | `AgentAuthGuard` + `Roles(SERVICE_PROVIDER)` | List services owned by provider |
| `GET` | `/api/agent/services/:id` | `AgentAuthGuard` + `Roles(SERVICE_PROVIDER)`| Fetch single service owned by provider |
| `PATCH`| `/api/agent/services/:id` | `AgentAuthGuard` + `Roles(SERVICE_PROVIDER)`| Update a service |
| `DELETE`| `/api/agent/services/:id`| `AgentAuthGuard` + `Roles(SERVICE_PROVIDER)`| Delete a service |

### Expected Service Response
```json
{
  "id": "ObjectId",
  "serviceId": "string",
  "name": "string",
  "address": "string",
  "serviceCategory": "string",
  "availableDays": ["string"],
  "description": "string",
  "price": "number",
  "perUnit": "string",
  "time": {
    "startTime": "string (e.g. '09:00')",
    "endTime": "string (e.g. '17:00')"
  },
  "isAvailable": "boolean",
  "status": "string",
  "averageRating": "number",
  "totalReviews": "number",
  "agentId": "ObjectId",
  "schoolId": "ObjectId",
  "images": [
    {
      "url": "string",
      "public_id": "string",
      "isCover": "boolean"
    }
  ]
}
```

---

## 5. Reviews & Ratings
**Base Route:** `/api/agent/reviews`  
**Guard:** `AgentAuthGuard`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/agent/reviews/item/:itemId` | Fetch all review comments submitted for a specific item |
| `GET` | `/api/agent/reviews/item/:itemId/ratings` | Fetch all numerical ratings submitted for a specific item |
| `POST` | `/api/agent/reviews/:id/reply` | Reply to a review comment left by a student |

---

## 6. Notifications
**Base Route:** `/api/agent/notifications`  
**Guard:** `AgentAuthGuard`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/agent/notifications` | Get notifications for the logged-in agent |
| `PATCH` | `/api/agent/notifications/:id/read` | Mark a single notification as read |
| `PATCH` | `/api/agent/notifications/read-all` | Mark all notifications as read |

### `GET /api/agent/notifications`
- **Description:** Get notifications for the logged-in agent.
- **Expected Response:** Array of Notification Objects:
```json
[
  {
    "id": "ObjectId",
    "recipientId": "ObjectId",
    "recipientType": "AGENT",
    "title": "string",
    "message": "string",
    "type": "NotificationType",
    "category": "REVIEW_CREATED | REQUEST_UPDATED | REQUEST_CREATED",
    "link": "string | null",
    "itemId": "ObjectId | null",
    "itemCategory": "PRODUCT | PROPERTY | SERVICE | null",
    "isRead": "boolean",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
]
```

---

## 7. Requests
**Base Route:** `/api/agent/requests`  
**Guard:** `AgentAuthGuard`  
Allows agents to manage and respond to incoming requests for items they own.

### `GET /api/agent/requests`
- **Description:** Fetch all requests submitted for products, properties, or services owned by the logged-in agent.
- **Expected Response:** Array of Request Objects with student information:
```json
[
  {
    "id": "ObjectId",
    "itemId": "ObjectId",
    "itemCategory": "PRODUCT | PROPERTY | SERVICE",
    "studentId": "ObjectId",
    "message": "string",
    "status": "PENDING | APPROVED | REJECTED",
    "agentResponse": "string | null",
    "createdAt": "DateTime",
    "updatedAt": "DateTime",
    "student": {
      "id": "ObjectId",
      "firstName": "string",
      "lastName": "string",
      "profileImage": { "url": "string", "public_id": "string" }
    }
  }
]
```

### `PATCH /api/agent/requests/:id/respond`
- **Description:** Respond (approve or reject) to a student's request.
- **Payload:**
```json
{
  "status": "APPROVED | REJECTED",
  "responseMessage": "string" // Optional response comment
}
```
- **Notifications triggered:** 
  - Student gets a notification confirming the decision (`Request Status Update` alert).

---

## 8. Chat System

**Base Route:** `/api/agent/chats`  
**Guard:** `AgentAuthGuard`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/agent/chats` | Fetch all chats the agent is part of |
| `GET` | `/api/agent/chats/:chatId` | Fetch details of a specific chat |
| `POST` | `/api/agent/chats/initiate` | Create or get an existing chat with a student |
| `GET` | `/api/agent/chats/:chatId/messages` | Fetch paginated messages in a chat |
| `PATCH` | `/api/agent/chats/:chatId/read` | Mark all unread messages from the student as read |

### `GET /api/agent/chats`
- **Description:** Fetch all conversations involving the logged-in agent.
- **Expected Response:** An array of Chat objects, including the latest message for preview.
```json
[
  {
    "id": "ObjectId",
    "studentId": "ObjectId",
    "agentId": "ObjectId",
    "itemId": "ObjectId | null",
    "itemCategory": "PRODUCT | PROPERTY | SERVICE | null",
    "createdAt": "DateTime",
    "updatedAt": "DateTime",
    "student": {
      "id": "ObjectId",
      "firstName": "string",
      "lastName": "string",
      "profileImage": { "url": "string", "public_id": "string" }
    },
    "messages": [
      {
        "id": "ObjectId",
        "chatId": "ObjectId",
        "senderId": "ObjectId",
        "senderType": "STUDENT | AGENT",
        "content": "string",
        "isRead": "boolean",
        "createdAt": "DateTime"
      }
    ]
  }
]
```

### `POST /api/agent/chats/initiate`
- **Description:** Get an existing chat room or create a new one to start talking to a student.
- **Payload:**
```json
{
  "studentId": "ObjectId (Required)",
  "itemId": "ObjectId (Optional)",
  "itemCategory": "PROPERTY | PRODUCT | SERVICE (Optional)"
}
```
- **Expected Response:** The `Chat` object.

### `GET /api/agent/chats/:chatId/messages`
- **Description:** Fetch messages in a chat (paginated).
- **Query Params:** `?limit=50&skip=0`
- **Expected Response:** An array of `Message` objects.
```json
[
  {
    "id": "ObjectId",
    "chatId": "ObjectId",
    "senderId": "ObjectId",
    "senderType": "STUDENT | AGENT",
    "content": "string",
    "isRead": "boolean",
    "createdAt": "DateTime"
  }
]
```

### WebSockets Connection
- **URL**: `ws://<backend-url>/chat`
- **Authentication**: Automatically authenticated via the `jwt` cookie sent during the HTTP handshake. No token needs to be passed manually.

#### Events Emitted from Client (Frontend -> Backend)
- `joinChat`: Subscribe to a chat room to listen for messages.
  - **Payload:** `{ "chatId": "string" }`
- `sendMessage`: Send a new message to the room.
  - **Payload:** `{ "chatId": "string", "senderId": "string", "senderType": "AGENT", "content": "string" }`
- `markAsRead`: Send this event when the user opens the chat UI to automatically mark unread messages as read.
  - **Payload:** `{ "chatId": "string" }`

#### Events Received by Client (Backend -> Frontend)
- `newMessage`: Triggered when a new message is saved to the DB.
  - **Payload:** The saved `Message` object.
- `messagesRead`: Triggered when the other user (student) reads your messages. Use this to update your UI (e.g. gray ticks to blue ticks).
  - **Payload:** `{ "chatId": "string", "readBy": "STUDENT", "readerId": "string" }`
