import Link from "next/link";

export default function LegalHub() {
  return (
    <div className="legal-hub">
      <Link href="/" className="back-link">← Back to OSD.WTF</Link>
      <h1>Legal</h1>
      <p>Key policies that govern your use of OSD.WTF.</p>

      <ul>
        <li><Link href="/privacy">Privacy Policy</Link> — what we collect and why</li>
        <li><Link href="/terms">Terms of Use</Link> — rules, liability, and rights</li>
        <li><Link href="/recording-policy">Recording & Clip Policy</Link> — how live audio and clips work</li>
      </ul>

      <h3>Contact</h3>
      <p>Email: <a href="mailto:privacy@osd.wtf">privacy@osd.wtf</a></p>
    </div>
  );
}
