# MySQL Database Schema for Notes Management System

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS notes_db;
USE notes_db;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_user_email (email),
  INDEX idx_user_username (username)
);

-- Notes table
CREATE TABLE notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  owner_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  content_type VARCHAR(50) DEFAULT 'text',
  tags JSON,
  is_locked BOOLEAN DEFAULT false,
  lock_pin VARCHAR(255),
  is_shared BOOLEAN DEFAULT false,
  share_token VARCHAR(100) UNIQUE,
  is_public BOOLEAN DEFAULT false,
  has_code BOOLEAN DEFAULT false,
  code_language VARCHAR(50),
  view_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_viewed DATETIME,
  
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_note_owner_id (owner_id),
  INDEX idx_note_created_at (created_at),
  INDEX idx_note_share_token (share_token),
  INDEX idx_note_is_shared (is_shared)
);

-- Create indexes for better performance
CREATE INDEX idx_notes_owner_updated ON notes(owner_id, updated_at);
CREATE INDEX idx_notes_tags ON notes(tags);
```

## Table Details

### Users Table
- `id`: Primary key
- `email`: Unique email for authentication
- `username`: Unique username
- `hashed_password`: Bcrypt hashed password
- `full_name`: Display name
- `is_active`: Account status
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Notes Table
- `id`: Primary key
- `owner_id`: Foreign key to users
- `title`: Note title
- `content`: Note content (LONGTEXT for large content)
- `content_type`: Type of content (text, code, json, markdown)
- `tags`: JSON array of tags
- `is_locked`: If note is password protected
- `lock_pin`: Hashed PIN for locked notes
- `is_shared`: If note is shareable
- `share_token`: Unique token for sharing
- `is_public`: Public/private flag for shared notes
- `has_code`: Auto-detected code flag
- `code_language`: Detected code language
- `view_count`: Count of views (for shared notes)
- `created_at`: Creation timestamp
- `updated_at`: Last modification timestamp
- `last_viewed`: Last view timestamp
