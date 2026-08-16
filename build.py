# 소스 조각을 합쳐 dist/index.html (단일 파일) 을 만든다.
# 사용: python build.py     (Node.js 없이 동작)
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
read = lambda n: (SRC / n).read_text(encoding="utf-8")

out = "\n".join([
    read("00-head.html"), "<style>", read("styles.css"), "</style>",
    read("01-body-top.html"),
    read("10-pane1-labs.html"), read("20-pane2-vibe.html"), read("30-pane3-flow.html"),
    "<script>", read("40-demos.js"), read("50-labs-spec.js"), read("60-engine.js"), "</script>",
    read("99-foot.html"),
])

(ROOT / "dist").mkdir(exist_ok=True)
(ROOT / "dist" / "index.html").write_text(out, encoding="utf-8")
print(f"dist/index.html 생성 완료 ({len(out):,}자)")
