import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { AVENUE_PARK } from './avenuePark.js';

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '../../public');

/**
 * Все пути к материалам страницы: слот → файл. Иконки-пиктограммы
 * (`icon-*.svg`) сюда не входят — они векторные и остаются заглушками по
 * замыслу, ТЗ их не касается.
 */
function imagePaths(data) {
  const { hero, about, standards, location, architecture, yard, playground, kids, hall, apartments, boxroom, floorPlans } = data;
  return [
    hero.image,
    hero.imageMobile,
    about.image,
    ...standards.cards.map((c) => c.image),
    location.mapImage,
    ...location.cards.map((c) => c.image),
    architecture.image,
    ...(architecture.gallery ?? []),
    yard.image,
    yard.imageMobile,
    playground.image,
    ...kids.gallery.map((g) => g.image),
    kids.roomImage,
    hall.image,
    ...(hall.gallery ?? []).map((g) => g.image),
    apartments.image,
    ...boxroom.gallery.map((g) => g.image),
    ...floorPlans.items.map((i) => i.image),
  ].filter(Boolean);
}

describe('материалы Avenue Park', () => {
  it('использует только собственные изображения ЖК', () => {
    // ТЗ: изображения других ЖК на странице недопустимы.
    for (const path of imagePaths(AVENUE_PARK)) {
      assert.ok(path.startsWith('/images/avenue-park/'), `${path} — изображение вне материалов Avenue Park`);
    }
  });

  it('не переиспользует один кадр в разных блоках', () => {
    // ТЗ: один и тот же рендер не должен занимать несколько слотов.
    const paths = imagePaths(AVENUE_PARK);
    const seen = new Map();
    const dupes = [];
    for (const p of paths) {
      if (seen.has(p)) dupes.push(p);
      seen.set(p, true);
    }
    assert.deepEqual([...new Set(dupes)], [], 'один и тот же файл занимает несколько слотов');
  });

  it('во всех слотах растровый материал, а не вектор', () => {
    // Оставшийся `.svg` в слоте — это незамененная заглушка старого поколения.
    for (const path of imagePaths(AVENUE_PARK)) {
      assert.match(path, /\.(webp|png|jpg|jpeg)$/, `${path} — не растровый материал`);
    }
  });

  it('все файлы лежат на диске', () => {
    // Битая картинка в проде выглядит хуже заглушки, поэтому проверяем факт
    // наличия файла, а не только правильность пути.
    const absent = imagePaths(AVENUE_PARK).filter((p) => !existsSync(join(PUBLIC, p)));
    assert.deepEqual(absent, [], `не выгружены материалы:\n  ${absent.join('\n  ')}`);
  });

  it('держит первый экран и «Умный замок» в двух кадрах — горизонтальном и вертикальном', () => {
    // Без мобильного кропа широкий кадр на телефоне обрезается до центральной трети.
    assert.ok(AVENUE_PARK.hero.imageMobile, 'нет вертикального кадра первого экрана');
    assert.ok(AVENUE_PARK.yard.imageMobile, 'нет вертикального кадра блока «Умный замок»');
  });
});

describe('планировки Avenue Park', () => {
  const { items } = AVENUE_PARK.floorPlans;

  it('содержит планировки', () => {
    assert.ok(items.length > 0);
  });

  it('берёт чертежи из отдельной папки планировок', () => {
    // ТЗ: планировки только из своей папки, не из общего набора рендеров.
    for (const item of items) {
      assert.match(item.image, /^\/images\/avenue-park\/plans\//, `${item.id}: чертёж лежит не в plans/`);
    }
  });

  it('не повторяет чертежи и id', () => {
    const ids = items.map((i) => i.id);
    const images = items.map((i) => i.image);
    assert.equal(new Set(ids).size, ids.length, 'повторяется id планировки');
    assert.equal(new Set(images).size, images.length, 'один чертёж использован дважды');
  });

  it('размечает каждый лист блоком и этажами — на них держатся фильтры', () => {
    for (const item of items) {
      assert.ok(item.block, `${item.id}: не указан блок`);
      assert.ok(item.floors?.length, `${item.id}: не указаны этажи`);
    }
  });
});
