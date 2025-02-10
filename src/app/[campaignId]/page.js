import { notFound, redirect } from "next/navigation";
import { fetchCampaignData } from "../utils";
import ClientRedirect from "../../components/ClientRedirect";
import { headers } from "next/headers";

// Metadata generation
export async function generateMetadata({ params }) {
  const { campaignId } = params;
  const { campaignData } = await fetchCampaignData(campaignId);

  if (!campaignData) return {};

  return {
    title: campaignData.title,
    description: campaignData.description,
    openGraph: {
      title: campaignData.title,
      description: campaignData.description,
      images: [{ url: campaignData.image }],
    },
    icons: {
      icon: campaignData.image,
    },
    appleItunesApp: {
      "app-clip-bundle-id": "com.xircular.XplorePromote.Clip",
      "app-clip-display": "card",
    },
  };
}

// Page component
export default async function CampaignPage({ params }) {
  const { campaignId } = params;

  // Fetch campaign data with error handling
  let campaignData, layouts;
  try {
    const result = await fetchCampaignData(campaignId);
    campaignData = result.campaignData;
    layouts = result.layouts;
  } catch (error) {
    console.error("Failed to fetch campaign data:", error);
    notFound();
  }

  // Handle missing campaign data
  if (!campaignData) {
    notFound();
  }

  // Check if the user is on an iOS device and if they're NOT using Chrome (i.e., not "CriOS")
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isiOS = /iPhone|iPad|iPod/.test(userAgent);
  const isChrome = /CriOS/.test(userAgent);

  // If on iOS and not using Chrome, perform the App Clip redirect.
  // if (isiOS && !isChrome) {
  //   redirect(
  //     `https://appclip.apple.com/id?p=com.xircular.XplorePromote.Clip&shortId=${campaignId}`
  //   );
  // }

  // Determine the redirect path based on layouts for client-side redirection
  const splashScreenLayout = layouts?.find(
    (layout) => layout.name === "splash_screen"
  );
  const initialLayout = layouts?.find((layout) => layout.isInitial === true);

  let redirectPath = null;
  if (splashScreenLayout) {
    redirectPath = `/${campaignId}/splash_screen`;
  } else if (initialLayout) {
    redirectPath = `/${campaignId}/${initialLayout.name}`;
  }

  // Render the page with a client-side redirect component if needed.
  return <ClientRedirect redirectPath={redirectPath} />;
}
