import { SideBlock } from "@/components/side-block";
import "./subscribe.css";

/** The sidebar's "Subscribe to this author" block: the RSS link and a one-line explainer. */
export function SubscribeBlock() {
  return (
    <SideBlock title="Subscribe to this author" className="ft-subscribe-block">
      <a href="/feed.xml" type="application/rss+xml">
        RSS feed
      </a>
      <details className="whatis">
        <summary>(what is this?)</summary>
        <p>A feed reader checks this file and tells you when a new entry appears. Nothing to sign up for.</p>
      </details>
    </SideBlock>
  );
}
