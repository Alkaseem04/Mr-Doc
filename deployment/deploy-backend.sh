#!/bin/bash

# Backend deployment script for MR.DOC

echo "Starting MR.DOC backend deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Please install npm first."
    exit 1
fi

# Navigate to backend directory
cd "$(dirname "$0")/../backend"

echo "Installing backend dependencies..."
npm install

# Check if MongoDB is running (optional check)
# You might want to uncomment this if you're running MongoDB locally
# if ! pgrep -x "mongod" > /dev/null
# then
#     echo "MongoDB is not running. Please start MongoDB first."
#     exit 1
# fi

echo "Starting backend server..."
# For production deployment, you might want to use a process manager like PM2
# npm install -g pm2
# pm2 start server.js --name "mrdoc-backend"

# For simple deployment, just start the server
node server.js &

echo "Backend deployment completed successfully!"
echo "Server is running on port 5000"