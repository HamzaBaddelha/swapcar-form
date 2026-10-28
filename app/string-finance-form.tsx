"use client";

import { useEffect, useRef, useState } from "react";
import { useAppTranslation } from "../lib/i18n/use-app-translation";
import { connectStringFrame, STRING_FORM_URL } from "./string-form";

const LOAD_TIMEOUT_MS = 20_000;
type Status = "loading" | "loaded" | "ready" | "slow" | "error";

function FrameSession({ onRetry }: { onRetry: () => void }) {
  const { t, language } = useAppTranslation("financing");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const timeout = window.setTimeout(() => {
      setStatus(current => current === "ready" ? current : "slow");
    }, LOAD_TIMEOUT_MS);
    const disconnect = connectStringFrame(window, iframe, {
      onLoad: () => setStatus(current => current === "loading" ? "loaded" : current),
      onReady: () => {
        window.clearTimeout(timeout);
        setStatus("ready");
      },
      onHeight: setHeight,
      onError: () => {
        window.clearTimeout(timeout);
        setStatus("error");
      },
    });
    // Register the bridge before navigation, even when the form is cached.
    // Avoid a second navigation during React Strict Mode's effect replay.
    if (iframe.getAttribute("src") !== STRING_FORM_URL) iframe.src = STRING_FORM_URL;
    return () => { window.clearTimeout(timeout); disconnect(); };
  }, []);

  const needsHelp = status === "slow" || status === "error";

  return (
    <div className="string-form">
      {language === "en" && <p className="string-language-notice">{t("formLanguageNotice")}</p>}
      <div className="string-frame-container" aria-busy={status === "loading"}>
        {status === "loading" && (
          <div className="string-loading" role="status">
            <span className="string-spinner" aria-hidden="true" />
            <p>{t("loading")}</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          id="formIframe"
          title={t("iframeTitle")}
          width="100%"
          scrolling="no"
          referrerPolicy="no-referrer"
          className="string-iframe"
          style={{ border: 0, minHeight: 400, height: height ?? "auto" }}
        />
      </div>
      {needsHelp && (
        <div className="string-fallback" role="status">
          <p>{t(status === "error" ? "loadError" : "loadSlow")}</p>
          <button className="string-retry" type="button" onClick={onRetry}>{t("retry")}</button>
          <small>{t("retryWarning")}</small>
        </div>
      )}
      <div className="string-form-help">
        <span>{t("completeInside")}</span>
        <a href={STRING_FORM_URL} target="_blank" rel="noopener noreferrer">{t("openForm")} <span aria-hidden="true">↗</span></a>
      </div>
      <noscript><p className="string-fallback">{t("enableJavascript")}</p></noscript>
    </div>
  );
}

export default function StringFinanceForm() {
  const [attempt, setAttempt] = useState(0);
  return <FrameSession key={attempt} onRetry={() => setAttempt(current => current + 1)} />;
}
