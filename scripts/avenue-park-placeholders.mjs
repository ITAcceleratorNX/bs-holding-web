#!/usr/bin/env node
/**
 * Рисует подписанные заглушки для слотов страницы Avenue Park.
 *
 *   node scripts/avenue-park-placeholders.mjs
 *
 * Каждая заглушка лежит под тем же именем и в той же пропорции, что и будущий
 * материал, и подписана: какой блок, что на кадре, из какой папки взять.
 * Поэтому подставить настоящий кадр = положить файл поверх (или прогнать
 * `prepare-avenue-park-images.mjs`), в коде менять нечего.
 *
 * Скрипт безопасен для повторного запуска: настоящий материал он узнаёт по
 * цвету верхней кромки (`isPlaceholderPixels` в avenue-park-slots.mjs) и не
 * перерисовывает его. `--force` снимает эту проверку.
 *
 * Нужен ffmpeg с libwebp (brew install ffmpeg).
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

import { PLACEHOLDER_PROBE, SLOTS, isPlaceholderPixels, ratioLabel } from './avenue-park-slots.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/images/avenue-park');
const FONT = '/System/Library/Fonts/Supplemental/Arial Unicode.ttf';

const BG = '#22403C';
const FRAME = '#3D615B';
const ACCENT = '#61D0C5';
const TITLE = '#E8F0EF';
const META = '#9FB6B2';

/** Перенос по словам: ffmpeg сам не переносит, длинная строка уедет за край. */
function wrap(text, max) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** drawtext через textfile — так не нужно экранировать двоеточия и кавычки. */
function textFilter(tmp, id, text, { size, color, y }) {
  const file = join(tmp, `${id}.txt`);
  writeFileSync(file, text, 'utf8');
  return `drawtext=fontfile=${FONT}:textfile=${file}:fontcolor=${color}:fontsize=${size}` +
    `:x=(w-text_w)/2:y=${y}`;
}

/** Настоящий материал, уже лежащий в слоте, перерисовывать нельзя. */
function isOurs(file) {
  try {
    return isPlaceholderPixels(
      execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', PLACEHOLDER_PROBE, '-frames:v', '1', '-f', 'rawvideo', '-']),
    );
  } catch {
    return false;
  }
}

const force = process.argv.includes('--force');
const tmp = mkdtempSync(join(tmpdir(), 'ap-placeholder-'));
mkdirSync(OUT, { recursive: true });

let made = 0;
const kept = [];

for (const slot of SLOTS) {
  const out = join(OUT, `${slot.name}.webp`);
  if (!force && existsSync(out) && !isOurs(out)) {
    kept.push(slot.name);
    continue;
  }

  const { w, h } = slot;
  const unit = Math.min(w, h);
  const titleSize = Math.round(unit * 0.062);
  const metaSize = Math.round(unit * 0.035);
  const lineH = Math.round(titleSize * 1.28);

  // Заголовок переносим так, чтобы строка занимала примерно 3/4 ширины кадра.
  const perLine = Math.max(14, Math.round((w * 0.78) / (titleSize * 0.52)));
  const titleLines = wrap(slot.title, perLine);
  const metaLines = [
    `${slot.name}.webp · ${w}×${h} · ${ratioLabel(slot)}`,
    `Источник: ${slot.source}`,
  ];

  const blockSize = Math.round(unit * 0.036);
  const blockLines = wrap(slot.block, Math.max(16, Math.round((w * 0.8) / (blockSize * 0.52))));

  // Блок сверху, заголовок по центру, техданные снизу — вертикаль считаем от центра.
  const titleTop = Math.round(h / 2 - (titleLines.length * lineH) / 2);
  const filters = [
    `drawbox=x=${Math.round(w * 0.035)}:y=${Math.round(h * 0.035)}` +
      `:w=${Math.round(w * 0.93)}:h=${Math.round(h * 0.93)}:color=${FRAME}:t=${Math.max(2, Math.round(unit * 0.004))}`,
  ];

  blockLines.forEach((line, i) =>
    filters.push(textFilter(tmp, `b${slot.name}${i}`, line, {
      size: blockSize,
      color: ACCENT,
      y: Math.round(h * 0.11) + i * Math.round(blockSize * 1.35),
    })),
  );
  titleLines.forEach((line, i) =>
    filters.push(textFilter(tmp, `t${slot.name}${i}`, line, {
      size: titleSize,
      color: TITLE,
      y: titleTop + i * lineH,
    })),
  );
  metaLines.forEach((line, i) =>
    filters.push(textFilter(tmp, `m${slot.name}${i}`, line, {
      size: metaSize,
      color: META,
      y: Math.round(h * 0.82) + i * Math.round(metaSize * 1.4),
    })),
  );

  execFileSync(
    'ffmpeg',
    ['-hide_banner', '-v', 'error', '-f', 'lavfi', '-i', `color=c=${BG}:s=${w}x${h}`,
     '-vf', filters.join(','), '-c:v', 'libwebp', '-quality', '80', '-frames:v', '1', '-y', out],
    { stdio: 'inherit' },
  );
  console.log(`  ✓ ${slot.name}.webp  ${w}×${h}  ${ratioLabel(slot)}`);
  made++;
}

rmSync(tmp, { recursive: true, force: true });

console.log(`\nЗаглушек нарисовано: ${made} из ${SLOTS.length}`);
if (kept.length) {
  console.log('\nУже заменены материалом, не трогал:');
  kept.forEach((n) => console.log(`  · ${n}.webp`));
}
