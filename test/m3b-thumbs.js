/* 53 곱셈공식 넓이 — 네 조각 정사각형 */
 svg(`<rect x="34" y="10" width="30" height="30" fill="${TC.blue}" opacity=".22" stroke="${TC.blue}" stroke-width="1.3"/>
   <rect x="64" y="10" width="16" height="30" fill="${TC.amber}" opacity=".35" stroke="${TC.amber}" stroke-width="1"/>
   <rect x="34" y="40" width="30" height="16" fill="${TC.amber}" opacity=".35" stroke="${TC.amber}" stroke-width="1"/>
   <rect x="64" y="40" width="16" height="16" fill="${TC.teal}" opacity=".35" stroke="${TC.teal}" stroke-width="1"/>
   <text x="94" y="26" font-size="9" font-weight="800" fill="${TC.ink}">a²+2ab</text>
   <text x="94" y="40" font-size="9" font-weight="800" fill="${TC.ink}">+b²</text>`,
   '정사각형이 a² ab ab b² 네 조각으로 나뉜 그림'),

/* 54 특수각 — 사분원과 자석 각 */
 svg(`<path d="M14 54 H74 M14 54 V10" ${T_GRID}/>
   <path d="M74 54 A60 60 0 0 0 14 -6" stroke="${TC.mute}" ${T_THIN}/>
   <path d="M14 54 L66 24" stroke="${TC.blue}" ${T_BOLD}/>
   <path d="M66 54 L66 24" stroke="${TC.teal}" ${T_THIN}/>
   <circle cx="66" cy="24" r="3.6" fill="${TC.amber}"/>
   <text x="86" y="22" font-size="9" font-weight="800" fill="${TC.ink}">30·45·60</text>
   <text x="86" y="36" font-size="9" font-weight="800" fill="${TC.teal}">√3/2</text>`,
   '사분원 위에서 특수각에 자석처럼 붙는 점'),

/* 55 삼각비 표 — 표와 보간 직선 */
 svg(`${T_AX}
   <circle cx="34" cy="42" r="3" fill="${TC.blue}"/>
   <circle cx="58" cy="33" r="3" fill="${TC.blue}"/>
   <circle cx="82" cy="26" r="3" fill="${TC.blue}"/>
   <path d="M58 33 L82 26" stroke="${TC.amber}" stroke-width="1.6" stroke-dasharray="3 2"/>
   <circle cx="70" cy="29.5" r="3.4" fill="none" stroke="${TC.rose}" stroke-width="1.8"/>
   <text x="70" y="16" font-size="8.5" font-weight="800" fill="${TC.rose}" text-anchor="middle">sin 37°?</text>`,
   '표의 두 점 사이를 직선으로 이어 값을 추정하는 그림'),

/* 56 원주각 — 같은 호를 보는 두 자리 */
 svg(`<circle cx="60" cy="34" r="26" stroke="${TC.mute}" ${T_THIN}/>
   <path d="M44 55 A26 26 0 0 0 76 55" stroke="${TC.rose}" stroke-width="2.6" fill="none"/>
   <path d="M44 55 L52 12 L76 55" stroke="${TC.blue}" ${T_THIN}/>
   <path d="M44 55 L74 14 L76 55" stroke="${TC.teal}" ${T_THIN} opacity=".8"/>
   <text x="97" y="22" font-size="9" font-weight="800" fill="${TC.ink}">같은 각</text>`,
   '같은 호를 바라보는 두 원주각이 같은 그림'),

/* 57 접선 — 위성과 가시 호 */
 svg(`<circle cx="42" cy="36" r="20" fill="${TC.teal}" opacity=".12"/>
   <circle cx="42" cy="36" r="20" stroke="${TC.teal}" ${T_THIN}/>
   <path d="M28 22 A20 20 0 0 1 57 25" stroke="${TC.rose}" stroke-width="2.6" fill="none"/>
   <path d="M96 14 L28 22 M96 14 L57 25" stroke="${TC.blue}" ${T_THIN}/>
   <circle cx="96" cy="14" r="3.8" fill="${TC.amber}"/>
   <text x="88" y="52" font-size="9" font-weight="800" fill="${TC.ink}">PA=PB</text>`,
   '위성에서 그은 두 접선과 가시 범위 호'),

/* 58 내접 사각형 — 원과 마주보는 두 각 */
 svg(`<circle cx="60" cy="32" r="25" stroke="${TC.mute}" ${T_THIN}/>
   <path d="M38 42 L50 10 L84 20 L74 54 Z" stroke="${TC.blue}" ${T_THIN} fill="${TC.blue}" fill-opacity=".08"/>
   <circle cx="50" cy="10" r="3" fill="${TC.teal}"/>
   <circle cx="74" cy="54" r="3" fill="${TC.teal}"/>
   <text x="99" y="34" font-size="9" font-weight="800" fill="${TC.ink}">합 180°</text>`,
   '원에 내접한 사각형의 마주보는 두 각'),

/* 59 상자그림 — 상자·수염·이상치 */
 svg(`<path d="M20 32 H38 M80 32 H92" stroke="${TC.ink}" stroke-width="1.6"/>
   <path d="M20 26 V38 M92 26 V38" stroke="${TC.ink}" stroke-width="1.6"/>
   <rect x="38" y="22" width="42" height="20" fill="${TC.blue}" opacity=".16" stroke="${TC.blue}" stroke-width="1.4"/>
   <path d="M56 22 V42" stroke="${TC.teal}" stroke-width="2.4"/>
   <circle cx="104" cy="32" r="3.6" fill="${TC.rose}"/>
   <text x="62" y="56" font-size="8.5" font-weight="800" fill="${TC.ink3}" text-anchor="middle">1.5×IQR 밖 = 이상치</text>`,
   '상자와 수염, 수염 밖에 떨어진 이상치 점'),

/* 60 이상치와 상관 — 추세와 반란 점 */
 svg(`${T_AX}
   <circle cx="28" cy="46" r="2.6" fill="${TC.blue}"/><circle cx="40" cy="41" r="2.6" fill="${TC.blue}"/>
   <circle cx="52" cy="37" r="2.6" fill="${TC.blue}"/><circle cx="64" cy="31" r="2.6" fill="${TC.blue}"/>
   <circle cx="76" cy="27" r="2.6" fill="${TC.blue}"/><circle cx="88" cy="22" r="2.6" fill="${TC.blue}"/>
   <path d="M22 50 L98 17" stroke="${TC.teal}" stroke-width="1.6" stroke-dasharray="4 3"/>
   <circle cx="98" cy="48" r="4.4" fill="${TC.rose}"/>
   <text x="98" y="61" font-size="8.5" font-weight="800" fill="${TC.rose}" text-anchor="middle">r↓</text>`,
   '추세를 따르는 점들과 상관을 무너뜨리는 구석의 이상치'),
