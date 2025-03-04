#!/bin/bash
#
# FlingPing.co Local Development Setup Script
# -------------------------------------------
# This script helps set up the local development environment for FlingPing.co
# It checks for required dependencies, creates a .env file, and prepares the project for development

echo "🎯 FlingPing.co Local Development Setup"
echo "======================================="
echo

# Check for Node.js and npm
echo "Checking for required dependencies..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js version 18 or higher."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm version 8 or higher."
    exit 1
fi

# Get Node and npm versions
NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo "✅ Found Node.js $NODE_VERSION"
echo "✅ Found npm $NPM_VERSION"

# Check for package.json
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check for .env file
ENV_FILE=.env
if [ -f "$ENV_FILE" ]; then
    echo "📄 .env file already exists."
    read -p "Do you want to update it? (y/n): " UPDATE_ENV
    if [[ $UPDATE_ENV != "y" && $UPDATE_ENV != "Y" ]]; then
        echo "Skipping .env file creation."
    else
        CREATE_ENV=true
    fi
else
    echo "📄 .env file not found. We'll create one."
    CREATE_ENV=true
fi

# Create or update .env file
if [ "$CREATE_ENV" = true ]; then
    echo "Creating .env file..."
    
    # Ask for Stripe keys
    read -p "Enter your Stripe Secret Key (sk_test_...) or press Enter to skip: " STRIPE_SECRET_KEY
    read -p "Enter your Stripe Publishable Key (pk_test_...) or press Enter to skip: " STRIPE_PUBLISHABLE_KEY
    
    # Generate a random token for webhook security
    RANDOM_TOKEN=$(openssl rand -hex 16)
    
    # Create the .env file
    cat > $ENV_FILE << EOF
# Stripe Integration
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-sk_test_placeholder}
STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY:-pk_test_placeholder}

# Google Sheets Integration (Optional for local development)
# GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
# GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_KEY_HERE\\n-----END PRIVATE KEY-----\\n"
# GOOGLE_SPREADSHEET_ID=your-spreadsheet-id

# Webhook Security
PIPEDREAM_SECURITY_TOKEN=$RANDOM_TOKEN

# Frontend Configuration
VITE_STRIPE_PRODUCT_LINK=/api/create-checkout-session
EOF
    
    echo "✅ .env file created with default values."
    echo "📝 Note: You can update these values manually by editing the .env file."
fi

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully."
else
    echo "❌ Error installing dependencies. Please check the output above."
    exit 1
fi

# Final instructions
echo
echo "🎉 Setup complete! You can now start the development server with:"
echo "    npm run dev"
echo
echo "📝 The server will be available at: http://localhost:5000"
echo
echo "Need more help? Check the following documentation files:"
echo "- COMPLETE-LOCAL-SETUP-GUIDE.md - Detailed setup instructions"
echo "- LOCAL-DEVELOPMENT-GUIDE.md - Development guidelines"
echo

exit 0