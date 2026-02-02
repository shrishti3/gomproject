package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"madmann.io/internal/models"
)

// Handler struct holds dependencies for request handlers
type Handler struct {
	db *mongo.Database
}

// NewHandler creates a new handler instance
func NewHandler(db *mongo.Database) *Handler {
	return &Handler{
		db: db,
	}
}

// SubmitInquiry handles POST /api/inquiry
func (h *Handler) SubmitInquiry(w http.ResponseWriter, r *http.Request) {
	var inquiry models.Inquiry

	// Parse request body
	if err := json.NewDecoder(r.Body).Decode(&inquiry); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if inquiry.FullName == "" || inquiry.Email == "" || inquiry.ServiceType == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	// Set timestamps and default status
	now := time.Now()
	inquiry.CreatedAt = now
	inquiry.UpdatedAt = now
	if inquiry.Status == "" {
		inquiry.Status = "pending"
	}

	// Insert into database
	collection := h.db.Collection("inquiries")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, inquiry)
	if err != nil {
		http.Error(w, "Failed to create inquiry", http.StatusInternalServerError)
		return
	}

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"id":      result.InsertedID,
		"message": "Inquiry submitted successfully",
	})
}

// GetInquiries handles GET /api/inquiries
func (h *Handler) GetInquiries(w http.ResponseWriter, r *http.Request) {
	collection := h.db.Collection("inquiries")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, nil)
	if err != nil {
		http.Error(w, "Failed to fetch inquiries", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var inquiries []models.Inquiry
	if err = cursor.All(ctx, &inquiries); err != nil {
		http.Error(w, "Failed to parse inquiries", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(inquiries)
}

// GetProjects handles GET /api/projects
func (h *Handler) GetProjects(w http.ResponseWriter, r *http.Request) {
	collection := h.db.Collection("projects")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, nil)
	if err != nil {
		http.Error(w, "Failed to fetch projects", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var projects []models.Project
	if err = cursor.All(ctx, &projects); err != nil {
		http.Error(w, "Failed to parse projects", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(projects)
}

// HealthCheck handles GET /api/health
func (h *Handler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "healthy",
		"service": "MadMann Dynamics API",
	})
}
