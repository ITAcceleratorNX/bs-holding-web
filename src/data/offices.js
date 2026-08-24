function mapEmbed(query) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=ru&z=17&output=embed`;
}

/** Офисы продаж и карты для блока контактов. */
export const OFFICES = [
  {
    city: 'Актау',
    addressKey: 'office.address.aktau',
    address: 'Г Актау, 40 мкр 2, ЖК «Central Park», отдел продаж BS Holding',
    mapQuery: 'Актау 40 мкр 2 Central Park отдел продаж BS Holding',
    mapEmbed: mapEmbed('Актау 40 мкр 2 Central Park отдел продаж BS Holding'),
  },
  {
    city: 'Актобе',
    addressKey: 'office.address.aktobe',
    address: 'Г Актобе, Алтын Орда 11 Б, Отдел продаж BS Holding',
    mapQuery: 'Актобе Алтын Орда 11Б Отдел продаж BS Holding',
    mapEmbed: mapEmbed('Актобе Алтын Орда 11Б Отдел продаж BS Holding'),
  },
  {
    city: 'Усть-Каменогорск',
    addressKey: 'office.address.oskemen',
    address: 'Г Оскемен, Проспект Крылова 66, НП 85',
    mapQuery: 'Оскемен Проспект Крылова 66 НП 85',
    mapEmbed: mapEmbed('Оскемен Проспект Крылова 66 НП 85'),
  },
];
