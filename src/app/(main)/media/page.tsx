import MediaMarketplaceClient from "../components/MediaMarketplaceClient";

export default async function MediaMarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const city = typeof resolvedParams.city === 'string' ? resolvedParams.city : undefined;

  return <MediaMarketplaceClient key={city || "all-locations"} initialCity={city} />;
}