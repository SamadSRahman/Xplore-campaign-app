import { notFound } from "next/navigation";
import { fetchCampaignData } from "../utils";

export default async function CampaignPage({ params }) {
  const { campaignId } = params;
  const { campaignData, layouts } = await fetchCampaignData(campaignId);

  if (!campaignData) {
    notFound();
  }

  return (
   <>
     <head>
      <link rel="icon" href={campaignData.image} sizes="256x256" type="image/x-icon"></link>
        <title>{campaignData.title}</title>
        <meta name="description" content={campaignData.description} />
        <meta property="og:title" content={campaignData.title} />
        <meta property="og:description" content={campaignData.description} />
        <meta property="og:image" content={campaignData.image} />
      </head>
   </>
  );
}
