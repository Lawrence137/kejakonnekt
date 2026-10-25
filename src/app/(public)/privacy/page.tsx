import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Privacy policy" };

// DRAFT: have a Kenyan lawyer review before launch. Confirm retention periods,
// processors and your Data Protection Act registration.
export default function PrivacyPage() {
  const { legalName } = siteConfig.company;

  return (
    <InfoPage
      title="Privacy policy"
      intro={`How ${legalName} collects, uses and protects your personal data.`}
      legal
    >
      <h2>Who we are</h2>
      <p>
        {legalName} runs the KejaKonnect rental marketplace and is the controller of the personal
        data described here. We handle personal data in line with Kenya&apos;s Data Protection Act,
        2019.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>All users:</strong> your phone number, and your name if you give it. We use SMS
          codes to log you in, so we don&apos;t store passwords.
        </li>
        <li>
          <strong>Landlords and agents:</strong> your full name, ID type and number, photos of your
          ID, your agency name if any, and the details and photos of the houses you list.
        </li>
        <li>
          <strong>Tenants who pay:</strong> your M-Pesa phone number and transaction reference,
          which houses&apos; contact details you unlock, and when.
        </li>
        <li>
          <strong>Technical data:</strong> a login session cookie that is strictly necessary for
          the site to work, and basic logs for security and fixing errors.
        </li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To create your account and log you in.</li>
        <li>To verify landlords and agents and keep scams off the platform.</li>
        <li>To process payments and give you access to contact details you paid for.</li>
        <li>To respond to reports and support requests, and to keep the service secure.</li>
      </ul>

      <h2>ID documents</h2>
      <p>
        ID photos are stored privately and are only seen by authorised KejaKonnect administrators
        for verification. They are never shown to tenants or the public. We record when an
        administrator views them. We delete ID photos within 30 days after a decision on your
        application, and keep only the verification record.
      </p>

      <h2>Who we share data with</h2>
      <p>
        We don&apos;t sell personal data. We use service providers to run KejaKonnect: for sending
        SMS codes, processing M-Pesa payments, hosting, and storing data and files. They process
        data only on our instructions. Some of these providers are based outside Kenya, and we
        take steps to protect data when it is transferred. A landlord&apos;s or agent&apos;s
        contact number on a listing is shown to tenants who have paid for access.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to see the data we hold about you, correct it, delete it, or object to how we
        use it. <a href="/contact">Contact us</a> to make a request. You can also complain to the
        Office of the Data Protection Commissioner.
      </p>

      <h2>Keeping data safe and how long we keep it</h2>
      <p>
        We use access controls, encryption in transit and private file storage. We keep data only
        as long as we need it for the purposes above or as the law requires, then delete or
        anonymise it.
      </p>

      <h2>Children</h2>
      <p>KejaKonnect is for people aged 18 and over.</p>

      <h2>Changes</h2>
      <p>
        We may update this policy. We&apos;ll change the date at the top when we do, and tell you
        about major changes.
      </p>
    </InfoPage>
  );
}