/**
 * Данные короткой посадочной страницы «Easton — квиз» для рекламного трафика.
 *
 * Отдельная страница (`#/easton-quiz`), не заменяет полную страницу Easton:
 * переиспользует её тексты, изображения и компоненты дизайн-системы, но
 * показывает только часть блоков и заканчивается пятишаговым квизом.
 */

import { EASTON } from './easton';

export const EASTON_QUIZ_LANDING = {
  ...EASTON,
  slug: 'easton-quiz',
  nav: [
    { label: 'Преимущества', href: '#easton-quiz-advantages' },
    { label: 'Локация', href: '#easton-quiz-location' },
    { label: 'Подбор квартиры', href: '#easton-quiz-quiz' },
  ],
  location: {
    ...EASTON.location,
    id: 'easton-quiz-location',
  },
  /** Переопределяет шаги `ProjectApartmentQuiz`: планировка и способ оплаты — по ТЗ. */
  quiz: {
    layouts: [{ value: 'Свободная планировка', label: 'Свободная планировка' }],
    payments: [
      { value: 'Ипотека', label: 'Ипотека' },
      { value: 'Рассрочка', label: 'Рассрочка' },
      { value: 'Полная оплата (100%)', label: 'Полная оплата (100%)' },
    ],
  },
};
