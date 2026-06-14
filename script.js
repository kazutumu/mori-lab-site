const root = document.documentElement;
const canvas = document.querySelector("#noise-canvas");
const ctx = canvas.getContext("2d", { alpha: true });

const readouts = {
  fog: document.querySelector("#fog-readout"),
  noise: document.querySelector("#noise-readout"),
};

const logLine = document.querySelector("#log-line");
const shuffleButton = document.querySelector("#shuffle-log");

const logLines = [
  "完全に重ならないから、関係が続く。",
  "感覚と言葉が一致したとき、人はそれを“好き”と呼ぶ。",
  "届かない。これって最高の1cm。",
  "壊れると思っても、壊れないものがある。",
  "答えはなくていい。でも気づきは残す。",
  "最先端の技術で、最高にくだらないことをする。",
  "霧は分かれているようで、繋がっている。",
  "今日も昼の星を探しています。",
  "外は遠いところではなく、窓のむこうで待っていた朝だった。",
  "ついてくるものがあると、ひとりでも、少しだけひとりじゃないみたい。",
  "そっとふれるものも、ここにいるよって言っているみたい。",
  "森研究所は、感覚側の現実として発生している。",
  "疲れた日は、止まる日ではなく、分岐が増える日。",
  "意味がないのに空気だけで面白いものも、保存対象。",
  "完成品ではなく、育っている途中の場所。",
  "ミナシリーズは、森研究所から伸びた枝のひとつ。",
  "認識できなくても、ほんの少し残ればいい。",
  "点だった感覚が、会話の中で森の空気になる。",
  "説明しきれないものを、空気のまま置いておく。",
  "霧の向こうから誰かが現れることもある。",
  "完全には知らないまま、関係は続く。",
  "忘れてしまうには少し惜しいものを、棚に置く。",
  "森研究所とは、気づきの保管庫である。"
];

let width = 0;
let height = 0;
let frame = 0;
let logIndex = 0;
const baseSignal = {
  fog: 54,
  noise: 29,
  distance: 42,
};

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawNoise() {
  const amount = baseSignal.noise;
  const fog = baseSignal.fog;
  ctx.clearRect(0, 0, width, height);

  const flecks = Math.floor(120 + amount * 5.4);
  for (let i = 0; i < flecks; i += 1) {
    const x = (Math.sin(i * 91.7 + frame * 0.012) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 43.3 + frame * 0.01) * 0.5 + 0.5) * height;
    const alpha = 0.035 + amount * 0.0007;
    ctx.fillStyle = `rgba(20, 30, 23, ${alpha})`;
    ctx.fillRect(x, y, 1 + (i % 2), 1 + (i % 3 === 0 ? 1 : 0));
  }

  const bands = Math.floor(5 + fog / 18);
  for (let i = 0; i < bands; i += 1) {
    const y = ((frame * 0.18 + i * 137) % (height + 180)) - 90;
    const gradient = ctx.createLinearGradient(0, y, width, y + 95);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.5, `rgba(239,242,221,${0.02 + fog * 0.0009})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, y, width, 110);
  }

  frame += 1;
  requestAnimationFrame(drawNoise);
}

function applyControl(name, value) {
  root.style.setProperty(`--${name}`, value);
  if (readouts[name]) {
    readouts[name].textContent = value;
  }
}

Object.entries(baseSignal).forEach(([name, value]) => {
  applyControl(name, value);
});

function shuffleLog() {
  if (!logLine) {
    return;
  }
  logIndex = (logIndex + 1) % logLines.length;
  logLine.animate(
    [
      { opacity: 1, filter: "blur(0)" },
      { opacity: 0, filter: "blur(8px)" },
      { opacity: 1, filter: "blur(0)" }
    ],
    { duration: 420, easing: "ease-out" }
  );
  window.setTimeout(() => {
    logLine.textContent = logLines[logIndex];
  }, 180);
}

if (shuffleButton) {
  shuffleButton.addEventListener("click", shuffleLog);
}
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
drawNoise();

window.setInterval(() => {
  if (logLine && document.visibilityState === "visible") {
    shuffleLog();
  }
}, 7200);
