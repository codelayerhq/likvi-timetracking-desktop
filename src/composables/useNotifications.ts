import { Ref, ref } from "vue";

const notifications = ref<Notification[]>([]);

export interface Notification {
  uuid: string;
  title: string;
  body: string;
  type: "info" | "positive" | "warning" | "negative";
  timeout?: number;
}

// Should be the same as Notification but without uuid, becasue the user does not need to providde this
export interface PartialNotification {
  title: string;
  body: string;
  type: "info" | "positive" | "warning" | "negative";
  timeout?: number;
}

// code from https://stackoverflow.com/a/8809472
function generateUUID(): string {
  let d = new Date().getTime(); //Timestamp
  let d2 = (performance && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export default function useNotifications(): {
  notifications: Ref<Notification[]>;
  notify: (notifcation: PartialNotification) => void;
} {
  function notify(notifcation: PartialNotification) {
    notifications.value.push({
      timeout: 10000,
      ...notifcation,
      uuid: generateUUID(),
    });
  }

  return {
    notifications,
    notify,
  };
}
