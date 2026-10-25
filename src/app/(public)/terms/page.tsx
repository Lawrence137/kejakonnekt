import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Terms of service" };

// DRAFT: have a Kenyan lawyer review before launch, especially liability and fees.
export default function TermsPage() {
  const { pass, company } = siteConfig;

  return (
    <InfoPage
      title="Terms of service"
      intro="Please read these terms before using KejaKonnect."
      legal
    >
      <h2>What KejaKonnect is</h2>
      <p>
        KejaKonnect is an online marketplace where landlords and agents advertise rental houses and
        tenants find them. We are not a party to any tenancy agreement and we do not own, manage
        or inspect the houses listed.
      </p>

      <h2>Accounts</h2>
      <p>
        You must be 18 or over and give accurate information. You log in with a phone number you
        control. You&apos;re responsible for activity on your account.
      </p>

      <h2>Tenants</h2>
      <ul>
        <li>Browsing listings is free.</li>
        <li>
          A pass costs KES {pass.priceKes} and lets you see landlords&apos; and agents&apos; contact
          numbers for {pass.durationDays} days. Passes can&apos;t be shared or transferred.
        </li>
        <li>
          A pass gives you access to contact details. It does not guarantee that a house is
          available or suitable. Always view a house in person before paying a landlord anything.
        </li>
        <li>
          Payments are made by M-Pesa through our payment provider. See our{" "}
          <a href="/refunds">refund policy</a>.
        </li>
      </ul>

      <h2>Landlords and agents</h2>
      <ul>
        <li>You must complete identity verification before listing, and tell the truth in it.</li>
        <li>You must have the right to let each house you list.</li>
        <li>Listings must be accurate, with photos of the actual house.</li>
        <li>
          Mark a house as taken when it is, and confirm availability regularly. Unconfirmed
          listings are hidden.
        </li>
        <li>You must not ask for any deposit or fee before a tenant has viewed the house.</li>
      </ul>

      <h2>Not allowed</h2>
      <ul>
        <li>Fake, misleading or duplicate listings.</li>
        <li>Harassing other users or sharing contact details to scam people.</li>
        <li>Trying to access contact details without paying, or to break the service.</li>
      </ul>

      <h2>Our right to act</h2>
      <p>
        We may remove listings, reject verification, or suspend accounts that break these terms or
        put users at risk, and we may do so without notice where needed.
      </p>

      <h2>Liability</h2>
      <p>
        We work to keep listings accurate but can&apos;t guarantee them. To the extent the law
        allows, {company.legalName} is not responsible for disputes between tenants and landlords,
        or for losses from dealings between users.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of Kenya.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? <a href="/contact">Contact us</a>.
      </p>
    </InfoPage>
  );
}