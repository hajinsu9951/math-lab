/**
 * 우리 연수 모음집 — 공동 보관함 (Google Apps Script)
 * ────────────────────────────────────────────────────────
 * 「일상 속 수학 실험실」 탭⑤에서 올린 HTML 자료를 스프레드시트 한 장에 쌓는다.
 * 연수가 끝나 페이지를 닫아도 남고, 다음 연수에서 그대로 이어 쓴다.
 *
 * 시트 두 장을 쓴다.
 *   목록  : 자료 하나 = 한 줄 (메타데이터)
 *   조각  : HTML 본문을 4만 자씩 쪼갠 조각 (셀 5만 자 한도를 넘기지 않기 위해)
 *
 * 설치는 docs/모음집_보관함_설치안내.md 참고.
 */

var SHEET_LIST  = '목록';
var SHEET_PART  = '조각';
var CHUNK       = 40000;          // 셀 하나에 담는 글자 수 (구글 한도 5만 자)
var MAX_SRC     = 2 * 1024 * 1024; // 자료 하나 2MB — 화면 쪽 제한과 같게

/* ---------- 시트 준비 ---------- */
function sheets_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var list = ss.getSheetByName(SHEET_LIST);
  if (!list) {
    list = ss.insertSheet(SHEET_LIST);
    list.appendRow(['id', '등록일시', '과목묶음', '과목명', '단원', '주제',
                    '제작자', '한줄소개', '파일명', '제목', '글자수', '조각수']);
    list.setFrozenRows(1);
  }
  var part = ss.getSheetByName(SHEET_PART);
  if (!part) {
    part = ss.insertSheet(SHEET_PART);
    part.appendRow(['id', '순번', '내용']);
    part.setFrozenRows(1);
  }
  return { list: list, part: part };
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------- 읽기 ---------- */
function doGet(e) {
  try {
    var mode = (e && e.parameter && e.parameter.mode) || 'list';
    var sh = sheets_();

    if (mode === 'list') {
      var rows = sh.list.getDataRange().getValues();
      var out = [];
      for (var i = 1; i < rows.length; i++) {
        var r = rows[i];
        if (!r[0]) continue;
        out.push({ id: String(r[0]), at: String(r[1]), sub: String(r[2]), subName: String(r[3]),
                   unit: String(r[4]), topic: String(r[5]), who: String(r[6]), memo: String(r[7]),
                   name: String(r[8]), title: String(r[9]), size: Number(r[10]) || 0 });
      }
      return json_(out);
    }

    if (mode === 'item') {
      var id = String(e.parameter.id || '');
      if (!id) return json_({ error: 'id 가 없습니다.' });

      var rows = sh.list.getDataRange().getValues(), meta = null;
      for (var j = 1; j < rows.length; j++) {
        if (String(rows[j][0]) === id) { meta = rows[j]; break; }
      }
      if (!meta) return json_({ error: '그런 자료가 없습니다: ' + id });

      var parts = sh.part.getDataRange().getValues(), buf = [];
      for (var k = 1; k < parts.length; k++) {
        if (String(parts[k][0]) === id) buf.push({ n: Number(parts[k][1]), s: String(parts[k][2]) });
      }
      buf.sort(function (a, b) { return a.n - b.n; });

      return json_({ id: id, at: String(meta[1]), sub: String(meta[2]), unit: String(meta[4]),
                     topic: String(meta[5]), who: String(meta[6]), memo: String(meta[7]),
                     name: String(meta[8]), title: String(meta[9]),
                     src: buf.map(function (p) { return p.s; }).join('') });
    }

    return json_({ error: '모르는 mode 입니다: ' + mode });
  } catch (err) {
    return json_({ error: String(err) });
  }
}

/* ---------- 쓰기 ---------- */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);   // 참가자 여럿이 동시에 눌러도 줄이 섞이지 않게

    var d = JSON.parse(e.postData.contents);
    if (d.mode !== 'put') return json_({ error: '모르는 mode 입니다.' });

    var src = String(d.src || '');
    if (!src) return json_({ error: '내용이 비어 있습니다.' });
    if (src.length > MAX_SRC) return json_({ error: '자료가 2MB를 넘습니다.' });

    var sh = sheets_();
    var id = Utilities.getUuid().slice(0, 8);
    var at = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');

    var chunks = [];
    for (var i = 0; i < src.length; i += CHUNK) chunks.push(src.slice(i, i + CHUNK));

    sh.list.appendRow([id, at, String(d.sub || ''), String(d.subName || ''), String(d.unit || ''),
                       String(d.topic || ''), String(d.who || ''), String(d.memo || ''),
                       String(d.name || ''), String(d.title || ''), src.length, chunks.length]);

    var rows = chunks.map(function (c, n) { return [id, n, c]; });
    sh.part.getRange(sh.part.getLastRow() + 1, 1, rows.length, 3).setValues(rows);

    return json_({ ok: true, id: id, at: at, parts: chunks.length });
  } catch (err) {
    return json_({ error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
