/* 92 조립제법 — 계수의 폭포 */
 svg(`<path d="M30 14 V52 M22 44 H104" stroke="${TC.mute}" stroke-width="1.4"/>
   <text x="44" y="26" font-size="10" font-weight="800" fill="${TC.ink}">1</text>
   <text x="62" y="26" font-size="10" font-weight="800" fill="${TC.ink}">−2</text>
   <text x="82" y="26" font-size="10" font-weight="800" fill="${TC.ink}">−5</text>
   <text x="100" y="26" font-size="10" font-weight="800" fill="${TC.ink}">6</text>
   <text x="62" y="38" font-size="9" fill="${TC.amber}">＋</text>
   <text x="44" y="56" font-size="10" font-weight="800" fill="${TC.teal}">1</text>
   <text x="62" y="56" font-size="10" font-weight="800" fill="${TC.teal}">−1</text>
   <text x="82" y="56" font-size="10" font-weight="800" fill="${TC.teal}">−6</text>
   <text x="100" y="56" font-size="10" font-weight="800" fill="${TC.rose}">0</text>`,
   '계수가 폭포처럼 내려와 나머지 0 에 닿는 조립제법 표'),

/* 93 나머지정리 — f(a) 와 나머지의 일치 */
 svg(`${T_AX}
   <path d="M18 44 C40 8 66 60 102 16" stroke="${TC.blue}" ${T_BOLD}/>
   <circle cx="52" cy="38" r="4" fill="${TC.amber}"/>
   <path d="M52 38 V54" stroke="${TC.amber}" stroke-width="1.4" stroke-dasharray="3 2"/>
   <text x="86" y="52" font-size="9" font-weight="800" fill="${TC.teal}">f(a)=R</text>`,
   '점 a 에서의 함숫값이 곧 나머지임을 보이는 그래프'),

/* 94 복소평면 — i 곱하기 회전 */
 svg(`<path d="M60 8 V56 M18 32 H102" ${T_GRID}/>
   <path d="M60 32 L92 20" stroke="${TC.blue}" ${T_THIN}/>
   <path d="M60 32 L72 0" stroke="${TC.teal}" ${T_THIN} opacity=".85"/>
   <path d="M88 14 A26 26 0 0 0 74 6" stroke="${TC.rose}" stroke-width="1.6" fill="none"/>
   <circle cx="92" cy="20" r="3.6" fill="${TC.blue}"/>
   <circle cx="72" cy="0" r="3.4" fill="${TC.teal}"/>
   <text x="93" y="44" font-size="9" font-weight="800" fill="${TC.rose}">×i = 90°</text>`,
   '복소수에 i 를 곱하면 90도 회전하는 그림'),

/* 95 근과 계수 — 합·곱이 계수로 */
 svg(`${T_AX}
   <path d="M24 16 Q60 74 96 16" stroke="${TC.blue}" ${T_BOLD}/>
   <circle cx="40" cy="54" r="3.6" fill="${TC.rose}"/>
   <circle cx="80" cy="54" r="3.6" fill="${TC.rose}"/>
   <text x="60" y="14" font-size="9" font-weight="800" fill="${TC.ink}" text-anchor="middle">p+q = −b</text>
   <text x="60" y="26" font-size="9" font-weight="800" fill="${TC.teal}" text-anchor="middle">pq = c</text>`,
   '두 근의 합과 곱이 계수에 들어 있는 포물선'),

/* 96 삼차 실근 — 산과 골짜기 */
 svg(`${T_AX}
   <path d="M16 50 C34 8 50 8 60 32 C70 56 86 56 104 14" stroke="${TC.blue}" ${T_BOLD}/>
   <circle cx="40" cy="17" r="3.4" fill="${TC.amber}"/>
   <circle cx="78" cy="47" r="3.4" fill="${TC.amber}"/>
   <circle cx="26" cy="54" r="3" fill="${TC.rose}"/>
   <circle cx="58" cy="54" r="3" fill="${TC.rose}"/>
   <circle cx="97" cy="54" r="3" fill="${TC.rose}"/>`,
   '산과 골짜기가 x축을 사이에 두어 실근이 셋인 삼차 곡선'),

/* 97 이차부등식 — 지하 구간 */
 svg(`${T_AX}
   <path d="M24 12 Q60 78 96 12" stroke="${TC.blue}" ${T_THIN}/>
   <path d="M38 54 Q60 70 82 54" stroke="${TC.rose}" stroke-width="3" fill="none"/>
   <path d="M38 58 H82" stroke="${TC.teal}" stroke-width="3.4"/>
   <circle cx="38" cy="58" r="3" fill="#fff" stroke="${TC.teal}" stroke-width="1.6"/>
   <circle cx="82" cy="58" r="3" fill="#fff" stroke="${TC.teal}" stroke-width="1.6"/>
   <text x="99" y="60" font-size="8.5" font-weight="800" fill="${TC.teal}">해집합</text>`,
   '포물선의 지하 구간이 수직선의 해집합으로 내려오는 그림'),

/* 98 선형계획 — 영역과 이익선 */
 svg(`<path d="M20 54 V12 M20 54 H104" ${T_GRID}/>
   <path d="M20 22 L52 22 L84 40 L96 54 L20 54 Z" fill="${TC.teal}" opacity=".18"/>
   <path d="M20 22 L52 22 L84 40 L96 54" stroke="${TC.teal}" ${T_THIN}/>
   <path d="M30 60 L104 22" stroke="${TC.rose}" stroke-width="2" stroke-dasharray="5 3"/>
   <circle cx="84" cy="40" r="4" fill="${TC.rose}"/>
   <text x="94" y="14" font-size="8.5" font-weight="800" fill="${TC.rose}">z 최대</text>`,
   '이익 직선이 볼록 영역의 꼭짓점을 마지막으로 스치는 그림'),

/* 99 순열·조합 — 12 대 6 */
 svg(`<text x="34" y="22" font-size="10" font-weight="800" fill="${TC.blue}">가나 나가</text>
   <text x="34" y="35" font-size="10" font-weight="800" fill="${TC.blue}">가다 다가 …</text>
   <rect x="24" y="42" width="72" height="16" rx="4" fill="${TC.teal}" opacity=".15"/>
   <text x="60" y="54" font-size="10" font-weight="800" fill="${TC.teal}" text-anchor="middle">{가,나} {가,다} …</text>
   <text x="104" y="24" font-size="10" font-weight="800" fill="${TC.ink}">12</text>
   <text x="104" y="54" font-size="10" font-weight="800" fill="${TC.teal}">6</text>`,
   '순열 12줄이 조합 6묶음으로 접히는 그림'),

/* 100 행렬 변환 — 기저 화살표와 F */
 svg(`<path d="M50 8 V56 M18 40 H106" ${T_GRID}/>
   <path d="M50 40 L84 34" stroke="${TC.blue}" stroke-width="2.2"/>
   <path d="M50 40 L60 12" stroke="${TC.teal}" stroke-width="2.2"/>
   <path d="M62 36 L62 18 L76 16 L76 22 L68 23 L68 26 L74 25 L74 31 L68 32 L68 36 Z" fill="${TC.blue}" opacity=".3" stroke="${TC.blue}" stroke-width="1"/>
   <text x="94" y="52" font-size="8.5" font-weight="800" fill="${TC.ink}">열 = 목적지</text>`,
   '기저 화살표 둘이 도형 F 를 끌고 가는 행렬 변환'),

/* 101 비가환 — 두 순서 두 결과 */
 svg(`<rect x="20" y="18" width="26" height="16" rx="2" fill="${TC.blue}" opacity=".3" stroke="${TC.blue}" stroke-width="1.2" transform="rotate(-18 33 26)"/>
   <rect x="66" y="14" width="16" height="26" rx="2" fill="${TC.teal}" opacity=".3" stroke="${TC.teal}" stroke-width="1.2" transform="rotate(12 74 27)"/>
   <text x="33" y="52" font-size="9" font-weight="800" fill="${TC.blue}" text-anchor="middle">R→S</text>
   <text x="74" y="52" font-size="9" font-weight="800" fill="${TC.teal}" text-anchor="middle">S→R</text>
   <text x="98" y="32" font-size="11" font-weight="800" fill="${TC.rose}">≠</text>`,
   '같은 두 변환을 다른 순서로 적용해 달라진 두 도형'),
