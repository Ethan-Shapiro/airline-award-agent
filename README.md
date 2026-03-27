# Airline Award Search Agent

Markdown-only multiagent architecture for award flight search orchestration.

## Architecture

- `AGENTS.md` is the main orchestrator definition.
- `subagents/airlines/*.md` are airline-specific search agents.
- `subagents/mfa-agent.md` is the shared MFA helper agent.
- Each airline agent performs browser search and parses results directly from page content.
- No parser scripts or TypeScript processing are used.

## Request Formats

- Structured: `/search SFO NRT 2026-05-01 business united,delta`
- Natural language: `Find business class award flights from SFO to Tokyo on May 1 on United and Delta`

## Output Contract

Each airline subagent returns a JSON array with:

- `airline`
- `flightNumber`
- `departure`
- `arrival`
- `origin`
- `destination`
- `cabinClass`
- `milesCost`
- `taxesFees`
- `stops`
- `availableSeats`

The orchestrator aggregates these arrays and returns one user-facing summary.

## Project Structure

```text
├── AGENTS.md
├── TOOLS.md
├── openclaw.json
└── subagents/
    ├── README.md
    ├── mfa-agent.md
    ├── parser-agent.md
    └── airlines/
        ├── united.md
        ├── delta.md
        ├── american.md
        └── air-canada.md
```

## Add a New Airline

1. Create `subagents/airlines/<airline-key>.md`.
2. Add login URL, award search URL, credentials env var name, and MFA sender filter.
3. Keep the same strict JSON output schema.
4. Add the new airline key to the supported list in `AGENTS.md`.
