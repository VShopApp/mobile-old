import { useTranslation } from "react-i18next";
import { List, Text, IconButton, Menu, Divider } from "react-native-paper";
import CurrencyIcon from "./CurrencyIcon";
import { Image } from "react-native";
import { useMediaPopupStore } from "./popups/MediaPopup";
import { useFeatureStore } from "~/hooks/useFeatureStore";
import { getDisplayIcon } from "~/utils/misc";
import { useState } from "react";

interface props {
  item: IGalleryItem;
  toggleFromWishlist: Function;
}
export default function GalleryItem(props: React.PropsWithChildren<props>) {
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);
  const { showMediaPopup } = useMediaPopupStore();
  const { screenshotModeEnabled } = useFeatureStore();

  return (
    <List.Item
      title={`${props.item.onWishlist ? "⭐ " : ""}${props.item.displayName}`}
      description={
        props.item.price
          ? () => (
              <Text>
                {props.item.price.toString()}
                <CurrencyIcon icon="vp" />
              </Text>
            )
          : undefined
      }
      left={(_props) => (
        <Image
          {..._props}
          source={getDisplayIcon(props.item, screenshotModeEnabled)}
          style={{ width: 100, height: 50 }}
          resizeMode="contain"
        />
      )}
      right={(_props) => (
        <>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                props.toggleFromWishlist(props.item.levels[0].uuid);
              }}
              title={
                props.item.onWishlist ? t("wishlist.remove") : t("wishlist.add")
              }
              icon={props.item.onWishlist ? "minus" : "plus"}
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                showMediaPopup(
                  props.item.levels.map(
                    (level) => level.streamedVideo || level.displayIcon || ""
                  ),
                  t("levels")
                );
              }}
              title={t("levels")}
              icon="arrow-up-bold"
            />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                showMediaPopup(
                  props.item.chromas.map(
                    (chroma) => chroma.streamedVideo || chroma.fullRender
                  ),
                  t("chromas")
                );
              }}
              title={t("chromas")}
              icon="format-color-fill"
            />
          </Menu>
        </>
      )}
    />
  );
}
