// Lõi trò chơi "Bắn chữ Hán": chữ Hán rơi xuống, gõ phiên âm không dấu để bắn.
// Tốc độ cố định ở mọi level: cứ 3,3 giây ra 1 chữ, mỗi chữ rơi hết màn hình trong 10 giây.
// Mỗi level 10 từ; 3 mạng; cứ 3 level được thêm 1 mạng (tối đa 5).

import { drawGun, drawHero, star, type Gun, type Hero } from "./sprites";

export type GameWord = { h: string; p: string; m: string; k: string; ks: string[] };

type Falling = GameWord & { x: number; y: number; v: number; w: number; dead: boolean; fx: number };
type Bullet = { x: number; y: number; tx: number; ty: number; t: number; d: number };
type Part = { x: number; y: number; vx: number; vy: number; l: number; c: string; r: number };
type FloatText = { x: number; y: number; txt: string; c: string; l: number; hit?: boolean };

export type Hud = { level: number; score: number; lives: number; done: number; paused: boolean };
export type EndStats = {
  score: number;
  level: number;
  hit: number;
  acc: number;
  best: number;
  newBest: boolean;
  missed: GameWord[];
};

export type EngineOptions = {
  hero: Hero;
  gun: Gun;
  mean: boolean;
  speak: boolean;
  label: string;
  brand: string;
  best: number;
  muted: () => boolean;
};

export type EngineCallbacks = {
  onHud: (h: Hud) => void;
  onEnd: (s: EndStats) => void;
  onSpeak: (h: string) => void;
};

export const LEVEL_WORDS = 10;
const FALL_TIME = 10;
const SPAWN_GAP = 3.3;
const MAX_ON = 3;
const HANF = '"Noto Serif SC","Noto Sans SC","Microsoft YaHei","PingFang SC",sans-serif';
const UIF = '"Be Vietnam Pro",system-ui,sans-serif';

/* ---------- âm thanh tự tạo bằng WebAudio (không cần file) ---------- */
let AC: AudioContext | null = null;
type AudioWin = Window & { webkitAudioContext?: typeof AudioContext };
export function audio(): AudioContext | null {
  if (!AC) {
    try {
      const Ctor = window.AudioContext ?? (window as AudioWin).webkitAudioContext;
      if (Ctor) AC = new Ctor();
    } catch {
      AC = null;
    }
  }
  if (AC && AC.state === "suspended") void AC.resume().catch(() => undefined);
  return AC;
}
export function beep(f: number, type: OscillatorType, dur: number, vol = 0.08, slide = 0) {
  const a = audio();
  if (!a) return;
  const o = a.createOscillator();
  const g = a.createGain();
  const t = a.currentTime;
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f * slide), t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}
function boom() {
  const a = audio();
  if (!a) return;
  const n = Math.floor(a.sampleRate * 0.25);
  const b = a.createBuffer(1, n, a.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.2);
  const s = a.createBufferSource();
  const g = a.createGain();
  s.buffer = b;
  g.gain.value = 0.22;
  s.connect(g);
  g.connect(a.destination);
  s.start();
}

/* ---------- so khớp phiên âm ---------- */
function clean(v: string): string {
  return v.toLowerCase().replace(/ü/g, "v").replace(/[^a-z]/g, "");
}
/* Bàn phím tiếng Việt (Telex) tự biến chữ khi gõ phiên âm: xuexi → "xuễi", wo → "ươ"…
   Đổi ngược: mỗi dấu thanh / dấu mũ ứng với 1 chữ cái đã gõ → so theo đúng bộ chữ cái đã gõ. */
const VNM: Record<string, string> = { "́": "s", "̀": "f", "̉": "r", "̃": "x", "̣": "j", "̆": "w", "̛": "w" };
function vnLetters(v: string) {
  const t = v
    .toLowerCase()
    .normalize("NFC")
    .replace(/(^|[^a-z])ươ/g, "$1wo")
    .replace(/ươ/g, "uơ")
    .replace(/(^|[^a-z])ư/g, "$1w")
    .replace(/ư/g, "ư")
    .replace(/đ/g, "dd");
  let base = "";
  let extra = "";
  for (const ch of t.normalize("NFD")) {
    if (/[a-z]/.test(ch)) {
      base += ch;
      continue;
    }
    if (ch === "̂") {
      extra += base.slice(-1);
      continue;
    }
    if (VNM[ch]) extra += VNM[ch];
  }
  return { base, all: (base + extra).split("").sort().join("") };
}
function isSub(a: string, b: string) {
  let i = 0;
  for (const c of b) if (c === a[i]) i++;
  return i === a.length;
}
function vnMatch(v: string, k: string) {
  const x = vnLetters(v);
  if (!x.base) return false;
  return x.all === k.split("").sort().join("") && isSub(x.base, k);
}

function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const STARS = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + 0.3, s: Math.random() * 0.6 + 0.2 }));

export class ShooterEngine {
  private ctx: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private DPR = 1;
  private raf = 0;
  private last = 0;
  private alive = true;
  private timers: number[] = [];

  private queue: GameWord[];
  private level = 1;
  private score = 0;
  private lives = 3;
  private combo = 0;
  private words: Falling[] = [];
  private bullets: Bullet[] = [];
  private parts: Part[] = [];
  private floats: FloatText[] = [];
  private spawnT = 1;
  private spawned = 0;
  private done = 0;
  private hit = 0;
  private badKeys = 0;
  private missed: GameWord[] = [];
  private t = 0;
  private paused = false;
  private over = false;
  private banner: { txt: string; sub: string; t: number } | null;
  private shake = 0;
  private recoil = 0;
  private ang = -Math.PI / 2;
  private aim: Falling | null = null;
  private lastShot = -9;
  private tail: { list: string[]; t: number } | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private input: HTMLInputElement,
    private pool: GameWord[],
    private opt: EngineOptions,
    private cb: EngineCallbacks,
  ) {
    const c = canvas.getContext("2d");
    if (!c) throw new Error("Canvas 2D không khả dụng");
    this.ctx = c;
    this.queue = shuffle(pool.slice());
    this.banner = { txt: "LEVEL 1", sub: opt.label, t: 2.2 };
  }

  start() {
    this.resize();
    this.hud();
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.alive) return;
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      if (!this.paused && !this.over) this.step(dt);
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  destroy() {
    this.alive = false;
    cancelAnimationFrame(this.raf);
    this.timers.forEach((t) => clearTimeout(t));
  }

  private later(fn: () => void, ms: number) {
    this.timers.push(window.setTimeout(() => this.alive && fn(), ms));
  }

  private sound(fn: () => void) {
    if (!this.opt.muted()) fn();
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    this.DPR = Math.min(2, window.devicePixelRatio || 1);
    this.W = r.width;
    this.H = r.height;
    this.canvas.width = Math.round(this.W * this.DPR);
    this.canvas.height = Math.round(this.H * this.DPR);
  }

  isOver() {
    return this.over;
  }
  isPaused() {
    return this.paused;
  }

  setPaused(v?: boolean) {
    if (this.over) return;
    this.paused = v === undefined ? !this.paused : v;
    this.hud();
  }

  private groundY() {
    return this.H - Math.max(70, Math.min(110, this.H * 0.16));
  }
  private hanSize() {
    return Math.max(28, Math.min(48, this.W / 15));
  }

  private hud() {
    this.cb.onHud({ level: this.level, score: this.score, lives: this.lives, done: Math.min(this.done, LEVEL_WORDS), paused: this.paused });
  }

  private spawn() {
    if (!this.queue.length) this.queue = shuffle(this.pool.slice());
    const onScr = new Set(this.words.filter((w) => !w.dead).map((w) => w.h));
    let qi = this.queue.findIndex((w) => !onScr.has(w.h));
    if (qi < 0) {
      if (this.pool.length <= onScr.size) return;
      this.queue = shuffle(this.pool.filter((w) => !onScr.has(w.h)));
      qi = 0;
    }
    const src = this.queue.splice(qi, 1)[0];
    const x = this.ctx;
    x.font = `700 ${this.hanSize()}px ${HANF}`;
    const tw = x.measureText(src.h).width;
    x.font = `600 14px ${UIF}`;
    const mw = this.opt.mean ? Math.min(x.measureText(src.m).width, this.W * 0.42) : 0;
    const w = Math.max(tw, mw, 60) + 24;
    let px = 0;
    let tries = 0;
    do {
      px = 12 + w / 2 + Math.random() * Math.max(1, this.W - 24 - w);
      tries++;
    } while (tries < 12 && this.words.some((o) => o.y < this.H * 0.3 && Math.abs(o.x - px) < (o.w + w) / 2 + 8));
    this.words.push({ ...src, x: px, y: -30, v: (this.groundY() + 30) / FALL_TIME, w, dead: false, fx: 0 });
    this.spawned++;
  }

  private step(dt: number) {
    this.t += dt;
    this.shake = Math.max(0, this.shake - dt * 2.5);
    this.recoil = Math.max(0, this.recoil - dt * 60);
    if (this.banner) this.banner.t -= dt;
    if (this.spawned < LEVEL_WORDS) {
      this.spawnT -= dt;
      const on = this.words.filter((w) => !w.dead).length;
      if ((this.spawnT <= 0 && on < MAX_ON) || (on === 0 && this.spawnT > 1.5)) {
        this.spawn();
        this.spawnT = SPAWN_GAP;
      }
    }
    const gy = this.groundY();
    for (const w of this.words) {
      if (w.dead) continue;
      w.y += w.v * dt;
      if (w.y >= gy - 10) {
        w.dead = true;
        this.lives--;
        this.done++;
        this.combo = 0;
        this.shake = 1;
        this.missed.push(w);
        if (this.aim === w) this.aim = null;
        this.burst(w.x, gy - 10, "#ff6b6b", 18);
        this.sound(() => beep(110, "sawtooth", 0.35, 0.12, 0.4));
        this.float(w.x, gy - 40, `${w.h}  ${w.p}`, "#ffb4b4");
        this.hud();
        if (this.lives <= 0) {
          this.gameOver();
          return;
        }
      }
    }
    this.words = this.words.filter((w) => !w.dead || w.fx > 0);
    for (const b of this.bullets) b.t += dt / b.d;
    this.bullets = this.bullets.filter((b) => b.t < 1);
    for (const p of this.parts) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 260 * dt;
      p.l -= dt;
    }
    this.parts = this.parts.filter((p) => p.l > 0);
    for (const f of this.floats) {
      f.y -= 28 * dt;
      f.l -= dt;
    }
    this.floats = this.floats.filter((f) => f.l > 0);
    const tg = this.aim && this.t - this.lastShot < 0.6 ? this.aim : null;
    const want = tg ? Math.atan2(tg.y - (gy + 8), tg.x - this.W / 2) : -Math.PI / 2;
    this.ang += (want - this.ang) * Math.min(1, dt * 18);
    if (this.spawned >= LEVEL_WORDS && this.done >= LEVEL_WORDS && !this.words.some((w) => !w.dead)) this.levelUp();
  }

  private levelUp() {
    this.level++;
    this.spawned = 0;
    this.done = 0;
    this.spawnT = 1.6;
    let sub = "Tốc độ giữ nguyên – cố lên!";
    if (this.level % 3 === 1 && this.lives < 5) {
      this.lives++;
      sub += " +1 ❤️";
    }
    this.banner = { txt: `LEVEL ${this.level}`, sub, t: 2.2 };
    [523, 659, 784, 1047].forEach((f, i) => this.later(() => this.sound(() => beep(f, "triangle", 0.18, 0.08)), i * 90));
    this.hud();
  }

  private burst(x: number, y: number, c: string, n: number) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 60 + Math.random() * 220;
      this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 80, l: 0.5 + Math.random() * 0.5, c, r: 2 + Math.random() * 3 });
    }
  }
  private float(x: number, y: number, txt: string, c: string, l = 1.6, hit = false) {
    this.floats.push({ x, y, txt, c, l, hit });
  }
  private fire(w: Falling, i: number) {
    const gx = this.W / 2;
    const gy = this.groundY() + 2;
    const L = 56;
    this.bullets.push({ x: gx + Math.cos(this.ang) * L, y: gy + Math.sin(this.ang) * L, tx: w.x, ty: w.y + 6, t: 0, d: 0.12 });
    this.recoil = 7;
    const [f, type] = this.opt.gun.snd;
    this.sound(() => beep(f * (1 + i * 0.04), type, 0.09, 0.05, 0.6));
  }

  private clearInput() {
    this.input.value = "";
  }
  private flashInput() {
    const i = this.input;
    i.classList.remove("bad");
    void i.offsetWidth;
    i.classList.add("bad");
  }

  /** Xử lý chữ trong ô gõ. enter = người chơi bấm Enter / dấu cách / nút Bắn */
  type(v: string, enter: boolean) {
    if (this.over) return;
    if (this.paused) {
      this.setPaused(false);
      return;
    }
    const b = clean(v);
    // vừa bắn từ đuôi 儿 bằng cách gõ ngắn mà gõ tiếp r / er → bỏ qua phần đuôi
    if (this.tail && b) {
      if (this.t - this.tail.t < 2 && this.tail.list.some((x) => x.startsWith(b))) {
        if (this.tail.list.includes(b)) {
          this.clearInput();
          this.tail = null;
        }
        return;
      }
      this.tail = null;
    }
    const vn = /[^\x00-\x7f]/.test(v);
    const live = this.words.filter((w) => !w.dead);
    const eq = (w: Falling) => w.ks.includes(b) || (vn && w.ks.some((k) => vnMatch(v, k)));
    const hit = b || vn ? live.filter(eq).sort((a, c) => c.y - a.y)[0] : undefined;
    // gõ đúng → bắn ngay; chỉ chờ Enter khi có TỪ KHÁC dài hơn bắt đầu giống hệt (是 shi / 时间 shijian)
    const amb = !!hit && !enter && live.some((w) => w !== hit && !eq(w) && w.ks.some((k) => k.length > b.length && k.startsWith(b)));
    if (hit && !amb) {
      this.clearInput();
      const tl = hit.ks.filter((k) => k.length > b.length && k.startsWith(b)).map((k) => k.slice(b.length));
      this.tail = tl.length ? { list: tl, t: this.t } : null;
      this.shoot(hit);
      return;
    }
    if (!enter) return;
    this.clearInput();
    if (!b) return;
    this.badKeys++;
    this.combo = 0;
    this.sound(() => beep(90, "square", 0.12, 0.06));
    this.flashInput();
    this.float(this.W / 2, this.groundY() - 90, `✗ ${b}`, "#ffa8a8", 1);
    this.hud();
  }

  private shoot(tg: Falling) {
    tg.dead = true;
    tg.fx = 0;
    this.aim = tg;
    this.lastShot = this.t;
    for (let i = 0; i < Math.min(6, tg.k.length); i++) this.later(() => this.fire(tg, i), i * 45);
    this.hit++;
    this.done++;
    this.combo++;
    const bonus = this.combo >= 3 ? this.combo * 5 * this.level : 0;
    this.score += (10 * tg.k.length + 50) * this.level + bonus;
    this.later(() => {
      this.burst(tg.x, tg.y, this.opt.gun.c, 22);
      this.sound(boom);
    }, 200);
    this.floats = this.floats.filter((f) => !f.hit);
    const fy = Math.max(70, tg.y - this.hanSize() * 0.9);
    this.float(tg.x, fy, `${tg.h}  ${tg.p}`, "#fff3bf", 2.2, true);
    if (this.opt.mean) this.float(tg.x, fy + 20, tg.m, "#d0ebff", 2.2, true);
    if (this.combo >= 3) this.float(this.W / 2, this.groundY() - 120, `Combo x${this.combo}!`, "#ffd43b", 1);
    if (this.opt.speak && !this.opt.muted()) this.cb.onSpeak(tg.h);
    this.hud();
  }

  private gameOver() {
    this.over = true;
    this.aim = null;
    const best = Math.max(this.opt.best, this.score);
    const acc = this.hit + this.badKeys ? Math.round((this.hit / (this.hit + this.badKeys)) * 100) : 100;
    const seen = new Set<string>();
    const missed = this.missed.filter((w) => !seen.has(w.h) && !!seen.add(w.h)).map(({ h, p, m, k, ks }) => ({ h, p, m, k, ks }));
    this.sound(() => beep(330, "sawtooth", 0.5, 0.1, 0.3));
    this.cb.onEnd({ score: this.score, level: this.level, hit: this.hit, acc, best, newBest: this.score > this.opt.best, missed });
  }

  /* ---------- vẽ ---------- */
  private draw() {
    const x = this.ctx;
    const { W, H } = this;
    x.setTransform(this.DPR, 0, 0, this.DPR, 0, 0);
    const sx = this.shake ? (Math.random() - 0.5) * 14 * this.shake : 0;
    x.save();
    x.translate(sx, 0);
    const bg = x.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0b1026");
    bg.addColorStop(0.6, "#1b1d4a");
    bg.addColorStop(1, "#3a1240");
    x.fillStyle = bg;
    x.fillRect(-20, 0, W + 40, H);
    for (const s of STARS) {
      const y = (s.y * H + this.t * 14 * s.s) % H;
      x.globalAlpha = 0.35 + 0.4 * Math.sin(this.t * 2 + s.x * 20);
      x.fillStyle = "#fff";
      x.beginPath();
      x.arc(s.x * W, y, s.r, 0, Math.PI * 2);
      x.fill();
    }
    x.globalAlpha = 1;
    const gy = this.groundY();
    // dòng thương hiệu chìm
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.font = `800 ${Math.max(13, Math.min(26, W / 34))}px "Lexend",${UIF}`;
    x.fillStyle = "rgba(247,220,148,.16)";
    x.fillText(this.opt.brand, W / 2, H * 0.55);
    // vạch phòng thủ
    x.strokeStyle = "rgba(255,107,107,.45)";
    x.setLineDash([8, 8]);
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(0, gy - 10);
    x.lineTo(W, gy - 10);
    x.stroke();
    x.setLineDash([]);
    // chữ rơi
    const hs = this.hanSize();
    for (const w of this.words) {
      if (w.dead) continue;
      const ext = this.opt.mean ? 18 : 0;
      const bh = hs * 1.12 + ext + 6;
      const bx = w.x - w.w / 2;
      const by = w.y - hs * 0.95;
      const tr = x.createLinearGradient(w.x, by - 60, w.x, by);
      tr.addColorStop(0, "rgba(255,255,255,0)");
      tr.addColorStop(1, "rgba(140,170,255,.35)");
      x.fillStyle = tr;
      x.fillRect(w.x - w.w / 2 + 8, by - 60, w.w - 16, 60);
      x.fillStyle = "rgba(255,255,255,.1)";
      x.strokeStyle = "rgba(255,255,255,.35)";
      x.lineWidth = 1.5;
      x.beginPath();
      if (typeof x.roundRect === "function") x.roundRect(bx, by, w.w, bh, 14);
      else x.rect(bx, by, w.w, bh);
      x.fill();
      x.stroke();
      x.textAlign = "center";
      x.textBaseline = "alphabetic";
      x.font = `700 ${hs}px ${HANF}`;
      x.fillStyle = "#fff";
      x.fillText(w.h, w.x, w.y);
      if (this.opt.mean) {
        x.font = `600 13px ${UIF}`;
        x.fillStyle = "#a5d8ff";
        let m = w.m;
        while (m.length > 4 && x.measureText(m).width > W * 0.42) m = m.slice(0, -2);
        if (m !== w.m) m += "…";
        x.fillText(m, w.x, w.y + hs * 0.17 + 14);
      }
    }
    // đạn
    const g = this.opt.gun;
    for (const b of this.bullets) {
      const px = b.x + (b.tx - b.x) * b.t;
      const py = b.y + (b.ty - b.y) * b.t;
      x.save();
      x.shadowColor = g.c;
      x.shadowBlur = 14;
      if (g.id === "laser") {
        x.strokeStyle = g.c;
        x.lineWidth = 4;
        x.beginPath();
        x.moveTo(b.x, b.y);
        x.lineTo(px, py);
        x.stroke();
      } else if (g.id === "thunder") {
        x.strokeStyle = g.c2;
        x.lineWidth = 3;
        x.beginPath();
        x.moveTo(b.x, b.y);
        const n = 6;
        for (let i = 1; i <= n; i++) {
          const tt = (i / n) * b.t;
          x.lineTo(b.x + (b.tx - b.x) * tt + (i < n ? (Math.random() - 0.5) * 18 : 0), b.y + (b.ty - b.y) * tt);
        }
        x.stroke();
      } else if (g.id === "star") {
        x.fillStyle = g.c;
        star(x, px, py, 10, 4.5, 5);
      } else if (g.id === "bubble") {
        x.strokeStyle = g.c;
        x.lineWidth = 2.5;
        x.fillStyle = "rgba(255,140,198,.25)";
        x.beginPath();
        x.arc(px, py, 9, 0, Math.PI * 2);
        x.fill();
        x.stroke();
      } else if (g.id === "ice") {
        x.translate(px, py);
        x.rotate(Math.atan2(b.ty - b.y, b.tx - b.x));
        x.fillStyle = g.c2;
        x.beginPath();
        x.moveTo(12, 0);
        x.lineTo(-8, -5);
        x.lineTo(-8, 5);
        x.closePath();
        x.fill();
      } else {
        x.fillStyle = g.c;
        x.beginPath();
        x.arc(px, py, 8, 0, Math.PI * 2);
        x.fill();
        x.fillStyle = g.c2;
        x.beginPath();
        x.arc(px, py, 4, 0, Math.PI * 2);
        x.fill();
      }
      x.restore();
    }
    // mảnh vỡ
    for (const p of this.parts) {
      x.globalAlpha = Math.max(0, p.l * 1.6);
      x.fillStyle = p.c;
      x.beginPath();
      x.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      x.fill();
    }
    x.globalAlpha = 1;
    // nhân vật + súng
    const cx = W / 2;
    const cy = gy + 8;
    x.fillStyle = "rgba(255,255,255,.08)";
    x.beginPath();
    x.ellipse(cx, cy + 46, 70, 12, 0, 0, Math.PI * 2);
    x.fill();
    const bob = Math.sin(this.t * 4) * 2;
    const hs2 = Math.min(1.05, Math.max(0.75, W / 700));
    x.save();
    x.translate(cx, cy + 6 + bob);
    drawHero(x, this.opt.hero, hs2);
    x.restore();
    x.save();
    x.translate(cx + 20 * hs2, cy + 10);
    drawGun(x, g, this.ang, 0.9, this.recoil);
    x.restore();
    // chữ nổi
    for (const f of this.floats) {
      x.globalAlpha = Math.min(1, f.l);
      x.font = `700 15px ${UIF}`;
      x.textAlign = "center";
      x.textBaseline = "alphabetic";
      x.lineWidth = 4;
      x.strokeStyle = "rgba(0,0,0,.6)";
      const hw = x.measureText(f.txt).width / 2 + 6;
      const fx = Math.max(hw, Math.min(W - hw, f.x));
      const fy = Math.max(22, f.y);
      x.strokeText(f.txt, fx, fy);
      x.fillStyle = f.c;
      x.fillText(f.txt, fx, fy);
    }
    x.globalAlpha = 1;
    // banner level
    if (this.banner && this.banner.t > 0) {
      x.globalAlpha = Math.min(1, this.banner.t);
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.font = `900 ${Math.min(64, W / 8)}px "Lexend",${UIF}`;
      x.lineWidth = 6;
      x.strokeStyle = "#5c070b";
      x.strokeText(this.banner.txt, W / 2, H * 0.38);
      x.fillStyle = "#ffd43b";
      x.fillText(this.banner.txt, W / 2, H * 0.38);
      x.font = `700 16px ${UIF}`;
      x.fillStyle = "#fff";
      x.fillText(this.banner.sub, W / 2, H * 0.38 + Math.min(48, W / 12));
      x.globalAlpha = 1;
    }
    x.restore();
  }
}
