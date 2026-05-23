export interface GroupedCartItems {
  giftBoxes: {
    [groupId: string]: {
      groupId: string;
      items: any[];
      recipientName?: string;
      giftMessage?: string;
      isPresetBox?: boolean;
      presetBoxName?: string;
      presetBoxOccasion?: string;
    };
  };
  regularItems: any[];
}

export function groupCartItems(cartItems: any[]): GroupedCartItems {
  const giftBoxes: GroupedCartItems['giftBoxes'] = {};
  const regularItems: any[] = [];

  cartItems.forEach((item) => {
    const giftBoxGroup = item.metadata?.gift_box_group;
    const isGiftItem = item.metadata?.is_gift_item;

    if (isGiftItem && giftBoxGroup) {
      // This is a gift box item
      if (!giftBoxes[giftBoxGroup]) {
        giftBoxes[giftBoxGroup] = {
          groupId: giftBoxGroup,
          items: [],
          recipientName: item.metadata?.recipient_name,
          giftMessage: item.metadata?.gift_message,
          isPresetBox: item.metadata?.is_preset_box || false,
          presetBoxName: item.metadata?.preset_box_name,
          presetBoxOccasion: item.metadata?.preset_box_occasion,
        };
      }
      giftBoxes[giftBoxGroup].items.push(item);
    } else {
      // Regular cart item
      regularItems.push(item);
    }
  });

  return { giftBoxes, regularItems };
}
