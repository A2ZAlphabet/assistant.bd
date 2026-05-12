#!/bin/bash
set -e

cd "$(dirname "$0")"

# Create main directories
mkdir -p apps/{web,inbox,builder,workflow-canvas,admin,landing}
mkdir -p services/{api-gateway,auth-service,crm-service,messaging-service,ai-orchestrator,workflow-engine,event-bus,billing-service,analytics-service}
mkdir -p agents/{support-agent,sales-agent,voice-agent,booking-agent,custom-agent-runtime}
mkdir -p workflows/{templates,runtime,scheduler}
mkdir -p packages/{ai-core,memory,types,utils,connectors,queue,logger}
mkdir -p infra/{docker,kubernetes,terraform/aws,terraform/digitalocean,monitoring/{prometheus,grafana}}
mkdir -p scripts
mkdir -p docs
mkdir -p docker

echo Monorepo structure created successfully!" 
