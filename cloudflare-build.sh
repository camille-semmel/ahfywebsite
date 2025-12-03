#!/bin/bash

# Cloudflare Pages build script
# This script is executed by Cloudflare Pages during deployment

echo "Starting build process..."

# Install Dashboard dependencies
echo "Installing Dashboard dependencies..."
cd Dashboard
npm ci

# Build Dashboard
echo "Building Dashboard..."
npm run build

# Go back to root
cd ..

# Create deployment directory structure
echo "Preparing deployment files..."
mkdir -p deploy

# Copy main website files
echo "Copying website files..."
cp *.html deploy/ 2>/dev/null || true
cp -r css deploy/ 2>/dev/null || true
cp -r js deploy/ 2>/dev/null || true
cp -r assets deploy/ 2>/dev/null || true
cp -r images deploy/ 2>/dev/null || true

# Copy Dashboard build output to /dashboard subdirectory
echo "Copying Dashboard build..."
mkdir -p deploy/dashboard
cp -r dashboard-app/* deploy/dashboard/

echo "Build completed successfully!"
echo "Output directory: deploy/"
