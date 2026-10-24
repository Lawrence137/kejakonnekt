"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { normalizeKenyanPhone } from "@/lib/phone";

const inputClass =
  "h-12 w-full rounded-xl border bg-background px-4 text-lg outline-none focus:ring-2 focus:ring-ring";
const buttonClass =
  "h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [phone, setPhone] = useState(""); // normalized +254...
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function sendCode(normalized: string) {
    setLoading(true);
    setError("");
    const { error } = await authClient.phoneNumber.sendOtp({
      phoneNumber: normalized,
    });
    setLoading(false);
    if (error) {
      setError(error.message ?? "Could not send the code. Try again.");
      return false;
    }
    setCooldown(60);
    return true;
  }

  async function onSubmitPhone(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeKenyanPhone(phoneInput);
    if (!normalized) {
      setError("Enter a valid Kenyan number, e.g. 0712 345 678");
      return;
    }
    setPhone(normalized);
    if (await sendCode(normalized)) setStep("code");
  }

  async function onSubmitCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await authClient.phoneNumber.verify({
      phoneNumber: phone,
      code,
    });
    setLoading(false);
    if (error) {
      setError(
        error.status === 403
          ? "Too many wrong attempts. Request a new code."
          : "That code is wrong or has expired.",
      );
      return;
    }
    router.push(next);
    router.refresh();
  }

  if (step === "phone") {
    return (
      <form onSubmit={onSubmitPhone} className="space-y-4">
        <label className="block text-sm font-medium">
          Phone number
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0712 345 678"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            className={`${inputClass} mt-1`}
            required
          />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button type="submit" disabled={loading} className={buttonClass}>
          {loading ? "Sending..." : "Send code"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmitCode} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        We sent a 6-digit code to <strong>{phone}</strong>.
      </p>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="123456"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        className={`${inputClass} text-center tracking-[0.5em]`}
        required
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={loading || code.length !== 6}
        className={buttonClass}
      >
        {loading ? "Checking..." : "Verify and continue"}
      </button>
      <div className="flex justify-between text-sm">
        <button
          type="button"
          onClick={() => {
            setStep("phone");
            setCode("");
            setError("");
          }}
          className="text-muted-foreground hover:underline"
        >
          Change number
        </button>
        <button
          type="button"
          disabled={cooldown > 0 || loading}
          onClick={() => sendCode(phone)}
          className="font-medium text-primary disabled:text-muted-foreground"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </div>
    </form>
  );
}