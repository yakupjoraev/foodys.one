export function formatDistance(distance: number) {
  if (distance < 1000) {
    return Math.round(distance).toString() + "\xa0m";
  }
  return (distance / 1000).toFixed(1) + "\xa0km";
}
