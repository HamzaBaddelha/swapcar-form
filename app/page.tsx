import Image from "next/image";
import SiteHeader, { BrandLink } from "../components/site-header";
import { Text } from "../components/localized-text";
import StringFinanceForm from "./string-finance-form";

function Icon({ kind }: { kind: "car" | "shield" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      {kind === "car" ? (
        <path d="m5 10 2-5h10l2 5M4 10h16v8H4zM7 18v2m10-2v2M7 14h2m6 0h2" />
      ) : (
        <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z" /><path d="m8 12 3 3 5-6" /></>
      )}
    </svg>
  );
}

export default function Home() {
  return (
    <div className="page">
      <SiteHeader />
      <main>
        <section className="intro">
          <h1><Text ns="common" id="heroTitle" /><br /><span><Text ns="common" id="heroAccent" /></span></h1>
        </section>
        <section className="application" id="application" aria-labelledby="application-title">
          <div className="card-top">
            <div className="card-icon"><Icon kind="car" /></div>
            <div>
              <h2 id="application-title"><Text ns="financing" id="title" /></h2>
              <p><Text ns="financing" id="description" /></p>
            </div>
          </div>
          <StringFinanceForm />
        </section>
        <div className="under-card"><Icon kind="shield" /><span><Text ns="financing" id="checkDetails" /></span></div>
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <BrandLink footer />
              <p><Text ns="common" id="footerDescription" /></p>
              <a className="website-cta" href="https://swapcar.sa/ar" target="_blank" rel="noreferrer"><Text ns="common" id="visitWebsite" /> <span className="directional-arrow" aria-hidden="true">←</span></a>
            </div>
            <nav className="footer-links" aria-labelledby="footer-links-title">
              <div><h3 id="footer-links-title"><Text ns="common" id="quickLinks" /></h3><a href="#application"><Text ns="common" id="financeLink" /></a><a href="https://swapcar.sa/ar" target="_blank" rel="noreferrer"><Text ns="common" id="browseCars" /></a></div>
              <div><h3><Text ns="common" id="contactUs" /></h3><a href="tel:920032590"><Text ns="common" id="phoneLabel" /> <bdi>920032590</bdi></a><a href="mailto:sales@swapcar.sa"><bdi>sales@swapcar.sa</bdi></a></div>
            </nav>
          </div>
          <div className="footer-bottom">
            <Image className="footer-english-logo" src="/brand/swapcar-logo-en-light.svg" alt="Swapcar" width={160} height={36} />
            <span className="copyright"><Text ns="common" id="copyright" /></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
