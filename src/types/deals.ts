export interface Deal {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  offerType: 'buy-get-free' | 'free-shipping' | 'referral' | 'upgrade' | 'discount' | 'bundle';
  discount?: number;
  originalPrice?: number;
  salePrice?: number;
  image: string;
  isActive: boolean;
  validUntil?: Date;
  slug: string;
  category: string[];
  products?: string[]; // Product IDs associated with this deal
}

export interface DealSection {
  id: string;
  title: string;
  subtitle?: string;
  deals: Deal[];
  backgroundColor?: string;
  textColor?: string;
}

export interface DealsPageData {
  sections: DealSection[];
}

export type DealCardProps = {
  deal: Deal;
  onClick: (deal: Deal) => void;
  className?: string;
}

export type DealSectionProps = {
  section: DealSection;
  onDealClick: (deal: Deal) => void;
  className?: string;
}