import { describe, expect, it } from "vitest";
// @ts-expect-error module .mjs sans types
import { ADS_TXT_LINE, checkAdsTxt, checkHtml, PUB } from "../../scripts/check-adsense.mjs";

const meta = `<meta name="google-adsense-account" content="${PUB}"/>`;
const script = `<script async="" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUB}" crossorigin="anonymous"></script>`;
// Rendu réel de next/script (afterInteractive) : élément dans les données RSC + préchargement.
const flight = `<script>self.__next_f.push([1,"[\\"$\\",\\"$L2\\",null,{\\"async\\":true,\\"src\\":\\"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUB}\\",\\"strategy\\":\\"afterInteractive\\"}]"])</script>`;
const page = (head: string, body = "") => `<html><head>${head}</head><body>${body}</body></html>`;

describe("garde-fou AdSense", () => {
  it("page conforme", () => expect(checkHtml(page(meta, script))).toEqual([]));
  it("rendu next/script (données RSC) conforme, double déclaration détectée", () => {
    expect(checkHtml(page(meta, flight))).toEqual([]);
    expect(checkHtml(page(meta, flight + flight)).join()).toContain("2 fois");
    expect(checkHtml(page(meta, flight + script)).join()).toContain("2 fois");
  });
  it("balise absente", () => expect(checkHtml(page("", script)).join()).toContain("absente"));
  it("balise dupliquée", () => expect(checkHtml(page(meta + meta, script)).join()).toContain("dupliquée"));
  it("balise hors du <head>", () => expect(checkHtml(page("", meta + script)).join()).toContain("hors du <head>"));
  it("script absent", () => expect(checkHtml(page(meta)).join()).toContain("script adsbygoogle.js absent"));
  it("script chargé deux fois", () => expect(checkHtml(page(meta, script + script)).join()).toContain("2 fois"));
  it("mauvais client", () => expect(checkHtml(page(meta, script.replace(PUB, "ca-pub-1"))).join()).toContain("client ≠"));
  it("ads.txt exact, avec ou sans fin de ligne", () => {
    expect(checkAdsTxt(ADS_TXT_LINE)).toEqual([]);
    expect(checkAdsTxt(`${ADS_TXT_LINE}\n`)).toEqual([]);
  });
  it("ads.txt modifié, dupliqué ou vide", () => {
    expect(checkAdsTxt("google.com, pub-1, DIRECT, f08c47fec0942fa0")).not.toEqual([]);
    expect(checkAdsTxt(`${ADS_TXT_LINE}\n${ADS_TXT_LINE}`)).not.toEqual([]);
    expect(checkAdsTxt("")).not.toEqual([]);
  });
});
