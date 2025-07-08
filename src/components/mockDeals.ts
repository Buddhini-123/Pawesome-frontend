import { DealsPageData } from '../types/deals';

export const mockDealsData: DealsPageData = {
  sections: [
    {
      id: 'weekly-deals',
      title: 'Bark-Worthy Deals This Week Only!',
      subtitle: 'Limited time offers on premium pet products',
      deals: [
        {
          id: 'buy-2-get-1-free',
          title: 'Buy 2 Get 1 FREE on Premium Dog Food',
          subtitle: 'Stock up and save big',
          description: 'Stock up on your pup\'s favorites and get more for less – limited time only.',
          offerType: 'buy-get-free',
          image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=600&fit=crop',
          isActive: true,
          validUntil: new Date('2025-06-15'),
          slug: 'buy-2-get-1-free-all-flavors',
          category: ['dog-food', 'premium'],
          products: ['dog-1', 'dog-6', 'dog-8']
        },
        {
          id: 'free-shipping',
          title: 'FREE Shipping on Subscriptions',
          subtitle: 'Never run out of pet supplies',
          description: 'Premium nutrition without the premium price tag – your wallet (and dog) will thank you.',
          offerType: 'free-shipping',
          image: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&h=600&fit=crop',
          isActive: true,
          slug: 'free-shipping-subscription',
          category: ['subscription', 'shipping'],
          products: ['dog-1', 'cat-2', 'dog-12', 'cat-13']
        },
        {
          id: 'referral-deal',
          title: 'Refer a Friend - Get Rs.250 OFF',
          subtitle: 'Share the love, save together',
          description: 'New to Pawsome? Let your furry friend try their new favorite meal.',
          offerType: 'referral',
          discount: 250,
          image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=600&fit=crop',
          isActive: true,
          slug: 'refer-friend-discount',
          category: ['referral', 'new-customer'],
          products: ['dog-1', 'cat-2', 'bird-1', 'other-1']
        },
        {
          id: 'premium-upgrade',
          title: 'Upgrade to Vet Diet - Save 15%',
          subtitle: 'Premium health nutrition',
          description: 'Wholesome meals made to fit on your budget.',
          offerType: 'upgrade',
          image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=600&fit=crop',
          isActive: true,
          slug: 'upgrade-to-premium',
          category: ['premium', 'upgrade'],
          products: ['vetdiet-1', 'vetdiet-2', 'vetdiet-4', 'vetdiet-7']
        }
      ]
    },
    {
      id: 'stock-up-save',
      title: 'Stock Up & Save on Pawsome Dog Food!',
      subtitle: 'Bulk buying benefits for smart pet parents',
      deals: [
        {
          id: 'bulk-discount-1',
          title: 'Bulk Buy Bonanza - Save 30%',
          subtitle: 'Buy more, save more',
          description: 'Stock up on your pup\'s favorites and get more for less – limited time only.',
          offerType: 'buy-get-free',
          image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=400&h=600&fit=crop',
          isActive: true,
          slug: 'bulk-buy-2-get-1',
          category: ['bulk', 'dog-food'],
          products: ['dog-1', 'dog-6', 'cat-2', 'cat-6']
        },
        {
          id: 'subscription-save',
          title: 'Subscribe & Save Extra 20%',
          subtitle: 'Auto-delivery convenience',
          description: 'Premium nutrition without the premium price tag – your wallet (and dog) will thank you.',
          offerType: 'free-shipping',
          image: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=400&h=600&fit=crop',
          isActive: true,
          slug: 'subscription-bulk-shipping',
          category: ['subscription', 'bulk'],
          products: ['dog-12', 'cat-13', 'other-9']
        },
        {
          id: 'family-pack',
          title: 'Family Bundle - 30% OFF',
          subtitle: 'Perfect for multi-pet homes',
          description: 'New to Pawsome? Let your furry friend try their new favorite meal.',
          offerType: 'bundle',
          discount: 30,
          image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=600&fit=crop',
          isActive: true,
          slug: 'family-pack-discount',
          category: ['family', 'bundle'],
          products: ['dog-1', 'dog-4', 'cat-2', 'cat-8', 'dog-8', 'cat-15']
        },
        {
          id: 'monthly-stock',
          title: 'Monthly Mega Sale - 25% OFF',
          subtitle: 'Limited time offer',
          description: 'Wholesome meals made to fit on your budget.',
          offerType: 'discount',
          discount: 25,
          image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=600&fit=crop',
          isActive: true,
          slug: 'monthly-stock-discount',
          category: ['monthly', 'stock'],
          products: ['dog-1', 'cat-2', 'bird-1', 'other-1']
        }
      ]
    },
    {
      id: 'loyalty-rewards',
      title: 'Loyal Pup? Earn Rewards Every Time You Buy!',
      subtitle: 'Join our loyalty program and save on every purchase',
      deals: [
        {
          id: 'loyalty-starter',
          title: 'Join Loyalty Program - Get Welcome Bonus',
          subtitle: 'Start earning rewards today',
          description: 'Stock up on your pup\'s favorites and get more for less – limited time only.',
          offerType: 'buy-get-free',
          image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&h=600&fit=crop',
          isActive: true,
          slug: 'loyalty-starter-bonus',
          category: ['loyalty', 'starter'],
          products: ['dog-1', 'cat-2', 'dog-8', 'cat-8']
        },
        {
          id: 'points-shipping',
          title: 'FREE Shipping for Members',
          subtitle: 'Loyalty has its perks',
          description: 'Premium nutrition without the premium price tag – your wallet (and dog) will thank you.',
          offerType: 'free-shipping',
          image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=600&fit=crop',
          isActive: true,
          slug: 'loyalty-free-shipping',
          category: ['loyalty', 'shipping'],
          products: ['dog-12', 'cat-13', 'dog-1', 'cat-2']
        },
        {
          id: 'double-points',
          title: 'Double Points Weekend',
          subtitle: 'Earn 2X rewards on all purchases',
          description: 'New to Pawsome? Let your furry friend try their new favorite meal.',
          offerType: 'referral',
          discount: 500,
          image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=600&fit=crop',
          isActive: true,
          slug: 'double-points-referral',
          category: ['loyalty', 'points'],
          products: ['dog-1', 'dog-6', 'cat-2', 'cat-6', 'bird-1', 'other-1']
        },
        {
          id: 'vip-upgrade',
          title: 'VIP Membership - Exclusive Benefits',
          subtitle: 'Unlock premium perks',
          description: 'Wholesome meals made to fit on your budget.',
          offerType: 'upgrade',
          image: 'https://images.unsplash.com/photo-1601758174493-45d0a4d3e407?w=400&h=600&fit=crop',
          isActive: true,
          slug: 'vip-loyalty-upgrade',
          category: ['loyalty', 'vip'],
          products: ['vetdiet-1', 'vetdiet-4', 'vetdiet-5', 'vetdiet-8']
        }
      ]
    }
  ]
};