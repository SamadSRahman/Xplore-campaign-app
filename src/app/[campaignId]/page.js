import { notFound } from "next/navigation";
import { fetchCampaignData } from "../utils";
import Preview from "@/components/Preview/Preview";

export async function generateMetadata({ params }) {
  const { campaignId } = params;
  const { campaignData } = await fetchCampaignData(campaignId);

  if (!campaignData) {
    return {
      title: "Campaign Not Found",
      description: "This campaign does not exist.",
      openGraph: {
        title: "Campaign Not Found",
        description: "No details available for this campaign.",
      },
    };
  }

  return {
    title: campaignData.title,
    description: campaignData.description,
    openGraph: {
      title: campaignData.title,
      description: campaignData.description,
      url: `https://yourwebsite.com/campaign/${campaignId}`,
      images: [
        {
          url: campaignData.image || "https://yourwebsite.com/default-image.jpg",
          width: 1200,
          height: 630,
          alt: campaignData.title,
        },
      ],
      type: "website",
    },
    alternates: {
      canonical: `https://appclip.apple.com/id?p=com.xircular.XplorePromote.Clip`,
    },
    other: {
      "apple-itunes-app": "app-clip-bundle-id=com.xircular.XplorePromote.Clip, app-clip-display=card",
      "appstore:bundle_id": "com.xircular.xplorecampaign",
      "appstore:store_id": "com.xircular.xplorecampaign",
    },
  };
}

export default async function CampaignPage({ params }) {
  const { campaignId } = params;
  const { campaignData, layouts } = await fetchCampaignData(campaignId);

  if (!campaignData) {
    notFound();
  }

  return (
    <main>
      <Preview campaignId={campaignId} layouts={layouts} />
    </main>
  );
}
