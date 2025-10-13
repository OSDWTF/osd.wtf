import Link from "next/link";

export default function RecordingPolicy() {
  return (
    <article className="legal-page">
      <Link href="/legal" className="back-link">← Back to Legal Hub</Link>

      <h1>Recording & Clip Policy — OSD.WTF</h1>
      <p><strong>Effective Date:</strong> October 12, 2025<br />
      <strong>Last Updated:</strong> October 12, 2025</p>

      <h2>1. Overview</h2>
      <p>This policy explains how OSD.WTF handles the recording, archiving, and use of audio content from live Spaces and other broadcasts.</p>
      <p>Our goal is to respect community consent while preserving cultural moments worth sharing.</p>
      <p>We operate transparently — if something is being recorded, you'll know.</p>

      <h2>2. Recording Status</h2>
      <ul>
        <li>OSD.WTF hosts may choose to enable or disable public recording on X (Twitter) Spaces.</li>
        <li>When recording is active, X displays a "REC" icon visible to all participants.</li>
        <li>Many Spaces are unrecorded by default, meaning no public replay is available after the broadcast ends.</li>
        <li>Regardless of recording status, X automatically retains a temporary archive of all Space audio for up to 30 days (or up to 120 days if under moderation review).</li>
      </ul>

      <h2>3. Archive Access & Retrieval</h2>
      <p>During this retention window, OSD.WTF may review or request access to the X archive to locate culturally significant, educational, or memorable moments.</p>
      <p>Any retrieved material will not be published without obtaining verbal or written consent from the identifiable speakers featured in the segment.</p>
      <p>This process allows OSD.WTF to preserve key moments from long-running or 24-hour Spaces while maintaining respect for participant privacy.</p>

      <h2>4. Clip Creation & Usage</h2>
      <p>OSD.WTF may create short audio or video excerpts ("Clips") from archived Spaces for cultural, educational, or promotional use.</p>
      <p>When doing so:</p>
      <ul>
        <li>Participants whose voice, likeness, or identifiable comments appear in a clip will be contacted for consent before public release.</li>
        <li>For pre-scheduled shows (like "Who TF is ___?"), participants may grant consent in advance.</li>
        <li>If we cannot reach a speaker but they later request removal, we may remove or edit the clip at our discretion to respect privacy and consent.</li>
        <li>Clips may appear on official OSD.WTF channels (website, X, YouTube, Spotify, etc.), but will never be sold or licensed commercially without direct agreement.</li>
      </ul>

      <h2>5. Third-Party Recordings</h2>
      <p>Spaces on X are public broadcasts.</p>
      <p>OSD.WTF cannot control or prevent listeners, anonymous users, or external tools from recording or redistributing live audio.</p>
      <p>Such recordings are outside our control and may occur without our knowledge or consent.</p>
      <p>By joining a Space, participants acknowledge this risk.</p>
      <p>OSD.WTF is not responsible for third-party recordings, reposts, or derivative uses created outside our official channels.</p>

      <h2>6. Transparency & Notice</h2>
      <p>At the start of every Space, hosts will announce whether the session is being recorded or may later be clipped.</p>
      <p>Guests on planned or featured shows will be briefed on this policy in advance.</p>
      
      <div className="disclaimer-box">
        <strong>Live Room Disclaimer:</strong><br />
        "This Space may be recorded or clipped for educational or cultural purposes. Views are speakers' own and do not represent OSD.WTF."
      </div>

      <h2>7. Takedown & Removal Requests</h2>
      <p>If you appear in a clip or recording and wish for it to be removed:</p>
      <ul>
        <li>Email <a href="mailto:privacy@osd.wtf">privacy@osd.wtf</a> with the subject "Clip Removal Request."</li>
        <li>Include a link or clear description of the content.</li>
        <li>We will review and respond promptly.</li>
      </ul>
      <p>We will honor reasonable takedown requests and remove or edit the material wherever possible.</p>

      <h2>8. Ownership & Rights</h2>
      <ul>
        <li>Speakers retain ownership of their words and likeness.</li>
        <li>By granting consent for a clip, speakers provide OSD.WTF a non-exclusive, worldwide license to reproduce, edit, and distribute that segment for educational or cultural purposes.</li>
        <li>OSD.WTF retains ownership over its brand, formatting, and edited media compositions.</li>
      </ul>

      <h2>9. Views & Liability Disclaimer</h2>
      <p>All Spaces are public, unscripted discussions.</p>
      <p>Opinions expressed belong solely to the individual speakers.</p>
      <p>They do not represent the views of OSD.WTF, OSD (Ordinals Support Desk), its hosts, or partners.</p>
      <p>OSD.WTF assumes no liability for statements made by third parties, nor for actions taken based on information shared in live or recorded broadcasts.</p>

      <h2>10. Policy Updates</h2>
      <p>We may revise this policy to reflect changes in technology, platform rules, or community standards.</p>
      <p>All updates will appear here with a new "Last Updated" date.</p>
      <p>Continued participation after an update constitutes acceptance of the revised policy.</p>

      <h2>11. Contact</h2>
      <p>For all questions or concerns about this policy:<br />
      📩 <a href="mailto:privacy@osd.wtf">privacy@osd.wtf</a><br />
      🕊 X (Twitter): <a href="https://x.com/OSDWTF" target="_blank">@OSDWTF</a></p>
    </article>
  );
}
