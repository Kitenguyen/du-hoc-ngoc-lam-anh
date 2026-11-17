// Xử lý HTML bài viết: lọc thẻ nguy hiểm, lấy văn bản thuần, tạo slug.

const IFRAME_OK =
  /src=["']https:\/\/(www\.)?(youtube(-nocookie)?\.com|player\.vimeo\.com|www\.blogger\.com|drive\.google\.com|docs\.google\.com|www\.google\.com\/maps)\//i;

/** Bỏ thẻ và thuộc tính nguy hiểm khỏi HTML bài viết (nội dung do nhân viên trung tâm soạn). */
export function sanitize(html: string): string {
  return html
    .replace(/<(script|style|object|embed|form|textarea|select|button)[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|object|embed|form|meta|link|base|input|textarea|select|button)\b[^>]*\/?>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe\s*>/gi, (m) => (IFRAME_OK.test(m) ? m : ""))
    .replace(/<iframe\b[^>]*\/?>/gi, (m) => (IFRAME_OK.test(m) ? m : ""))
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*(["'])\s*(javascript|vbscript|data):[^"']*\2/gi, ' $1="#"')
    .replace(/<a\b(?![^>]*\btarget=)/gi, '<a target="_blank" rel="noopener"');
}

export function textOf(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>|<\/p>|<\/div>|<\/h\d>|<\/li>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function excerptOf(html: string, max = 180): string {
  const t = textOf(html);
  return t.length > max ? `${t.slice(0, max - 3).replace(/\s+\S*$/, "")}…` : t;
}

export function slugify(s: string, max = 80): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max)
    .replace(/-+$/, "");
}

export function firstImage(html: string): string | undefined {
  return html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
}
