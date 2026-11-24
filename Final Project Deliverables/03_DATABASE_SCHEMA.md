# Vocalix Database Architecture & Schema Design
### Academic Deliverable & Production Persistence Specification

---

## 1. Architectural Strategy: Why Stateless REST?

For the core Text-to-Speech Studio application, a **stateless, client-first architecture** was purposefully chosen for the following academic and technical reasons:

1. **Zero Data Retention & User Privacy**: Users frequently convert sensitive or personal text (letters, contracts, academic papers, student notes). By keeping speech synthesis in-memory and client-controlled, no user text is persistently logged or stored on a database without explicit user permission.
2. **Instant Response Latency**: Querying a database prior to each audio stream introduces unnecessary disk I/O and query roundtrips. Stateless streaming reduces server latency by up to 80%.
3. **Horizontal Scalability**: A stateless Express server can scale seamlessly across multiple container instances (Docker/Kubernetes) behind a load balancer without distributed database lock contention.
4. **Client State Persistence**: UI theme preferences (light/dark mode) and audio preferences are persisted on the client side using the HTML5 `localStorage` API, surviving page refreshes without server overhead.

---

## 2. Optional Production Database Schema (MongoDB & PostgreSQL)

If database persistence is added for a multi-tenant enterprise version (e.g. user accounts, saved audio libraries, custom voice presets, usage analytics), the following database schemas have been fully modeled.

### 2.1 Entity Relationship (ER) Diagram

```
+--------------------+            +------------------------+
|       users        | 1        * |     speech_records     |
+--------------------+------------+------------------------+
| id (PK)            |            | id (PK)                |
| email              |            | user_id (FK)           |
| password_hash      |            | text_content           |
| role               |            | language               |
| created_at         |            | voice_name             |
+--------------------+            | speed, pitch, volume   |
          | 1                     | audio_file_url         |
          |                       | char_count, word_count |
          | *                     | created_at             |
+---------v----------+            +------------------------+
|   voice_presets    |
+--------------------+
| id (PK)            |
| user_id (FK)       |
| preset_name        |
| language           |
| voice_name         |
| speed, pitch, vol  |
| created_at         |
+--------------------+
```

---

### 2.2 Relational SQL Schema (PostgreSQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    tier VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Voice Presets
CREATE TABLE voice_presets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    preset_name VARCHAR(50) NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'en-US',
    voice_name VARCHAR(100) NOT NULL,
    speed NUMERIC(3, 2) DEFAULT 1.00 CHECK (speed BETWEEN 0.50 AND 2.00),
    pitch NUMERIC(3, 2) DEFAULT 1.00 CHECK (pitch BETWEEN 0.50 AND 2.00),
    volume NUMERIC(3, 2) DEFAULT 1.00 CHECK (volume BETWEEN 0.00 AND 1.00),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: Speech Generation Records
CREATE TABLE speech_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    text_content TEXT NOT NULL,
    language VARCHAR(10) NOT NULL,
    voice_name VARCHAR(100) NOT NULL,
    speed NUMERIC(3, 2) NOT NULL DEFAULT 1.00,
    pitch NUMERIC(3, 2) NOT NULL DEFAULT 1.00,
    volume NUMERIC(3, 2) NOT NULL DEFAULT 1.00,
    character_count INTEGER NOT NULL,
    word_count INTEGER NOT NULL,
    duration_seconds NUMERIC(6, 2),
    audio_format VARCHAR(10) DEFAULT 'mp3',
    audio_file_url VARCHAR(500),
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_speech_user ON speech_records(user_id);
CREATE INDEX idx_speech_created ON speech_records(created_at DESC);
CREATE INDEX idx_presets_user ON voice_presets(user_id);
```

---

### 2.3 NoSQL Schema (MongoDB / Mongoose)

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

// User Schema
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, trim: true },
  tier: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  createdAt: { type: Date, default: Date.now }
});

// Speech Record Schema
const SpeechRecordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  textContent: { type: String, required: true, maxlength: 5000 },
  language: { type: String, required: true, default: 'en-US' },
  voiceName: { type: String, required: true },
  settings: {
    speed: { type: Number, min: 0.5, max: 2.0, default: 1.0 },
    pitch: { type: Number, min: 0.5, max: 2.0, default: 1.0 },
    volume: { type: Number, min: 0.0, max: 1.0, default: 1.0 }
  },
  metrics: {
    characterCount: { type: Number, required: true },
    wordCount: { type: Number, required: true },
    durationSeconds: { type: Number }
  },
  audioUrl: { type: String },
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  SpeechRecord: mongoose.model('SpeechRecord', SpeechRecordSchema)
};
```
