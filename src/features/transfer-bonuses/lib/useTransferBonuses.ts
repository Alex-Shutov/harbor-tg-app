import { useState, useCallback, useEffect } from 'react';
import {
  useLazySearchUserTagsQuery,
  useTransferBonusesMutation,
  useGetComissionQuery
} from '@/entities/bonuses';
import { IToastState } from '@/entities/promocode/types';
import { IUserTag } from '@/entities/bonuses/types';

export const useTransferBonuses = (userBalance: number) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
  }>({
    isOpen: false,
  });

  const [confirmationModalState, setConfirmationModalState] = useState<{
    isOpen: boolean;
  }>({
    isOpen: false,
  });

  const [recipientTag, setRecipientTag] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedRecipient, setSelectedRecipient] = useState<IUserTag | null>(null);
  const [suggestedTags, setSuggestedTags] = useState<IUserTag[]>([]);
  const [isTagInputFocused, setIsTagInputFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');

  const [searchUserTags, { isLoading: isSearchingTags }] = useLazySearchUserTagsQuery();
  const [transferBonuses, { isLoading: isTransferring }] = useTransferBonusesMutation();
  const {data:comission} = useGetComissionQuery();

  const [toastState, setToastState] = useState<IToastState>({
    isVisible: false,
    title: '',
    description: '',
  });

  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Дебаунс для поиска тегов
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Поиск тегов при изменении debouncedSearchQuery
  useEffect(() => {
    if (debouncedSearchQuery.trim().length > 0 && isTagInputFocused) {
      searchUserTags(debouncedSearchQuery)
        .unwrap()
        .then((tags) => {
          setSuggestedTags(tags);
        })
        .catch(() => {
          setSuggestedTags([]);
        });
    } else {
      setSuggestedTags([]);
    }
  }, [debouncedSearchQuery, isTagInputFocused, searchUserTags]);

  const openModal = useCallback(() => {
    setModalState({ isOpen: true });
    setRecipientTag('');
    setAmount('');
    setDescription('');
    setSelectedRecipient(null);
    setSuggestedTags([]);
    setIsTagInputFocused(false);
    setSearchQuery('');
    setConfirmationModalState({ isOpen: false });
    setShowValidationErrors(false);
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ isOpen: false });
    setRecipientTag('');
    setAmount('');
    setDescription('');
    setSelectedRecipient(null);
    setSuggestedTags([]);
    setIsTagInputFocused(false);
    setSearchQuery('');
    setConfirmationModalState({ isOpen: false });
    setShowValidationErrors(false);
  }, []);

  const openConfirmationModal = useCallback(() => {
    setModalState({ isOpen: false });
    setConfirmationModalState({ isOpen: true });
  }, []);

  const closeConfirmationModal = useCallback(() => {
    setConfirmationModalState({ isOpen: false });
  }, []);

  const handleDescriptionChange = useCallback((value: string) => {
    setDescription(value);
  }, []);

  const handleTagInputChange = useCallback((value: string) => {
    setRecipientTag(value);
    setSearchQuery(value);
    setSelectedRecipient(null);
    // Скрываем ошибку валидации при начале ввода
    if (showValidationErrors && value.trim()) {
      setShowValidationErrors(false);
    }
  }, [showValidationErrors]);

  const handleTagInputFocus = useCallback(() => {
    setIsTagInputFocused(true);
  }, []);

  const handleTagInputBlur = useCallback(() => {
    setTimeout(() => {
      setIsTagInputFocused(false);
    }, 200);
  }, []);

  const handleSelectRecipient = useCallback((tag: IUserTag) => {
    setSelectedRecipient(tag);
    setRecipientTag(tag.tag);
    setSearchQuery(tag.tag);
    setSuggestedTags([]);
    setIsTagInputFocused(false);
  }, []);

  const handleAmountChange = useCallback((value: string) => {
    // Разрешаем только цифры
    const numericValue = value.replace(/[^\d]/g, '');
    setAmount(numericValue);
  }, []);

  const handleNumberPadClick = useCallback((value: string) => {
    // NumberPad используется только для ввода суммы
    handleAmountChange(amount + value);
    // Скрываем ошибку валидации при начале ввода суммы
    if (showValidationErrors && Number(amount + value) > 0) {
      setShowValidationErrors(false);
    }
  }, [amount, handleAmountChange, showValidationErrors]);

  const handleBackspace = useCallback(() => {
    // Backspace используется только для суммы
    setAmount((prev) => prev.slice(0, -1));
  }, []);

  const showSuccessToast = useCallback((message: string) => {
    setToastState({
      isVisible: true,
      type: 'success',
      title: 'Перевод выполнен!',
      description: message,
      icon: '/subscribe-confirmed.gif',
      showCloseButton: true,
      duration: 3000,
    });
  }, []);

  const showErrorToast = useCallback((message: string) => {
    setToastState({
      isVisible: true,
      type: 'error',
      icon: '/empty.gif',
      title: 'Ошибка',
      description: message,
      showCloseButton: true,
      duration: 0,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const handleTransfer = useCallback(() => {
    const MIN_TRANSFER_AMOUNT = 10;
    const amountNumber = Number(amount) || 0;
    const hasRecipient = selectedRecipient || recipientTag.trim();
    const hasAmount = amountNumber > 0;
    const hasEnoughBalance = amountNumber <= userBalance;
    const hasMinAmount = amountNumber >= MIN_TRANSFER_AMOUNT;

    if (!hasRecipient || !hasAmount || !hasEnoughBalance || !hasMinAmount) {
      setShowValidationErrors(true);
      return;
    }

    setShowValidationErrors(false);
    openConfirmationModal();
  }, [selectedRecipient, recipientTag, amount, userBalance, openConfirmationModal]);

  const handleConfirmTransfer = useCallback(async () => {
    if (!selectedRecipient && !recipientTag.trim()) {
      showErrorToast('Введите тег получателя');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      showErrorToast('Введите сумму для перевода');
      return;
    }

    if (Number(amount) > userBalance) {
      showErrorToast('Недостаточно бонусов для перевода');
      return;
    }


    try {
      const result = await transferBonuses({
        recipientTag: selectedRecipient?.tag || recipientTag.trim(),
        amount: Number(amount),
        description: description === '' ? '⠀' : description.trim(),
      }).unwrap();
      if (result.status === 'SUCCESS') {
        showSuccessToast(result.message || 'Перевод выполнен успешн!');
        closeConfirmationModal();
        closeModal();
      } else {
        showErrorToast(result.message || 'Ошибка при переводе бонусов');
      }
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.error?.data?.message || 'Не удалось выполнить перевод';
      showErrorToast(errorMsg);
    }
  }, [selectedRecipient, recipientTag, amount, description, userBalance, transferBonuses, showSuccessToast, showErrorToast, closeConfirmationModal, closeModal]);

  return {
    modalState,
    confirmationModalState,
    openModal,
    closeModal,
    openConfirmationModal,
    closeConfirmationModal,
    recipientTag,
    amount,
    description,
    selectedRecipient,
    suggestedTags,
    isTagInputFocused,
    isSearchingTags,
    isTransferring,
    showValidationErrors,
    handleTagInputChange,
    handleTagInputFocus,
    handleTagInputBlur,
    handleSelectRecipient,
    handleAmountChange,
    handleNumberPadClick,
    handleBackspace,
    handleDescriptionChange,
    handleTransfer,
    handleConfirmTransfer,
    comission,
    toastState,
    hideToast,
  };
};

