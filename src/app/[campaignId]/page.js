import { notFound, redirect } from "next/navigation";
import { fetchCampaignData } from "../utils";

export default async function CampaignPage({ params }) {
  const { campaignId } = params;
  const { campaignData, layouts } = await fetchCampaignData(campaignId);

  if (!campaignData) {
    notFound();
  }

  const splashScreenLayout = layouts.find((layout) => layout.name === "splash_screen");

  // 2️⃣ If "splash_screen" exists, redirect to it
  if (splashScreenLayout) {
    redirect(`/${campaignId}/splash_screen`);
  }

  // 3️⃣ If "splash_screen" does not exist, find the initial layout
  const initialLayout = layouts.find((layout) => layout.isInitial === true);

  // 4️⃣ If an initial layout exists, redirect to it
  if (initialLayout) {
    redirect(`/${campaignId}/${initialLayout.name}`);
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
