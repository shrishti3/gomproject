package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Inquiry represents a customer inquiry for MadMann services
type Inquiry struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	FullName    string             `bson:"fullName" json:"fullName" binding:"required"`
	Email       string             `bson:"email" json:"email" binding:"required,email"`
	Phone       string             `bson:"phone" json:"phone"`
	Company     string             `bson:"company" json:"company"`
	ServiceType string             `bson:"serviceType" json:"serviceType" binding:"required"` // ODM, SCM, EMS, Wire Harnessing
	Message     string             `bson:"message" json:"message"`
	Budget      string             `bson:"budget" json:"budget"`
	Timeline    string             `bson:"timeline" json:"timeline"`
	Status      string             `bson:"status" json:"status" default:"pending"` // pending, reviewed, contacted
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
}

// Project represents a MadMann project
type Project struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	ProjectName string             `bson:"projectName" json:"projectName"`
	Category    string             `bson:"category" json:"category"` // ODM, SCM, EMS, Wire Harnessing
	Description string             `bson:"description" json:"description"`
	Status      string             `bson:"status" json:"status"` // active, completed, archived
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
}

// Contact represents contact information
type Contact struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Email       string             `bson:"email" json:"email"`
	Subject     string             `bson:"subject" json:"subject"`
	Message     string             `bson:"message" json:"message"`
	Status      string             `bson:"status" json:"status"` // unread, read, responded
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
}
