# API Reference - Notes Management System

## Base URL
```
http://localhost:8000/api
```

## Authentication
All endpoints (except public shared notes) require JWT token in header:
```
Authorization: Bearer {access_token}
```

## Response Format
All responses are in JSON format:
```json
{
  "data": { ... },
  "error": null,
  "message": "Success"
}
```

---

## Authentication Endpoints

### POST /auth/register
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "full_name": "John Doe",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
}
```

---

### POST /auth/login
Authenticate user and get JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": { ... }
}
```

---

## Notes Endpoints

### POST /notes
Create a new note.

**Request:**
```json
{
  "title": "My First Note",
  "content": "This is my note content",
  "tags": ["important", "work"],
  "content_type": "text"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "owner_id": 1,
  "title": "My First Note",
  "content": "This is my note content",
  "content_type": "text",
  "tags": ["important", "work"],
  "is_locked": false,
  "is_shared": false,
  "is_public": false,
  "has_code": false,
  "code_language": null,
  "share_token": null,
  "view_count": 0,
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00",
  "last_viewed": null
}
```

---

### GET /notes
Get all notes with pagination.

**Query Parameters:**
- `skip` (int, default: 0) - Number of records to skip
- `limit` (int, default: 20) - Number of records to return (max: 100)

**Example:**
```
GET /notes?skip=0&limit=20
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Note 1",
    "content": "...",
    "content_type": "text",
    "tags": ["tag1"],
    "is_locked": false,
    "is_shared": false,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00",
    "view_count": 0
  }
]
```

---

### GET /notes/{note_id}
Get a specific note by ID.

**Path Parameters:**
- `note_id` (int, required) - Note ID

**Response (200 OK):**
```json
{
  "id": 1,
  "owner_id": 1,
  "title": "Note Title",
  "content": "Note content...",
  "content_type": "text",
  "tags": ["tag1", "tag2"],
  "is_locked": false,
  "is_shared": false,
  "is_public": false,
  "has_code": false,
  "code_language": null,
  "share_token": null,
  "view_count": 0,
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00",
  "last_viewed": null
}
```

**Errors:**
- 404 Not Found - Note doesn't exist

---

### PUT /notes/{note_id}
Update a note.

**Request:**
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "tags": ["new_tag"],
  "content_type": "code"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Response (200 OK):**
Same as GET /notes/{note_id}

---

### DELETE /notes/{note_id}
Delete a note permanently.

**Response (200 OK):**
```json
{
  "message": "Note deleted successfully"
}
```

---

### GET /notes/search
Search notes by title or content.

**Query Parameters:**
- `q` (string, required) - Search query (min length: 1)
- `skip` (int, default: 0)
- `limit` (int, default: 20)

**Example:**
```
GET /notes/search?q=python&skip=0&limit=10
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Python Tutorial",
    "content": "...",
    "content_type": "code",
    "tags": ["python"],
    "is_locked": false,
    "is_shared": false,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00",
    "view_count": 0
  }
]
```

---

### GET /notes/recent
Get recently viewed notes.

**Query Parameters:**
- `limit` (int, default: 5, max: 20)

**Response (200 OK):**
Same as GET /notes/search response

---

## Notes Security Endpoints

### POST /notes/{note_id}/lock
Lock a note with a PIN.

**Request:**
```json
{
  "lock_pin": "1234"
}
```

**Response (200 OK):**
```json
{
  "message": "Note locked successfully",
  "is_locked": true
}
```

---

### POST /notes/{note_id}/unlock
Unlock a locked note.

**Request:**
```json
{
  "lock_pin": "1234"
}
```

**Response (200 OK):**
```json
{
  "message": "Note unlocked successfully"
}
```

**Errors:**
- 400 Bad Request - Note not locked
- 401 Unauthorized - Invalid PIN

---

## Notes Sharing Endpoints

### POST /notes/{note_id}/share
Generate a shareable link for a note.

**Request:**
```json
{
  "is_shared": true,
  "is_public": false
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "owner_id": 1,
  "title": "My Note",
  "content": "...",
  "content_type": "text",
  "tags": [],
  "is_locked": false,
  "is_shared": true,
  "is_public": false,
  "has_code": false,
  "code_language": null,
  "share_token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "view_count": 0,
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00",
  "last_viewed": null
}
```

**Share Link Format:**
```
http://localhost:3000/shared/{share_token}
```

---

### GET /notes/shared/{share_token}
Retrieve a publicly shared note (No authentication required).

**Path Parameters:**
- `share_token` (string, required) - Share token from note object

**Response (200 OK):**
Same as GET /notes/{note_id}

**Errors:**
- 404 Not Found - Share link doesn't exist
- 403 Forbidden - Note is locked

---

### DELETE /notes/{note_id}/share
Stop sharing a note.

**Response (200 OK):**
```json
{
  "message": "Note unshared successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "detail": "Not authenticated" or "Invalid token"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "An error occurred"
}
```

---

## Examples

### Complete Workflow Example

1. **Register User:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user123",
    "password": "secure_pass_123"
  }'
```

2. **Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_pass_123"
  }'
```

Save the `access_token` from response.

3. **Create Note:**
```bash
curl -X POST http://localhost:8000/api/notes \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Python Project",
    "content": "def hello():\n    print(\"Hello World\")",
    "tags": ["python", "project"],
    "content_type": "code"
  }'
```

4. **Get All Notes:**
```bash
curl -X GET "http://localhost:8000/api/notes?skip=0&limit=10" \
  -H "Authorization: Bearer {access_token}"
```

5. **Share Note:**
```bash
curl -X POST http://localhost:8000/api/notes/1/share \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "is_shared": true,
    "is_public": true
  }'
```

---

## Rate Limiting
Currently no rate limiting. Recommended to implement in production.

## Pagination
- Default limit: 20
- Max limit: 100
- Use `skip` for pagination

## Search
- Searches title and content fields
- Case-insensitive
- Partial matching supported

## Sorting
- Notes sorted by `updated_at` (newest first)
- Recent notes sorted by `last_viewed`

---

**Last Updated:** 2024
