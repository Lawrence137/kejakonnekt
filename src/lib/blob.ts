// Options for the PUBLIC listing-photos store. This is a different store from the
// private ID-verification one, so it has its own prefixed variables (LISTINGS_...).
// If your variable names differ, change them here only.
export function publicBlobOptions() {
  const token = process.env.LISTINGS_READ_WRITE_TOKEN;
  const storeId = process.env.LISTINGS_STORE_ID;

  return {
    access: "public" as const,
    contentType: "image/jpeg",
    ...(token ? { token } : {}),
    ...(storeId ? { storeId } : {}),
  };
}