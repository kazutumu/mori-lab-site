// Keep old deep links usable even when their archive is folded away.
function revealArchiveTarget() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  const archive = document.getElementById('heritage');
  if (target && archive && archive.contains(target) && target !== archive) {
    archive.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
}
window.addEventListener('hashchange', revealArchiveTarget);
revealArchiveTarget();
const snippets = [
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
let snippetIndex = 0;
document.querySelector('#shuffle-log')?.addEventListener('click', () => {
  snippetIndex = (snippetIndex + 1) % snippets.length;
  document.querySelector('#log-line').textContent = snippets[snippetIndex];
});
