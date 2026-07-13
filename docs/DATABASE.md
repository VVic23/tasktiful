# Database

Tasktiful uses PostgreSQL with Prisma ORM.

## Main Entities

## User

Stores account information.

Fields:

- id
- name
- email
- image
- createdAt


## Task

Core application object.

Fields:

- id
- title
- description
- priority
- status
- dueDate
- estimatedTime
- favorite
- createdAt
- updatedAt
- userId


## Category

Groups tasks.

Examples:

- Work
- School
- Personal
- Health


## Tag

Flexible organization.

Examples:

- coding
- errands
- urgent


## Subtask

Tasks inside tasks.

Example:

Vacation

- Book flight
- Reserve hotel


## Future Tables

Possible additions:

- Reminders
- Notifications
- Calendar integrations
- Activity history
- Shared projects