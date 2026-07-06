/**
 * WCAG 대비 검사 — 디자인 시스템에서 실제 쓰이는 "텍스트 × 배경" 조합을 검증합니다.
 *   실행:  node scripts/check-contrast.mjs   (또는 npm run check:contrast)
 *
 * critical=true 조합이 AA(일반 4.5 / 큰 텍스트 3.0)를 통과하지 못하면 종료코드 1(=CI 실패).
 * placeholder·disabled 처럼 의도적으로 낮은 대비는 critical=false(정보성)로 둡니다.
 */
import { contrastRatio, wcagLevel } from '../src/data/contrast.js';
import { COLOR_NEUTRAL, T } from '../src/data/tokens.js';

const N = Object.fromEntries(COLOR_NEUTRAL.map((c) => [c.key, c.value]));

// { label, fg, bg, large?, critical? } — critical 기본 true
const CASES = [
  // 본문·라벨 텍스트 × 다크 표면(패널/카드/딥)
  { label: '기본 텍스트(neutral90) / 패널(neutral10)', fg: N.neutral90, bg: N.neutral10 },
  { label: '본문 텍스트(neutral80) / 패널(neutral10)', fg: N.neutral80, bg: N.neutral10 },
  { label: '본문 텍스트(neutral80) / 카드(neutral15)', fg: N.neutral80, bg: N.neutral15 },
  { label: '본문 텍스트(neutral80) / 딥 배경(neutral5)', fg: N.neutral80, bg: N.neutral5 },
  { label: '보조 텍스트(neutral70) / 패널(neutral10)', fg: N.neutral70, bg: N.neutral10 },
  { label: '보조 텍스트(neutral70) / 카드(neutral15)', fg: N.neutral70, bg: N.neutral15 },
  // 의도적으로 낮은 대비(정보성) — placeholder/disabled
  { label: '플레이스홀더/비활성(neutral60) / 패널(neutral10)', fg: N.neutral60, bg: N.neutral10, critical: false },
  { label: '약한 텍스트(neutral50) / 패널(neutral10)', fg: N.neutral50, bg: N.neutral10, critical: false },
  // 상태색 텍스트 × 다크 표면
  { label: '성공(positive) / 카드(neutral15)', fg: T.positive, bg: N.neutral15 },
  { label: '주의(cautionary) / 카드(neutral15)', fg: T.cautionary, bg: N.neutral15 },
  { label: '위험(error) / 카드(neutral15)', fg: T.error, bg: N.neutral15 },
  // Primary — 버튼/강조
  { label: '버튼 텍스트(#FFFFFF) / Primary(#0066FF)', fg: '#FFFFFF', bg: T.primary },
  { label: 'Primary 텍스트/아이콘(#0066FF) / 패널(neutral10)', fg: T.primary, bg: N.neutral10, large: true },
  { label: 'PrimaryStrong 링크(#3385FF) / 패널(neutral10)', fg: T.primaryStrong, bg: N.neutral10 },
  // 컨텍스트 메뉴(우클릭) — 실제 사용값
  { label: '메뉴 항목(#d4d4d8) / 메뉴 패널(#1E2229)', fg: '#d4d4d8', bg: '#1E2229' },
  { label: '메뉴 강조 "고정"(#ffd699) / 메뉴 패널(#1E2229)', fg: '#ffd699', bg: '#1E2229' },
  { label: '메뉴 아이콘(#8a8a92) / 메뉴 패널(#1E2229)', fg: '#8a8a92', bg: '#1E2229', large: true },
];

let failures = 0;
const rows = CASES.map((c) => {
  const critical = c.critical !== false;
  const lvl = wcagLevel(contrastRatio(c.fg, c.bg), { large: c.large });
  const pass = c.large ? lvl.aa : lvl.aa; // wcagLevel이 large 반영
  const mark = pass ? 'AA ✅' : (lvl.aaLarge ? 'AA(large만) ⚠️' : 'FAIL ❌');
  if (!pass && critical) failures += 1;
  return { critical, label: c.label, ratio: lvl.ratio, size: c.large ? 'large' : 'normal', verdict: mark };
});

const pad = (s, n) => String(s).padEnd(n);
console.log('WCAG 대비 검사 (AA: 일반 4.5 / 큰 텍스트 3.0)\n');
console.log(pad('결과', 16) + pad('비율', 8) + pad('크기', 8) + '조합');
console.log('-'.repeat(96));
for (const r of rows) {
  console.log(pad(r.verdict, 16) + pad(r.ratio, 8) + pad(r.size, 8) + r.label + (r.critical ? '' : '  (정보성)'));
}
console.log('-'.repeat(96));
console.log(`\ncritical 실패: ${failures}건`);

if (failures > 0) {
  console.error(`\n❌ AA 미달(critical) ${failures}건 — 색 조합을 조정하거나 텍스트 색을 한 단계 밝게 하세요.`);
  process.exit(1);
} else {
  console.log('\n✅ critical 조합 전부 AA 통과.');
}
