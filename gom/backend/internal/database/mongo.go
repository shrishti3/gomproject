package database

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Client represents MongoDB client wrapper
type Client struct {
	client *mongo.Client
	db     *mongo.Database
}

// NewClient creates a new MongoDB client
func NewClient(mongoURI string) (*Client, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		return nil, err
	}

	// Verify the connection
	err = client.Ping(ctx, nil)
	if err != nil {
		return nil, err
	}

	db := client.Database("madmann_db")

	return &Client{
		client: client,
		db:     db,
	}, nil
}

// GetClient returns the MongoDB client
func (c *Client) GetClient() *mongo.Client {
	return c.client
}

// GetDatabase returns the MongoDB database
func (c *Client) GetDatabase() *mongo.Database {
	return c.db
}

// GetCollection returns a specific collection
func (c *Client) GetCollection(name string) *mongo.Collection {
	return c.db.Collection(name)
}

// Close closes the MongoDB connection
func (c *Client) Close(ctx context.Context) error {
	return c.client.Disconnect(ctx)
}
