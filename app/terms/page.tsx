import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageShell,
  LegalSection
} from "@/components/landing/legal-page-shell";
import { PRO_LIFETIME_PRICE_USD } from "@/lib/pro/constants";

export const metadata: Metadata = {
  title: "Terms of Service | AppFrames",
  description: "Terms and conditions for using AppFrames."
};

export default function TermsOfServicePage() {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated="May 28, 2026">
      <LegalSection title="Agreement">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of AppFrames
          (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), including our website and
          screenshot editor. By accessing or using AppFrames, you agree to these Terms. If you do
          not agree, do not use the service.
        </p>
      </LegalSection>

      <LegalSection title="The service">
        <p>
          AppFrames is a design tool that helps you create App Store marketing screenshots using
          templates, device mockups, typography, and export tools. Features may vary between free
          and paid plans. We may update, add, or remove features at any time.
        </p>
      </LegalSection>

      <LegalSection title="Eligibility">
        <p>
          You must be at least 13 years old to use AppFrames. If you are using the service on
          behalf of a company or organization, you represent that you have authority to bind that
          entity to these Terms.
        </p>
      </LegalSection>

      <LegalSection title="Your content">
        <p>
          You retain ownership of screenshots, graphics, text, and other materials you upload or
          create in AppFrames (&ldquo;Your Content&rdquo;). You are solely responsible for Your
          Content and for ensuring you have all rights needed to use, modify, and export it,
          including any third-party app screenshots, logos, trademarks, or likenesses.
        </p>
        <p>
          You grant us a limited, non-exclusive license to process Your Content only as needed to
          operate the service—for example, rendering previews and generating exports in your
          browser. We do not claim ownership of Your Content.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use AppFrames for unlawful, infringing, or harmful purposes</li>
          <li>Upload malware or attempt to disrupt or reverse engineer the service</li>
          <li>Circumvent export limits, licensing checks, or other access controls</li>
          <li>Misrepresent your affiliation with Apple, Google, or any other third party</li>
          <li>Use automated means to scrape or overload the service without permission</li>
        </ul>
      </LegalSection>

      <LegalSection title="Free and paid plans">
        <p>
          AppFrames offers a free tier with limited exports and features, and a lifetime Pro plan
          with expanded access. Current plan details are described on our{" "}
          <Link href="/#pricing" className="text-zinc-300 underline-offset-2 hover:underline">
            pricing page
          </Link>
          .
        </p>
        <p>
          Lifetime Pro is a one-time purchase (currently ${PRO_LIFETIME_PRICE_USD} USD at launch
          pricing unless otherwise stated at checkout) that unlocks Pro features for the purchased
          license. &ldquo;Lifetime&rdquo; means for as long as we continue to operate AppFrames,
          not in perpetuity if the product is discontinued.
        </p>
      </LegalSection>

      <LegalSection title="Payments and refunds">
        <p>
          Paid purchases are processed by Stripe. Prices, taxes, and available payment methods are
          shown at checkout. You authorize us and Stripe to charge the payment method you provide
          for the selected plan.
        </p>
        <p>
          Because AppFrames delivers immediate digital access, all sales are generally final unless
          required otherwise by applicable law or explicitly offered by us in writing. If you believe
          a charge was made in error, contact us promptly at{" "}
          <a
            href="mailto:martimicm1010@gmail.com"
            className="text-zinc-300 underline-offset-2 hover:underline"
          >
            martimicm1010@gmail.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          AppFrames, including its software, templates, branding, and design, is owned by us or our
          licensors and protected by intellectual property laws. These Terms do not grant you any
          right to use our trademarks, logos, or brand assets except as needed to describe your
          lawful use of the service.
        </p>
        <p>
          AppFrames is not affiliated with, endorsed by, or sponsored by Apple Inc. Apple, the
          Apple logo, iPhone, and App Store are trademarks of Apple Inc.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer of warranties">
        <p>
          AppFrames is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. To
          the fullest extent permitted by law, we disclaim all warranties, express or implied,
          including merchantability, fitness for a particular purpose, and non-infringement. We do
          not guarantee that exports will meet App Store review requirements or that the service
          will be uninterrupted or error-free.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, AppFrames and its operators will not be liable for
          any indirect, incidental, special, consequential, or punitive damages, or any loss of
          profits, data, or goodwill, arising from your use of the service.
        </p>
        <p>
          Our total liability for any claim relating to the service will not exceed the greater of
          (a) the amount you paid us in the twelve months before the claim or (b) USD $50.
        </p>
      </LegalSection>

      <LegalSection title="Termination">
        <p>
          You may stop using AppFrames at any time. We may suspend or terminate access if you
          violate these Terms or if we discontinue the service. Sections that by their nature
          should survive termination will survive, including ownership, disclaimers, and limits of
          liability.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may modify these Terms from time to time. If changes are material, we will provide
          notice by updating the date at the top of this page or through the service. Continued use
          after changes take effect constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These Terms are governed by the laws of the United States and the State of Delaware,
          without regard to conflict-of-law principles, except where mandatory consumer protection
          laws in your jurisdiction provide otherwise.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these Terms? Email us at{" "}
          <a
            href="mailto:martimicm1010@gmail.com"
            className="text-zinc-300 underline-offset-2 hover:underline"
          >
            martimicm1010@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
