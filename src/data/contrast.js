/**
 * WCAG 대비(contrast) 계산 유틸 — 순수 함수(토큰 비의존).
 * 대비 검사 스크립트(scripts/check-contrast.mjs)와 MCP 도구(check_contrast)가 공유합니다.
 * 참고: WCAG 2.x relative luminance / contrast ratio 정의.
 */

// '#RGB' 또는 '#RRGGBB' → {r,g,b} (0-255). 실패 시 null.
export function parseHex(hex) {
  if (typeof hex !== 'string') return null;
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

function channelLum(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

// 상대 휘도(relative luminance) 0..1
export function luminance(hex) {
  const rgb = parseHex(hex);
  if (!rgb) return null;
  return 0.2126 * channelLum(rgb.r) + 0.7152 * channelLum(rgb.g) + 0.0722 * channelLum(rgb.b);
}

// 두 색의 대비비(contrast ratio) 1..21. 입력 오류 시 null.
export function contrastRatio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  if (la == null || lb == null) return null;
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

// WCAG 등급 판정. large=큰 텍스트(굵은 14pt/일반 18pt↑) 기준.
//  normal: AA 4.5 / AAA 7 · large: AA 3.0 / AAA 4.5 · 비텍스트(UI 요소/그래픽): 3.0
export function wcagLevel(ratio, { large = false } = {}) {
  if (ratio == null) return { ratio: null, aa: false, aaa: false, aaLarge: false };
  const r = Math.round(ratio * 100) / 100;
  return {
    ratio: r,
    aa: large ? r >= 3 : r >= 4.5,
    aaa: large ? r >= 4.5 : r >= 7,
    aaLarge: r >= 3,
  };
}
