#!/usr/bin/env node
/**
 * Раскладывает материалы Avenue Park по слотам страницы.
 *
 *   node scripts/prepare-avenue-park-images.mjs ~/Downloads/avenue-park
 *
 * Складываете в одну папку файлы с именами слотов (`hero.jpg`, `yard-sport.png`,
 * `mop-hall.jpeg` — расширение любое), запускаете скрипт, он кладёт готовые
 * `.webp` в public/images/avenue-park/. Список имён — docs/avenue-park-media.md
 * и `SLOTS` в avenue-park-slots.mjs.
 *
 * Что скрипт делает сам:
 *  - приводит кадр к пропорции слота, чтобы вёрстка его дальше не резала;
 *  - никогда не растягивает: исходник меньше слота — останется родное
 *    разрешение в нужной пропорции, а не мыло;
 *  - предметный кадр (замок Xiaomi) не режет, а вписывает в слот на фоне;
 *  - собирает вертикальные кадры (`hero-mobile`, `smart-lock-mobile`) из
 *    горизонтальных, если отдельных не положили;
 *  - предупреждает, если от кадра пришлось отрезать больше 15%.
 *
 * Кадрирует по центру. Если центр — не то место, точку задаёт `--focus`:
 *
 *   node scripts/prepare-avenue-park-images.mjs ~/Downloads/avenue-park \
 *     --focus hero-mobile=35,45
 *
 * Нужен ffmpeg с libwebp (brew install ffmpeg).
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SLOTS, ratioLabel } from './avenue-park-slots.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/images/avenue-park');
const QUALITY = 82;
/** Фон под предметный кадр — тот же тёмно-зелёный, что у секции «Умный замок». */
const PAD_BG = '0x12312C';
const EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff', '.bmp']);

/** Находит в папке файл с именем слота, не считаясь с регистром и расширением. */
function findSource(files, base) {
  const want = base.toLowerCase();
  const hit = files.find((f) => f.name.toLowerCase() === want && EXTS.has(f.ext));
  return hit?.path ?? null;
}

function size(file) {
  const out = execFileSync(
    'ffprobe',
    ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file],
    { encoding: 'utf8' },
  );
  const [w, h] = out.trim().split(',').map(Number);
  return { w, h };
}

function encode(src, out, filter) {
  mkdirSync(dirname(out), { recursive: true });
  execFileSync(
    'ffmpeg',
    ['-hide_banner', '-v', 'error', '-i', src, '-vf', filter,
     '-c:v', 'libwebp', '-quality', String(QUALITY), '-compression_level', '6', '-frames:v', '1', '-y', out],
    { stdio: 'inherit' },
  );
}

/**
 * Кадр обрезается до пропорции слота и ужимается до его размера.
 * Возвращает долю отрезанного — по ней скрипт решает, стоит ли ругаться.
 *
 * По умолчанию рамка ставится по центру исходника. Когда центр — не то место
 * (здание в кадре смещено, вертикальный кроп режет его пополам), точку задаёт
 * `--focus имя=x,y` в процентах от исходника: `--focus hero-mobile=35,45`.
 */
function cover(src, out, slot, sw, sh) {
  const target = slot.w / slot.h;
  let cw = sw;
  let ch = sh;
  if (sw / sh > target) cw = Math.round(sh * target);
  else ch = Math.round(sw / target);

  const [fx, fy] = FOCUS.get(slot.name) ?? [0.5, 0.5];
  const clamp = (v, max) => Math.max(0, Math.min(max, Math.round(v)));
  const cx = clamp(sw * fx - cw / 2, sw - cw);
  const cy = clamp(sh * fy - ch / 2, sh - ch);
  // Апскейл запрещён: лучше родное разрешение в нужной пропорции, чем мыло.
  const upscale = cw < slot.w;
  const scale = upscale ? '' : `,scale=${slot.w}:${slot.h}:flags=lanczos`;

  encode(src, out, `crop=${cw}:${ch}:${cx}:${cy}${scale}`);
  return { cut: 1 - (cw * ch) / (sw * sh), outW: upscale ? cw : slot.w, outH: upscale ? ch : slot.h, upscale };
}

/**
 * Границы самого предмета на светлом фоне. Продуктовые кадры приходят с широким
 * белым полем вокруг товара: без обрезки этого поля замок занимает треть панели
 * и теряется. Считаем по уменьшенной серой копии — этого хватает, чтобы найти
 * рамку, и не требует ничего кроме ffmpeg.
 */
function contentBox(src, sw, sh) {
  const N = 200;
  let buf;
  try {
    buf = execFileSync(
      'ffmpeg',
      ['-v', 'error', '-i', src, '-vf', `scale=${N}:${N},format=gray`, '-frames:v', '1', '-f', 'rawvideo', '-'],
      { maxBuffer: 1 << 24 },
    );
  } catch {
    return { x: 0, y: 0, w: sw, h: sh };
  }
  let l = N, r = -1, t = N, b = -1;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (buf[y * N + x] >= 245) continue;
      if (x < l) l = x;
      if (x > r) r = x;
      if (y < t) t = y;
      if (y > b) b = y;
    }
  }
  if (r < l || b < t) return { x: 0, y: 0, w: sw, h: sh };

  // Поле в 3% вокруг предмета: вплотную обрезанный товар выглядит зажатым.
  const pad = 0.03;
  const x0 = Math.max(0, (l / N - pad) * sw);
  const y0 = Math.max(0, (t / N - pad) * sh);
  const x1 = Math.min(sw, ((r + 1) / N + pad) * sw);
  const y1 = Math.min(sh, ((b + 1) / N + pad) * sh);
  return { x: Math.round(x0), y: Math.round(y0), w: Math.round(x1 - x0), h: Math.round(y1 - y0) };
}

/** Слот подстраивает высоту под файл: обрезки нет, ограничиваем только ширину. */
function free(src, out, slot, sw, sh) {
  const w = Math.min(slot.w, sw);
  const h = Math.round((w / sw) * sh);
  encode(src, out, `scale=${w}:-2:flags=lanczos`);
  return { cut: 0, outW: w, outH: h, upscale: false };
}

/**
 * Кадр целиком вписывается в слот и дополняется фоном — ничего не теряется.
 *
 * Координаты внутри `pad` считаются в его собственных переменных: `iw`/`ih` —
 * это уже отмасштабированный кадр, `ow`/`oh` — слот. Похожие на них `W`/`H`/`w`
 * есть только у `overlay`, и в `pad` они дают «Undefined constant».
 */
function pad(src, out, slot, sw, sh) {
  /*
   * Замок снят на белом фоне. Положенный на тёмную секцию как есть, он читается
   * белой наклейкой посреди фона, поэтому белое поле доводится до цельной
   * панели: во всю высоту слота справа на десктопе и во всю ширину сверху на
   * мобильном. Получается задуманный раскол макета — текст на тёмном, товар на
   * светлом, — а не дырка в фоне. Панель справа начинается за колонкой текста
   * (`.easton-yard__content`, максимум 960px), поэтому они не налезают.
   */
  const panel = slot.align === 'right'
    ? { w: Math.round(slot.w * 0.34), h: slot.h }
    : { w: slot.w, h: Math.round(slot.h * 0.38) };
  const at = slot.align === 'right' ? { x: slot.w - panel.w, y: 0 } : { x: 0, y: 0 };
  const box = contentBox(src, sw, sh);
  // Вертикальный товар упирается в высоту панели, поэтому в низкой панели
  // мобильного запас по краям делаем меньше — иначе замок остаётся мелким.
  const room = slot.align === 'right' ? 0.8 : 0.92;
  const fw = Math.round(panel.w * room);
  const fh = Math.round(panel.h * room);

  encode(
    src,
    out,
    `crop=${box.w}:${box.h}:${box.x}:${box.y},` +
      `scale=${fw}:${fh}:force_original_aspect_ratio=decrease:flags=lanczos,` +
      `pad=${panel.w}:${panel.h}:(ow-iw)/2:(oh-ih)/2:color=white,` +
      `pad=${slot.w}:${slot.h}:${at.x}:${at.y}:color=${PAD_BG}`,
  );
  return { cut: 0, outW: slot.w, outH: slot.h, upscale: false };
}

const argv = process.argv.slice(2);

/** `--focus hero-mobile=35,45` → точка кадрирования в долях от исходника. */
const FOCUS = new Map();
for (let i = 0; i < argv.length; i++) {
  if (argv[i] !== '--focus') continue;
  const [name, point] = (argv[i + 1] ?? '').split('=');
  const [x, y] = (point ?? '').split(',').map(Number);
  if (!name || Number.isNaN(x) || Number.isNaN(y)) {
    console.error(`Не разобрал --focus ${argv[i + 1]}. Формат: --focus hero-mobile=35,45`);
    process.exit(1);
  }
  FOCUS.set(name, [x / 100, y / 100]);
  argv.splice(i, 2);
  i--;
}

const dir = argv[0] && resolve(argv[0].replace(/^~/, process.env.HOME));
if (!dir || !existsSync(dir)) {
  console.error('Укажите папку с материалами Avenue Park:');
  console.error('  node scripts/prepare-avenue-park-images.mjs ~/Downloads/avenue-park');
  console.error('\nИмена файлов = имена слотов из docs/avenue-park-media.md, расширение любое.');
  process.exit(1);
}

const files = readdirSync(dir, { withFileTypes: true })
  .filter((e) => e.isFile())
  .map((e) => ({
    path: join(dir, e.name),
    ext: extname(e.name).toLowerCase(),
    name: e.name.slice(0, e.name.length - extname(e.name).length),
  }));

let ok = 0;
const missing = [];
const notes = [];
const failed = [];

for (const slot of SLOTS) {
  let src = findSource(files, slot.name);
  let borrowed = false;
  if (!src && slot.fallbackFrom) {
    src = findSource(files, slot.fallbackFrom);
    borrowed = Boolean(src);
  }
  if (!src) {
    missing.push(slot);
    continue;
  }

  const out = join(OUT, `${slot.name}.webp`);
  let sw, sh, res;
  try {
    ({ w: sw, h: sh } = size(src));
    res = slot.fit === 'free' ? free(src, out, slot, sw, sh)
      : slot.fit === 'pad' ? pad(src, out, slot, sw, sh)
      : cover(src, out, slot, sw, sh);
  } catch {
    // Один битый исходник не должен обрывать раскладку остальных слотов.
    failed.push(`${slot.name} — ffmpeg не смог обработать ${src}`);
    continue;
  }

  const extra = [];
  if (borrowed) extra.push(`собран из ${slot.fallbackFrom} — проверьте, что здание не срезано`);
  if (res.cut > 0.15) extra.push(`отрезано ${Math.round(res.cut * 100)}% кадра, нужен исходник ближе к ${ratioLabel(slot)}`);
  if (res.upscale) extra.push(`исходник мал (${res.outW}px < ${slot.w}px) — оставил родное разрешение`);
  extra.forEach((e) => notes.push(`${slot.name}: ${e}`));

  console.log(`  ✓ ${slot.name}.webp  ${sw}×${sh} → ${res.outW}×${res.outH}` + (extra.length ? `  ← ${extra.join('; ')}` : ''));
  ok++;
}

console.log(`\nГотово: ${ok} из ${SLOTS.length}`);
if (failed.length) {
  console.log('\nНе получилось:');
  failed.forEach((f) => console.log(`  ✗ ${f}`));
}
if (notes.length) {
  console.log('\nОбратить внимание:');
  notes.forEach((n) => console.log(`  · ${n}`));
}
if (missing.length) {
  console.log(`\nНе найдено в ${dir} (на странице останется заглушка):`);
  missing.forEach((s) => console.log(`  · ${s.name} — ${s.title} (${s.source})`));
}
