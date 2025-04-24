"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DivkitRenderer from "@/components/DivkitRenderer/DivkitRenderer";
import styles from "../../components/Preview/Preview.module.css";
import { productJSON, productOne, productTwo } from "@/assets/layouts/product";

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [dynamicProductJSON, setDynamicProductJSON] = useState(productJSON);

  useEffect(() => {
    if (id === "1") {
      setDynamicProductJSON((prevJSON) => ({
        ...prevJSON,
        card: {
          ...prevJSON.card,
          variables: prevJSON.card.variables.map((variable) =>
            variable.name === "product"
              ? { ...variable, value: productOne }
              : variable
          ),
        },
      }));
    } else if (id === "2") {
      setDynamicProductJSON((prevJSON) => ({
        ...prevJSON,
        card: {
          ...prevJSON.card,
          variables: prevJSON.card.variables.map((variable) =>
            variable.name === "product"
              ? { ...variable, value: productTwo }
              : variable
          ),
        },
      }));
    }
  }, [id]);

  return (
    <div className={styles.cardWrapper} style={{ margin: "auto" }}>
      <DivkitRenderer
        divkitJson={dynamicProductJSON}
        onClick={() => console.log("action triggered")}
      />
    </div>
  );
}
