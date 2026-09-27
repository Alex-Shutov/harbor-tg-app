import MockAdapter from 'axios-mock-adapter';
import { http } from '@shared/http';
import { apiClient } from '@shared/api/reduxClient';
import { EWeekDay, ECostLevel, EScheduleType, EReservationType, EAgeRating } from '@shared/constants';
import { EPromoType, ERestrictionType } from '@/entities/promocode/types';
import { EGiveawayStatus, EParticipationType } from '@/entities/giveaway/types';

const img = (seed: string, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

/* ------------------------------------------------------------------ */
/* Shared fixtures                                                    */
/* ------------------------------------------------------------------ */

const mapLocation = (seed: string) => ({
  pointTitle: 'ул. Гаванская, 12',
  latitude: 56.8389 + (seed.length % 5) * 0.01,
  longitude: 60.6057 + (seed.length % 5) * 0.01,
  mapLink: 'https://yandex.ru/maps/?text=Harbor%20City',
});

const openingHours = () => ([
  { weekDay: EWeekDay.MONDAY, from: '10:00:00', till: '23:00:00', open: true, currentDay: false },
  { weekDay: EWeekDay.TUESDAY, from: '10:00:00', till: '23:00:00', open: true, currentDay: false },
  { weekDay: EWeekDay.WEDNESDAY, from: '10:00:00', till: '23:00:00', open: true, currentDay: false },
  { weekDay: EWeekDay.THURSDAY, from: '10:00:00', till: '23:00:00', open: true, currentDay: false },
  { weekDay: EWeekDay.FRIDAY, from: '10:00:00', till: '00:00:00', open: true, currentDay: true },
  { weekDay: EWeekDay.SATURDAY, from: '12:00:00', till: '00:00:00', open: true, currentDay: false },
  { weekDay: EWeekDay.SUNDAY, from: '12:00:00', till: '22:00:00', open: true, currentDay: false },
]);

const sectionsWithImages = (seed: string) => ([
  { id: 1, title: 'Зал', serialNumber: 1, images: [{ id: 1, url: img(`${seed}-hall-1`) }, { id: 2, url: img(`${seed}-hall-2`) }] },
  { id: 2, title: 'Меню', serialNumber: 2, images: [{ id: 3, url: img(`${seed}-menu-1`) }] },
]);

const promoCodesFixture = (objectId: number, objectType: 'establishment' | 'event' | 'leisure', objectTitle: string) => ([
  {
    id: objectId * 10 + 1,
    title: 'Скидка 10% на счёт',
    receivedPromoCodeId: 0,
    description: 'Промокод действует при посещении Harbor City',
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2026-12-31T23:59:59.000Z',
    amount: 10,
    appliedCount: 12,
    receivedCount: 34,
    img: { id: 1, url: img(`promo-${objectId}`) },
    cost: 0,
    type: EPromoType.FREE,
    restrictionType: ERestrictionType.UPON_RECEIPT,
    allowReuse: false,
    useOrGetType: 'CAN_GET' as const,
    objectType,
    objectId,
    objectTitle,
  },
]);

const categoryFixture = (id: number, title: string, inner?: { id: number; title: string; priority: number }[]) => ({
  id,
  title,
  serialNumber: id,
  priority: id,
  innerCategories: inner,
});

/* ------------------------------------------------------------------ */
/* Establishments                                                     */
/* ------------------------------------------------------------------ */

const establishmentCategories = [
  categoryFixture(1, 'Рестораны', [
    { id: 11, title: 'Европейская', priority: 1 },
    { id: 12, title: 'Азиатская', priority: 2 },
  ]),
  categoryFixture(2, 'Кофейни'),
  categoryFixture(3, 'Бары'),
];

const establishmentListItems = [
  { id: 1, title: 'Harbor Kitchen', type: 'FOOD_ESTABLISHMENT', imgUrl: img('kitchen'), serialNumber: 1, categories: [establishmentCategories[0]], promotionExist: true, inFavorites: false, categoryId: 1 },
  { id: 2, title: 'North Bay Coffee', type: 'FOOD_ESTABLISHMENT', imgUrl: img('coffee'), serialNumber: 2, categories: [establishmentCategories[1]], promotionExist: false, inFavorites: true, categoryId: 2 },
  { id: 3, title: 'Anchor Bar', type: 'FOOD_ESTABLISHMENT', imgUrl: img('bar'), serialNumber: 3, categories: [establishmentCategories[2]], promotionExist: false, inFavorites: false, categoryId: 3 },
  { id: 4, title: 'Lighthouse Bistro', type: 'FOOD_ESTABLISHMENT', imgUrl: img('bistro'), serialNumber: 4, categories: [establishmentCategories[0]], promotionExist: true, inFavorites: false, categoryId: 1 },
  { id: 5, title: 'Pier Coffee Roasters', type: 'FOOD_ESTABLISHMENT', imgUrl: img('roasters'), serialNumber: 5, categories: [establishmentCategories[1]], promotionExist: false, inFavorites: false, categoryId: 2 },
];

const groupByCategory = <T extends { categoryId: number }>(items: T[]) => {
  const result: Record<number, T[]> = {};
  items.forEach((item) => {
    result[item.categoryId] = result[item.categoryId] || [];
    result[item.categoryId].push(item);
  });
  return result;
};

const buildEstablishmentDetail = (id: number) => {
  const base = establishmentListItems.find((item) => item.id === id) ?? establishmentListItems[0];
  return {
    id: base.id,
    title: base.title,
    description: 'Уютное место в самом сердце Harbor City с авторской кухней и атмосферой гостеприимства.',
    rating: 4.7,
    costLevel: ECostLevel.THREE,
    inFavorites: base.inFavorites,
    mainImg: { id: 1, url: base.imgUrl },
    menu: { id: 1, url: img(`menu-${base.id}`) },
    sectionsWithImages: sectionsWithImages(`est-${base.id}`),
    categories: base.categories,
    openingHours: openingHours(),
    promoCodes: promoCodesFixture(base.id, 'establishment', base.title),
    mapLocation: mapLocation(base.title),
    review: { id: 1, title: 'Отзыв гостя', content: 'Прекрасное место, обязательно вернёмся снова!', videoUrl: '', img: { id: 1, url: img(`review-${base.id}`) } },
    events: [],
    averageBill: 1800,
    hasBreakfasts: true,
    hasBusinessLunches: true,
    hasDelivery: false,
    hasParking: true,
    hasCatering: true,
    hasBanquets: false,
    phoneNumbers: ['+7 (900) 123-45-67'],
    webSiteLink: 'https://harbor.city',
    reservationTypeEnum: EReservationType.BY_PHONE,
    needMessageAfterSuccessBid: false,
    needBidBeforeField: false,
    messageAfterSuccessBid: '',
    canBookSomeTables: false,
    partnersLinkForReserve: '',
  };
};

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

const eventCategories = [
  categoryFixture(1, 'Концерты'),
  categoryFixture(2, 'Кино'),
  categoryFixture(3, 'Выставки'),
];

const eventListItems = [
  { id: 1, title: 'Джазовый вечер в Harbor Hall', imgUrl: img('jazz'), serialNumber: 1, categories: [eventCategories[0]], promotionExist: true, inFavorites: false, categoryId: 1, type: EScheduleType.DATE_TIME, dateTime: '2026-08-10T19:00:00.000Z', ageRating: EAgeRating.SIX },
  { id: 2, title: 'Ретроспектива Harbor Film Fest', imgUrl: img('film'), serialNumber: 2, categories: [eventCategories[1]], promotionExist: false, inFavorites: true, categoryId: 2, type: EScheduleType.PERIOD, startDate: '2026-08-01T00:00:00.000Z', endDate: '2026-08-15T00:00:00.000Z', ageRating: EAgeRating.TWELVE },
  { id: 3, title: 'Выставка «Огни залива»', imgUrl: img('expo'), serialNumber: 3, categories: [eventCategories[2]], promotionExist: false, inFavorites: false, categoryId: 3, type: EScheduleType.WORKING_HOURS, openingHours: openingHours(), ageRating: EAgeRating.ZERO },
];

const buildEventDetail = (id: number) => {
  const base = eventListItems.find((item) => item.id === id) ?? eventListItems[0];
  return {
    id: base.id,
    title: base.title,
    description: 'Незабываемое событие в атмосфере Harbor City — соберите друзей и приходите!',
    rating: 4.8,
    inFavorites: base.inFavorites,
    serialNumber: base.serialNumber,
    mainImg: { id: 1, url: base.imgUrl },
    sectionsWithImages: sectionsWithImages(`event-${base.id}`),
    categories: base.categories,
    type: base.type,
    dateTime: base.dateTime,
    startDate: base.startDate,
    endDate: base.endDate,
    openingHours: base.openingHours,
    promoCodes: promoCodesFixture(base.id, 'event', base.title),
    mapLocation: mapLocation(base.title),
    mapPoint: { addressTitle: 'наб. Причальная, 5', latitude: 56.8412, longitude: 60.6098 },
    review: undefined,
    phoneNumbers: ['+7 (900) 765-43-21'],
    webSiteLink: 'https://harbor.city/events',
    ageRating: base.ageRating,
    establishments: [],
    leisure: [],
  };
};

/* ------------------------------------------------------------------ */
/* Leisure                                                             */
/* ------------------------------------------------------------------ */

const leisureCategories = [
  categoryFixture(1, 'Активный отдых'),
  categoryFixture(2, 'СПА и релакс'),
  categoryFixture(3, 'Развлечения'),
];

const leisureListItems = [
  { id: 1, title: 'Harbor Climbing Gym', imgUrl: img('climb'), serialNumber: 1, categories: [leisureCategories[0]], promotionExist: true, inFavorites: false, categoryId: 1 },
  { id: 2, title: 'Bay Spa & Wellness', imgUrl: img('spa'), serialNumber: 2, categories: [leisureCategories[1]], promotionExist: false, inFavorites: true, categoryId: 2 },
  { id: 3, title: 'Harbor Bowling Club', imgUrl: img('bowling'), serialNumber: 3, categories: [leisureCategories[2]], promotionExist: false, inFavorites: false, categoryId: 3 },
];

const buildLeisureDetail = (id: number) => {
  const base = leisureListItems.find((item) => item.id === id) ?? leisureListItems[0];
  return {
    id: base.id,
    title: base.title,
    description: 'Отличный способ провести время активно и с удовольствием в Harbor City.',
    rating: 4.6,
    inFavorites: base.inFavorites,
    serialNumber: base.serialNumber,
    mainImg: { id: 1, url: base.imgUrl },
    sectionsWithImages: sectionsWithImages(`leisure-${base.id}`),
    categories: base.categories,
    type: EScheduleType.WORKING_HOURS,
    openingHours: openingHours(),
    promoCodes: promoCodesFixture(base.id, 'leisure', base.title),
    mapLocation: mapLocation(base.title),
    averageBill: 1500,
    hasBreakfasts: false,
    hasBusinessLunches: false,
    hasDelivery: false,
    hasParking: true,
    hasCatering: false,
    hasBanquets: false,
    review: undefined,
    events: [],
    reservationTypeEnum: EReservationType.NONE,
    phoneNumbers: ['+7 (900) 111-22-33'],
    webSiteLink: 'https://harbor.city/leisure',
    externalBookUrl: '',
  };
};

/* ------------------------------------------------------------------ */
/* Shop / cart (stateful)                                              */
/* ------------------------------------------------------------------ */

const storeItems = [
  { id: 1, title: 'Кружка Harbor', description: 'Керамическая кружка с логотипом Harbor City', mainImage: { id: 1, url: img('mug') }, additionalImages: [], status: 'ACTIVE' as const, type: 'PRODUCT' as const, cost: 500, availableQuantity: 20, onePerHand: false, pickupLocation: 'Стойка ресепшн Harbor City', contactUsername: '@harbor_support' },
  { id: 2, title: 'Худи Harbor', description: 'Тёплое худи с вышивкой Harbor City', mainImage: { id: 2, url: img('hoodie') }, additionalImages: [], status: 'ACTIVE' as const, type: 'PRODUCT' as const, cost: 2500, availableQuantity: 10, onePerHand: true, pickupLocation: 'Стойка ресепшн Harbor City', contactUsername: '@harbor_support' },
  { id: 3, title: 'Промокод «-10% на счёт»', description: 'Промокод на скидку в заведениях-партнёрах', mainImage: { id: 3, url: img('promo-store') }, additionalImages: [], status: 'ACTIVE' as const, type: 'PROMO_CODE' as const, cost: 300, availableQuantity: 50, onePerHand: false, code: 'HARBOR10', amount: 10, objectType: 'ESTABLISHMENT', objectId: 1, objectTitle: 'Harbor Kitchen', startDate: '2026-01-01T00:00:00.000Z', endDate: '2026-12-31T23:59:59.000Z', allowReuse: false, useOrGetType: 'CAN_USE' },
];

interface MockCartItem {
  cartItemId: number;
  item: typeof storeItems[number];
  quantity: number;
  available: boolean;
}

let cartItems: MockCartItem[] = [];
let nextCartItemId = 1;
let userBalance = 3200;

const buildCartResponse = () => ({
  items: cartItems,
  totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
  unavailableItems: [],
  unavailableItemsCount: 0,
});

/* ------------------------------------------------------------------ */
/* Favorites                                                           */
/* ------------------------------------------------------------------ */

const favoriteCategories = [
  { id: 1, title: 'Рестораны', serialNumber: 1 },
  { id: 2, title: 'Мероприятия', serialNumber: 2 },
];

/* ------------------------------------------------------------------ */
/* Giveaway / referral / transactions                                  */
/* ------------------------------------------------------------------ */

const mockGiveaways = {
  active: [{
    id: 1,
    status: EGiveawayStatus.ACTIVE,
    title: 'Розыгрыш ужина на двоих',
    description: 'Участвуйте и получите шанс выиграть ужин в Harbor Kitchen',
    participationType: EParticipationType.CHANNEL_SUBSCRIPTION,
    participationCost: 0,
    channels: [{ title: 'Harbor City', url: 'https://t.me/harbor_city_demo', code: 'harbor_city_demo', imgUrl: img('channel-1', 100, 100), isSubscribed: false }],
    participantsLimit: 500,
    participantsCount: 128,
    winnersCount: 1,
    image: { id: 1, url: img('giveaway-1') },
    startDateTime: '2026-07-01T00:00:00.000Z',
    endDateTime: '2026-08-31T23:59:59.000Z',
    isParticipant: false,
    isWinner: false,
  }],
  participating: [],
  completed: [{
    id: 2,
    status: EGiveawayStatus.COMPLETED,
    title: 'Розыгрыш худи Harbor',
    description: 'Розыгрыш завершён, поздравляем победителей!',
    participationType: EParticipationType.POINTS,
    participationCost: 50,
    channels: [],
    participantsLimit: 200,
    participantsCount: 200,
    winnersCount: 2,
    image: { id: 2, url: img('giveaway-2') },
    startDateTime: '2026-06-01T00:00:00.000Z',
    endDateTime: '2026-06-30T23:59:59.000Z',
    isParticipant: true,
    isWinner: false,
    winners: [{ username: 'harbor_fan', serialNumber: 1 }, { username: 'city_lover', serialNumber: 2 }],
  }],
  prizes: [],
};

const mockReferralInfo = {
  isActive: true,
  rewardAmount: 100,
  earnedAmount: 300,
  userHash: 'mock-referral-hash',
  invitedCount: 3,
  referrals: [
    { username: 'harbor_friend_1', joinedAt: '2026-06-01T00:00:00.000Z', status: 'ACCRUED' as const },
    { username: 'harbor_friend_2', joinedAt: '2026-06-10T00:00:00.000Z', status: 'UNDER_REVIEW' as const },
  ],
};

const mockTransactions = [
  { id: 1, dateTime: '2026-07-20T10:00:00.000Z', title: 'Начисление за подписку', description: 'Бонус за подписку на Harbor City', amount: 100, direction: 'INCREASE' as const },
  { id: 2, dateTime: '2026-07-18T15:30:00.000Z', title: 'Покупка в магазине', description: 'Кружка Harbor', amount: 500, direction: 'DECREASE' as const },
];

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

const mockOrders = [
  {
    id: 1,
    createdAt: '2026-07-15T10:00:00.000Z',
    updatedAt: '2026-07-15T10:00:00.000Z',
    status: 'COMPLETED' as const,
    items: [{ cartItemId: 1001, item: storeItems[0], quantity: 1, available: true }],
    type: 'PRODUCT' as const,
    totalAmount: 500,
    pickupLocation: 'Стойка ресепшн Harbor City',
    contactUsername: '@harbor_support',
  },
];

/* ------------------------------------------------------------------ */
/* Promo codes (profile)                                               */
/* ------------------------------------------------------------------ */

const mockPromoCodesResponse = {
  active: promoCodesFixture(1, 'establishment', 'Harbor Kitchen'),
  completed: [],
  used: [],
};

/* ------------------------------------------------------------------ */
/* Registration                                                        */
/* ------------------------------------------------------------------ */

const getQueryParam = (url: string | undefined, key: string): string | null => {
  if (!url) return null;
  const query = url.split('?')[1];
  if (!query) return null;
  return new URLSearchParams(query).get(key);
};

const registerMocks = (mock: MockAdapter) => {
  /* Auth / subscription / captcha */
  mock.onPost('/authentication').reply(200, {
    sessionId: 'mock-session',
    hasChatId: true,
    captchaRequiredForLogin: false,
    captchaRequiredForTask: false,
    captchaRequiredForGiveaway: false,
    captchaRequiredForBookingTelegram: false,
    captchaRequiredForWaitingListTelegram: false,
  });
  mock.onGet('/authentication').reply(200, { sessionId: 'mock-session', hasChatId: true });
  mock.onGet('/subscription/check').reply(200, { subscribeOnChannel: true });
  mock.onGet('/authentication/captcha/requirement').reply(200, {
    captchaRequiredForLogin: false,
    captchaRequiredForTask: false,
    captchaRequiredForGiveaway: false,
    captchaRequiredForBookingTelegram: false,
    captchaRequiredForWaitingListTelegram: false,
  });
  mock.onGet(/\/food\/establishments\/\d+\/captcha\/requirement/).reply(200, {
    captchaRequiredForBooking: false,
    captchaRequiredForWaitingList: false,
  });

  /* Main showcase */
  mock.onGet('/main/showcase').reply(200, {
    establishments: establishmentListItems.slice(0, 3).map((item) => ({ ...item, urbanboxExist: false })),
    leisure: leisureListItems.slice(0, 2).map((item) => ({ ...item, isPromotionExist: item.promotionExist })),
    events: eventListItems.slice(0, 2),
    generatedAt: new Date().toISOString(),
  });
  mock.onGet('/main/selections').reply(200, {
    selections: [
      { id: 1, title: 'Лучшее в Harbor City', priority: 1, imgUrl: img('collection-main-1') },
      { id: 2, title: 'Новинки недели', priority: 2, imgUrl: img('collection-main-2') },
    ],
  });
  mock.onGet('/main/banners').reply(200, {
    sliders: [
      { id: 1, imgUrl: img('banner-main-1', 1200, 400), linkToFollow: '/establishments', serialNumber: 1 },
      { id: 2, imgUrl: img('banner-main-2', 1200, 400), linkToFollow: '/events', serialNumber: 2 },
    ],
  });
  mock.onGet('/main/search').reply((config) => {
    const searchValue = String(config.params?.searchValue ?? '').toLowerCase();
    const matches = (title: string) => !searchValue || title.toLowerCase().includes(searchValue);
    return [200, {
      establishments: establishmentListItems.filter((item) => matches(item.title)).map((item) => ({ ...item, urbanboxExist: false })),
      leisure: leisureListItems.filter((item) => matches(item.title)).map((item) => ({ ...item, isPromotionExist: item.promotionExist })),
      events: eventListItems.filter((item) => matches(item.title)),
      generatedAt: new Date().toISOString(),
    }];
  });

  /* Establishments */
  mock.onGet('/food/establishments/categories/all').reply(200, { categories: establishmentCategories });
  mock.onGet('/food/establishments/selections/all').reply(200, {
    selections: [{ id: 1, title: 'Гастрономия Harbor City', imgUrl: img('collection-est-1') }],
  });
  mock.onGet('/food/establishments/slider/content').reply(200, {
    sliders: [{ id: 1, imgUrl: img('banner-est-1', 1200, 400), linkToFollow: '/establishments/1', serialNumber: 1 }],
  });
  mock.onPost(/\/food\/establishments\/slider\/capture\/user\/click/).reply(200, {});
  mock.onGet('/food/establishments/find').reply((config) => {
    const categoryId = Number(config.params?.categoryId ?? 0);
    return [200, establishmentListItems.filter((item) => item.categoryId === categoryId)];
  });
  mock.onGet('/food/establishments/find/for/all/categories').reply(200, groupByCategory(establishmentListItems));
  mock.onGet(/\/food\/establishments\/get/).reply((config) => {
    const id = Number(getQueryParam(config.url, 'id') ?? 1);
    return [200, buildEstablishmentDetail(id)];
  });
  mock.onPost(/\/food\/establishments\/check\/\d+\/promo\/code/).reply(200, { success: true });
  mock.onPost('/food/establishments/receive/or/buy/promo/code').reply((config) => {
    const id = Number(config.params?.id ?? 1);
    return [200, buildEstablishmentDetail(id)];
  });

  /* Events */
  mock.onGet('/event/categories/all').reply(200, { categories: eventCategories });
  mock.onGet('/event/selections/all').reply(200, {
    selections: [{ id: 2, title: 'События Harbor City', imgUrl: img('collection-event-1') }],
  });
  mock.onGet('/event/slider/content').reply(200, {
    sliders: [{ id: 2, imgUrl: img('banner-event-1', 1200, 400), linkToFollow: '/events/1', serialNumber: 1 }],
  });
  mock.onPost(/\/event\/slider\/capture\/user\/click/).reply(200, {});
  mock.onGet('/event/find').reply((config) => {
    const categoryId = Number(config.params?.categoryId ?? 0);
    return [200, eventListItems.filter((item) => item.categoryId === categoryId)];
  });
  mock.onGet('/event/find/for/all/categories').reply(200, groupByCategory(eventListItems));
  mock.onGet(/\/event\/get/).reply((config) => {
    const id = Number(getQueryParam(config.url, 'id') ?? 1);
    return [200, buildEventDetail(id)];
  });
  mock.onPost(/\/events\/check\/\d+\/promo\/code/).reply(200, { success: true });
  mock.onPost('/event/receive/or/buy/promo/code').reply((config) => {
    const id = Number(config.params?.id ?? 1);
    return [200, buildEventDetail(id)];
  });

  /* Leisure */
  mock.onGet('/leisure/categories/all').reply(200, { categories: leisureCategories });
  mock.onGet('/leisure/selections/all').reply(200, {
    selections: [{ id: 3, title: 'Досуг Harbor City', imgUrl: img('collection-leisure-1') }],
  });
  mock.onGet('/leisure/slider/content').reply(200, {
    sliders: [{ id: 3, imgUrl: img('banner-leisure-1', 1200, 400), linkToFollow: '/leisure/1', serialNumber: 1 }],
  });
  mock.onPost(/\/leisure\/slider\/capture\/user\/click/).reply(200, {});
  mock.onGet('/leisure/find').reply((config) => {
    const categoryId = Number(config.params?.categoryId ?? 0);
    return [200, leisureListItems.filter((item) => item.categoryId === categoryId)];
  });
  mock.onGet('/leisure/find/for/all/categories').reply(200, groupByCategory(leisureListItems));
  mock.onGet(/\/leisure\/get/).reply((config) => {
    const id = Number(getQueryParam(config.url, 'id') ?? 1);
    return [200, buildLeisureDetail(id)];
  });
  mock.onPost(/\/leisures\/check\/\d+\/promo\/code/).reply(200, { success: true });
  mock.onPost('/leisure/receive/or/buy/promo/code').reply((config) => {
    const id = Number(config.params?.id ?? 1);
    return [200, buildLeisureDetail(id)];
  });

  /* Favorites */
  mock.onGet('/account/favorite/categories').reply(200, favoriteCategories);
  mock.onGet('/account/favorite/find').reply((config) => {
    const categoryType = config.params?.categoryType;
    const categoryId = Number(config.params?.categoryId ?? 0);
    if (categoryType === 'EVENT') return [200, eventListItems.filter((item) => item.inFavorites)];
    if (categoryType === 'LEISURE') return [200, leisureListItems.filter((item) => item.inFavorites)];
    return [200, establishmentListItems.filter((item) => item.inFavorites && (!categoryId || item.categoryId === categoryId))];
  });
  mock.onGet('/account/favorite/find/for/all/categories').reply(200, {
    favoriteEstablishments: groupByCategory(establishmentListItems.filter((item) => item.inFavorites)),
    favoriteEvents: groupByCategory(eventListItems.filter((item) => item.inFavorites)),
    favoriteLeisure: groupByCategory(leisureListItems.filter((item) => item.inFavorites)),
  });

  /* Shop / cart / orders */
  mock.onGet(/\/account\/store\/list/).reply((config) => {
    const type = getQueryParam(config.url, 'type');
    const items = type ? storeItems.filter((item) => item.type === type) : storeItems;
    return [200, { items }];
  });
  mock.onGet('/account/cart/info').reply(200, buildCartResponse());
  mock.onPost('/account/cart/add').reply((config) => {
    const body = JSON.parse(config.data ?? '{}');
    const storeItem = storeItems.find((item) => item.id === body.itemId);
    if (!storeItem) return [404, { message: 'Товар не найден' }];
    const existing = cartItems.find((cartItem) => cartItem.item.id === storeItem.id);
    if (existing) {
      existing.quantity += body.quantity ?? 1;
    } else {
      cartItems.push({ cartItemId: nextCartItemId++, item: storeItem, quantity: body.quantity ?? 1, available: true });
    }
    return [200, buildCartResponse()];
  });
  mock.onDelete('/account/cart/remove').reply((config) => {
    const body = JSON.parse(config.data ?? '{}');
    cartItems = cartItems.filter((cartItem) => cartItem.cartItemId !== body.cartItemId);
    return [200, buildCartResponse()];
  });
  mock.onPut('/account/cart/decrease').reply((config) => {
    const body = JSON.parse(config.data ?? '{}');
    const existing = cartItems.find((cartItem) => cartItem.cartItemId === body.cartItemId);
    if (existing) {
      existing.quantity -= body.decreaseBy ?? 1;
      if (existing.quantity <= 0) {
        cartItems = cartItems.filter((cartItem) => cartItem.cartItemId !== body.cartItemId);
      }
    }
    return [200, buildCartResponse()];
  });
  mock.onPost('/account/order/create').reply((config) => {
    const body = JSON.parse(config.data ?? '{}');
    const orderedItems = cartItems.filter((cartItem) => body.cartItemIds?.includes(cartItem.cartItemId));
    const totalAmount = orderedItems.reduce((sum, cartItem) => sum + (cartItem.item.cost ?? 0) * cartItem.quantity, 0);
    userBalance = Math.max(0, userBalance - totalAmount);
    cartItems = cartItems.filter((cartItem) => !body.cartItemIds?.includes(cartItem.cartItemId));
    return [200, { success: true }];
  });
  mock.onGet(/\/account\/order\/list/).reply(200, mockOrders);
  mock.onPost(/\/account\/order\/\d+\/cancel/).reply(200, {});

  /* Bonuses / transfer / balance */
  mock.onGet('/user/info').reply(() => [200, { urbanBonusBalance: userBalance }]);
  mock.onGet('/account/transactions').reply(200, mockTransactions);
  mock.onGet('/transaction/payment/users').reply(200, [
    { id: 1, tag: 'harbor_friend', username: 'harbor_friend' },
    { id: 2, tag: 'city_lover', username: 'city_lover' },
  ]);
  mock.onGet('/transaction/payment/commison').reply(200, 5);
  mock.onPost('/transaction/payment/user').reply((config) => {
    const body = JSON.parse(config.data ?? '{}');
    userBalance = Math.max(0, userBalance - (Number(body.amount) || 0));
    return [200, { success: true, message: 'Перевод выполнен успешно', newBalance: userBalance }];
  });

  /* Giveaway / referral */
  mock.onGet('/account/giveaway/list').reply(200, mockGiveaways);
  mock.onPost('/account/giveaway/participate').reply(200, {
    success: true,
    message: 'Вы участвуете в розыгрыше',
    telegramGiveawayDetailedInfoDto: { ...mockGiveaways.active[0], isParticipant: true },
  });
  mock.onGet('/account/task/referral-system').reply(200, mockReferralInfo);

  /* Promo codes (profile) */
  mock.onGet('/account/promo/code/find').reply(200, mockPromoCodesResponse);
  mock.onGet('/account/promo/code/categories').reply(200, {
    establishments: [establishmentCategories[0]],
    events: [eventCategories[0]],
    leisure: [leisureCategories[0]],
  });
  mock.onPost('/account/promo/code/use').reply(200, { success: true });
};

let mocksInitialized = false;

export const setupMocks = () => {
  if (mocksInitialized) return;
  if (import.meta.env.VITE_USE_MOCKS !== 'true') return;

  const httpMock = new MockAdapter(http, { delayResponse: 400 });
  const apiClientMock = new MockAdapter(apiClient, { delayResponse: 400 });

  registerMocks(httpMock);
  registerMocks(apiClientMock);

  mocksInitialized = true;
};
