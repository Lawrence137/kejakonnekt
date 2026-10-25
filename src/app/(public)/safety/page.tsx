import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Safety tips for renting",
  description: "How to avoid rental scams and view houses safely in Kenya.",
};

export default function SafetyPage() {
  return (
    <InfoPage
      title="Safety tips"
      intro="Most landlords are honest, but rental scams are real. These habits protect you."
    >
      <h2>Before you pay anyone</h2>
      <ul>
        <li>
          <strong>View the house in person first.</strong> Never send a deposit, &quot;booking
          fee&quot; or &quot;viewing fee&quot; to someone you haven&apos;t met.
        </li>
        <li>Go in daylight and take a friend or family member with you.</li>
        <li>
          Check that the person showing the house is the owner or has written authority from the
          owner to let it.
        </li>
        <li>Make sure the photos match the house you&apos;re seeing.</li>
      </ul>

      <h2>When you&apos;re ready to pay rent or a deposit</h2>
      <ul>
        <li>Read and sign a written tenancy agreement first, and keep a copy.</li>
        <li>Pay in a traceable way and get a written receipt.</li>
        <li>Never share your M-Pesa PIN. No genuine service will ask for it.</li>
      </ul>

      <h2>Warning signs</h2>
      <ul>
        <li>A price far below similar houses in the area.</li>
        <li>Pressure to pay today because &quot;many people are interested&quot;.</li>
        <li>A landlord who refuses to meet, or who is always &quot;out of town&quot;.</li>
        <li>Requests for money before you&apos;ve seen the house.</li>
      </ul>

      <h2>For landlords and agents</h2>
      <ul>
        <li>Keep your listing up to date, and mark houses as taken promptly.</li>
        <li>Use written tenancy agreements and keep records of payments.</li>
        <li>Never share your ID or M-Pesa PIN with anyone.</li>
      </ul>

      <h2>Found a problem?</h2>
      <p>
        If a listing looks fake, a number doesn&apos;t work, or a house is already taken,
        <a href="/contact"> contact us</a> and we&apos;ll look into it.
      </p>
    </InfoPage>
  );
}