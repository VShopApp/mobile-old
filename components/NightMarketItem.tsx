import { useTranslation } from "react-i18next";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  useTheme,
} from "react-native-paper";
import CurrencyIcon from "./CurrencyIcon";
import { useMediaPopupStore } from "./popups/MediaPopup";
import { getDisplayIcon } from "~/utils/misc";
import { useFeatureStore } from "~/hooks/useFeatureStore";

interface props {
  item: INightMarketItem;
}
export default function NightMarketItem(props: React.PropsWithChildren<props>) {
  const { t } = useTranslation();
  const { showMediaPopup } = useMediaPopupStore();
  const { screenshotModeEnabled } = useFeatureStore();
  const { colors } = useTheme();

  return (
    <>
      <Card style={{ margin: 5, backgroundColor: colors.backdrop }}>
        <Card.Content>
          <Title>{props.item.displayName}</Title>
          <Paragraph>
            <Text
              style={{
                textDecorationLine: "line-through",
                textDecorationStyle: "solid",
                fontSize: 12,
              }}
            >
              {props.item.price}
            </Text>{" "}
            {props.item.discountedPrice} <CurrencyIcon icon="vp" /> (
            <Text
              style={{
                color: "green",
              }}
            >
              -{props.item.discountPercent}%
            </Text>
            )
          </Paragraph>
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
