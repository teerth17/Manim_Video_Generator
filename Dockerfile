# 1. Base image with Python and Manim dependencies
FROM python:3.10-slim as manim-base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg libcairo2-dev \
    texlive texlive-latex-extra \
    git curl build-essential \
    libpango1.0-dev fonts-freefont-ttf pkg-config

# Install Python packages
RUN pip install --upgrade pip setuptools wheel
RUN pip install manim

# Install Node.js and TypeScript
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs
RUN npm install -g typescript

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Add before CMD (after RUN mkdir)
ENV NODE_ENV=production
ENV PORT=3000

# Update CMD to use environment port
CMD ["sh", "-c", "node dist/index.js"]

# Set working directory
WORKDIR /app

# Copy backend code
COPY backend /app/backend

# Copy .env (make sure it’s part of COPY backend)
# Already copied as part of backend/ above

# Install Node.js dependencies
WORKDIR /app/backend
RUN npm install

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Make folders for video output
RUN mkdir -p /app/videos /app/manim /app/backend/assets

# Run the app
CMD ["node", "dist/index.js"]
