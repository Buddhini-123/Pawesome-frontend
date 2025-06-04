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
          title: 'THE BEST FOOD FOR YOUR DOG',
          subtitle: 'Delicious food made with love',
          description: 'Stock up on your pup\'s favorites and get more for less – limited time only.',
          offerType: 'buy-get-free',
          image: '/api/placeholder/200/300',
          isActive: true,
          validUntil: new Date('2025-06-15'),
          slug: 'buy-2-get-1-free-all-flavors',
          category: ['dog-food', 'premium'],
          products: ['premium-dog-food-1', 'premium-dog-food-2']
        },
        {
          id: 'free-shipping',
          title: 'THE BEST FOOD FOR YOUR DOG',
          subtitle: 'Delicious food made with love',
          description: 'Premium nutrition without the premium price tag – your wallet (and dog) will thank you.',
          offerType: 'free-shipping',
          image: '/api/placeholder/200/300',
          isActive: true,
          slug: 'free-shipping-subscription',
          category: ['subscription', 'shipping'],
          products: ['subscription-plan-1', 'subscription-plan-2']
        },
        {
          id: 'referral-deal',
          title: 'THE BEST FOOD FOR YOUR DOG',
          subtitle: 'Delicious food made with love',
          description: 'New to Pawsome? Let your furry friend try their new favorite meal.',
          offerType: 'referral',
          discount: 250,
          image: '/api/placeholder/200/300',
          isActive: true,
          slug: 'refer-friend-discount',
          category: ['referral', 'new-customer'],
          products: ['starter-pack-1', 'trial-pack-1']
        },
        {
          id: 'premium-upgrade',
          title: 'THE BEST FOOD FOR YOUR DOG',
          subtitle: 'Delicious food made with love',
          description: 'Wholesome meals made to fit on your budget.',
          offerType: 'upgrade',
          image: '/api/placeholder/200/300',
          isActive: true,
          slug: 'upgrade-to-premium',
          category: ['premium', 'upgrade'],
          products: ['premium-plan-1', 'premium-plan-2']
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
          title: 'THE BEST FOOD FOR YOUR DOG',
          subtitle: 'Delicious food made with love',
          description: 'Stock up on your pup\'s favorites and get more for less – limited time only.',
          offerType: 'buy-get-free',
          image: '/api/placeholder/200/300',
          isActive: true,
          slug: 'bulk-buy-2-get-1',
          category: ['bulk', 'dog-food'],
          products: ['bulk-pack-1', 'bulk-pack-2']
        },
        {
          id: 'subscription-save',
          title: 'THE BEST FOOD FOR YOUR DOG',
          subtitle: 'Delicious food made with love',
          description: 'Premium nutrition without the premium price tag – your wallet (and dog) will thank you.',
          offerType: 'free-shipping',
          image: '/api/placeholder/200/300',
          isActive: true,
          slug: 'subscription-bulk-shipping',
          category: ['subscription', 'bulk'],
          products: ['bulk-subscription-1']
        },
        {
          id: 'family-pack',
          title: 'THE BEST FOOD FOR YOUR DOG',
          subtitle: 'Delicious food made with love',
          description: 'New to Pawsome? Let your furry friend try their new favorite meal.',
          offerType: 'bundle',
          discount: 30,
          image: '/api/placeholder/200/300',
          isActive: true,
          slug: 'family-pack-discount',
          category: ['family', 'bundle'],
          products: ['family-pack-1', 'family-pack-2']
        },
        {
          id: 'monthly-stock',
          title: 'THE BEST FOOD FOR YOUR DOG',
          subtitle: 'Delicious food made with love',
          description: 'Wholesome meals made to fit on your budget.',
          offerType: 'discount',
          discount: 25,
          image: '/api/placeholder/200/300',
          isActive: true,
          slug: 'monthly-stock-discount',
          category: ['monthly', 'stock'],
          products: ['monthly-supply-1']
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
          title: 'THE BEST FOOD FOR YOUR DOG',
          subtitle: 'Delicious food made with love',
          description: 'Stock up on your pup\'s favorites and get more for less – limited time only.',
          offerType: 'buy-get-free',
          image: '/api/placeholder/200/300',
          isActive: true,
          slug: 'loyalty-starter-bonus',
          category: ['loyalty', 'starter'],
          products: ['loyalty-pack-1']
        },
        {
          id: 'points-shipping',
          title: 'THE BEST FOOD FOR YOUR DOG',
          subtitle: 'Delicious food made with love',
          description: 'Premium nutrition without the premium price tag – your wallet (and dog) will thank you.',
          offerType: 'free-shipping',
          image: '/api/placeholder/200/300',
          isActive: true,
          slug: 'loyalty-free-shipping',
          category: ['loyalty', 'shipping'],
          products: ['loyalty-subscription-1']
        },
        {
          id: 'double-points',
          title: 'THE BEST FOOD FOR YOUR DOG',
          subtitle: 'Delicious food made with love',
          description: 'New to Pawsome? Let your furry friend try their new favorite meal.',
          offerType: 'referral',
          discount: 500,
          image: '/api/placeholder/200/300',
          isActive: true,
          slug: 'double-points-referral',
          category: ['loyalty', 'points'],
          products: ['points-bonus-1']
        },
        {
          id: 'vip-upgrade',
          title: 'THE BEST FOOD FOR YOUR DOG',
          subtitle: 'Delicious food made with love',
          description: 'Wholesome meals made to fit on your budget.',
          offerType: 'upgrade',
          image: '/api/placeholder/200/300',
          isActive: true,
          slug: 'vip-loyalty-upgrade',
          category: ['loyalty', 'vip'],
          products: ['vip-membership-1']
        }
      ]
    }
  ]
};