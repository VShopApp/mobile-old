import "expo-router/entry";

import BackgroundFetch from "react-native-background-fetch";
import { wishlistBgTask } from "./utils/wishlist";

BackgroundFetch.registerHeadlessTask(async (event) => {
  let taskId = event.taskId;
  let isTimeout = event.timeout;
  if (isTimeout) {
    console.log("[BackgroundFetch] Headless TIMEOUT:", taskId);
    BackgroundFetch.finish(taskId);
    return;
  }

  await wishlistBgTask();
  BackgroundFetch.finish(taskId);
});
