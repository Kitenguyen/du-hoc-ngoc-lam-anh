"use client";

// Đọc to tiếng Trung bằng giọng máy của trình duyệt (speechSynthesis).

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
}

function zhVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /^zh[-_]CN/i.test(v.lang)) ??
    voices.find((v) => /^zh/i.test(v.lang)) ??
    voices.find((v) => /chinese|普通话|中文/i.test(v.name))
  );
}

/** Đọc một câu; lời thoại dạng "女：…男：…问：…" được đọc liền, bỏ nhãn người nói */
export function speakZh(text: string, onEnd?: () => void): void {
  if (!canSpeak()) {
    onEnd?.();
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const parts = text
    .split(/(?=(?:男|女|问)：)/)
    .map((p) => p.replace(/^(男|女)：/, "").replace(/^问：/, "问题："))
    .filter(Boolean);
  const voice = zhVoice();
  parts.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(p);
    u.lang = "zh-CN";
    u.rate = 0.85;
    if (voice) u.voice = voice;
    if (i === parts.length - 1 && onEnd) {
      u.onend = () => onEnd();
      u.onerror = () => onEnd();
    }
    synth.speak(u);
  });
}

export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel();
}

export function canRecord(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function"
  );
}
