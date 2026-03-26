---
name: mfa-agentmail
description: Retrieve a one-time passcode (OTP) from the shared AgentMail inbox when an airline website prompts for MFA verification.
tools:
  - exec
---

# MFA Code Retrieval via AgentMail

When an airline website prompts for multi-factor authentication (MFA), use this skill to retrieve the one-time passcode from the shared AgentMail inbox.

## How It Works

All airline accounts are configured to send MFA codes to a single AgentMail inbox. The `poll-mfa.ts` script queries that inbox, filtering by sender domain and timestamp to find the correct OTP email.

## Usage

### 1. Note the timestamp

Before the MFA email is triggered (i.e., before you submit the login form or click "send code"), capture the current time:

```
date -u +%Y-%m-%dT%H:%M:%SZ
```

This timestamp ensures the script only looks at emails received after the MFA was triggered, avoiding stale codes from previous login attempts.

### 2. Run the polling script

```
npx tsx scripts/poll-mfa.ts --sender-filter "<mfa_sender_filter>" --after "<timestamp>"
```

**Parameters:**
- `--sender-filter` — the email domain to filter by (from airline config, e.g., `@united.com`)
- `--after` — ISO 8601 timestamp from step 1

**Behavior:**
- Polls the AgentMail inbox every 3 seconds
- Looks for emails from a sender matching the filter, received after the specified timestamp
- Extracts a 4-8 digit numeric code from the email body
- Prints the code to stdout and exits with code 0
- If no matching email arrives within 60 seconds, exits with code 1

### 3. Enter the code

Take the OTP code from the script output and enter it into the MFA form field in the browser:

```
browser fill @<otp_field_ref> "<otp_code>"
browser click @<submit_ref>
browser wait --load networkidle
browser snapshot -i
```

### 4. Verify success

Check the snapshot after submitting the OTP. If login succeeded, you should see the airline's main page or dashboard. If the code was rejected, the page will show an error — report this as a failure.

## Error Handling

- **Exit code 1 (timeout):** The OTP email did not arrive within 60 seconds. This could mean the airline's email system is slow, the sender filter is wrong, or the MFA was not triggered. Report the failure.
- **Exit code 2 (config error):** Missing environment variables. Check that `AGENTMAIL_API_KEY` and `AGENTMAIL_INBOX_ID` are set.
- **Multiple codes received:** The script uses the most recent matching email. If this code doesn't work, the airline may have rate-limited or invalidated it.
