# Architecture

## Overview

Tasktiful is a full-stack Next.js application.

## Technology Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend

- Next.js Server Actions
- Next.js Route Handlers

### Database

- PostgreSQL
- Prisma ORM

### Authentication

- Auth.js
- Google OAuth

### Deployment

- Vercel
- Neon PostgreSQL


# Principles

## Server First

Use React Server Components by default.

Only use Client Components when required.

Examples:

Client Components:
- Forms
- Interactive calendars
- Drag and drop
- Animations

Server Components:
- Data fetching
- Static UI
- Dashboard summaries


## Type Safety

Avoid:

- any
- duplicated types
- unclear data flow

Use:

- TypeScript
- Zod validation
- Prisma generated types


## Folder Structure
app/
routes
layouts

components/
ui/
task/
calendar/
dashboard/

actions/
server actions

lib/
database
auth
utilities

hooks/

types/

prisma/
schema.prisma