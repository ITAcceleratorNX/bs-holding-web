#!/usr/bin/env node
/**
 * Показывает, что на странице Avenue Park уже заменено материалом, а что ещё
 * заглушка, и совпадает ли пропорция файла с пропорцией слота.
 *
 *   npm run check:avenue
 *
 * Расхождение пропорции — единственная причина, по которой кадр в слоте с
 * фиксированной пропорцией всё-таки обрежется. Скрипт считает, сколько
 * процентов кадра при этом уйдёт, и советует прогнать
 * `prepare-avenue-park-images.mjs`.
 *
 * Нужен ffprobe (входит в ffmpeg).
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PLACEHOLDER_PROBE, SLOTS, isPlaceholderPixels, ratioLabel } from './avenue-park-slots.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/images/avenue-park');
/** Ниже этого расхождения обрезка не видна глазом. */
const TOLERANCE = 0.02;

function probe(file) {
  const out = execFileSync(
    'ffprobe',
    ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file],
    { encoding: 'utf8' },
  );
  const [w, h] = out.trim().split(',').map(Number);
  const rgb = execFileSync(
    'ffmpeg',
    ['-v', 'error', '-i', file, '-vf', PLACEHOLDER_PROBE, '-frames:v', '1', '-f', 'rawvideo', '-'],
  );
  return { w, h, placeholder: isPlaceholderPixels(rgb) };
}

/**
 * Подпись кадра: 8×8 в градациях серого, каждая клетка — светлее или темнее
 * среднего. Байтовое сравнение здесь бесполезно: один и тот же исходник в двух
 * слотах режется по-разному и даёт разные файлы, а вот подпись у него остаётся
 * почти той же.
 */
function signature(file) {
  const buf = execFileSync(
    'ffmpeg',
    ['-v', 'error', '-i', file, '-vf', 'scale=8:8,format=gray', '-frames:v', '1', '-f', 'rawvideo', '-'],
  );
  const avg = [...buf].reduce((a, v) => a + v, 0) / 64;
  return [...buf].map((v) => (v > avg ? 1 : 0));
}

/** Ниже этого расхождения подписей кадры считаем одним и тем же материалом. */
const SAME_FRAME = 4;

/**
 * Один и тот же кадр в двух слотах — ТЗ это запрещает, а тест по путям такое
 * не ловит: файлы лежат под разными именами. Плоские кадры (`pad`) из сравнения
 * исключены — у заливки подпись ничего не значит.
 */
function duplicates(files) {
  const signed = files.map(({ name, path }) => ({ name, sig: signature(path) }));
  const pairs = [];
  for (let i = 0; i < signed.length; i++) {
    for (let j = i + 1; j < signed.length; j++) {
      const dist = signed[i].sig.reduce((sum, v, k) => sum + (v !== signed[j].sig[k] ? 1 : 0), 0);
      if (dist <= SAME_FRAME) pairs.push([signed[i].name, signed[j].name]);
    }
  }
  return pairs;
}

let filled = 0;
const stubs = [];
const absent = [];
const problems = [];
const real = [];

for (const slot of SLOTS) {
  const file = join(OUT, `${slot.name}.webp`);
  if (!existsSync(file)) {
    absent.push(slot);
    continue;
  }

  const { w, h, placeholder } = probe(file);
  if (placeholder) {
    stubs.push({ slot, w, h });
    continue;
  }
  filled++;
  if (slot.fit !== 'pad') real.push({ name: slot.name, path: file });

  const status = [`${w}×${h}`];
  // `free` подстраивает высоту под файл, `pad` вписывает кадр целиком —
  // обрезки там нет по устройству слота, проверять нечего.
  if (slot.fit === 'cover') {
    const want = slot.w / slot.h;
    const got = w / h;
    const off = Math.abs(got - want) / want;
    if (off > TOLERANCE) {
      const cut = 1 - Math.min(got, want) / Math.max(got, want);
      status.push(`пропорция ${got.toFixed(2)} вместо ${want.toFixed(2)} — обрежется ~${Math.round(cut * 100)}%`);
      problems.push(slot.name);
    }
  }
  if (w < slot.w * 0.75) status.push(`мелковат: ${w}px против ${slot.w}px по слоту`);

  console.log(`  ✓ ${slot.name.padEnd(20)} ${status.join('  ← ')}`);
}

console.log(`\nМатериалом закрыто: ${filled} из ${SLOTS.length}`);

const dupes = duplicates(real);
if (dupes.length) {
  console.log('\nОдин и тот же кадр в разных слотах — ТЗ это запрещает:');
  dupes.forEach(([a, b]) => console.log(`  ✗ ${a} и ${b} — это один и тот же кадр`));
}

if (stubs.length) {
  console.log('\nЕщё заглушки:');
  for (const { slot } of stubs) {
    console.log(`  · ${slot.name.padEnd(20)} ${slot.title}`);
    console.log(`    ${''.padEnd(20)} ${slot.source} · ${slot.w}×${slot.h} · ${ratioLabel(slot)}`);
  }
}
if (absent.length) {
  console.log('\nФайла нет вообще (на странице будет битая картинка):');
  absent.forEach((s) => console.log(`  · ${s.name}.webp`));
}
if (problems.length) {
  console.log('\nПропорция не совпала со слотом — кадр обрежется. Прогоните материалы через скрипт:');
  console.log('  node scripts/prepare-avenue-park-images.mjs <папка с исходниками>');
  console.log(`  затрагивает: ${problems.join(', ')}`);
}

process.exit(absent.length || dupes.length ? 1 : 0);
