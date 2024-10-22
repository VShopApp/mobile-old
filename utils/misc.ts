export const VCurrencies = {
  VP: "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741", // VP
  RAD: "e59aa87c-4cbf-517a-5983-6e81511be9b7", // Radianite Points
  FAG: "f08d4ae3-939c-4576-ab26-09ce1f23bb37", // Free Agents
};

export const VItemTypes = {
  SkinLevel: "e7c63390-eda7-46e0-bb7a-a6abdacd2433",
  SkinChroma: "3ad1b2b2-acdb-4524-852f-954a76ddae0a",
  Agent: "01bb38e1-da47-4e6a-9b3d-945fe4655707",
  ContractDefinition: "f85cb6f7-33e5-4dc8-b609-ec7212301948",
  Buddy: "dd3bf334-87f3-40bd-b043-682a57a8dc3a",
  Spray: "d5f120f8-ff8c-4aac-92ea-f2b5acbe9475",
  PlayerCard: "3f296c07-64c3-494c-923b-fe692a4fa1bd",
  PlayerTitle: "de7caa6b-adf7-4588-bbd1-143831e786c6",
};

export const regions = ["eu", "na", "ap", "kr"];

export const getAccessTokenFromUri = (uri: string) => {
  return (
    uri.match(
      /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/
    ) as any
  )[1];
};

export const getDisplayIcon = (
  item: IBundleItem | IShopItem | INightMarketItem | IGalleryItem,
  screenshotModeEnabled: boolean
) => {
  const imgUri = item.levels[0].displayIcon || item.displayIcon;
  if (imgUri && !screenshotModeEnabled) return { uri: imgUri };
  return require("~/assets/images/noimage.png");
};

export const isSameDayUTC = (d1: Date, d2: Date) => {
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
};
