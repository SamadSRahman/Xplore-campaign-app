import { notFound } from "next/navigation";
import { fetchCampaignData } from "../utils";
import ClientRedirect from "../../components/ClientRedirect";

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
  };
}

// Page component
export default async function CampaignPage({ params }) {
  const { campaignId } = params;
  const { campaignData, layouts } = await fetchCampaignData(campaignId);

  if (!campaignData) {
    notFound();
  }

  const splashScreenLayout = layouts.find((layout) => layout.name === "splash_screen");
  const initialLayout = layouts.find((layout) => layout.isInitial === true);

  let redirectPath = null;
  if (splashScreenLayout) {
    redirectPath = `/${campaignId}/splash_screen`;
  } else if (initialLayout) {
    redirectPath = `/${campaignId}/${initialLayout.name}`;
  }

  return <ClientRedirect  redirectPath={redirectPath} />;
}