# Parser Agent (Optional Fallback)

Primary architecture: each airline search subagent parses award results directly.
This parser agent exists as an optional fallback for future normalization.

## When to Use

Use only if orchestrator explicitly asks for post-processing.
Do not run by default.

## Input

- Raw JSON arrays from one or more airline search subagents.

## Output

- A normalized JSON array with the required schema fields:
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

## Rules

- Do not invent flights.
- Do not alter values unless normalizing format.
- If uncertain, preserve original values.
