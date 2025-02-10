import Image from "next/image";
import styles from "./page.module.css";
import { fetchCampaignData } from "./utils";
import Preview from "@/components/Preview/Preview";

export default async function Home() {
  let campaignId ="tnslpvfpp";
  
    const {campaignData, layouts} = await fetchCampaignData(campaignId);
    console.log(campaignData, layouts)
  

  return (
    <>
    <head>

    </head>
    <main>
      <Preview campaignData={campaignData} layouts={layouts} campaignId={campaignId} />
    </main>
    </>
  );
}
