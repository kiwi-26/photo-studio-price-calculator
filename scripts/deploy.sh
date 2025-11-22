#!/bin/bash

# Manual deployment script for rental server
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Starting deployment process..."

# Check if required environment variables are set
if [ -z "$SSH_HOST" ] || [ -z "$SSH_USER" ] || [ -z "$DEPLOY_PATH" ]; then
    echo "❌ Error: Required environment variables not set"
    echo "Please set: SSH_HOST, SSH_USER, DEPLOY_PATH"
    echo "Example:"
    echo "  export SSH_HOST=your-server.com"
    echo "  export SSH_USER=username"
    echo "  export DEPLOY_PATH=/var/www/html/"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build project
echo "🔨 Building project..."
export NODE_ENV=production
npm run build

# Verify build output
if [ ! -d "dist" ]; then
    echo "❌ Build failed: dist directory not found"
    exit 1
fi

echo "✅ Build successful. Contents of dist directory:"
ls -la dist/

# Deploy to server
echo "🚀 Deploying to $SSH_HOST:$DEPLOY_PATH"
rsync -avz --delete --progress dist/ $SSH_USER@$SSH_HOST:$DEPLOY_PATH

echo "✅ Deployment completed successfully!"
echo "🌐 Your site should now be available on your rental server"