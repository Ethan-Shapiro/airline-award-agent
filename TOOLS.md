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
- `browser --session <airline_key> wait 5000`
- `browser --session <airline_key> wait --load networkidle`
- `browser --session <airline_key> snapshot -i`
- `browser --session <airline_key> fill @<ref> "<value>"`
- `browser --session <airline_key> click @<ref>`

Use a unique `--session` per airline so subagents can run in parallel safely.

## Timing Rules (IMPORTANT)

Airline websites are slow and heavily JavaScript-dependent. Follow these rules strictly:

1. **After every `open` or `click` that triggers navigation**, always run:
   ```
   browser --session <airline_key> wait 5000
   browser --session <airline_key> wait --load networkidle
   ```
   The 5-second wait lets the page start rendering before checking network idle.

2. **After form submissions** (search, login, MFA verify), wait longer:
   ```
   browser --session <airline_key> wait 5000
   browser --session <airline_key> wait --load networkidle
   browser --session <airline_key> wait 3000
   ```

3. **Always snapshot after waiting**, never before.

## Retry on Failure

If a page loads as a 404, error page, or blank page after navigation:

1. Refresh the page:
   ```
   browser --session <airline_key> reload
   ```
2. Wait 10 seconds:
   ```
   browser --session <airline_key> wait 10000
   browser --session <airline_key> wait --load networkidle
   ```
3. Snapshot and try again.
4. If it still fails after one retry, report the failure — do not loop indefinitely.

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
