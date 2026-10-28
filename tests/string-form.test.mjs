import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildStringFormParams,
  connectStringFrame,
  readStringIframeHeight,
  STRING_FORM_URL,
  STRING_ORIGIN,
} from "../app/string-form.ts";

test("official URL and every outbound payload fix the source to website", () => {
  const url = new URL(STRING_FORM_URL);
  assert.equal(url.origin, STRING_ORIGIN);
  assert.equal(url.searchParams.get("domain"), "https://swipecar.production.thestring.net/api/v1");
  assert.equal(url.searchParams.get("v"), "way9w9lfyaj");
  assert.equal(url.searchParams.get("utm_source"), "website");
  assert.deepEqual(buildStringFormParams("?utm_source=facebook&utm_source=tiktok"), { utm_source: "website" });
});

test("only supported marketing fields pass; customer, vehicle and routing query data never do", () => {
  assert.deepEqual(buildStringFormParams(
    "?utm_source=ads&utm_medium=cpc&utm_campaign=autumn&utm_content=hero&utm_term=car" +
    "&phone=private&monthly_salary=10000&local_financing_id=fake&car_model=fake" +
    "&request_type=cash&product=9&branch=1&domain=evil&v=other&__proto__=bad&token=secret",
  ), { utm_medium: "cpc", utm_campaign: "autumn", utm_content: "hero", utm_term: "car", utm_source: "website" });
  assert.deepEqual(buildStringFormParams("?utm_medium="), { utm_source: "website" });
  assert.equal(buildStringFormParams(`?utm_campaign=${"a".repeat(500)}`).utm_campaign.length, 255);
});

test("height accepts only numeric values within the supplied bounds", () => {
  for (const height of [300, 5000, "720", 940.5]) {
    assert.equal(readStringIframeHeight({ type: "IFRAME_HEIGHT", height }), Number(height));
  }
  for (const height of [299, 5001, -10, Infinity, NaN, null, undefined, true, false, [], {}, "", " ", "700px"]) {
    assert.equal(readStringIframeHeight({ type: "IFRAME_HEIGHT", height }), undefined);
  }
  for (const data of [null, "IFRAME_HEIGHT", [], { height: 700 }, { type: "other", height: 700 }]) {
    assert.equal(readStringIframeHeight(data), undefined);
  }
});

function fixture() {
  const host = new EventTarget();
  host.location = { search: "?utm_source=ads&utm_campaign=first&phone=private" };
  const iframe = new EventTarget();
  const posts = [];
  iframe.contentWindow = { postMessage: (data, origin) => posts.push({ data, origin }) };
  const calls = { loads: 0, ready: 0, heights: [], errors: 0 };
  const disconnect = connectStringFrame(host, iframe, {
    onLoad: () => calls.loads++, onReady: () => calls.ready++,
    onHeight: height => calls.heights.push(height), onError: () => calls.errors++,
  });
  const message = (data, origin = STRING_ORIGIN, source = iframe.contentWindow) => {
    const event = new Event("message");
    Object.defineProperties(event, { data: { value: data }, origin: { value: origin }, source: { value: source } });
    host.dispatchEvent(event);
  };
  return { host, iframe, posts, calls, disconnect, message };
}

test("load and REQUEST_FORM_PARAMS send current allowed parameters to the exact origin", () => {
  const f = fixture();
  f.iframe.dispatchEvent(new Event("load"));
  assert.equal(f.calls.loads, 1);
  assert.equal(f.calls.ready, 0); // load alone does not prove String rendered
  f.host.location.search = "?utm_source=tiktok&utm_campaign=second&phone=private";
  f.message({ type: "REQUEST_FORM_PARAMS" });
  assert.deepEqual(f.posts, [
    { data: { type: "FORM_PARAMS", params: { utm_campaign: "first", utm_source: "website" } }, origin: STRING_ORIGIN },
    { data: { type: "FORM_PARAMS", params: { utm_campaign: "second", utm_source: "website" } }, origin: STRING_ORIGIN },
  ]);
  assert.equal(f.calls.ready, 0); // asking for params is not a render-ready signal
  f.host.location.search = "?utm_medium=referral";
  f.host.dispatchEvent(new Event("popstate"));
  assert.deepEqual(f.posts.at(-1).data.params, { utm_medium: "referral", utm_source: "website" });
  f.disconnect();
});

test("wrong origin, sibling window, missing source and malformed messages have no effects", () => {
  const f = fixture();
  f.message({ type: "REQUEST_FORM_PARAMS" }, "https://evil.example");
  f.message({ type: "IFRAME_HEIGHT", height: 700 }, STRING_ORIGIN, {});
  f.message({ type: "REQUEST_FORM_PARAMS" }, STRING_ORIGIN, null);
  for (const data of [null, "REQUEST_FORM_PARAMS", {}, { type: "SUBMIT_FORM" }, { type: "IFRAME_HEIGHT", height: true }]) f.message(data);
  assert.deepEqual(f.posts, []);
  assert.deepEqual(f.calls, { loads: 0, ready: 0, heights: [], errors: 0 });
  f.message({ type: "IFRAME_HEIGHT", height: "750" });
  assert.deepEqual(f.calls.heights, [750]);
  f.iframe.dispatchEvent(new Event("error"));
  assert.equal(f.calls.errors, 1);
  f.disconnect();
});

test("unmount cleanup removes every listener; a remount has no duplicate handlers", () => {
  const f = fixture();
  f.disconnect();
  f.disconnect();
  f.iframe.dispatchEvent(new Event("load"));
  f.iframe.dispatchEvent(new Event("error"));
  f.message({ type: "REQUEST_FORM_PARAMS" });
  f.message({ type: "IFRAME_HEIGHT", height: 900 });
  f.host.dispatchEvent(new Event("popstate"));
  assert.deepEqual(f.posts, []);
  assert.deepEqual(f.calls, { loads: 0, ready: 0, heights: [], errors: 0 });
  const disconnect = connectStringFrame(f.host, f.iframe, { onLoad() {}, onReady() {}, onHeight() {}, onError() {} });
  f.message({ type: "REQUEST_FORM_PARAMS" });
  assert.equal(f.posts.length, 1);
  disconnect();
});
