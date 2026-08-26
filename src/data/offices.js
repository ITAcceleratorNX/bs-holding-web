/** Embed Google Maps по координатам — стабильная метка для всех городов. */
function mapEmbedCoords(lat, lng) {
  return `https://maps.google.com/maps?q=${lat},${lng}&hl=ru&z=17&output=embed`;
}

/** Офисы продаж и карты для блока контактов. */
export const OFFICES = [
  {
    city: 'Актау',
    addressKey: 'office.address.aktau',
    address: 'Г Актау, 40 мкр 2, ЖК «Central Park», отдел продаж BS Holding',
    mapQuery: 'Актау, 40-й микрорайон, 2, ЖК Central Park',
    mapEmbed: mapEmbedCoords(43.687123, 51.14698),
  },
  {
    city: 'Актобе',
    addressKey: 'office.address.aktobe',
    address: 'Г Актобе, Алтын Орда 11 Б, Отдел продаж BS Holding',
    mapQuery: 'Актобе, Алтын Орда 11Б',
    mapEmbed: mapEmbedCoords(50.2784628, 57.1291094),
  },
  {
    city: 'Усть-Каменогорск',
    addressKey: 'office.address.oskemen',
    address: 'Г Оскемен, Проспект Крылова 66, НП 85',
    mapQuery: 'Оскемен, проспект Крылова 66',
    mapEmbed: mapEmbedCoords(49.9459418, 82.6186679),
  },
];
