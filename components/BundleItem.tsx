import { useTranslation } from "react-i18next";
import { Card, Title, Button, Text, useTheme } from "react-native-paper";
import CurrencyIcon from "./CurrencyIcon";
import { useMediaPopupStore } from "./popups/MediaPopup";
import { useFeatureStore } from "~/hooks/useFeatureStore";
import { getDisplayIcon } from "~/utils/misc";

interface props {
  item: IBundleItem;
}
export default function BundleItem(props: React.PropsWithChildren<props>) {
  const { t } = useTranslation();
  const { showMediaPopup } = useMediaPopupStore();
  const { screenshotModeEnabled } = useFeatureStore();
  const { colors } = useTheme();

  return (
    <>
      <Card style={{ margin: 5, backgroundColor: colors.backdrop }}>
        <Card.Content>
          <Title>{props.item.displayName}</Title>
          <Text>
            {props.item.price} <CurrencyIcon icon="vp" />{" "}
            <Text style={{ fontSize: 11 }}>({t("separate")})</Text>
          </Text>
        </Card.Content>
        <Card.Cover
          resizeMode="contain"
          style={{
            backgroundColor: colors.backdrop,
            padding: 10,
          }}
          source={getDisplayIcon(props.item, screenshotModeEnabled)}
        />
        <Card.Actions>
          <Button
            onPress={() =>
              showMediaPopup(
                props.item.levels.map(
                  (level) => level.streamedVideo || level.displayIcon || ""
                ),
                t("levels")
              )
            }
          >
            {t("levels")}
          </Button>
          <Button
            onPress={() =>
              showMediaPopup(
                props.item.chromas.map(
                  (chroma) => chroma.streamedVideo || chroma.fullRender
                ),
                t("chromas")
              )
            }
          >
            {t("chromas")}
          </Button>
        </Card.Actions>
      </Card>
    </>
  );
}
