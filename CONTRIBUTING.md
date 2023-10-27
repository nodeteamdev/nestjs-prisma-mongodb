# Contributing to the project

### Merge requests

Create new branch from `staging` branch and submit a merge request.
Branch name should be with the next format: 
```
feature/<label>
feature/<label>/<name>
feature/<label>/<name>-<name>

fix/*
hotfix/*
docs/*
build/*
```

### Commit message

Commit message should be with the next format - [conventionalcommits](https://www.conventionalcommits.org/en/v1.0.0/)
We are use commitizen for commit message formatting.

### Logging 

Define which events to log.
Log events that tell the story of how your app is behaving. Always log:

- Application errors
- Input and output validation failures
- Authentication successes and failures
- Authorization failures
- Session management failures
- Privilege elevation successes and failures
- Other higher-risk events, like data import and export
- Logging initialization
- Opt-ins, like terms of service
Consider logging other events that address these use cases:

Troubleshooting
- Monitoring and performance improvement
- Testing
- Understanding user behavior
- Security and auditing
For example, for auditing purposes, log an event whenever a user updates their profile in your app.

We are yse Nest.js logger. [Nest.js logger](https://docs.nestjs.com/techniques/logger)
