FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directory for JWT keys
RUN mkdir -p /keys

# Environment variables will be provided by docker-compose

# Expose the port
EXPOSE 8088

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8088"]
