export const convertNs = (ns: bigint) => {
  const seconds = Number(ns / BigInt(1e9));
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  return {
    seconds,
    minutes,
    hours,
    days,
  };
};

export const formatDuration = (ns: bigint) => {
  const { seconds, minutes, hours, days } = convertNs(ns);

  if (days >= 1) {
    return `${Math.floor(days)} day${Math.floor(days) > 1 ? "s" : ""}`;
  }
  if (hours >= 1) {
    return `${Math.floor(hours)} hour${Math.floor(hours) > 1 ? "s" : ""}`;
  }
  if (minutes >= 1) {
    return `${Math.floor(minutes)} minute${Math.floor(minutes) > 1 ? "s" : ""}`;
  }

  return `${Math.floor(seconds)} second${Math.floor(seconds) > 1 ? "s" : ""}`;
};
