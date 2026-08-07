#!/usr/bin/env node
/**
 * Готовит выгрузку из Figma к странице ЖК BS Towers.
 *
 *   node scripts/prepare-bs-towers-images.mjs ~/Downloads/bs-towers
 *
 * Для каждого слота страницы: отрезает пустые поля, кадрирует по центру до
 * пропорции слота, ужимает до целевого размера и кладёт .webp в
 * public/images/bs-towers/.
 *
 * Три вещи, которые скрипт делает сам, потому что руками их легко пропустить:
 *  - отрезает чёрные поля, которые Figma оставляет, если рендер не заполнил рамку;
 *  - никогда не растягивает: если исходник меньше слота, отдаёт родное
 *    разрешение в нужной пропорции, а не мыло;
 *  - вырезает из маркетингового листа планировки сам чертёж — без QR-кодов,
 *    логотипов, рендера здания и пустых полей под цену (ТЗ это запрещает).
 *
 * Нужны cwebp (brew install webp) и sips (есть в macOS).
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/images/bs-towers');
const QUALITY = 82;
const PLAN_QUALITY = 90;

/**
 * Слоты страницы. `w`/`h` — размер в пикселях, снятый с живой вёрстки.
 * `plan: true` — чертёж планировки: пропорция любая, обрезаются белые поля.
 */
const SLOTS = [
  { name: 'hero', w: 2560, h: 1600 },
  { name: 'hero-mobile', w: 1200, h: 2000, from: ['hero-mobile', 'hero-moblie'] },
  // Блок «О жилом комплексе» подстраивает высоту под пропорцию рендера
  // (`imageRatio` в bsTowers.js), поэтому здесь пропорция самого кадра.
  { name: 'about', w: 2560, h: 1433 },
  { name: 'feature-parking', w: 1200, h: 1280 },
  { name: 'feature-fitness', w: 1200, h: 612 },
  { name: 'feature-glazing', w: 1200, h: 612 },
  { name: 'location-map', w: 2400, h: 1160 },
  { name: 'place-dina', w: 800, h: 1140 },
  { name: 'place-park', w: 800, h: 1140 },
  { name: 'place-museum', w: 800, h: 1140 },
  { name: 'architecture', w: 2400, h: 1160 },
  { name: 'parking-roof', w: 2560, h: 1600 },
  { name: 'yard-playground', w: 900, h: 1010 },
  { name: 'yard-sport', w: 900, h: 1010 },
  { name: 'yard-lounge', w: 900, h: 1010 },
  { name: 'apartments', w: 2400, h: 1280 },
  // Планировки: имя файла = блок, комнатность и площадь с самого листа,
  // чтобы файл нельзя было перепутать (`plan-7r` — это 4 комнаты, а не 7).
  { name: 'plans/b2-1r-54', from: ['plan-4r'], plan: true },
  { name: 'plans/b2-1r-55', from: ['plan-9r'], plan: true },
  { name: 'plans/b2-2r-78', from: ['plan-5r'], plan: true },
  { name: 'plans/b3-2r-83', from: ['plan-10r'], plan: true },
  { name: 'plans/b2-3r-106', from: ['plan-1r'], plan: true },
  { name: 'plans/b3-3r-106', from: ['plan-6r'], plan: true },
  { name: 'plans/b2-3r-120', from: ['plan-3r'], plan: true },
  { name: 'plans/b3-3r-140', from: ['plan-8r'], plan: true },
  { name: 'plans/b2-4r-146', from: ['plan-2r'], plan: true },
  { name: 'plans/b3-4r-146', from: ['plan-7r'], plan: true },
];

const EXTS = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'webp', 'WEBP'];
const TMP = join(tmpdir(), `bs-towers-${process.pid}.bmp`);

function findSource(dir, slot) {
  for (const base of slot.from ?? [slot.name]) {
    for (const ext of EXTS) {
      const p = join(dir, `${base}.${ext}`);
      if (existsSync(p)) return p;
    }
  }
  return null;
}

function size(file) {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  const w = Number(out.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const h = Number(out.match(/pixelHeight:\s*(\d+)/)?.[1]);
  return { w, h };
}

/** Разбирает изображение в пиксельную выборку через BMP — без внешних зависимостей. */
function readPixels(file) {
  execFileSync('sips', ['-s', 'format', 'bmp', file, '--out', TMP], { stdio: 'ignore' });
  const buf = readFileSync(TMP);
  const offset = buf.readUInt32LE(10);
  const width = buf.readInt32LE(18);
  const rawH = buf.readInt32LE(22);
  const height = Math.abs(rawH);
  const topDown = rawH < 0;
  const bytes = buf.readUInt16LE(28) / 8;
  const stride = Math.floor((bytes * 8 * width + 31) / 32) * 4;
  const sum = (x, y) => {
    const row = topDown ? y : height - 1 - y;
    const o = offset + row * stride + x * bytes;
    return buf[o] + buf[o + 1] + buf[o + 2];
  };
  rmSync(TMP, { force: true });
  return { width, height, sum };
}

/**
 * Границы содержимого. `onWhite` — для чертежей (тёмные линии на белом),
 * иначе для рендеров (изображение на чёрных полях, которые оставляет Figma,
 * когда рендер не заполнил рамку).
 */
function contentBox(file, w, h, onWhite = false) {
  let px;
  try {
    px = readPixels(file);
  } catch {
    return { x: 0, y: 0, w, h };
  }
  const { width, height, sum } = px;
  const filled = onWhite ? (x, y) => sum(x, y) < 705 : (x, y) => sum(x, y) > 72;
  // У чертежа фон идеально белый, поэтому хватает одного тёмного пикселя:
  // иначе тонкие выносные линии в 1–2px не переживают обрезку.
  // У фото фон шумит, там нужна доля пикселей.
  const step = onWhite ? 1 : 2;
  const need = (span) => (onWhite ? 1 : (span / step) * 0.004);
  const colFilled = (x) => {
    let n = 0;
    for (let y = 0; y < height; y += step) if (filled(x, y)) n++;
    return n >= need(height);
  };
  const rowFilled = (y) => {
    let n = 0;
    for (let x = 0; x < width; x += step) if (filled(x, y)) n++;
    return n >= need(width);
  };
  let l = 0, r = width - 1, t = 0, b = height - 1;
  while (l < r && !colFilled(l)) l++;
  while (r > l && !colFilled(r)) r--;
  while (t < b && !rowFilled(t)) t++;
  while (b > t && !rowFilled(b)) b--;
  return { x: l, y: t, w: r - l + 1, h: b - t + 1 };
}

/**
 * Доля почти белых пикселей. Чистый чертёж — это тонкие линии на белом (>0,6).
 * Маркетинговый лист с цветной панелью, логотипом и QR-кодами даёт заметно меньше,
 * и такой лист на сайт ставить нельзя (ТЗ запрещает QR-коды и рекламные надписи).
 */
function whiteShare(file) {
  let px;
  try {
    px = readPixels(file);
  } catch {
    return 1;
  }
  const { width, height, sum } = px;
  let white = 0, total = 0;
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      total++;
      if (sum(x, y) > 705) white++;
    }
  }
  return white / total;
}

function run(src, out, args) {
  mkdirSync(dirname(out), { recursive: true });
  execFileSync('cwebp', [...args, src, '-o', out], { stdio: 'ignore' });
}

const dir = process.argv[2] && resolve(process.argv[2].replace(/^~/, process.env.HOME));
if (!dir || !existsSync(dir)) {
  console.error('Укажите папку с выгрузкой из Figma:');
  console.error('  node scripts/prepare-bs-towers-images.mjs ~/Downloads/bs-towers');
  process.exit(1);
}

let ok = 0;
const missing = [];
const notes = [];
const failed = [];

for (const slot of SLOTS) {
  const src = findSource(dir, slot);
  if (!src) {
    missing.push(slot.name);
    continue;
  }
  const out = join(OUT, `${slot.name}.webp`);
  const { w: sw, h: sh } = size(src);

  if (slot.plan) {
    const white = whiteShare(src);
    if (white < 0.6) {
      // Это не чертёж, а маркетинговый лист: цветная панель, логотип, QR-коды.
      failed.push(`${slot.name}: похоже на маркетинговый лист (только ${Math.round(white * 100)}% белого).` +
        ' Экспортируйте из Figma сам чертёж — QR-коды и рекламные надписи выводить нельзя.');
      continue;
    }
    // Обрезаем белые поля: без них чертёж заметно крупнее в карточке.
    const b = contentBox(src, sw, sh, true);
    const pad = Math.round(Math.min(sw, sh) * 0.015);
    const cx = Math.max(0, b.x - pad);
    const cy = Math.max(0, b.y - pad);
    const cw = Math.min(sw - cx, b.w + pad * 2);
    const ch = Math.min(sh - cy, b.h + pad * 2);
    run(src, out, ['-quiet', '-q', String(PLAN_QUALITY), '-crop', String(cx), String(cy), String(cw), String(ch)]);
    const trim = sw - cw;
    console.log(`  ✓ ${slot.name}.webp  ${sw}x${sh} → ${cw}x${ch}` +
      (trim > 20 ? `  ← срезано ${trim}px белых полей` : ''));
    if (cw < 1000) notes.push(`${slot.name}: чертёж ${cw}px, в увеличенном попапе будет мылить`);
    ok++;
    continue;
  }

  const box = contentBox(src, sw, sh);
  const trimmed = box.w !== sw || box.h !== sh;

  // Кадрируем внутри содержимого до пропорции слота.
  const target = slot.w / slot.h;
  let cw, ch;
  if (box.w / box.h > target) {
    ch = box.h;
    cw = Math.round(box.h * target);
  } else {
    cw = box.w;
    ch = Math.round(box.w / target);
  }
  const cx = box.x + Math.round((box.w - cw) / 2);
  const cy = box.y + Math.round((box.h - ch) / 2);

  // Апскейл запрещён: лучше отдать родное разрешение в нужной пропорции.
  const upscale = cw < slot.w;
  const args = ['-quiet', '-q', String(QUALITY), '-crop', String(cx), String(cy), String(cw), String(ch)];
  if (!upscale) args.push('-resize', String(slot.w), String(slot.h));
  run(src, out, args);

  const lostW = Math.round((1 - cw / box.w) * 100);
  const lostH = Math.round((1 - ch / box.h) * 100);
  const extra = [];
  if (trimmed) extra.push(`срезано пустое поле ${sw - box.w}x${sh - box.h}px`);
  if (lostW > 8 || lostH > 8) extra.push(`обрезано ${lostW}% ширины / ${lostH}% высоты`);
  if (upscale) extra.push(`исходник мал (${cw}px < ${slot.w}px) — оставил родное разрешение`);
  extra.forEach((e) => notes.push(`${slot.name}: ${e}`));

  console.log(`  ✓ ${slot.name}.webp  ${sw}x${sh} → ${upscale ? `${cw}x${ch}` : `${slot.w}x${slot.h}`}` +
    (extra.length ? `  ← ${extra.join('; ')}` : ''));
  ok++;
}

console.log(`\nГотово: ${ok} из ${SLOTS.length}`);
if (failed.length) {
  console.log('\nОтклонено:');
  failed.forEach((f) => console.log(`  ✗ ${f}`));
}
if (notes.length) {
  console.log('\nОбратить внимание:');
  notes.forEach((n) => console.log(`  · ${n}`));
}
if (missing.length) {
  console.log(`\nНе найдено в ${dir}:`);
  missing.forEach((m) => console.log(`  · ${m}`));
}
