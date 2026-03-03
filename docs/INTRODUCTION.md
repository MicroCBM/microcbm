# Documentation Index

Fetch the complete documentation index at: **https://microcbm-microcbm.mintlify.app/llms.txt**

Use this file to discover all available pages before exploring further.

---

# Introduction

Welcome to MicroCBM - A modern platform for Condition-Based Maintenance that helps organizations monitor assets, track oil samples, and perform advanced root cause analysis.

![MicroCBM Hero Light](https://mintlify.s3.us-west-1.amazonaws.com/microcbm-microcbm/images/hero-light.svg)
*Hero image (light theme)*

![MicroCBM Hero Dark](https://mintlify.s3.us-west-1.amazonaws.com/microcbm-microcbm/images/hero-dark.svg)
*Hero image (dark theme)*

## What is MicroCBM?

MicroCBM is a Next.js 15 frontend application built for Condition-Based Maintenance (CBM) platforms. It provides a comprehensive solution for organizations to monitor equipment health, track oil sample analysis, manage alarms, and perform root cause analysis using proven methodologies.

The platform connects to a RESTful backend API and leverages modern React patterns including Server Actions, Server Components, and advanced state management to deliver a fast, reliable user experience.

## Key Features

| Feature | Description |
|--------|-------------|
| **Asset Management** | Track equipment inventory with detailed maintenance history, specifications, and lifecycle management across multiple sites. [Learn more](/features/asset-management) |
| **Oil Sample Analysis** | Monitor wear metals, contaminants, particle counts, and viscosity measurements to predict equipment failures before they occur. [Learn more](/features/oil-sample-analysis) |
| **Alarm Monitoring** | Real-time alarm system with acknowledgment workflow, severity tracking, and direct linking to maintenance recommendations. [Learn more](/features/alarm-monitoring) |
| **Root Cause Analysis** | Investigate failures using 5 Whys, Logic Tree, and Fishbone diagram templates with persistent browser storage. [Learn more](/features/root-cause-analysis) |
| **Multi-Organization Support** | Manage multiple organizations and sites with role-based access control and department-level permissions. [Learn more](/features/organizations-sites) |
| **Dashboard Analytics** | Visualize trends with interactive charts for assets, alarms, recommendations, and oil analysis data with forecasting capabilities. [Learn more](/features/asset-management) |

## Technology Stack

MicroCBM is built with modern web technologies:

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict type checking
- **UI Library**: React 19 with Server Components
- **State Management**: Zustand and TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS 4 with custom SCSS modules
- **Components**: Radix UI primitives with custom design system
- **Charts**: Recharts for data visualization
- **Authentication**: JWT-based with OTP verification

## Architecture Overview

MicroCBM follows a client-server architecture:

```mermaid
graph LR
    A[Browser] --> B[Next.js Frontend]
    B --> C[Server Actions]
    C --> D[REST API Backend]
    D --> E[Database]
    B --> F[Local Storage]
    F --> G[RCA Data]
```

> **Note:** MicroCBM is a frontend-only application. All business logic and data persistence are handled by the external REST API configured via `NEXT_PUBLIC_API_URL`.

## Use Cases

MicroCBM is designed for organizations that need to:

- **Predict Equipment Failures**: Use oil analysis trends to detect early warning signs of wear and contamination
- **Manage Maintenance Programs**: Track recommendations, assign work orders, and monitor completion status
- **Analyze Historical Data**: Review sample history and alarm patterns to identify recurring issues
- **Collaborate Across Teams**: Share insights between operations, maintenance, and engineering departments
- **Ensure Compliance**: Document maintenance activities and maintain audit trails for regulatory requirements

## Core Concepts

Before diving in, familiarize yourself with these key concepts:

- **[Authentication Flow](/concepts/authentication)** — Learn about JWT tokens, OTP verification, and session management
- **[Data Flow](/concepts/data-flow)** — Understand how data moves between components, Server Actions, and the API
- **[Architecture](/concepts/architecture)** — Explore the application structure and design patterns
- **[Permissions](/features/user-management)** — Discover role-based access control and permission checking

## Getting Started

Ready to start? Follow our quickstart guide to set up MicroCBM in minutes:

- **[Quickstart Guide](/quickstart)** — Get up and running with MicroCBM in under 5 minutes
- **[Installation Guide](/installation)** — Complete installation and configuration documentation

## Community and Support

Need help or want to contribute?

- **Documentation**: You're reading it! Use the search bar to find specific topics
- **Issues**: Report bugs or request features on GitHub
- **Updates**: Follow release notes for new features and improvements

> **Note:** This documentation covers the frontend application. For API documentation, backend setup, or database schema details, refer to your organization's backend documentation.
