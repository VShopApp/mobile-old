import React from "react";
import { Searchbar } from "react-native-paper";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import { Dimensions } from "react-native";
import { useWishlistStore } from "~/hooks/useWishlistStore";
import GalleryItem from "~/components/GalleryItem";
import { offers, skins } from "~/utils/valorant-api";

function useDebounceValue(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function Gallery() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const debouncedQuery = useDebounceValue(searchQuery, 100);
  const [gallerySkins, setGallerySkins] = React.useState<IGalleryItem[]>([]);
  const galleryDataProvider = new DataProvider((r1, r2) => {
    return r1.uuid !== r2.uuid;
  }).cloneWithRows(gallerySkins);
  const { skinIds, toggleSkin } = useWishlistStore();

  React.useEffect(() => {
    setGallerySkins(
      skins
        .filter(
          (skin) =>
            skin.displayName.match(
              new RegExp(
                debouncedQuery.replace(/[&/\\#,+()$~%.^'":*?<>{}]/g, ""),
                "i"
              )
            ) && skin.contentTierUuid
        )
        .map((item) => ({
          ...item,
          price: offers[item.levels[0].uuid],
          onWishlist: skinIds.includes(item.levels[0].uuid),
        }))
        .sort((a, b) =>
          a.onWishlist === b.onWishlist ? 0 : a.onWishlist ? -1 : 1
        )
    );
  }, [debouncedQuery, skinIds]);

  const rowRenderer = (
    type: string | number,
    data: IGalleryItem,
    index: number
  ) => <GalleryItem item={data} toggleFromWishlist={toggleSkin} />;

  return (
    <>
      <Searchbar
        placeholder="Search"
        onChangeText={(value) => setSearchQuery(value)}
        value={searchQuery}
        style={{ margin: 5 }}
      />
      {galleryDataProvider.getSize() > 0 && (
        <RecyclerListView
          rowRenderer={rowRenderer}
          dataProvider={galleryDataProvider}
          layoutProvider={
            new LayoutProvider(
              () => 0,
              (type, dim) => {
                dim.width = Dimensions.get("window").width;
                dim.height = 69;
              }
            )
          }
        />
      )}
    </>
  );
}

export default Gallery;
