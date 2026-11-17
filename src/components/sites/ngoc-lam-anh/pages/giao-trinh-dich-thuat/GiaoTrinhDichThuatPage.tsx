"use client";

import { useState } from "react";
import { BRAND, href } from "../../data";
import { SERVER_NOTICE } from "../tai-lieu/api";
import { useStoredString, writeStored } from "../tai-lieu/hooks";
import { LESSONS, type DichLesson, type VocabRow } from "./data";
import "./giao-trinh-dich-thuat.css";

function VocabTable({ rows }: { rows: VocabRow[] }) {
  return (
    <div className="dt-scroll">
      <table className="vocab">
        <thead>
          <tr>
            <th>Chữ Hán</th>
            <th>Phiên âm</th>
            <th>Loại</th>
            <th>Nghĩa</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((v) => (
            <tr key={v.zh}>
              <td className="han">{v.zh}</td>
              <td>{v.py}</td>
              <td>{v.pos ?? ""}</td>
              <td>{v.vi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Khung dịch — bản nháp lưu tạm trong localStorage của máy người học */
function Draft({ id }: { id: number }) {
  const key = `nla_dich_${id}`;
  const stored = useStoredString(key);
  const [val, setVal] = useState<string | null>(null);
  const value = val ?? stored ?? "";
  return (
    <>
      <textarea
        className="dich"
        placeholder="Nhập bản dịch của bạn tại đây…"
        value={value}
        onChange={(e) => {
          setVal(e.target.value);
          writeStored(key, e.target.value);
        }}
      />
      <div className="small" style={{ marginTop: 6 }}>
        Bản nháp được lưu tạm trên máy bạn.{" "}
        <button
          className="x-btn"
          type="button"
          style={{ padding: "4px 10px", fontSize: 12 }}
          onClick={() => {
            setVal("");
            writeStored(key, null);
          }}
        >
          Xóa nháp
        </button>
      </div>
    </>
  );
}

function Lesson({ L }: { L: DichLesson }) {
  return (
    <>
      <div className="ltitle">
        Bài {L.id}: {L.titleVi}{" "}
        <span className="han" style={{ color: "#1b1f24" }}>
          ({L.titleZh})
        </span>
      </div>
      <div className="lsub">Trình độ: {L.level} · Văn phong: 书面语</div>
      {!L.baikhoa.length ? (
        <div className="note">Bài này đang được biên soạn — Đang cập nhật.</div>
      ) : (
        <>
          <div className="sec">Bài khóa (tiếng Trung)</div>
          <div className="zhblock han">{L.baikhoa.map((s) => s.zh).join(" ")}</div>
          <div className="sec">Bảng từ vựng bài khóa</div>
          <VocabTable rows={L.tuvung} />
          <div className="sec">Khung dịch (gõ bản dịch tiếng Việt của bạn)</div>
          <Draft id={L.id} key={L.id} />
          <div className="note">
            Bản phân tích đầy đủ (phiên âm, nghĩa, phân tích từng câu, bài tập luyện dịch và đáp án) dành cho tài khoản giáo
            viên. {SERVER_NOTICE}
          </div>
        </>
      )}
    </>
  );
}

export function GiaoTrinhDichThuatPage() {
  const [cur, setCur] = useState<number | null>(null);
  const L = LESSONS.find((x) => x.id === cur);

  return (
    <div className="pg-giao-trinh-dich-thuat">
      <header>
        <span className="han">{BRAND.zh}</span>
        <h1>Giáo trình Tiếng Trung Thương mại – Dịch thuật</h1>
        <span className="sp" />
        <span className="who">Khách</span>
        <a className="home" href={href("tai-lieu.html")}>
          ← Tài liệu
        </a>
      </header>
      <div className="x-wrap">
        <aside className="side">
          <h3>Danh sách bài</h3>
          <div>
            {!LESSONS.length && (
              <div className="small" style={{ padding: 8 }}>
                Chưa có bài học.
              </div>
            )}
            {LESSONS.map((x) => (
              <a
                key={x.id}
                href={`#bai${x.id}`}
                className={x.id === cur ? "on" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setCur(x.id);
                }}
              >
                Bài {x.id}: {x.titleVi}
              </a>
            ))}
          </div>
        </aside>
        <main className="main">
          <div style={{ marginBottom: 8 }}>
            <span className="badge">Bản học viên · bài khóa + từ vựng + khung dịch</span>
          </div>
          <div>{L ? <Lesson L={L} /> : <div className="small">Chọn một bài ở cột bên trái để bắt đầu.</div>}</div>
        </main>
      </div>
    </div>
  );
}
