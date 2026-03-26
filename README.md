# Airline Award Search Agent

Multi-agent award flight search system powered by [OpenClaw](https://docs.openclaw.ai). Searches multiple airlines in parallel for award availability and delivers results via Telegram.

## Architecture

- **Orchestrator** (GPT-5.4-mini) receives search requests via Telegram, spawns parallel sub-agents
- **Sub-agents** (Gemini 3 Flash) each handle one airline: browser login, MFA, search, parse
- **AgentMail** provides a shared email inbox for receiving MFA one-time passcodes
- **Deterministic parsers** extract structured results from airline pages without using LLM tokens

## Setup

### 1. Prerequisites

- [OpenClaw](https://docs.openclaw.ai) installed and configured
- [agent-browser](https://agent-browser.dev/installation) installed (`npm install -g agent-browser && agent-browser install`)
- Node.js 18+

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your actual keys and credentials
```

Required environment variables:
- `OPENAI_API_KEY` — OpenAI API key (for orchestrator)
- `GOOGLE_API_KEY` — Google AI API key (for sub-agents)
- `TELEGRAM_BOT_TOKEN` — Telegram bot token from @BotFather
- `AGENTMAIL_API_KEY` — AgentMail API key
- `AGENTMAIL_INBOX_ID` — Your shared AgentMail inbox address
- `UNITED_CREDENTIALS`, `DELTA_CREDENTIALS`, `AMERICAN_CREDENTIALS` — Airline login credentials (format: `user:password`)

### 4. Configure OpenClaw

Edit `openclaw.json`:
- Add your Telegram user ID to `channels.telegram.allowFrom`

### 5. Configure airline accounts

Update each airline account's MFA email to your AgentMail inbox address (the value of `AGENTMAIL_INBOX_ID`).

### 6. Start the gateway

```bash
openclaw gateway
```

### 7. Pair Telegram (first time only)

Follow the OpenClaw Telegram pairing flow, then approve via:
```bash
openclaw pairing approve telegram <CODE>
```

## Usage

### On-demand search (via Telegram)

```
/search SFO NRT 2026-05-01 business united,delta
```

Or natural language:
```
Find business class award flights from SFO to Tokyo on May 1 on United and Delta
```

### Scheduled search (via cron)

```bash
openclaw cron add \
  --schedule "0 6 * * *" \
  --prompt "Search for award flights SFO to NRT on 2026-05-01 in business class on united and delta. Report results." \
  --deliver telegram
```

## Project Structure

```
├── openclaw.json          # OpenClaw runtime config
├── AGENTS.md              # Orchestrator instructions
├── SOUL.md                # Agent persona
├── TOOLS.md               # Tool usage notes
├── config/
│   ├── airlines.yaml      # Per-airline config
│   └── searches.yaml      # Saved search profiles
├── skills/
│   ├── airline-search/    # Browser automation workflow
│   └── mfa-agentmail/     # MFA code retrieval
└── scripts/
    ├── poll-mfa.ts        # AgentMail OTP polling
    ├── parse-united.ts    # United results parser
    ├── parse-delta.ts     # Delta results parser
    └── parse-american.ts  # American results parser
```

## Customization

### Adding a new airline

1. Add an entry to `config/airlines.yaml` with the airline's URLs, MFA sender filter, and credentials env var
2. Create a parser script at `scripts/parse-<airline>.ts`
3. Add the credentials env var to `.env`
4. Update the airline account's MFA email to your AgentMail inbox

### Adjusting models

Edit `openclaw.json`:
- `agents.defaults.model` — orchestrator model
- `agents.defaults.subagents.model` — sub-agent model
