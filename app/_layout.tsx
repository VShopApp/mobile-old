import { Stack, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Appbar,
  DarkTheme as PaperDarkTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { StripeProvider } from "@stripe/stripe-react-native";
import merge from "deepmerge";
import {
  DarkTheme as NavigationDarkTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Platform } from "react-native";
import UpdatePopup from "~/components/popups/UpdatePopup";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen } from "expo-router";
import { useTranslation } from "react-i18next";
import { SharedPostHogProvider } from "~/components/Posthog";
import { initBackgroundFetch, stopBackgroundFetch } from "~/utils/wishlist";
import { useWishlistStore } from "~/hooks/useWishlistStore";

export const CombinedDarkTheme = {
  ...merge(PaperDarkTheme, NavigationDarkTheme),
  colors: {
    ...merge(PaperDarkTheme.colors, NavigationDarkTheme.colors),
    primary: "#fa4454",
    accent: "#fa4454",
  },
};

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    // "Sync" background fetch with local state
    const notificationEnabled = useWishlistStore.getState().notificationEnabled;
    if (notificationEnabled) {
      initBackgroundFetch();
    } else {
      stopBackgroundFetch();
    }

    // If user has set the region, he *should* be a returning user
    AsyncStorage.getItem("region").then((region) => {
      if (region) {
        router.replace("/reauth");
      } else {
        router.replace("/setup");
      }
      SplashScreen.hideAsync();
    });
  }, [router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SharedPostHogProvider>
        <SafeAreaView
          style={{ backgroundColor: CombinedDarkTheme.colors.primary }}
        />
        <PaperProvider theme={CombinedDarkTheme}>
          <StripeProvider
            publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLIC_KEY ?? ""}
          >
            <ThemeProvider value={CombinedDarkTheme}>
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: CombinedDarkTheme.colors.primary,
                  },
                  headerTintColor: "#fff",
                  header: ({ options, navigation }) => (
                    <Appbar.Header
                      style={{
                        backgroundColor: CombinedDarkTheme.colors.primary,
                      }}
                    >
                      <Appbar.BackAction onPress={navigation.goBack} />
                      <Appbar.Content title={options.title} />
                    </Appbar.Header>
                  ),
                  gestureEnabled: false,
                }}
              >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="reauth" options={{ headerShown: false }} />
                <Stack.Screen name="setup" options={{ headerShown: false }} />
                <Stack.Screen
                  name="language"
                  options={{ presentation: "modal", title: t("language") }}
                />
                <Stack.Screen
                  name="(authenticated)"
                  options={{ headerShown: false }}
                />
              </Stack>
              {Platform.OS === "android" && <UpdatePopup />}
            </ThemeProvider>
          </StripeProvider>
        </PaperProvider>
      </SharedPostHogProvider>
    </GestureHandlerRootView>
  );
}

export default RootLayout;
