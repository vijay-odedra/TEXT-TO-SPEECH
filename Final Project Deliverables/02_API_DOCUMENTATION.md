# Vocalix REST API Documentation
### Technical Specification & Endpoint Reference

---

## 1. Overview
The **Vocalix REST API** provides a lightweight, secure backend service for system health monitoring, provider capability status, pre-configured voice discovery, and binary audio synthesis.

- **Base URL**: `http://localhost:5005`
- **Protocol**: HTTP/1.1
- **Data Exchange**: JSON (`application/json`) for metadata, Binary MP3 (`audio/mpeg`) for synthesis
- **CORS**: Enabled for `http://localhost:5173` and common frontend development ports

---

## 2. API Endpoints

### 2.1 GET `/api/health`
Checks server uptime and health.

#### Request
```http
GET /api/health HTTP/1.1
Host: localhost:5005
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Text-to-Speech server is running",
  "timestamp": "2026-11-24T02:40:46.095Z",
  "uptime": 1473.73
}
```

---

### 2.2 GET `/api/status`
Returns information regarding the active speech synthesis provider and credential readiness.

#### Request
```http
GET /api/status HTTP/1.1
Host: localhost:5005
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "provider": "free",
  "isConfigured": true,
  "outputFormat": "audio/mpeg",
  "message": "Free audio synthesis service is active (no API key required)"
}
```

---

### 2.3 GET `/api/voices`
Returns a list of server-supported voices and locales.

#### Request
```http
GET /api/voices HTTP/1.1
Host: localhost:5005
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "provider": "free",
  "voices": [
    {
      "id": "en-US-Standard",
      "name": "English (US) Standard",
      "language": "en-US",
      "gender": "neutral"
    },
    {
      "id": "hi-IN-Standard",
      "name": "Hindi (India) Standard",
      "language": "hi-IN",
      "gender": "neutral"
    },
    {
      "id": "gu-IN-Standard",
      "name": "Gujarati (India) Standard",
      "language": "gu-IN",
      "gender": "neutral"
    }
  ]
}
```

---

### 2.4 POST `/api/tts`
Synthesizes input text into binary MP3 audio and streams it directly in the HTTP response.

#### Request Headers
| Header | Value | Description |
| :--- | :--- | :--- |
| `Content-Type` | `application/json` | Required for body parsing |

#### Request Body Schema
| Field | Type | Required | Range / Enum | Description |
| :--- | :--- | :--- | :--- | :--- |
| `text` | string | **Yes** | 1 to 5,000 characters | The plain text to convert into speech |
| `language` | string | No | e.g. `en-US`, `hi-IN` | Target language locale code (Default: `en-US`) |
| `voice` | string | No | Voice identifier | Target voice name |
| `speed` | number | No | `0.5` to `2.0` | Speech rate multiplier (Default: `1.0`) |
| `pitch` | number | No | `0.5` to `2.0` | Voice pitch multiplier (Default: `1.0`) |
| `volume` | number | No | `0.0` to `1.0` | Voice volume level (Default: `1.0`) |

#### Sample Request
```json
{
  "text": "Welcome to Vocalix! Both male and female voices are ready.",
  "language": "en-US",
  "speed": 1.0,
  "pitch": 1.0,
  "volume": 1.0
}
```

#### Success Response (`200 OK`)
- **Content-Type**: `audio/mpeg`
- **Content-Disposition**: `attachment; filename="speech.mp3"`
- **Body**: Binary audio byte buffer (`Buffer<MP3>`)

#### Error Responses

##### 400 Bad Request — Empty Text
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": [
      {
        "field": "text",
        "message": "text must be a non-empty string"
      }
    ]
  }
}
```

##### 400 Bad Request — Speed Out of Bounds
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": [
      {
        "field": "speed",
        "message": "speed must be a number between 0.5 and 2.0"
      }
    ]
  }
}
```

##### 429 Too Many Requests — Rate Limiting Exceeded
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in a few moments."
  }
}
```

---

## 3. cURL Examples

### Health Check
```bash
curl -X GET http://localhost:5005/api/health
```

### Synthesize and Save MP3
```bash
curl -X POST http://localhost:5005/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world from Vocalix", "language": "en-US", "speed": 1.0}' \
  --output my_speech.mp3
```
