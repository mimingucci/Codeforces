#!/bin/bash
# create-topics.sh

# Wait for Kafka to be fully up and running
echo "Waiting for Kafka to start..."
sleep 30

# Create topics if they don't exist
echo "Creating Kafka topics..."

kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic contest.action
kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic submission.result

# Add more topics if needed
echo "Kafka topics created successfully"
