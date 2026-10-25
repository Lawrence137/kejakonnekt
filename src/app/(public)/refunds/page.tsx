import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Refund policy" };

// DRAFT: this is a business decision. Adjust it to what you will actually honour.
export default function RefundsPage() {
  const { pass } = siteConfig;

  return (
    <InfoPage
      title="Refund policy"
      intro="We want you to get value from your pass. Here is what we'll do when something goes wrong."
      legal
    >
      <h2>What you paid for</h2>
      <p>
        A pass (KES {pass.priceKes}) gives you access to landlords&apos; and agents&apos; contact
        numbers for {pass.durationDays} days. Once you&apos;ve unlocked a number, the service has
        been delivered, so passes are generally not refundable.
      </p>

      <h2>When we&apos;ll make it right</h2>
      <ul>
        <li>
          <strong>The number is wrong or doesn&apos;t work.</strong> Report it and we&apos;ll
          check. If it&apos;s our fault or the landlord&apos;s, we&apos;ll extend your pass or
          refund you.
        </li>
        <li>
          <strong>The house was already taken.</strong> Report it, and we&apos;ll extend your pass
          and remove the listing.
        </li>
        <li>
          <strong>You were charged twice or a payment failed.</strong> We&apos;ll refund the extra
          amount.
        </li>
        <li>
          <strong>The listing was fake.</strong> We&apos;ll refund you and remove the account.
        </li>
      </ul>

      <h2>How to ask</h2>
      <p>
        <a href="/contact">Contact us</a> within 7 days with your phone number and the house
        concerned. We aim to respond within 2 working days. Refunds go back to your M-Pesa number.
      </p>
    </InfoPage>
  );
}