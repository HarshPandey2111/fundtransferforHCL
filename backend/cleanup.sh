#!/bin/bash
echo "Cleaning up ports 5000-5003..."
for port in {5000..5003}
do
  pid=$(lsof -ti :$port)
  if [ ! -z "$pid" ]; then
    echo "Killing process on port $port (PID: $pid)"
    kill -9 $pid
  fi
done
echo "Cleanup complete" 