import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { phoneNumber } from "better-auth/plugins";
import { after } from "next/server";
import { db } from "@/lib/db";
import { isKenyanPhone } from "@/lib/phone";
import { sendSms } from "@/lib/sms";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),

  user: {
    additionalFields: {
      // input: false means users can never set these themselves
      role: { type: "string", required: false, defaultValue: "SEEKER", input: false },
      isVerified: { type: "boolean", required: false, defaultValue: false, input: false },
    },
  },

  // Protects your SMS budget from abuse
  rateLimit: {
    enabled: process.env.NODE_ENV === "production",
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/phone-number/send-otp": { window: 60, max: 3 },
      "/phone-number/verify": { window: 60, max: 10 },
    },
  },

  plugins: [
    phoneNumber({
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      allowedAttempts: 3,
      phoneNumberValidator: (phone) => isKenyanPhone(phone),
      sendOTP: ({ phoneNumber, code }) => {
        // Not awaited, so response time doesn't leak whether the number exists.
        // after() keeps the SMS going on Vercel after the response is sent.
        after(() =>
          sendSms(
            phoneNumber,
            `KejaKonnect: your code is ${code}. It expires in 5 minutes. Never share it.`,
          ),
        );
      },
      signUpOnVerification: {
        getTempEmail: (phone) =>
          `${phone.replace("+", "")}@phone.kejakonnect.invalid`,
        getTempName: () => "KejaKonnect user",
      },
    }),
    nextCookies(), // must stay last
  ],
});