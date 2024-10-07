import PostHog, { PostHogProvider } from "posthog-react-native";

export const posthog = new PostHog(
  process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? " ",
  {
    host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
    enableSessionReplay: false,
    disabled: !(
      process.env.EXPO_PUBLIC_POSTHOG_API_KEY &&
      process.env.EXPO_PUBLIC_POSTHOG_HOST
    ),
  }
);

export function SharedPostHogProvider(props: any) {
  return <PostHogProvider client={posthog}>{props.children}</PostHogProvider>;
}
