// Nhân vật và súng của trò chơi bắn chữ — vẽ hoàn toàn bằng canvas (không dùng ảnh).

export type HeroId = "panda" | "robot" | "cat" | "fox" | "astro" | "tiger";
export type GunId = "laser" | "fire" | "ice" | "star" | "bubble" | "thunder";

export type Hero = { id: HeroId; name: string; body: string };
export type Gun = { id: GunId; name: string; c: string; c2: string; snd: [number, OscillatorType] };

export const HEROES: Hero[] = [
  { id: "panda", name: "Gấu trúc", body: "#2b2f3a" },
  { id: "robot", name: "Robot", body: "#7c8aa5" },
  { id: "cat", name: "Mèo may mắn", body: "#f59f00" },
  { id: "fox", name: "Cáo nhỏ", body: "#e8590c" },
  { id: "astro", name: "Phi hành gia", body: "#e9ecef" },
  { id: "tiger", name: "Hổ con", body: "#fd7e14" },
];

export const GUNS: Gun[] = [
  { id: "laser", name: "Súng laser", c: "#3ee0ff", c2: "#c8f7ff", snd: [880, "square"] },
  { id: "fire", name: "Súng lửa", c: "#ff7a1a", c2: "#ffd166", snd: [220, "sawtooth"] },
  { id: "ice", name: "Súng băng", c: "#8fd3ff", c2: "#ffffff", snd: [1320, "triangle"] },
  { id: "star", name: "Súng ngôi sao", c: "#ffd43b", c2: "#fff3bf", snd: [660, "triangle"] },
  { id: "bubble", name: "Súng bong bóng", c: "#ff8cc6", c2: "#ffe3f1", snd: [520, "sine"] },
  { id: "thunder", name: "Súng sấm sét", c: "#b197fc", c2: "#f3f0ff", snd: [150, "square"] },
];

type Ctx = CanvasRenderingContext2D;

function circle(x: Ctx, cx: number, cy: number, r: number, fill: string) {
  x.fillStyle = fill;
  x.beginPath();
  x.arc(cx, cy, r, 0, Math.PI * 2);
  x.fill();
}
function ellipse(x: Ctx, cx: number, cy: number, rx: number, ry: number, rot: number, fill: string) {
  x.fillStyle = fill;
  x.beginPath();
  x.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
  x.fill();
}
function tri(x: Ctx, pts: [number, number][], fill: string) {
  x.fillStyle = fill;
  x.beginPath();
  pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b)));
  x.closePath();
  x.fill();
}
function rrect(x: Ctx, rx: number, ry: number, w: number, h: number, r: number) {
  x.beginPath();
  if (typeof x.roundRect === "function") x.roundRect(rx, ry, w, h, r);
  else x.rect(rx, ry, w, h);
}

export function star(x: Ctx, cx: number, cy: number, R: number, r: number, n: number) {
  x.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const a = (i * Math.PI) / n - Math.PI / 2;
    const d = i % 2 ? r : R;
    x.lineTo(cx + Math.cos(a) * d, cy + Math.sin(a) * d);
  }
  x.closePath();
  x.fill();
}

/** Vẽ nhân vật, tâm đầu ở (0,0), cao khoảng 70 đơn vị (đầu + thân) */
export function drawHero(x: Ctx, hero: Hero, s: number) {
  x.save();
  x.scale(s, s);
  // thân
  x.fillStyle = hero.body;
  rrect(x, -17, 16, 34, 28, 10);
  x.fill();
  if (hero.id === "astro") {
    x.fillStyle = "#4dabf7";
    x.fillRect(-6, 24, 12, 8);
  }
  if (hero.id === "robot") {
    x.fillStyle = "#3ee0ff";
    circle(x, 0, 30, 4, "#3ee0ff");
  }
  const eyes = (y: number, c = "#1b1b1b") => {
    circle(x, -8, y, 3.2, c);
    circle(x, 8, y, 3.2, c);
    circle(x, -7, y - 1, 1.1, "#fff");
    circle(x, 9, y - 1, 1.1, "#fff");
  };
  switch (hero.id) {
    case "panda":
      circle(x, -16, -17, 8, "#1b1b1b");
      circle(x, 16, -17, 8, "#1b1b1b");
      circle(x, 0, 0, 22, "#fff");
      ellipse(x, -8, -1, 6, 8, 0.5, "#1b1b1b");
      ellipse(x, 8, -1, 6, 8, -0.5, "#1b1b1b");
      circle(x, -8, -2, 2.2, "#fff");
      circle(x, 8, -2, 2.2, "#fff");
      ellipse(x, 0, 9, 4, 3, 0, "#1b1b1b");
      break;
    case "robot":
      x.strokeStyle = "#adb5bd";
      x.lineWidth = 2;
      x.beginPath();
      x.moveTo(0, -20);
      x.lineTo(0, -30);
      x.stroke();
      circle(x, 0, -32, 4, "#ff6b6b");
      x.fillStyle = "#ced4da";
      rrect(x, -21, -20, 42, 36, 9);
      x.fill();
      x.fillStyle = "#212529";
      rrect(x, -15, -12, 30, 12, 5);
      x.fill();
      circle(x, -7, -6, 3.5, "#3ee0ff");
      circle(x, 7, -6, 3.5, "#3ee0ff");
      x.fillStyle = "#495057";
      for (let i = -9; i <= 9; i += 6) x.fillRect(i - 1.5, 6, 3, 6);
      break;
    case "cat":
      tri(x, [[-20, -8], [-16, -28], [-4, -18]], "#f59f00");
      tri(x, [[20, -8], [16, -28], [4, -18]], "#f59f00");
      tri(x, [[-16, -12], [-14, -23], [-8, -17]], "#ffc9c9");
      tri(x, [[16, -12], [14, -23], [8, -17]], "#ffc9c9");
      circle(x, 0, 0, 21, "#ffa94d");
      eyes(-2);
      tri(x, [[-3, 6], [3, 6], [0, 9]], "#f06595");
      x.strokeStyle = "#7c4a03";
      x.lineWidth = 1.2;
      x.beginPath();
      [-1, 1].forEach((d) => {
        x.moveTo(6 * d, 9);
        x.lineTo(19 * d, 6);
        x.moveTo(6 * d, 11);
        x.lineTo(19 * d, 12);
      });
      x.stroke();
      break;
    case "fox":
      tri(x, [[-21, -6], [-17, -30], [-4, -18]], "#e8590c");
      tri(x, [[21, -6], [17, -30], [4, -18]], "#e8590c");
      tri(x, [[-19, -22], [-17, -30], [-13, -24]], "#212529");
      tri(x, [[19, -22], [17, -30], [13, -24]], "#212529");
      circle(x, 0, 0, 21, "#fd7e14");
      tri(x, [[-21, 2], [0, 21], [-2, 4]], "#fff");
      tri(x, [[21, 2], [0, 21], [2, 4]], "#fff");
      eyes(-4);
      circle(x, 0, 12, 3.2, "#212529");
      break;
    case "astro":
      circle(x, 0, 0, 24, "#f1f3f5");
      x.strokeStyle = "#adb5bd";
      x.lineWidth = 2;
      x.beginPath();
      x.arc(0, 0, 24, 0, Math.PI * 2);
      x.stroke();
      ellipse(x, 0, 1, 17, 13, 0, "#1c3d6e");
      ellipse(x, -6, -4, 5, 3, -0.5, "rgba(255,255,255,.55)");
      circle(x, 0, -27, 3, "#ff6b6b");
      break;
    case "tiger":
      circle(x, -16, -16, 7, "#fd7e14");
      circle(x, 16, -16, 7, "#fd7e14");
      circle(x, -16, -16, 3.5, "#ffe8cc");
      circle(x, 16, -16, 3.5, "#ffe8cc");
      circle(x, 0, 0, 22, "#ff922b");
      x.strokeStyle = "#3b2a1a";
      x.lineWidth = 2.6;
      x.beginPath();
      x.moveTo(0, -21);
      x.lineTo(0, -13);
      x.moveTo(-7, -20);
      x.lineTo(-5, -14);
      x.moveTo(7, -20);
      x.lineTo(5, -14);
      x.moveTo(-21, -2);
      x.lineTo(-14, 0);
      x.moveTo(21, -2);
      x.lineTo(14, 0);
      x.stroke();
      ellipse(x, 0, 9, 10, 7, 0, "#fff4e6");
      eyes(-4);
      ellipse(x, 0, 6, 3.5, 2.5, 0, "#3b2a1a");
      break;
  }
  x.restore();
}

/** Vẽ súng, gốc ở báng súng, nòng hướng theo góc `ang` (radian, -PI/2 = thẳng lên) */
export function drawGun(x: Ctx, gun: Gun, ang: number, s: number, recoil: number) {
  x.save();
  x.rotate(ang + Math.PI / 2);
  x.scale(s, s);
  x.translate(0, recoil);
  x.lineJoin = "round";
  // báng cầm
  x.fillStyle = "#3d4354";
  rrect(x, -13, -8, 26, 13, 5);
  x.fill();
  // thân súng
  x.fillStyle = "#23262f";
  x.strokeStyle = gun.c;
  x.lineWidth = 2;
  rrect(x, -8, -44, 16, 38, 6);
  x.fill();
  x.stroke();
  // nòng
  x.fillStyle = gun.c;
  rrect(x, -4.5, -55, 9, 13, 3);
  x.fill();
  x.fillStyle = gun.c2;
  switch (gun.id) {
    case "laser":
      x.fillRect(-1.5, -40, 3, 28);
      break;
    case "fire":
      circle(x, 0, -24, 6, "#ffb703");
      circle(x, 0, -24, 3, "#fff3bf");
      break;
    case "ice":
      for (let i = 0; i < 3; i++) tri(x, [[-8, -40 + i * 11], [-15, -35 + i * 11], [-8, -31 + i * 11]], "#e7f5ff");
      break;
    case "star":
      x.fillStyle = gun.c;
      star(x, 0, -25, 7, 3.2, 5);
      break;
    case "bubble":
      x.strokeStyle = "#fff";
      x.lineWidth = 1.8;
      x.beginPath();
      x.arc(0, -26, 5.5, 0, Math.PI * 2);
      x.stroke();
      break;
    case "thunder":
      x.strokeStyle = "#fff";
      x.lineWidth = 2.4;
      x.beginPath();
      x.moveTo(3, -38);
      x.lineTo(-3, -27);
      x.lineTo(3, -25);
      x.lineTo(-3, -14);
      x.stroke();
      break;
  }
  x.restore();
}
