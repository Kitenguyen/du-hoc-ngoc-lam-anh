-- Dashboard quản trị Du học Ngọc Lâm Anh: tài khoản, phiên đăng nhập, bài viết, đăng ký học.
-- Áp dụng: npx wrangler d1 migrations apply DB --local   (máy mình)
--          npx wrangler d1 migrations apply DB --remote  (Cloudflare)

CREATE TABLE users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  name        TEXT    NOT NULL DEFAULT '',
  avatar      TEXT,
  role        TEXT    NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  -- Quyền của nhân viên (JSON): {"blogWrite":bool,"blogPublish":bool,"leads":bool,"content":bool}
  perms       TEXT    NOT NULL DEFAULT '{}',
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  last_login  TEXT
);

CREATE TABLE sessions (
  token_hash  TEXT    PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at  TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_sessions_user ON sessions(user_id);

CREATE TABLE posts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT    NOT NULL UNIQUE,
  title         TEXT    NOT NULL,
  excerpt       TEXT    NOT NULL DEFAULT '',
  content       TEXT    NOT NULL DEFAULT '',
  cover         TEXT,
  labels        TEXT    NOT NULL DEFAULT '[]',
  -- draft: nháp · pending: chờ duyệt · published: đã đăng · hidden: đã ẩn
  status        TEXT    NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'hidden')),
  author_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reviewer_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  review_note   TEXT,
  published_at  TEXT,
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_posts_status ON posts(status, published_at DESC);

CREATE TABLE leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name   TEXT    NOT NULL,
  phone       TEXT    NOT NULL,
  birth       TEXT    NOT NULL DEFAULT '',
  address     TEXT    NOT NULL DEFAULT '',
  course      TEXT    NOT NULL DEFAULT '',
  shift       TEXT    NOT NULL DEFAULT '',
  branch      TEXT    NOT NULL DEFAULT '',
  note        TEXT    NOT NULL DEFAULT '',
  source      TEXT    NOT NULL DEFAULT 'dang-ky',
  -- new: mới · contacted: đã liên hệ · enrolled: đã đăng ký học · closed: không tiếp tục
  status      TEXT    NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'enrolled', 'closed')),
  assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  staff_note  TEXT    NOT NULL DEFAULT '',
  ip          TEXT,
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_leads_status ON leads(status, created_at DESC);
CREATE INDEX idx_leads_ip ON leads(ip, created_at);

-- Nhật ký thao tác trong dashboard
CREATE TABLE audit_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action      TEXT    NOT NULL,
  target      TEXT    NOT NULL DEFAULT '',
  detail      TEXT    NOT NULL DEFAULT '',
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
