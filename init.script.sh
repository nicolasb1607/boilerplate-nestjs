#!/bin/sh

# Run migrations
echo "RUNNING MIGRATION"
pnpm run migrate

# Run seeds
echo "RUNNING SEED"
pnpm run seed

# Start the application
echo "STARTING THE APPLICATION"
node dist/apps/api/main
