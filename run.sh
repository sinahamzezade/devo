#!/bin/bash

# Display a message indicating what this script does
echo "Building and starting both backend and frontend..."

# Store the root directory
ROOT_DIR=$(pwd)

# Reset and seed the database
echo "Resetting and seeding database..."
cd $ROOT_DIR/backend
npx prisma migrate reset --force
npm run seed

# Build the backend
echo "Building backend..."
cd $ROOT_DIR/backend
npm run build

# Build the frontend
echo "Building frontend..."
cd $ROOT_DIR/frontend
npm run build

# Start the backend in production mode in the background
echo "Starting backend..."
cd $ROOT_DIR/backend && npm run start:prod &
BACKEND_PID=$!

# Start the frontend in production mode in the background
echo "Starting frontend..."
cd $ROOT_DIR/frontend && npm run start &
FRONTEND_PID=$!

# Function to handle shutdown
function cleanup {
  echo "Shutting down services..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Trap SIGINT (Ctrl+C) and call the cleanup function
trap cleanup SIGINT

# Keep the script running
echo "Both services are running. Press Ctrl+C to stop."
wait 