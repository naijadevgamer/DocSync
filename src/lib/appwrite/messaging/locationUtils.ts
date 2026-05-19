export const getDirectionsLink = () => {
  const defaultAddress =
    "DocSync Medical Center, 123 Healthcare Ave, Medical District";
  const address = defaultAddress;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${encodeURIComponent(address)}`;
  const wazeUrl = `https://www.waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;

  return {
    google: googleMapsUrl,
    apple: appleMapsUrl,
    waze: wazeUrl,
    default: googleMapsUrl,
  };
};
