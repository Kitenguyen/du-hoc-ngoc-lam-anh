"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { BRAND, PHONE_LABEL } from "../../data";
import { SERVER_NOTICE, SPEAKING_NOTICE, saveResultOnline } from "./api";
import { flatQuestions, type Exam, type Level, type Question } from "./exams";
import { canRecord, canSpeak, speakZh, stopSpeaking } from "./speech";
import { addResult, parseJSON, progressKey, removeKey, useStored, writeJSON, type Progress } from "./storage";

const LETTERS = "ABCDEF";
const MAX_PLAYS = 2;

type Phase = "intro" | "doing" | "done";

type SectionScore = { title: string; speaking: boolean; correct: number; total: number; points: number };

type Summary = {
  auto: boolean;
  sec: number;
  sections: SectionScore[];
  score: number;
  max: number;
  correct: number;
  total: number;
  speakingOnly: boolean;
};

const noopSubscribe = () => () => {};

/** Thời điểm hiện tại (ms) — chỉ gọi trong trình xử lý sự kiện / bộ đếm giờ */
function nowMs(): number {
  return Date.now();
}

function mmss(s: number): string {
  const v = Math.max(0, Math.round(s));
  return `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;
}

export function ExamPlayer({ level, exam, examKey }: { level: Level; exam: Exam; examKey: string }) {
  const items = useMemo(() => flatQuestions(exam), [exam]);
  const choiceCount = items.filter((i) => i.q.type === "choice").length;
  const speakingOnly = choiceCount === 0;

  const tts = useSyncExternalStore(noopSubscribe, canSpeak, () => true);
  const mic = useSyncExternalStore(noopSubscribe, canRecord, () => true);
  const savedProgress = parseJSON<Progress | null>(useStored(progressKey(examKey)), null);

  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [start, setStart] = useState(0);
  const [now, setNow] = useState(0);
  const [plays, setPlays] = useState<Record<number, number>>({});
  const [playing, setPlaying] = useState<number | null>(null);
  const [shown, setShown] = useState<Record<number, boolean>>({});
  const [recs, setRecs] = useState<Record<number, string>>({});
  const [recording, setRecording] = useState<{ no: number; until: number } | null>(null);
  const [micError, setMicError] = useState("");
  const [armed, setArmed] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);

  const topRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const recTimer = useRef<number | undefined>(undefined);
  const urlsRef = useRef<string[]>([]);
  const finishRef = useRef<(auto: boolean) => void>(() => {});
  const armTimer = useRef<number | undefined>(undefined);

  const limit = exam.minutes * 60;
  const left = limit - (now - start) / 1000;

  // Đồng hồ: cập nhật mỗi giây, hết giờ thì tự nộp bài
  useEffect(() => {
    if (phase !== "doing") return;
    const id = window.setInterval(() => {
      const t = nowMs();
      setNow(t);
      if (limit - (t - start) / 1000 <= 0) finishRef.current(true);
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, start, limit]);

  // Dọn dẹp khi đóng đề: dừng đọc, dừng ghi âm, giải phóng bản ghi
  useEffect(() => {
    const urls = urlsRef;
    return () => {
      stopSpeaking();
      window.clearTimeout(recTimer.current);
      window.clearTimeout(armTimer.current);
      const r = recRef.current;
      if (r && r.state !== "inactive") r.stop();
      urls.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  function begin(resume: boolean) {
    const t = nowMs();
    const valid = resume && savedProgress && t - savedProgress.start < limit * 1000;
    const st = valid ? savedProgress.start : t;
    const ans = valid ? savedProgress.answers : {};
    setStart(st);
    setNow(t);
    setAnswers(ans);
    setPlays({});
    setShown({});
    setSummary(null);
    setArmed(false);
    writeJSON(progressKey(examKey), { start: st, answers: ans } satisfies Progress);
    setPhase("doing");
    topRef.current?.scrollIntoView({ block: "start" });
  }

  function choose(no: number, i: number) {
    if (phase !== "doing") return;
    const next = { ...answers, [no]: i };
    setAnswers(next);
    writeJSON(progressKey(examKey), { start, answers: next } satisfies Progress);
  }

  function listen(no: number, text: string) {
    const used = plays[no] ?? 0;
    if (phase === "doing" && used >= MAX_PLAYS) return;
    if (phase === "doing") setPlays({ ...plays, [no]: used + 1 });
    setPlaying(no);
    speakZh(text, () => setPlaying((p) => (p === no ? null : p)));
  }

  function stopRec() {
    window.clearTimeout(recTimer.current);
    const r = recRef.current;
    if (r && r.state !== "inactive") r.stop();
  }

  async function startRec(no: number, seconds: number) {
    if (phase !== "doing") return;
    stopRec();
    stopSpeaking();
    setMicError("");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMicError("Không mở được micro. Hãy cho phép trình duyệt dùng micro rồi bấm Ghi âm lại.");
      return;
    }
    const mr = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    mr.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    mr.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: mr.mimeType || "audio/webm" });
      const url = URL.createObjectURL(blob);
      urlsRef.current.push(url);
      setRecs((prev) => ({ ...prev, [no]: url }));
      setRecording((r) => (r && r.no === no ? null : r));
      if (recRef.current === mr) recRef.current = null;
    };
    recRef.current = mr;
    mr.start();
    const t = nowMs();
    setNow(t);
    setRecording({ no, until: t + seconds * 1000 });
    recTimer.current = window.setTimeout(() => {
      if (mr.state !== "inactive") mr.stop();
    }, seconds * 1000);
  }

  function finish(auto: boolean) {
    if (phase !== "doing") return;
    stopSpeaking();
    stopRec();
    const sec = Math.min(limit, Math.round((nowMs() - start) / 1000));
    const sections: SectionScore[] = exam.sections.map((s, si) => {
      const qs = items.filter((i) => i.section === si);
      const speaking = s.kind === "speaking";
      const correct = qs.filter((i) =>
        i.q.type === "choice" ? answers[i.no] === i.q.answer : Boolean(recs[i.no]),
      ).length;
      const points = qs.length ? Math.round((correct / qs.length) * 100) : 0;
      return { title: `${s.zh} · ${s.title}`, speaking, correct, total: qs.length, points };
    });
    const scored = sections.filter((s) => !s.speaking);
    const score = speakingOnly ? sections.reduce((n, s) => n + s.correct, 0) : scored.reduce((n, s) => n + s.points, 0);
    const max = speakingOnly ? items.length : scored.length * 100;
    const correct = scored.reduce((n, s) => n + s.correct, 0);
    const total = scored.reduce((n, s) => n + s.total, 0);
    const sum: Summary = { auto, sec, sections, score, max, correct, total, speakingOnly };
    const row = { score, max, correct, total, sec, at: nowMs(), speaking: speakingOnly };
    addResult(examKey, row);
    void saveResultOnline(examKey, row);
    removeKey(progressKey(examKey));
    setSummary(sum);
    setPhase("done");
    setArmed(false);
    topRef.current?.scrollIntoView({ block: "start" });
  }

  useEffect(() => {
    finishRef.current = finish;
  });

  function askSubmit() {
    if (!armed) {
      setArmed(true);
      window.clearTimeout(armTimer.current);
      armTimer.current = window.setTimeout(() => setArmed(false), 5000);
      const miss = items.find((i) => (i.q.type === "choice" ? answers[i.no] == null : !recs[i.no]));
      if (miss) document.getElementById(`${examKey}-q${miss.no}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    finish(false);
  }

  const missing = items.filter((i) => (i.q.type === "choice" ? answers[i.no] == null : !recs[i.no])).length;
  const doneCount = items.length - missing;
  const done = phase === "done";

  const paperHead = (
    <div className="dx-hd">
      <p>
        <b>{BRAND.fullName.toUpperCase()}</b> · {PHONE_LABEL}
      </p>
      <h1>
        {level.name} · {exam.title}
      </h1>
      <p>{level.speaking ? "THI NÓI · ghi âm trên máy" : "MÔN: TIẾNG TRUNG QUỐC"} · Thời gian: {exam.minutes} phút</p>
    </div>
  );

  if (phase === "intro") {
    const hasProgress = Boolean(savedProgress);
    return (
      <div className="dx" ref={topRef}>
        <div className="dx-paper" style={{ textAlign: "center" }}>
          {paperHead}
          <p style={{ fontSize: 18 }}>
            ⏱ Thời gian làm bài: <b>{exam.minutes} phút</b> · <b>{items.length} câu</b>
            {speakingOnly ? " thi nói" : " trắc nghiệm"}
            {exam.scale ? ` · thang điểm ${exam.scale}` : ""}
            {exam.pass ? ` · đạt từ ${exam.pass} điểm` : ""}
          </p>
          <p className="muted" style={{ marginTop: 6 }}>
            Đồng hồ bắt đầu chạy khi bấm “Bắt đầu”. Hết giờ bài được nộp tự động. Sau khi nộp sẽ có điểm, đáp án và giải
            thích từng câu.
          </p>
          {!tts && (
            <p className="xv-warn">
              Trình duyệt này không có giọng đọc tiếng Trung, phần nghe sẽ hiện lời thoại dạng chữ. Nên dùng Chrome / Edge /
              Safari bản mới.
            </p>
          )}
          {level.speaking && (
            <p className="xv-warn">
              {mic
                ? "Phần thi nói dùng micro của máy để ghi âm, bản ghi chỉ nằm trên trình duyệt của bạn. "
                : "Trình duyệt này không hỗ trợ ghi âm – bạn vẫn có thể nghe đề và xem bài nói mẫu. "}
              Chấm điểm phát âm cần máy chủ – trung tâm sẽ bật sau.
            </p>
          )}
          <p style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {hasProgress && (
              <button type="button" className="btn pri" onClick={() => begin(true)}>
                ▶ Làm tiếp bài đang làm
              </button>
            )}
            <button type="button" className={hasProgress ? "btn" : "btn pri"} onClick={() => begin(false)}>
              {hasProgress ? "↻ Làm lại từ đầu" : "▶ Bắt đầu làm bài"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  function renderQuestion(no: number, q: Question) {
    const id = `${examKey}-q${no}`;
    const used = plays[no] ?? 0;
    const audioBtn = q.audio ? (
      tts ? (
        <button
          type="button"
          className={`xv-play${playing === no ? " on" : ""}`}
          onClick={() => listen(no, q.audio ?? "")}
          disabled={!done && used >= MAX_PLAYS}
        >
          🔊 {playing === no ? "Đang đọc…" : done ? "Nghe lại" : used >= MAX_PLAYS ? "Hết lượt nghe" : `Nghe (còn ${MAX_PLAYS - used} lượt)`}
        </button>
      ) : (
        <button type="button" className="xv-play" onClick={() => setShown({ ...shown, [no]: true })}>
          📄 Xem lời thoại
        </button>
      )
    ) : null;
    const transcript = q.audio && (done || (!tts && shown[no])) ? <div className="xv-tr">🎧 {q.audio}</div> : null;

    if (q.type === "choice") {
      const me = answers[no];
      const ok = me === q.answer;
      return (
        <div className={`dx-q${done ? (ok ? " ok" : " no") : ""}`} id={id} key={id}>
          <div className="qq">
            <b>Câu {no}.</b> {audioBtn}
          </div>
          {q.prompt && <div className="xv-p">{q.prompt}</div>}
          {q.pinyin && <div className="xv-py">{q.pinyin}</div>}
          {transcript}
          <div className="dx-o">
            {q.options.map((o, i) => {
              let cls = "";
              if (done) cls = i === q.answer ? "right" : i === me ? "wrong" : "";
              else if (me === i) cls = "sel";
              return (
                <label className={cls} key={i}>
                  <input type="radio" name={id} checked={me === i} disabled={done} onChange={() => choose(no, i)} />
                  <span>
                    <b>{LETTERS[i]}.</b> {o}
                  </span>
                </label>
              );
            })}
          </div>
          {done && (
            <div className="dx-ex">
              <div>
                <b style={{ color: ok ? "#2b8a3e" : "#c92a2a" }}>
                  {ok ? "✓ Đúng" : me == null ? "✗ Chưa làm" : `✗ Sai – bạn chọn ${LETTERS[me]}`}
                </b>{" "}
                · Đáp án đúng: <b>{LETTERS[q.answer]}</b>
              </div>
              <div style={{ margin: "4px 0" }}>{q.explain}</div>
            </div>
          )}
        </div>
      );
    }

    const isRec = recording?.no === no;
    const recLeft = isRec && recording ? Math.max(0, Math.ceil((recording.until - now) / 1000)) : 0;
    return (
      <div className={`dx-q${done ? (recs[no] ? " ok" : " no") : ""}`} id={id} key={id}>
        <div className="qq">
          <b>Câu {no}.</b> {audioBtn}
        </div>
        {q.prompt && <div className="xv-p">{q.prompt}</div>}
        {q.pinyin && <div className="xv-py">{q.pinyin}</div>}
        {transcript}
        <div className="xv-rec">
          {!done &&
            (mic ? (
              isRec ? (
                <button type="button" className="btn sm pri xv-recbtn on" onClick={stopRec}>
                  ⏹ Dừng ghi ({recLeft}s)
                </button>
              ) : (
                <button type="button" className="btn sm xv-recbtn" onClick={() => void startRec(no, q.recordSeconds)}>
                  🎙 {recs[no] ? "Ghi âm lại" : "Ghi âm"} (tối đa {q.recordSeconds}s)
                </button>
              )
            ) : (
              <span className="muted">Trình duyệt không hỗ trợ ghi âm.</span>
            ))}
          {recs[no] && !isRec && (
            <audio controls src={recs[no]}>
              <track kind="captions" />
            </audio>
          )}
        </div>
        {done && (
          <div className="dx-ex">
            <div>
              <b style={{ color: recs[no] ? "#2b8a3e" : "#c92a2a" }}>{recs[no] ? "✓ Đã ghi âm" : "✗ Chưa ghi âm"}</b> · Bài
              nói mẫu:
            </div>
            <div className="xv-sample">{q.sample}</div>
            {q.sampleVi && <div className="w">{q.sampleVi}</div>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="dx" ref={topRef}>
      <div className="dx-top">
        <b className="t">
          {exam.title} · {items.length} câu
        </b>
        <span className={`dx-clock${!done && left < 300 ? " low" : ""}`}>{done ? "Đã nộp" : mmss(left)}</span>
        <span>
          {speakingOnly ? "Đã ghi" : "Đã làm"} {doneCount}/{items.length}
        </span>
        {!done && (
          <button type="button" className="btn pri sm" onClick={askSubmit}>
            {armed ? (missing ? `Còn ${missing} câu chưa làm – bấm lần nữa để nộp` : "Bấm lần nữa để nộp bài") : "📤 Nộp bài"}
          </button>
        )}
        <div className="dx-nav">
          {items.map((i) => {
            let cls = "";
            if (done) {
              const ok = i.q.type === "choice" ? answers[i.no] === i.q.answer : Boolean(recs[i.no]);
              cls = ok ? "ok" : "no";
            } else if (i.q.type === "choice" ? answers[i.no] != null : recs[i.no]) cls = "d";
            return (
              <button
                type="button"
                key={i.no}
                className={cls}
                onClick={() =>
                  document.getElementById(`${examKey}-q${i.no}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
              >
                {i.no}
              </button>
            );
          })}
        </div>
      </div>

      <div className="dx-paper">
        {paperHead}
        {done && summary && (
          <div className="dx-res">
            {summary.auto && <p>⏰ Hết giờ – bài đã được nộp tự động.</p>}
            {summary.speakingOnly ? (
              <>
                <div className="sc">
                  {summary.score}/{summary.max}
                </div>
                <p>câu đã ghi âm · thời gian {mmss(summary.sec)}</p>
                <p className="xv-note">{SPEAKING_NOTICE}</p>
              </>
            ) : (
              <>
                <div className="sc">
                  {summary.score} / {summary.max} điểm
                </div>
                <p>
                  Đúng <b>{summary.correct}/{summary.total}</b> câu · thời gian làm {mmss(summary.sec)}
                  {exam.pass && summary.max === exam.scale
                    ? summary.score >= exam.pass
                      ? ` · ĐẠT (từ ${exam.pass} điểm)`
                      : ` · CHƯA ĐẠT (cần ${exam.pass} điểm)`
                    : ""}
                </p>
                <div className="xv-secs">
                  {summary.sections.map((s) => (
                    <span key={s.title}>
                      {s.title}: <b>{s.speaking ? `${s.correct}/${s.total} câu đã ghi` : `${s.points} điểm (${s.correct}/${s.total})`}</b>
                    </span>
                  ))}
                </div>
              </>
            )}
            <p className="xv-note">
              Kết quả được lưu trên trình duyệt này. Lưu điểm vào tài khoản học viên: {SERVER_NOTICE.toLowerCase()}
            </p>
            <p style={{ marginTop: 10 }}>
              <button type="button" className="btn gold" onClick={() => begin(false)}>
                ↻ Làm lại đề này
              </button>
            </p>
          </div>
        )}
        {micError && <p className="xv-warn">{micError}</p>}

        {exam.sections.map((s, si) => (
          <div className="dx-part" key={s.zh}>
            <div className="dx-ins">
              {s.zh} · {s.title}
            </div>
            <p className="muted xv-si">{s.instructions}</p>
            {s.groups.map((g, gi) => (
              <div key={gi}>
                <p className="xv-gi">{g.instructions}</p>
                {items.filter((i) => i.section === si && i.group === gi).map((i) => renderQuestion(i.no, i.q))}
              </div>
            ))}
          </div>
        ))}

        {!done && (
          <p style={{ textAlign: "center", marginTop: 20 }}>
            <button type="button" className="btn pri" onClick={askSubmit}>
              {armed ? "Bấm lần nữa để nộp bài" : "📤 Nộp bài"}
            </button>
          </p>
        )}
        <p className="muted" style={{ textAlign: "center" }}>
          ------ HẾT ------
        </p>
      </div>
    </div>
  );
}
