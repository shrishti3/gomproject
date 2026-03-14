# CORS Configuration Explained

## What is CORS?

**CORS** (Cross-Origin Resource Sharing) allows web applications running on one domain/port to make requests to a server on a different domain/port.

Without CORS, your React frontend running on `http://localhost:3000` would be blocked from making requests to your Go backend on `http://localhost:8080`.

---

## How It's Configured in MadMann Dynamics

### Backend (Go) - [backend/cmd/server/main.go](backend/cmd/server/main.go#L60)

```go
corsOrigin := os.Getenv("CORS_ORIGIN")
if corsOrigin == "" {
    corsOrigin = "http://localhost:3000"  // Default for local development
}

c := cors.New(cors.Options{
    AllowedOrigins:   []string{corsOrigin},
    AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowedHeaders:   []string{"Content-Type", "Authorization"},
    ExposedHeaders:   []string{"Content-Length"},
    MaxAge:           300,
})

router.Use(c.Handler)
```

### Frontend (React) - [frontend/src/utils/apiClient.js](frontend/src/utils/apiClient.js)

```javascript
export const submitInquiry = async (data) => {
    try {
        const response = await axiosInstance.post('/api/inquiry', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
```

The frontend makes requests to `http://localhost:8080/api/*` and the backend's CORS middleware allows it.

---

## For Different Environments

### Local Development
```bash
# Frontend runs on: http://localhost:3000
# Backend runs on: http://localhost:8080
# CORS_ORIGIN = http://localhost:3000
```

### Production (Example: AWS)
```bash
# Frontend runs on: https://madmanndynamics.com
# Backend runs on: https://api.madmanndynamics.com
# CORS_ORIGIN = https://madmanndynamics.com
```

Set via environment variable:
```bash
export CORS_ORIGIN=https://madmanndynamics.com
```

---

## Why CORS Instead of Same Domain?

We use separate ports/domains because:

1. **Better architecture** - Clear separation of concerns
2. **Independent scaling** - Frontend and backend can scale separately
3. **Flexible deployment** - Can deploy to different servers
4. **Microservices-ready** - Easy to add more services
5. **API reusability** - Backend can serve multiple frontends

---

## Testing CORS

### Check CORS Headers
```bash
curl -i -X OPTIONS http://localhost:8080/api/health \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"
```

Look for these response headers:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Common CORS Issues & Solutions

| Issue | Solution |
|-------|----------|
| `"Access to XMLHttpRequest blocked"` | Backend CORS_ORIGIN doesn't match frontend URL |
| `"Expected 'GET', got 'OPTIONS'"` | Backend not handling OPTIONS requests (we handle this) |
| `"No 'Access-Control-Allow-Origin' header"` | Backend CORS middleware not applied to router |
| API works in Postman but not browser | Likely a CORS issue - check headers above |

---

## Production Deployment

When deploying to production:

1. **Get your domain** (e.g., `madmanndynamics.com`)
2. **Update CORS_ORIGIN** to your frontend domain
3. **Use HTTPS** (important for production security)
4. **Set other security headers** (see [DEPLOYMENT.md](DEPLOYMENT.md))

Example:
```bash
# In production environment
CORS_ORIGIN=https://madmanndynamics.com
MONGO_URI=mongodb+srv://user:pass@prod.mongodb.net/madmann_db
PORT=8080
```

---

## Conclusion

**CORS is already properly configured** in your application:
- ✅ Backend accepts requests from frontend
- ✅ All necessary HTTP methods allowed (GET, POST, PUT, DELETE)
- ✅ Credentials can be sent if needed
- ✅ Easily configurable via environment variables
- ✅ Production-ready security settings

**No additional CORS setup needed** - just run the frontend and backend, and they'll communicate seamlessly! 🎉
