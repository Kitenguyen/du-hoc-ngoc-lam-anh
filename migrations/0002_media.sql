-- Ảnh tải lên từ dashboard (đã thu nhỏ trên trình duyệt, tối đa ~900 KB/ảnh)
CREATE TABLE media (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  key         TEXT    NOT NULL UNIQUE,
  mime        TEXT    NOT NULL,
  size        INTEGER NOT NULL,
  width       INTEGER,
  height      INTEGER,
  data        BLOB    NOT NULL,
  uploader_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
