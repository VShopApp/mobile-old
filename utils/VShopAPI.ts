import axios from "axios";

export const checkDonator = async (riotId: string) => {
  try {
    const res = await axios.request({
      url: `${process.env.EXPO_PUBLIC_API_URL}/user/${riotId}`,
      method: "GET",
      timeout: 5 * 1000,
    });

    return res.data.donator as boolean;
  } catch (e) {
    console.log(e);
  }
  return false;
};

export const getCurrencies = async () => {
  const res = await axios.request({
    url: `${process.env.EXPO_PUBLIC_API_URL}/stripe/currencies`,
    method: "GET",
  });

  return res.data as ICurrency[];
};

export const generatePaymentSheet = async ({
  amount,
  riotId,
  currencyCode,
}: {
  amount: number;
  riotId: string;
  currencyCode: string;
}) => {
  const res = await axios.request({
    url: `${process.env.EXPO_PUBLIC_API_URL}/stripe/payment-sheet`,
    method: "POST",
    data: {
      amount,
      riotId,
      currencyCode,
    },
  });

  return res;
};
