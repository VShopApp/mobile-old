import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { VCurrencies, VItemTypes } from "./misc";
import { IStorefrontV3 } from "../types/StorefrontV3";
import https from "https-browserify";
import { getVAPILang } from "./localization";

axios.interceptors.request.use(
  function (config) {
    if (__DEV__) console.log(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export let defaultUser = {
  id: "",
  name: "",
  region: "",
  shops: {
    main: [] as IShopItem[],
    bundles: [] as IBundle[],
    nightMarket: [] as INightMarketItem[],
    remainingSecs: {
      main: 0,
      bundles: [0],
      nightMarket: 0,
    },
  },
  balances: {
    vp: 0,
    rad: 0,
    fag: 0,
  },
  progress: {
    level: 0,
    xp: 0,
  },
};

export let offers: any = {};
export let skins: ISkin[] = [];

const extraHeaders = {
  "X-Riot-ClientVersion": "43.0.1.4195386.4190634",
  "X-Riot-ClientPlatform":
    "eyJwbGF0Zm9ybVR5cGUiOiJQQyIsInBsYXRmb3JtT1MiOiJXaW5kb3dzIiwicGxhdGZvcm1PU1ZlcnNpb24iOiIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwicGxhdGZvcm1DaGlwc2V0IjoiVW5rbm93biJ9",
};

export async function loadVersion() {
  try {
    const res = await axios.request({
      url: "https://valorant-api.com/v1/version",
      method: "GET",
    });

    extraHeaders["X-Riot-ClientVersion"] = res.data.data.riotClientVersion;
  } catch (e) {
    console.log(e);
  }
}

export async function loadSkins() {
  const res2 = await axios.request({
    url: `https://valorant-api.com/v1/weapons/skins?language=${getVAPILang()}`,
    method: "GET",
  });

  skins = res2.data.data;
}

export async function getEntitlementsToken(accessToken: string) {
  const res = await axios.request({
    url: getUrl("entitlements"),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...extraHeaders,
    },
    data: {},
  });

  return res.data.entitlements_token;
}

export function getUserId(accessToken: string) {
  const data = jwtDecode(accessToken) as any;

  return data.sub;
}

export async function getUsername(
  accessToken: string,
  entitlementsToken: string,
  userId: string,
  region: string
) {
  const res = await axios.request({
    url: getUrl("name", region),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
      ...extraHeaders,
    },
    data: [userId],
  });

  return res.data[0].GameName !== "" ? res.data[0].GameName : "?";
}

export async function loadOffers(
  accessToken: string,
  entitlementsToken: string,
  region: string
) {
  const res = await axios.request({
    url: getUrl("offers", region),
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
      ...extraHeaders,
    },
  });

  for (var i = 0; i < res.data.Offers.length; i++) {
    let offer = res.data.Offers[i];
    offers[offer.OfferID] = offer.Cost[VCurrencies.VP];
  }
}

export async function getShop(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  userId: string
) {
  const res = await axios.request<IStorefrontV3>({
    url: getUrl("storefront", region, userId),
    method: "POST",
    headers: {
      ...extraHeaders,
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
    data: {},
  });

  return res.data;
}

export async function parseShop(shop: IStorefrontV3) {
  /* NORMAL SHOP */
  let singleItemOffers = shop.SkinsPanelLayout.SingleItemOffers;
  let main: IShopItem[] = [];
  for (var i = 0; i < singleItemOffers.length; i++) {
    const skin = skins.find(
      (_skin) => _skin.levels[0].uuid === singleItemOffers[i]
    ) as ISkin;

    main[i] = {
      ...skin,
      price: offers[singleItemOffers[i]],
    };
  }

  /* BUNDLES */
  const bundles: IBundle[] = [];
  for (var b = 0; b < shop.FeaturedBundle.Bundles.length; b++) {
    const bundle = shop.FeaturedBundle.Bundles[b];
    const bundleVAPI = (
      await axios.request({
        url: `https://valorant-api.com/v1/bundles/${
          bundle.DataAssetID
        }?language=${getVAPILang()}`,
        method: "GET",
      })
    ).data.data;

    bundles.push({
      ...bundleVAPI,
      price: bundle.Items.map((item) => item.DiscountedPrice).reduce(
        (a, b) => a + b
      ),
      items: bundle.Items.filter(
        (item) => item.Item.ItemTypeID === VItemTypes.SkinLevel
      ).map((item) => {
        const skin = skins.find(
          (_skin) => _skin.levels[0].uuid === item.Item.ItemID
        ) as ISkin;

        return {
          ...skin,
          price: item.BasePrice,
        };
      }),
    });
  }

  /* NIGHT MARKET */
  let nightMarket: INightMarketItem[] = [];
  if (shop.BonusStore) {
    var bonusStore = shop.BonusStore.BonusStoreOffers;
    for (var k = 0; k < bonusStore.length; k++) {
      let itemid = bonusStore[k].Offer.Rewards[0].ItemID;
      const skin = skins.find(
        (_skin) => _skin.levels[0].uuid === itemid
      ) as ISkin;

      nightMarket.push({
        ...skin,
        price: bonusStore[k].Offer.Cost[VCurrencies.VP],
        discountedPrice: bonusStore[k].DiscountCosts[VCurrencies.VP],
        discountPercent: bonusStore[k].DiscountPercent,
      });
    }
  }

  return {
    main,
    bundles,
    nightMarket,
    remainingSecs: {
      main:
        shop.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds ?? 0,
      bundles: shop.FeaturedBundle.Bundles.map(
        (bundle) => bundle.DurationRemainingInSeconds
      ) ?? [0],
      nightMarket: shop.BonusStore?.BonusStoreRemainingDurationInSeconds ?? 0,
    },
  };
}

export async function getBalances(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  userId: string
) {
  const res = await axios.request({
    url: getUrl("wallet", region, userId),
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
      ...extraHeaders,
    },
  });

  return {
    vp: res.data.Balances[VCurrencies.VP],
    rad: res.data.Balances[VCurrencies.RAD],
    fag: res.data.Balances[VCurrencies.FAG],
  };
}

export async function getProgress(
  accessToken: string,
  entitlementsToken: string,
  region: string,
  userId: string
) {
  const res = await axios.request({
    url: getUrl("playerxp", region, userId),
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
      ...extraHeaders,
    },
  });

  return {
    level: res.data.Progress.Level,
    xp: res.data.Progress.XP,
  };
}

export const reAuth = () =>
  axios.request({
    url: "https://auth.riotgames.com/api/v1/authorization",
    method: "POST",
    headers: {
      "User-Agent": `RiotClient/${extraHeaders["X-Riot-ClientVersion"]} rso-auth (Windows; 10;;Professional, x64)`,
      "Content-Type": "application/json",
    },
    data: {
      client_id: "play-valorant-web-prod",
      nonce: "1",
      redirect_uri: "https://playvalorant.com/opt_in",
      response_type: "token id_token",
      response_mode: "query",
      scope: "account openid",
    },
    httpsAgent: new https.Agent({
      ciphers: [
        "TLS_CHACHA20_POLY1305_SHA256",
        "TLS_AES_128_GCM_SHA256",
        "TLS_AES_256_GCM_SHA384",
        "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
      ].join(":"),
      honorCipherOrder: true,
      minVersion: "TLSv1.2",
    }),
    withCredentials: true,
  });

function getUrl(name: string, region?: string, userId?: string) {
  const URLS: any = {
    auth: "https://auth.riotgames.com/api/v1/authorization/",
    entitlements: "https://entitlements.auth.riotgames.com/api/token/v1/",
    userinfo: "https://auth.riotgames.com/userinfo/",
    storefront: `https://pd.${region}.a.pvp.net/store/v3/storefront/${userId}`,
    wallet: `https://pd.${region}.a.pvp.net/store/v1/wallet/${userId}`,
    playerxp: `https://pd.${region}.a.pvp.net/account-xp/v1/players/${userId}`,
    weapons: "https://valorant-api.com/v1/weapons/",
    offers: `https://pd.${region}.a.pvp.net/store/v1/offers/`,
    name: `https://pd.${region}.a.pvp.net/name-service/v2/players`,
  };

  return URLS[name];
}
