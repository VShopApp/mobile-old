interface IUser {
  name: string;
  loading: boolean;
  accessToken: string;
  entitlementsToken: string;
  idtoken: string;
  expiresIn: number;
  region: string;
  id: string;
  error?: string | undefined;
  mfaRequired?: boolean | undefined;
  mfaEmail?: string | undefined;
}

interface ISkin {
  uuid: string;
  displayName: string;
  themeUuid: string;
  contentTierUuid?: string;
  displayIcon?: string;
  wallpaper?: string;
  assetPath: string;
  chromas: ISkinChroma[];
  levels: ISkinLevel[];
}

interface IBundle {
  uuid: string;
  displayName: string;
  displayNameSubText?: string;
  description: string;
  extraDescription?: string;
  promoDescription?: string;
  useAdditionalContext: boolean;
  displayIcon: string;
  displayIcon2: string;
  verticalPromoImage?: string;
  assetPath: string;
}

interface ISkinChroma {
  uuid: string;
  displayName: string;
  displayIcon?: string;
  fullRender: string;
  swatch?: string;
  streamedVideo?: string;
  assetPath: string;
}

interface ISkinLevel {
  uuid: string;
  displayName: string;
  levelItem?: string;
  displayIcon?: string;
  streamedVideo?: string;
  assetPath: string;
}

interface IShopItem extends ISkin {
  price: number;
}

interface IGalleryItem extends IShopItem {
  onWishlist: boolean;
}

interface INightMarketItem extends IShopItem {
  discountedPrice: number;
  discountPercent: number;
}

interface IBundleItem extends IShopItem {
  discountedPrice: number;
}

interface IBundle {
  uuid: string;
  displayName: string;
  description: string;
  extraDescription: any;
  promoDescription: any;
  useAdditionalContext: boolean;
  displayIcon: string;
  displayIcon2: string;
  verticalPromoImage: string;
  assetPath: string;
  price: number;
  items: IBundleItem[];
}

interface IBalance {
  vp: number;
  rad: number;
  fag: number;
}

interface IProgress {
  level: number;
  xp: number;
}
