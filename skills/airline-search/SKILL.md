---
name: airline-search
description: Search for award flights on a specific airline website using browser automation. Follow these steps sequentially to login, handle MFA, search, and parse results.
tools:
  - browser
  - exec
---

# Airline Award Search

This skill walks you through searching for award flights on an airline website. You will receive task instructions specifying the airline details and search criteria.

## Prerequisites

Before starting, confirm you have these from your task instructions:
- **login_url** — the airline's login page
- **credentials_env** — environment variable name holding `username:password`
- **mfa_sender_filter** — email domain filter for OTP emails (e.g., `@united.com`)
- **origin** — departure airport IATA code
- **destination** — arrival airport IATA code
- **date** — travel date
- **cabin_class** — economy, premium_economy, business, or first
- **parser_script** — path to the deterministic parser script

## Step 1: Read Credentials

Read the credentials from the environment variable specified in your task. The format is `username:password`. Split on the first `:` to get the username and password separately.

Use `exec` to read the env var:
```
echo $<credentials_env>
```

## Step 2: Navigate to Login

Use `--session` with the airline name to isolate this browser from other parallel sub-agents:

```
browser --session <airline_key> open <login_url>
browser --session <airline_key> wait --load networkidle
browser --session <airline_key> snapshot -i
```

All subsequent `browser` commands in this skill should also include `--session <airline_key>`.

Look for the login form in the snapshot. You should see input fields for email/username and password.

## Step 3: Login

Fill the login form using element refs from the snapshot:

```
browser fill @<username_ref> "<username>"
browser fill @<password_ref> "<password>"
browser click @<submit_ref>
browser wait --load networkidle
browser snapshot -i
```

## Step 4: Handle MFA (if prompted)

Check the snapshot after login. If you see an MFA/verification code prompt:

1. Note the current time as an ISO timestamp
2. Run the MFA polling script:
```
npx tsx scripts/poll-mfa.ts --sender-filter "<mfa_sender_filter>" --after "<ISO timestamp>"
```
3. The script will output the OTP code on stdout
4. Fill the OTP into the verification field and submit:
```
browser fill @<otp_ref> "<otp_code>"
browser click @<verify_ref>
browser wait --load networkidle
browser snapshot -i
```

If no MFA prompt appears, skip to Step 5.

## Step 5: Navigate to Award Search

If you're not already on the award search page after login, navigate there. Look for links or menu items related to "Book", "Flights", or "Award travel" in the snapshot.

Key things to look for and enable on the search form:
- A "Use miles" / "Book with miles" / "Shop with Miles" / "Redeem miles" toggle or checkbox — **this must be enabled**
- Trip type selector — set to "One-way" or "Round trip" as appropriate

## Step 6: Fill Search Form

Using the snapshot refs, fill in the search criteria:

```
browser fill @<origin_ref> "<origin>"
browser fill @<destination_ref> "<destination>"
browser fill @<date_ref> "<date>"
```

For cabin class, look for a dropdown or selector and choose the appropriate option.

After filling all fields, submit the search:
```
browser click @<search_ref>
browser wait --load networkidle
```

Wait for results to fully load. Airline search results pages often have loading spinners or progressive rendering. Wait a few seconds and re-snapshot:
```
browser wait 5000
browser snapshot -i
```

## Step 7: Parse Results

Once the results page has loaded, extract the page content and pipe it to the deterministic parser:

```
browser get text body > /tmp/results.txt
npx tsx <parser_script> < /tmp/results.txt
```

Alternatively, if the parser expects a snapshot:
```
browser snapshot > /tmp/snapshot.txt
npx tsx <parser_script> < /tmp/snapshot.txt
```

The parser outputs a JSON array of award results. This is your final output — return it as your result.

## Step 8: Clean Up

```
browser close
```

## Troubleshooting

- **Login failed:** Re-snapshot and look for error messages. If credentials are wrong, report the error — do not retry with different credentials.
- **MFA timeout:** If `poll-mfa.ts` exits with code 1, the OTP email did not arrive within 60 seconds. Report this as a failure.
- **No results page:** If the search doesn't navigate to results after 15 seconds, take a screenshot for debugging and report the issue.
- **CAPTCHA:** If you encounter a CAPTCHA, report it as a failure — CAPTCHAs cannot be solved automatically.
- **Unexpected page state:** Take a screenshot with `browser screenshot` and describe what you see in your error report.
