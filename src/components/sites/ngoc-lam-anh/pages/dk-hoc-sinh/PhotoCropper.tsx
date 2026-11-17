"use client";

import { useEffect, useRef, useState } from "react";
import type Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

/** Hộp chỉnh ảnh 4×6 (khung 2:3) bằng cropperjs@1 — chạy hoàn toàn trên máy. */
export function PhotoCropper({ url, onCancel, onDone }: { url: string; onCancel: () => void; onDone: (dataUrl: string) => void }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let alive = true;
    const img = imgRef.current;
    if (!img) return;
    void import("cropperjs").then(({ default: CropperCtor }) => {
      if (!alive) return;
      cropperRef.current = new CropperCtor(img, {
        aspectRatio: 2 / 3,
        viewMode: 1,
        autoCropArea: 1,
        dragMode: "move",
        background: false,
        responsive: true,
      });
    });
    return () => {
      alive = false;
      cropperRef.current?.destroy();
      cropperRef.current = null;
    };
  }, [url]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  function done() {
    const c = cropperRef.current;
    if (!c) {
      setMsg("Ảnh đang được nạp, chờ 1–2 giây rồi bấm lại nhé.");
      return;
    }
    const canvas = c.getCroppedCanvas({ width: 600, height: 900, imageSmoothingQuality: "high", fillColor: "#fff" });
    onDone(canvas.toDataURL("image/jpeg", 0.86));
  }

  return (
    <div className="cmodal" role="dialog" aria-modal="true" aria-labelledby="dkhs-ctitle">
      <div className="cbox">
        <div className="ctitle" id="dkhs-ctitle">
          Chỉnh ảnh 4×6 — kéo &amp; phóng to cho rõ mặt
        </div>
        <div className="carea">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imgRef} src={url} alt="" />
        </div>
        <div className="cmsg">{msg}</div>
        <div className="crow">
          <button type="button" className="mini" onClick={() => cropperRef.current?.zoom(0.15)}>
            ➕ To
          </button>
          <button type="button" className="mini" onClick={() => cropperRef.current?.zoom(-0.15)}>
            ➖ Nhỏ
          </button>
          <button type="button" className="mini" onClick={() => cropperRef.current?.rotate(90)}>
            ↻ Xoay
          </button>
          <button type="button" className="mini" onClick={() => cropperRef.current?.reset()}>
            ⟲ Vừa khung
          </button>
          <span className="flex1" />
          <button type="button" className="mini ghost" onClick={onCancel}>
            Hủy
          </button>
          <button type="button" className="mini pri" onClick={done}>
            ✓ Dùng ảnh này
          </button>
        </div>
      </div>
    </div>
  );
}
