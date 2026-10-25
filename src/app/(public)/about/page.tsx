import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <InfoPage
      title="About KejaKonnect"
      intro={`We help people find rental houses in ${siteConfig.launchArea} and beyond, without the runaround.`}
    >
      <h2>Why we exist</h2>
      <p>
        Finding a house usually means chasing brokers, travelling to houses that were taken weeks
        ago, and worrying about scams. KejaKonnect is built to make that easier and safer.
      </p>

      <h2>What makes us different</h2>
      <ul>
        <li>
          <strong>Verified landlords and agents.</strong> Everyone who lists confirms their phone
          number and submits an ID that our team reviews.
        </li>
        <li>
          <strong>Fresh listings.</strong> Landlords must confirm availability regularly, and houses
          that are taken disappear from search.
        </li>
        <li>
          <strong>Free to browse.</strong> You see photos, prices and locations without paying.
          You pay only to unlock contact details.
        </li>
      </ul>

      <h2>Where we operate</h2>
      <p>
        We&apos;re starting in {siteConfig.launchArea}, Kiambu County, and growing to more areas
        across Kenya.
      </p>

      <h2>For landlords and agents</h2>
      <p>
        Listing is free. Tenants pay to reach you, so the calls you get are from people who are
        ready to view. <a href="/dashboard">Get started</a>.
      </p>
    </InfoPage>
  );
}