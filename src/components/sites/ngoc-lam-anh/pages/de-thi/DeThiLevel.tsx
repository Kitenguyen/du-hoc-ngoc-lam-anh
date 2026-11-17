"use client";

import { useEffect, useState } from "react";
import { BRAND, ZALO_HREF, href } from "../../data";
import { ExamPlayer } from "./ExamPlayer";
import { countQuestions, findLevel } from "./exams";
import { stopSpeaking } from "./speech";
import { RESULTS_KEY, parseJSON, useStored, type ResultRow } from "./storage";

function scoreText(r: ResultRow): string {
  return `${r.score}/${r.max}`;
}

/** Danh sách đề của một cấp + khung làm bài toàn màn hình (giống de-thi.html của trang mẫu) */
export function DeThiLevel({ levelId, examId }: { levelId?: string; examId?: string }) {
  const level = findLevel(levelId);
  const [openId, setOpenId] = useState<string | null>(
    level && examId && level.exams.some((e) => e.id === examId) ? examId : null,
  );
  const results = parseJSON<Record<string, ResultRow[]>>(useStored(RESULTS_KEY), {});

  const open = level?.exams.find((e) => e.id === openId);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      stopSpeaking();
    };
  }, [open]);

  if (!level) {
    return (
      <section className="block light">
        <div className="wrap">
          <div className="card">
            Chưa có đề thi cấp này. <a href={href("thi-thu.html")}>← Thi thử HSK</a>
          </div>
        </div>
      </section>
    );
  }

  const login = href(`dang-nhap.html?next=${encodeURIComponent(`de-thi?l=${level.id}`)}`);

  return (
    <>
      <div className="bk-hero">
        <div className="wrap">
          <a href={href("thi-thu.html")} style={{ color: "#f7dc94" }}>
            ← Thi thử HSK
          </a>
          <div className="zh" style={{ marginTop: 10 }}>
            {level.speaking ? "口语考试" : "模拟考试"}
          </div>
          <h1>Đề thi {level.name}</h1>
          <p>
            {level.exams.length ? `${level.exams.length} đề` : "Đề đang được cập nhật"} ·{" "}
            {level.speaking ? "nghe đề, ghi âm và nghe lại bài nói" : "làm bài như thi thật, chấm điểm tự động"}
          </p>
          <span className="who">
            Khách · kết quả lưu trên trình duyệt này ·{" "}
            <a style={{ color: "#f7dc94" }} href={login}>
              Đăng nhập
            </a>
          </span>
        </div>
      </div>

      <section className="block light" style={{ paddingTop: 26 }}>
        <div className="wrap">
          <div className="infobox">
            Đề luyện do {BRAND.fullName} tự soạn, thi thử miễn phí. {level.format}. Kết quả được lưu ngay trên trình duyệt
            của bạn; lưu điểm vào tài khoản học viên cần máy chủ – trung tâm sẽ bật sau.
          </div>
          <div className="rows">
            {level.exams.map((e, i) => {
              const key = `${level.id}/${e.id}`;
              const list = results[key] ?? [];
              const best = list.reduce<ResultRow | null>((a, x) => (!a || x.score > a.score ? x : a), null);
              return (
                <div className="rowx" key={e.id}>
                  <span className="no">{i + 1}</span>
                  <div className="tt">
                    <b style={{ fontFamily: "var(--sans)" }}>
                      Đề số {i + 1} · {e.title}
                    </b>
                    <span>
                      {countQuestions(e)} câu · {e.minutes} phút
                      {e.sections.length > 1 ? ` · ${e.sections.map((s) => s.title.replace("Phần ", "")).join(" – ")}` : ""}
                    </span>
                    {best && list[0] && (
                      <span className="myk">
                        Đã thi {list.length} lần · cao nhất <b>{scoreText(best)}</b> · gần nhất {scoreText(list[0])}
                        {best.speaking ? " (câu đã ghi âm)" : ""}
                      </span>
                    )}
                  </div>
                  <div className="acts">
                    <button type="button" className="btn pri sm" onClick={() => setOpenId(e.id)}>
                      Vào thi
                    </button>
                  </div>
                </div>
              );
            })}
            {!level.exams.length && (
              <div className="rowx locked">
                <span className="no">…</span>
                <div className="tt">
                  <b style={{ fontFamily: "var(--sans)" }}>Đề đang được cập nhật</b>
                  <span>Trung tâm đang soạn đề luyện cho cấp này. Bạn có thể nhắn trung tâm để được tư vấn lộ trình ôn thi.</span>
                </div>
                <div className="acts">
                  <a className="btn sm" href={ZALO_HREF} target="_blank" rel="noopener noreferrer">
                    💬 Nhắn tư vấn
                  </a>
                  <a className="btn pri sm" href={href("thi-thu.html")}>
                    Cấp khác
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {open && (
        <div id="hdview" className="on" role="dialog" aria-modal="true" aria-label={`${level.name} · ${open.title}`}>
          <div className="hv-bar">
            <b className="hv-t">
              {level.name} · {open.title}
            </b>
            <a className="hv-n btn sm ghost" href={`/de-thi?l=${level.id}&de=${open.id}`} target="_blank" rel="noopener">
              Mở tab mới ↗
            </a>
            <button className="btn sm gold hv-x" type="button" onClick={() => setOpenId(null)}>
              Đóng ✕
            </button>
          </div>
          <div className="xv-body">
            <ExamPlayer key={open.id} level={level} exam={open} examKey={`${level.id}/${open.id}`} />
          </div>
        </div>
      )}
    </>
  );
}
