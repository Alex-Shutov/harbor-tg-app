import React, { useMemo, useState } from 'react';
import './shop-promocodes.scss';
import { ShopCard } from './ShopCard';
import Loader from '@shared/Loader';
import EmptyEstablishments from '@components/EmptyEstablishments';
import {
  useGetStoreListQuery,
  useGetCartInfoQuery,
  useAddToCartMutation,
  useDecreaseCartItemMutation,
  useRemoveFromCartMutation,
} from '@/entities/shop/api/store.api';
import { IStoreItem, EStoreItemType } from '@/entities/shop/types';
import { ShopFilters, ShopFilterType } from './ShopFilters';
import { ShopStatusFilter, ShopStatusFilterType } from './ShopStatusFilter';
import { ShopItemModal } from './ShopItemModal';
import { ShopOrderModal } from './ShopOrderModal';
import { useAppDispatch } from '@/store/hooks';
import {
  setCart,
  setUnavailableItems,
  setCartStats,
  updateCartItem,
} from '@/entities/shop/model/cart.slice';
import { selectCartItems } from '@/entities/shop/model/cart.slice';
import { useSelector } from 'react-redux';

interface IShopPromocodesProps {
  className?: string;
}

export const ShopPromocodes: React.FC<IShopPromocodesProps> = ({ className = '' }) => {
  const [selectedFilter, setSelectedFilter] = useState<ShopFilterType>('all');
  const [selectedStatus, setSelectedStatus] = useState<ShopStatusFilterType>('active');
  const [selectedItem, setSelectedItem] = useState<IStoreItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const dispatch = useAppDispatch();
  const cartItems = useSelector(selectCartItems);

  const { data: storeItems, isLoading, isError } = useGetStoreListQuery();

  const { data: cartData } = useGetCartInfoQuery(undefined, {
    skip: false,
  });

  React.useEffect(() => {
    if (cartData) {
      dispatch(setCart(cartData.items));
      dispatch(setUnavailableItems(cartData.unavailableItems));
      dispatch(setCartStats({
        totalItems: cartData.totalItems,
        unavailableItemsCount: cartData.unavailableItemsCount,
      }));
    }
  }, [cartData, dispatch]);

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [decreaseCartItem] = useDecreaseCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const filteredItems = useMemo(() => {
    debugger
    if (!storeItems) return [];
    
    let filtered = storeItems;
    
    if (selectedFilter !== 'all') {
      filtered = filtered.filter((item) => item.type === selectedFilter);
    }
    
    if (selectedStatus === 'active') {
      filtered = filtered.filter((item) => item.status === 'ACTIVE' && (item.type === EStoreItemType.PROMO_CODE || (item.availableQuantity ?? 0) > 0));
    } else {
      filtered = filtered.filter((item) => item.status !== 'ACTIVE' || (item.type !== EStoreItemType.PROMO_CODE && (item.availableQuantity ?? 0) === 0));
    }
    
    return filtered;
  }, [storeItems, selectedFilter, selectedStatus]);

  const isItemInCart = (itemId: number): boolean => {
    return cartItems.some((cartItem) => cartItem.item.id === itemId);
  };

  const getItemQuantity = (itemId: number): number => {
    const cartItem = cartItems.find((item) => item.item.id === itemId);
    return cartItem?.quantity || 1;
  };

  const handleItemClick = (item: IStoreItem) => {
    setSelectedItem(item);
    setQuantity(getItemQuantity(item.id));
    setIsModalOpen(true);
  };

  const handleAddToCart = async () => {
    if (!selectedItem) return;
    
    try {
      await addToCart({
        itemId: selectedItem.id,
        itemType: selectedItem.type,
        quantity: 1,
      }).unwrap();
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleBuyNow = () => {
    setIsModalOpen(false);
    setIsOrderModalOpen(true);
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (!selectedItem) return;
    const cartItem = cartItems.find((item) => item.item.id === selectedItem.id);


    if (!cartItem) return;
    setQuantity(newQuantity);

    try {
      if (newQuantity === 0 && cartItem){
        await removeFromCart({ cartItemId:cartItem.cartItemId }).unwrap();
      }
      if (newQuantity < cartItem.quantity) {
        await decreaseCartItem({
          cartItemId: cartItem.cartItemId,
          decreaseBy: 1,
        }).unwrap();
      } else {
        await decreaseCartItem({
          cartItemId: cartItem.cartItemId,
          decreaseBy: -1,
        }).unwrap();
      }
      dispatch(updateCartItem({ cartItemId: cartItem.cartItemId, quantity: newQuantity }));
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };


  if (isError) {
    return (
      <div className={`shop-promocodes ${className}`}>
        <div className="shop-promocodes__error">Ошибка загрузки товаров</div>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!filteredItems || filteredItems.length === 0) {
    return (
      <div className={`shop-promocodes ${className}`}>
        <ShopFilters selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
        <ShopStatusFilter selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
        <EmptyEstablishments
          mainLabel={'Кажется, товары закончились'}
          secondLabel={'Пожалуйста, попробуйте позднее'}
        />
      </div>
    );
  }

  return (
    <div className={`shop-promocodes ${className}`}>
      <ShopFilters selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
      <ShopStatusFilter selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
      <div className="shop-promocodes__cards">
        {filteredItems.map((item) => {
          console.log(filteredItems,'filtered');
          const isExpired = item.status !== 'ACTIVE' || item.availableQuantity === 0;
          const canPurchase = !isExpired;

          const isUrbanBox = item.type === EStoreItemType.URBAN_BOX;
          const isProduct = item.type === EStoreItemType.PRODUCT;
          const isPromoCode = item.type === EStoreItemType.PROMO_CODE;
          const isSoldOut = (item.availableQuantity ?? 0) === 0;
          
          const hasDiscount = isUrbanBox && item.priceActual !== undefined &&
                             item.priceCustomer !== undefined && 
                             item.priceActual > item.priceCustomer;
          console.log(item?.priceActual,item.priceCustomer);
          return (
            <div key={item.id} className="shop-promocodes__card">
              <ShopCard
                title={isPromoCode ? item.description : item.title}
                imgUrl={item.mainImage.url}
                imgAlt={item.title}
                isUrbanBox={isUrbanBox}
                isExpired={!canPurchase}
                onClick={canPurchase ? () => handleItemClick(item) : undefined}
                price={isUrbanBox ? `${item.priceCustomer || item.cost} ₽` : `${item.cost}`}
                showPriceInRubles={isUrbanBox}
                originalPrice={hasDiscount ? item.priceActual : undefined}
                remainingCount={isUrbanBox || isProduct  ? (item.availableQuantity ?? 0) : undefined}
                isSoldOut={isUrbanBox ? isSoldOut : false}
              />
            </div>
          );
        })}
      </div>

      <ShopItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        quantity={quantity}
        onQuantityChange={handleQuantityChange}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isLoading={isAddingToCart}
        isInCart={selectedItem ? isItemInCart(selectedItem.id) : false}
      />

      <ShopOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
        }}
        dividedInGroups={false}
      />
    </div>
  );
};

