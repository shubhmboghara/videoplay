import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);

const timeAgo = (date) => dayjs(date).fromNow();

export { timeAgo };