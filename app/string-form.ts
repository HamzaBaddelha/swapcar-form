export const STRING_ORIGIN = "https://dashboard.thestring.net";
export const STRING_FORM_URL =
  `${STRING_ORIGIN}/forms/0aa8b3fe-d730-4e92-9015-e5af34ab01a6/show?domain=https://swipecar.production.thestring.net/api/v1&v=way9w9lfyaj&utm_source=website`;

/** Verified in String's collectUtmParams; no arbitrary query forwarding. */
const MARKETING_KEYS = ["utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function buildStringFormParams(search: string): Record<string, string> {
  const query = new URLSearchParams(search);
  const params: Record<string, string> = {};
  for (const key of MARKETING_KEYS) {
    const value = query.get(key);
    if (value) params[key] = value.slice(0, 255);
  }
  // The iframe gives hostParams precedence over its own URL, so fix BOTH.
  params.utm_source = "website";
  return params;
}

export function readStringIframeHeight(data: unknown): number | undefined {
  if (!data || typeof data !== "object" || !("type" in data) || data.type !== "IFRAME_HEIGHT" || !("height" in data)) return;
  const raw = data.height;
  if (typeof raw !== "number" && typeof raw !== "string") return;
  if (typeof raw === "string" && !raw.trim()) return;
  const height = Number(raw);
  if (Number.isFinite(height) && height >= 300 && height <= 5000) return height;
}

interface FrameCallbacks {
  onLoad: () => void;
  onReady: () => void;
  onHeight: (height: number) => void;
  onError: () => void;
}

/** Register once per mounted frame; return all listener cleanup to React. */
export function connectStringFrame(host: Window, iframe: HTMLIFrameElement, callbacks: FrameCallbacks) {
  const sendParams = () => {
    iframe.contentWindow?.postMessage(
      { type: "FORM_PARAMS", params: buildStringFormParams(host.location.search) },
      STRING_ORIGIN,
    );
  };
  const onLoad = () => { sendParams(); callbacks.onLoad(); };
  const onMessage = (event: MessageEvent) => {
    if (event.origin !== STRING_ORIGIN || !iframe.contentWindow || event.source !== iframe.contentWindow) return;
    if (!event.data || typeof event.data !== "object") return;
    if (event.data.type === "REQUEST_FORM_PARAMS") {
      sendParams();
    }
    const height = readStringIframeHeight(event.data);
    if (height !== undefined) {
      callbacks.onHeight(height);
      callbacks.onReady();
    }
  };
  host.addEventListener("message", onMessage);
  host.addEventListener("popstate", sendParams);
  iframe.addEventListener("load", onLoad);
  iframe.addEventListener("error", callbacks.onError);
  return () => {
    host.removeEventListener("message", onMessage);
    host.removeEventListener("popstate", sendParams);
    iframe.removeEventListener("load", onLoad);
    iframe.removeEventListener("error", callbacks.onError);
  };
}
