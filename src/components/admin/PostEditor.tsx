"use client";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { deletePostAction, rejectPostAction, savePostAction, uploadImageAction } from "@/app/quan-tri/actions";
import { compressImage } from "./image";

type PostIntent = "draft" | "submit" | "publish" | "hide";
type Status = "draft" | "pending" | "published" | "hidden";

export type EditablePost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover: string;
  labels: string[];
  status: Status;
  reviewNote: string | null;
  author: string;
};

const STATUS_LABEL: Record<Status, string> = { draft: "Bản nháp", pending: "Chờ duyệt", published: "Đã đăng", hidden: "Đã ẩn" };
const SUGGESTED_LABELS = ["Du học", "Học bổng", "Khai giảng", "HSK", "Tiếng Trung trẻ em", "Kinh nghiệm học", "Sự kiện"];

async function upload(file: File): Promise<string> {
  const { blob, w, h } = await compressImage(file);
  const fd = new FormData();
  const name = file.name.replace(/\.[^.]+$/, "") + (blob.type === "image/gif" ? ".gif" : ".webp");
  fd.append("file", new File([blob], name, { type: blob.type || "image/webp" }));
  fd.append("w", String(w));
  fd.append("h", String(h));
  const r = await uploadImageAction(fd);
  if (!r.url) throw new Error(r.error || "Tải ảnh chưa được.");
  return r.url;
}

function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
}

function Toolbar({ editor, onImage, busy }: { editor: Editor; onImage: () => void; busy: boolean }) {
  const st = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      ul: e.isActive("bulletList"),
      ol: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
    }),
  });
  const btn = (on: boolean, label: string, title: string, run: () => void) => (
    <button type="button" className={on ? "on" : undefined} title={title} aria-label={title} aria-pressed={on} onMouseDown={(e) => e.preventDefault()} onClick={run}>
      {label}
    </button>
  );
  const c = () => editor.chain().focus();
  const setLink = () => {
    const prev = (editor.getAttributes("link").href as string | undefined) ?? "";
    const url = window.prompt("Dán đường dẫn (để trống để bỏ link):", prev);
    if (url === null) return;
    if (!url.trim()) c().extendMarkRange("link").unsetLink().run();
    else c().extendMarkRange("link").setLink({ href: /^(https?:|mailto:|tel:|\/)/.test(url) ? url.trim() : `https://${url.trim()}` }).run();
  };
  const addVideo = () => {
    const url = window.prompt("Dán link video YouTube:");
    if (!url) return;
    const src = youtubeEmbed(url);
    if (!src) return window.alert("Link YouTube chưa đúng.");
    // Trình soạn không giữ khung iframe → chèn ảnh thu nhỏ của video kèm link mở YouTube
    const id = src.split("/").pop();
    const href = `https://www.youtube.com/watch?v=${id}`;
    c()
      .insertContent(`<p><a href="${href}"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="Video YouTube"></a></p><p><a href="${href}">▶ Xem video trên YouTube</a></p>`)
      .run();
  };
  return (
    <div className="toolbar" role="toolbar" aria-label="Định dạng">
      {btn(st.h2, "H2", "Tiêu đề lớn", () => c().toggleHeading({ level: 2 }).run())}
      {btn(st.h3, "H3", "Tiêu đề nhỏ", () => c().toggleHeading({ level: 3 }).run())}
      <span className="sep" />
      {btn(st.bold, "B", "In đậm (Ctrl+B)", () => c().toggleBold().run())}
      {btn(st.italic, "I", "In nghiêng (Ctrl+I)", () => c().toggleItalic().run())}
      {btn(st.underline, "U", "Gạch chân (Ctrl+U)", () => c().toggleUnderline().run())}
      <span className="sep" />
      {btn(st.ul, "• Danh sách", "Danh sách chấm", () => c().toggleBulletList().run())}
      {btn(st.ol, "1. Danh sách", "Danh sách số", () => c().toggleOrderedList().run())}
      {btn(st.quote, "❝ Trích", "Trích dẫn", () => c().toggleBlockquote().run())}
      <span className="sep" />
      {btn(st.link, "🔗 Link", "Chèn link", setLink)}
      {btn(false, busy ? "Đang tải…" : "🖼 Ảnh", "Chèn ảnh từ máy", onImage)}
      {btn(false, "▶ YouTube", "Chèn video YouTube", addVideo)}
      <span className="sep" />
      {btn(false, "↶", "Hoàn tác (Ctrl+Z)", () => c().undo().run())}
      {btn(false, "↷", "Làm lại (Ctrl+Y)", () => c().redo().run())}
    </div>
  );
}

export function PostEditor({ post, canPublish }: { post?: EditablePost; canPublish: boolean }) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [cover, setCover] = useState(post?.cover ?? "");
  const [labels, setLabels] = useState((post?.labels ?? []).join(", "));
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const status = post?.status ?? "draft";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true, defaultProtocol: "https" } }),
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
    ],
    content: post?.content ?? "<p></p>",
    immediatelyRender: false,
    onUpdate: () => setDirty(true),
    editorProps: {
      attributes: { "aria-label": "Nội dung bài viết" },
      handlePaste: (_view, event) => {
        const file = Array.from(event.clipboardData?.files ?? []).find((f) => f.type.startsWith("image/"));
        if (!file) return false;
        void insertImage(file);
        return true;
      },
      handleDrop: (_view, event) => {
        const file = Array.from((event as DragEvent).dataTransfer?.files ?? []).find((f) => f.type.startsWith("image/"));
        if (!file) return false;
        event.preventDefault();
        void insertImage(file);
        return true;
      },
    },
  });

  // Cảnh báo khi rời trang mà chưa lưu
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  async function insertImage(file: File) {
    if (!editor) return;
    setUploading(true);
    setMsg(null);
    try {
      const url = await upload(file);
      editor.chain().focus().setImage({ src: url, alt: title || "Ảnh bài viết" }).run();
      if (!cover) setCover(url);
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Tải ảnh chưa được." });
    } finally {
      setUploading(false);
    }
  }

  async function onCoverFile(file: File) {
    setUploading(true);
    try {
      setCover(await upload(file));
      setDirty(true);
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Tải ảnh chưa được." });
    } finally {
      setUploading(false);
    }
  }

  function save(intent: PostIntent) {
    if (!editor) return;
    setMsg(null);
    start(async () => {
      const r = await savePostAction(
        {
          id: post?.id,
          title,
          slug,
          content: editor.getHTML(),
          cover,
          labels: labels.split(",").map((s) => s.trim()).filter(Boolean),
        },
        intent,
      );
      if (r.error) return setMsg({ ok: false, text: r.error });
      setDirty(false);
      setMsg({ ok: true, text: r.message ?? "Đã lưu." });
      if (!post && r.id) router.replace(`/quan-tri/bai-viet/${r.id}?moi=1`);
      else router.refresh();
    });
  }

  function reject() {
    if (!post) return;
    const note = window.prompt("Ghi chú cho tác giả (cần sửa gì?):");
    if (note === null) return;
    start(async () => {
      const r = await rejectPostAction(post.id, note);
      if (r.error) return setMsg({ ok: false, text: r.error });
      router.push("/quan-tri/bai-viet?trang-thai=pending");
    });
  }

  function remove() {
    if (!post || !window.confirm("Xóa vĩnh viễn bài viết này? Không thể hoàn tác.")) return;
    start(async () => {
      const r = await deletePostAction(post.id);
      if (r.error) return setMsg({ ok: false, text: r.error });
      setDirty(false);
      router.push("/quan-tri/bai-viet");
    });
  }

  const addLabel = (l: string) => {
    const cur = labels.split(",").map((s) => s.trim()).filter(Boolean);
    if (!cur.includes(l)) setLabels([...cur, l].join(", "));
    setDirty(true);
  };

  return (
    <>
      <div className="top">
        <Link className="btn ghost sm" href="/quan-tri/bai-viet">
          ← Bài viết
        </Link>
        <h1>{post ? "Sửa bài viết" : "Viết bài mới"}</h1>
        {post && <span className={`pill ${status}`}>{STATUS_LABEL[status]}</span>}
        <span className="sp" />
        {post && status === "published" && (
          <a className="btn sec sm" href={`/blog/${post.slug}`} target="_blank" rel="noopener">
            Xem trên web ↗
          </a>
        )}
      </div>
      {msg && <div className={`flash ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
      {post?.reviewNote && status === "draft" && <div className="review-note">↩ Biên tập viên nhắn: {post.reviewNote}</div>}

      <div className="editor-layout">
        <div className="card">
          <input
            className="title-input"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDirty(true);
            }}
            placeholder="Tiêu đề bài viết"
            maxLength={200}
            aria-label="Tiêu đề bài viết"
          />
          {editor && <Toolbar editor={editor} onImage={() => fileRef.current?.click()} busy={uploading} />}
          <div className="rte">
            <EditorContent editor={editor} />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void insertImage(f);
              e.target.value = "";
            }}
          />
          <p className="muted" style={{ margin: "8px 0 0", fontSize: 13 }}>
            Mẹo: dán (Ctrl+V) hoặc kéo thả ảnh thẳng vào bài. Ảnh được tự thu nhỏ trước khi tải lên.
          </p>
        </div>

        <div>
          <div className="card side-box">
            <h3>Đăng bài</h3>
            <div className="actions">
              {canPublish ? (
                <>
                  <button className="btn ok" type="button" disabled={pending || uploading} onClick={() => save("publish")}>
                    {status === "published" ? "Cập nhật bài đã đăng" : status === "pending" ? "Duyệt & đăng" : "Đăng bài"}
                  </button>
                  {status === "pending" && (
                    <button className="btn sec" type="button" disabled={pending} onClick={reject}>
                      Trả về tác giả sửa
                    </button>
                  )}
                  {status === "published" && (
                    <button className="btn sec" type="button" disabled={pending} onClick={() => save("hide")}>
                      Ẩn khỏi trang Tin tức
                    </button>
                  )}
                </>
              ) : (
                <button className="btn" type="button" disabled={pending || uploading} onClick={() => save("submit")}>
                  {status === "pending" ? "Cập nhật bài chờ duyệt" : "Gửi duyệt"}
                </button>
              )}
              <button className="btn sec" type="button" disabled={pending || uploading} onClick={() => save("draft")}>
                {status === "published" ? "Gỡ về bản nháp" : "Lưu nháp"}
              </button>
              {post && (
                <button className="btn danger" type="button" disabled={pending} onClick={remove}>
                  Xóa bài
                </button>
              )}
            </div>
            {pending && <p className="muted">Đang lưu…</p>}
            {post?.author && <p className="muted" style={{ marginBottom: 0 }}>Tác giả: {post.author}</p>}
          </div>

          <div className="card side-box">
            <h3>Ảnh đại diện</h3>
            <div className="cover-prev">
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt="" />
              ) : (
                <span>Chưa có – sẽ lấy ảnh đầu tiên trong bài</span>
              )}
            </div>
            <div className="row" style={{ marginTop: 8 }}>
              <button className="btn sec sm" type="button" onClick={() => coverRef.current?.click()} disabled={uploading}>
                Tải ảnh lên
              </button>
              {cover && (
                <button
                  className="btn ghost sm"
                  type="button"
                  onClick={() => {
                    setCover("");
                    setDirty(true);
                  }}
                >
                  Bỏ ảnh
                </button>
              )}
            </div>
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onCoverFile(f);
                e.target.value = "";
              }}
            />
          </div>

          <div className="card side-box">
            <h3>Chủ đề (nhãn)</h3>
            <input
              type="text"
              value={labels}
              onChange={(e) => {
                setLabels(e.target.value);
                setDirty(true);
              }}
              placeholder="Du học, Học bổng"
            />
            <div className="row" style={{ gap: 6, marginTop: 8 }}>
              {SUGGESTED_LABELS.map((l) => (
                <button key={l} type="button" className="btn ghost sm" onClick={() => addLabel(l)}>
                  + {l}
                </button>
              ))}
            </div>
          </div>

          <div className="card side-box">
            <h3>Đường dẫn</h3>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setDirty(true);
              }}
              placeholder="tu-dong-theo-tieu-de"
            />
            <p className="muted" style={{ fontSize: 12.5, margin: "6px 0 0" }}>
              /blog/{slug || "(tự tạo từ tiêu đề)"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
