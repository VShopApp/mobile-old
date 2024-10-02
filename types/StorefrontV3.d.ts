export interface IStorefrontV3 {
  FeaturedBundle: FeaturedBundle;
  SkinsPanelLayout: SkinsPanelLayout;
  BonusStore?: BonusStore;
}

interface FeaturedBundle {
  Bundle: Bundle;
  Bundles: Bundle2[];
  BundleRemainingDurationInSeconds: number;
}

interface Bundle {
  ID: string;
  DataAssetID: string;
  CurrencyID: string;
  Items: Item[];
  DurationRemainingInSeconds: number;
  WholesaleOnly: boolean;
}

interface Item {
  Item: Item2;
  BasePrice: number;
  CurrencyID: string;
  DiscountPercent: number;
  DiscountedPrice: number;
  IsPromoItem: boolean;
}

interface Item2 {
  ItemTypeID: string;
  ItemID: string;
  Amount: number;
}

interface Bundle2 {
  ID: string;
  DataAssetID: string;
  CurrencyID: string;
  Items: Item3[];
  DurationRemainingInSeconds: number;
  WholesaleOnly: boolean;
}

interface Item3 {
  Item: Item4;
  BasePrice: number;
  CurrencyID: string;
  DiscountPercent: number;
  DiscountedPrice: number;
  IsPromoItem: boolean;
}

interface Item4 {
  ItemTypeID: string;
  ItemID: string;
  Amount: number;
}

interface SkinsPanelLayout {
  SingleItemOffers: string[];
  SingleItemOffersRemainingDurationInSeconds: number;
}

interface BonusStore {
  BonusStoreOffers: BonusStoreOffer[];
  BonusStoreRemainingDurationInSeconds: number;
}

interface BonusStoreOffer {
  BonusOfferID: string;
  Offer: Offer;
  DiscountPercent: number;
  DiscountCosts: { [currency: string]: number };
  IsSeen: boolean;
}

interface Offer {
  OfferID: string;
  IsDirectPurchase: boolean;
  StartDate: string;
  Cost: { [currency: string]: number };
  Rewards: Reward[];
}

interface Reward {
  ItemTypeID: string;
  ItemID: string;
  Quantity: number;
}
