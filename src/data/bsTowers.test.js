import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { BS_TOWERS } from './bsTowers.js';

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '../../public');

/** Все пути к изображениям страницы, кроме иконок-пиктограмм. */
function imagePaths(data) {
  const { about, standards, location, architecture, yard, kids, apartments, floorPlans, hero } = data;
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
    ...kids.gallery.map((g) => g.image),
    apartments.image,
    ...floorPlans.items.map((i) => i.image),
  ].filter(Boolean);
}

describe('материалы BS Towers', () => {
  it('использует только собственные изображения ЖК', () => {
    for (const path of imagePaths(BS_TOWERS)) {
      assert.ok(
        path.startsWith('/images/bs-towers/'),
        `${path} — изображение вне материалов BS Towers`,
      );
    }
  });

  it('не переиспользует один рендер в разных блоках', () => {
    const paths = imagePaths(BS_TOWERS);
    assert.equal(new Set(paths).size, paths.length, 'один и тот же файл занимает несколько слотов');
  });

  it('заполняет каждый слот страницы', () => {
    // Пустой слот означает незаменённую заглушку — блок уйдёт в прод «дырой».
    for (const path of imagePaths(BS_TOWERS)) {
      assert.match(path, /\.(webp|png|jpg)$/, `${path} — не растровый материал (осталась заглушка?)`);
    }
  });

  it('все файлы лежат на диске', () => {
    // Битая картинка в проде выглядит хуже заглушки, поэтому проверяем факт
    // наличия файла, а не только правильность пути.
    const absent = imagePaths(BS_TOWERS).filter((p) => !existsSync(join(PUBLIC, p)));
    assert.deepEqual(absent, [], `не выгружены материалы:\n  ${absent.join('\n  ')}`);
  });
});

describe('планировки BS Towers', () => {
  const { items } = BS_TOWERS.floorPlans;

  it('содержит планировки', () => {
    assert.ok(items.length > 0);
  });

  it('не повторяет планировки', () => {
    const ids = items.map((i) => i.id);
    const images = items.map((i) => i.image);
    // Две планировки могут совпасть по площади, если они в разных блоках, —
    // это разные решения, а не дубль. Повтором считается совпадение всей тройки.
    const shapes = items.map((i) => `${i.block}|${i.rooms}|${i.area}`);

    assert.equal(new Set(ids).size, ids.length, 'повторяется id планировки');
    assert.equal(new Set(images).size, images.length, 'один чертёж использован дважды');
    assert.equal(new Set(shapes).size, shapes.length, 'повторяется «блок + комнатность + площадь»');
  });

  it('указывает комнатность и площадь в каждой карточке', () => {
    for (const item of items) {
      assert.ok(item.rooms, `${item.id}: не указана комнатность`);
      assert.ok(item.area, `${item.id}: не указана площадь`);
      assert.match(item.area, /^\d+,\d{2} м²$/, `${item.id}: площадь в неожиданном формате`);
      assert.ok(item.name.startsWith(item.rooms.replace(/\D.*/, '')), `${item.id}: комнатности нет в заголовке`);
    }
  });

  it('берёт чертежи из отдельной папки планировок', () => {
    // Маркетинговый лист целиком брать нельзя — на нём QR-коды и логотипы.
    for (const item of items) {
      assert.match(item.image, /^\/images\/bs-towers\/plans\//, `${item.id}: чертёж лежит не в plans/`);
    }
  });

  it('не выводит неподтверждённую цену', () => {
    // ТЗ: неизвестные и неподтверждённые цены на страницу не попадают.
    for (const item of items) {
      if (item.price === undefined) continue;
      assert.ok(item.priceConfirmed !== false, `${item.id}: цена выводится без подтверждения`);
      assert.match(item.price, /₸/, `${item.id}: цена без валюты`);
    }
  });

  it('не осталось карточек-заглушек', () => {
    for (const item of items) {
      assert.ok(!item.placeholder, `${item.id}: карточка всё ещё помечена как заглушка`);
    }
  });
});
