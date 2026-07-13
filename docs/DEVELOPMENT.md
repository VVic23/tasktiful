# Development Guide

## Git

Commit frequently.

Commit messages should describe changes.

Examples:

Good:
Add task creation form
Implement calendar view
Fix authentication redirect


Bad:
Changes
Update stuff
Fix



## Coding Rules

### Components

Prefer:

- Small components
- Reusable components
- Clear responsibilities


### Styling

Use:

- Tailwind CSS
- shadcn/ui

Avoid:

- Custom CSS unless necessary


### Naming

Components:
TaskCard.tsx
CalendarView.tsx


Functions:
createTask()
getUserTasks()



## Environment Variables

Never commit:

- API keys
- Database URLs
- Secrets


## Deployment

Production deployment:

- GitHub
- Vercel
- Neon