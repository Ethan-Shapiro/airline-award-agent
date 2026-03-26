# Tools

## Browser Automation (agent-browser)

Sub-agents use the `browser` tool for airline website automation. Core workflow:

1. `browser navigate <url>` — open a page
2. `browser snapshot -i` — get interactive elements with refs (@e1, @e2)
3. `browser click @e1` / `browser fill @e2 "text"` — interact using refs
4. Re-snapshot after any page change

Tips:
- Always snapshot after navigation or form submission to get fresh refs
- Use `browser wait --load networkidle` before snapshot on slow pages
- Use `browser screenshot` for debugging when snapshots are unclear
- Use `browser --session <name>` to run in an isolated session (each sub-agent should use a unique session name like `--session united` to avoid conflicts with parallel searches)
- Use `browser state save <file>` after a successful login to cache the session, and `browser state load <file>` on subsequent runs to skip re-login
- If `@ref`-based interaction fails on tricky elements, use semantic locators as a fallback:
  - `browser find role button click --name "Submit"` — find by ARIA role + name
  - `browser find text "Sign In" click` — find by visible text
  - `browser find label "Email" fill "user@test.com"` — find by form label

## Helper Scripts

All scripts are in the `scripts/` directory and run via `npx tsx`:

- **poll-mfa.ts** — Polls AgentMail for an OTP code
  - Usage: `npx tsx scripts/poll-mfa.ts --sender-filter <domain> --after <ISO timestamp>`
  - Outputs: the OTP code on stdout, or exits with code 1 on timeout
  - Example: `npx tsx scripts/poll-mfa.ts --sender-filter "@united.com" --after "2026-05-01T10:30:00Z"`

- **parse-united.ts** — Parses United award results from page content
  - Input: page content via stdin (pipe from `browser get text` or snapshot)
  - Output: JSON array of award results on stdout

- **parse-delta.ts** — Same as above for Delta
- **parse-american.ts** — Same as above for American Airlines

## Configuration

- `config/airlines.yaml` — Per-airline URLs, credentials env vars, MFA sender filters, parser scripts
- `config/searches.yaml` — Saved search profiles for cron jobs
