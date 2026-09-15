#!/bin/bash

# Frontend deployment script for MR.DOC

echo "Starting MR.DOC frontend deployment..."

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

# Navigate to frontend directory
cd "$(dirname "$0")/.."

echo "Installing frontend dependencies..."
npm install

# Check if build is successful
if npm run build; then
    echo "Frontend build successful!"
    
    # For deployment to Vercel (uncomment and configure as needed)
    # echo "Deploying to Vercel..."
    # npx vercel --prod
    
    # For deployment to Netlify (uncomment and configure as needed)
    # echo "Deploying to Netlify..."
    # npx netlify deploy --prod
    
    echo "Frontend deployment completed successfully!"
else
    echo "Frontend build failed!"
    exit 1
fi