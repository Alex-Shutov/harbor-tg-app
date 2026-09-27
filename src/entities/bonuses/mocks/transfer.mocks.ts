// import {
//   IApiUserTag,
//   IApiTransferBonusesRequest,
//   ITransferBonusesResponse,
// } from '../types/transfer.types';
//
// export const mockUserTags: IApiUserTag[] = [
//   { id: 1, tag: 'goodman', username: 'goodman' },
//   { id: 2, tag: 'goodman2', username: 'goodman2' },
//   { id: 3, tag: 'goodman3', username: 'goodman3' },
//   { id: 4, tag: 'goodman4', username: 'goodman4' },
//   { id: 5, tag: 'goodman5', username: 'goodman5' },
//   { id: 6, tag: 'goodman6', username: 'goodman6' },
//   { id: 7, tag: 'user123', username: 'user123' },
//   { id: 8, tag: 'testuser', username: 'testuser' },
// ];
//
// export const mockTransferBonuses = (
//   request: IApiTransferBonusesRequest
// ): ITransferBonusesResponse => {
//   // Проверяем, существует ли тег
//   const userExists = mockUserTags.some(
//     (tag) => tag.tag.toLowerCase() === request.recipientTag.toLowerCase()
//   );
//
//   if (!userExists) {
//     return {
//       success: false,
//       message: 'Пользователь с таким тегом не найден',
//     };
//   }
//
//   // Проверяем, что сумма больше 0
//   if (request.amount <= 0) {
//     return {
//       success: false,
//       message: 'Сумма должна быть больше нуля',
//     };
//   }
//
//   // Симулируем успешный перевод
//   return {
//     success: true,
//     message: 'Перевод выполнен успешно!',
//     newBalance: 1100, // Пример нового баланса
//   };
// };
//
//
