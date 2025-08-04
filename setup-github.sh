#!/bin/bash

echo "=== GitHub Repository Setup ==="
echo ""
echo "This script will help you set up a new GitHub repository for your Task Management System."
echo ""

# Get the new repository URL
echo "Please create a new repository on GitHub:"
echo "1. Go to https://github.com/new"
echo "2. Repository name: task-management-system"
echo "3. Description: A comprehensive Task Management System built with Node.js, EJS, and PostgreSQL"
echo "4. Make it Public"
echo "5. Don't initialize with README"
echo ""
echo "After creating the repository, copy the repository URL."
echo "It should look like: https://github.com/Deepee26/task-management-system.git"
echo ""

read -p "Enter the new repository URL: " NEW_REPO_URL

if [ -z "$NEW_REPO_URL" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

echo ""
echo "Updating git remote..."

# Update the remote URL
git remote set-url origin "$NEW_REPO_URL"

echo "✅ Remote URL updated to: $NEW_REPO_URL"
echo ""

# Push to the new repository
echo "Pushing to new repository..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to new repository!"
    echo ""
    echo "🎉 Your repository is now ready for Render deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://dashboard.render.com/"
    echo "2. Create PostgreSQL database"
    echo "3. Create Web Service and connect to your new repository"
    echo "4. Set environment variables"
    echo "5. Deploy!"
else
    echo "❌ Failed to push to repository. Please check your GitHub access."
    echo "You may need to:"
    echo "1. Set up SSH keys, or"
    echo "2. Use a personal access token"
fi 