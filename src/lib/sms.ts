// Dev: prints the message to the terminal. Production: sends via Africa's Talking.
// Set SMS_LIVE_IN_DEV=true to send real SMS from your laptop.
export async function sendSms(to: string, message: string) {
  const live =
    process.env.NODE_ENV === "production" ||
    process.env.SMS_LIVE_IN_DEV === "true";

  if (!live) {
    console.log(`\n[SMS dev] to ${to}\n${message}\n`);
    return;
  }

  const username = process.env.AT_USERNAME;
  const apiKey = process.env.AT_API_KEY;
  if (!username || !apiKey) {
    console.error("SMS not sent: AT_USERNAME / AT_API_KEY missing");
    return;
  }

  const base =
    username === "sandbox"
      ? "https://api.sandbox.africastalking.com"
      : "https://api.africastalking.com";

  const body = new URLSearchParams({ username, to, message });
  if (process.env.AT_SENDER_ID) body.set("from", process.env.AT_SENDER_ID);

  try {
    const res = await fetch(`${base}/version1/messaging`, {
      method: "POST",
      headers: {
        apiKey,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) console.error("SMS failed:", res.status, await res.text());
  } catch (err) {
    console.error("SMS error:", err);
  }
}