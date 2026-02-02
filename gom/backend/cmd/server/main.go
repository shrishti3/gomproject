package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"madmann.io/internal/database"
	"madmann.io/internal/handlers"
	"madmann.io/internal/middleware"
)

func init() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}
}

func main() {
	// Get configuration from environment
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://admin:madmann_secure_2025@localhost:27017/madmann_db"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	corsOrigin := os.Getenv("CORS_ORIGIN")
	if corsOrigin == "" {
		corsOrigin = "http://localhost:3000"
	}

	// Connect to MongoDB
	dbClient, err := database.NewClient(mongoURI)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer func() {
		if err := dbClient.Close(nil); err != nil {
			log.Printf("Error closing MongoDB connection: %v", err)
		}
	}()

	log.Println("✓ Connected to MongoDB")

	// Initialize handlers
	h := handlers.NewHandler(dbClient.GetDatabase())

	// Create router
	router := mux.NewRouter()

	// Apply middleware
	router.Use(middleware.LoggingMiddleware)
	router.Use(middleware.JSONHeaderMiddleware)

	// API Routes
	api := router.PathPrefix("/api").Subrouter()

	// Health check
	api.HandleFunc("/health", h.HealthCheck).Methods("GET")

	// Inquiry endpoints
	api.HandleFunc("/inquiry", h.SubmitInquiry).Methods("POST")
	api.HandleFunc("/inquiries", h.GetInquiries).Methods("GET")

	// Project endpoints
	api.HandleFunc("/projects", h.GetProjects).Methods("GET")

	// CORS configuration
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{corsOrigin},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		ExposedHeaders:   []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           300,
	})

	// Wrap router with CORS
	handler := c.Handler(router)

	// Start server
	addr := fmt.Sprintf(":%s", port)
	log.Printf("🚀 MadMann Dynamics API Server running on %s", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
