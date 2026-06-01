import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageShell,
  LegalSection
} from "@/components/landing/legal-page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy | AppFrames",
  description: "How AppFrames collects, uses, and protects your information."
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated="May 28, 2026">
      <LegalSection title="Overview">
        <p>
          AppFrames (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates a
          browser-based tool that helps you design and export App Store screenshots. This Privacy
          Policy explains what information we collect, how we use it, and the choices you have.
        </p>
        <p>
          By using AppFrames at{" "}
          <Link href="/" className="text-zinc-300 underline-offset-2 hover:underline">
            our website
          </Link>{" "}
          or the editor, you agree to the practices described here.
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <p>
          <strong className="font-medium text-zinc-300">Content you upload.</strong> When you use
          the editor, you may upload screenshots, graphics, and other images. In normal use, this
          content is processed in your browser to render previews and exports. We do not operate a
          user account system, and we do not intentionally store your uploaded images on our
          servers as part of routine editing.
        </p>
        <p>
          <strong className="font-medium text-zinc-300">Usage data on your device.</strong> We use
          your browser&apos;s local storage to remember settings such as how many free exports you
          have used. If you purchase Pro, we may store a license indicator in a cookie so the app
          can recognize your purchase on return visits.
        </p>
        <p>
          <strong className="font-medium text-zinc-300">Payment information.</strong> If you buy
          lifetime Pro access, payments are processed by Stripe. We receive purchase confirmation
          and limited billing details from Stripe (such as email and transaction status), but we do
          not receive or store your full payment card number.
        </p>
        <p>
          <strong className="font-medium text-zinc-300">Technical and analytics data.</strong> Like
          most websites, our hosting infrastructure may automatically log basic technical
          information when you visit the site, such as IP address, browser type, referring page,
          and timestamps. We use this information to keep the service secure and reliable.
        </p>
      </LegalSection>

      <LegalSection title="How we use information">
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide, maintain, and improve the AppFrames editor and website</li>
          <li>Process purchases and verify Pro access</li>
          <li>Enforce free-tier limits and prevent abuse</li>
          <li>Respond to support requests and legal obligations</li>
          <li>Protect the security and integrity of our service</li>
        </ul>
      </LegalSection>

      <LegalSection title="How we share information">
        <p>
          We do not sell your personal information. We may share information only in these limited
          situations:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-zinc-300">Service providers</strong> such as
            Stripe (payments) and our hosting provider, who process data on our behalf
          </li>
          <li>
            <strong className="font-medium text-zinc-300">Legal requirements</strong> when we
            believe disclosure is necessary to comply with law, enforce our terms, or protect
            rights and safety
          </li>
          <li>
            <strong className="font-medium text-zinc-300">Business transfers</strong> in connection
            with a merger, acquisition, or sale of assets, with notice where required
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Data retention">
        <p>
          Editor content you upload generally remains on your device unless you clear your browser
          data or remove it yourself. Purchase-related records may be retained as long as needed to
          verify your license, comply with tax and accounting obligations, and resolve disputes.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          You can clear local storage and cookies in your browser to reset local app state, though
          this may remove export counts and Pro recognition until restored through purchase
          verification. You may choose not to upload content or make a purchase, but some features
          will not be available without doing so.
        </p>
        <p>
          Depending on where you live, you may have additional rights to access, correct, or delete
          personal information. Contact us to make a request.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          AppFrames is not directed to children under 13, and we do not knowingly collect personal
          information from children. If you believe a child has provided us information, please
          contact us so we can delete it.
        </p>
      </LegalSection>

      <LegalSection title="International users">
        <p>
          AppFrames is operated from the United States. If you access the service from other
          regions, your information may be processed in the United States or where our service
          providers operate.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we will revise the
          &ldquo;Last updated&rdquo; date at the top of this page. Continued use of AppFrames after
          changes become effective means you accept the updated policy.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about this Privacy Policy? Email us at{" "}
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
