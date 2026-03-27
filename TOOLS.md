# Tools

## Browser Automation (agent-browser)

Airline subagents use `browser` for all website interactions:

1. Navigate to login or award search page.
2. Capture interactive snapshot.
3. Fill forms and submit actions.
4. Re-snapshot after each major page transition.
5. Read rendered results and parse directly in-agent.

## Recommended Command Pattern

- `browser --session <airline_key> open <url>`
- `browser --session <airline_key> wait --load networkidle`
- `browser --session <airline_key> snapshot -i`
- `browser --session <airline_key> fill @<ref> "<value>"`
- `browser --session <airline_key> click @<ref>`

Use a unique `--session` per airline so subagents can run in parallel safely.

## MFA Handling

If the page requests verification:

1. Airline subagent requests help using `subagents/mfa-agent.md`.
2. MFA subagent returns either:
   - `{"status":"ok","otp":"123456"}`
   - `{"status":"error","reason":"<reason>"}`
3. Airline subagent continues or fails fast with a clear reason.

## Output Requirement

Airline subagents must return JSON arrays with:

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

No parser scripts are used in this architecture.
