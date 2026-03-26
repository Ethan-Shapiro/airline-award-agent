import { AgentMailClient } from "agentmail";

const POLL_INTERVAL_MS = 3_000;
const MAX_POLL_DURATION_MS = 60_000;
const OTP_REGEX = /\b(\d{4,8})\b/;

interface Args {
  senderFilter: string;
  after: string;
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  let senderFilter = "";
  let after = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--sender-filter" && args[i + 1]) {
      senderFilter = args[i + 1];
      i++;
    } else if (args[i] === "--after" && args[i + 1]) {
      after = args[i + 1];
      i++;
    }
  }

  if (!senderFilter || !after) {
    console.error("Usage: npx tsx scripts/poll-mfa.ts --sender-filter <domain> --after <ISO timestamp>");
    process.exit(2);
  }

  return { senderFilter, after };
}

async function pollForOtp(args: Args): Promise<string> {
  const apiKey = process.env.AGENTMAIL_API_KEY;
  const inboxId = process.env.AGENTMAIL_INBOX_ID;

  if (!apiKey || !inboxId) {
    console.error("Missing AGENTMAIL_API_KEY or AGENTMAIL_INBOX_ID environment variables.");
    process.exit(2);
  }

  const client = new AgentMailClient({ apiKey });
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_POLL_DURATION_MS) {
    const response = await client.inboxes.messages.list(inboxId, {
      after: args.after,
      limit: 10,
      ascending: false,
    });

    for (const message of response.messages) {
      const from = message.from?.toLowerCase() ?? "";
      if (!from.includes(args.senderFilter.toLowerCase())) continue;

      const fullMessage = await client.inboxes.messages.get(inboxId, message.messageId);
      const body = (fullMessage as any).extractedText
        ?? (fullMessage as any).text
        ?? (fullMessage as any).preview
        ?? "";

      const match = body.match(OTP_REGEX);
      if (match) {
        await client.inboxes.messages.update(inboxId, message.messageId, {
          addLabels: ["processed"],
        });
        return match[1];
      }
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error("Timed out waiting for OTP email.");
}

async function main() {
  const args = parseArgs();

  try {
    const otp = await pollForOtp(args);
    process.stdout.write(otp);
    process.exit(0);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}

main();
