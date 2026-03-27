# Subagents

This folder contains all subagent definitions used by the orchestrator.

## Structure

- `mfa-agent.md` - shared MFA retrieval flow
- `parser-agent.md` - optional normalization fallback (not primary path)
- `airlines/*.md` - airline-specific search agents

## How the Orchestrator Uses This Folder

1. Parse user request into route/date/cabin/airlines.
2. Map each airline key to `subagents/airlines/<airline>.md`.
3. Spawn airline subagents in parallel.
4. Each airline subagent performs browser search and direct parsing from page content.
5. Aggregate all airline JSON outputs into one final response.

## Standard Output Schema

Each airline subagent must return a JSON array of objects with:

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

Return `[]` when no results are found.
