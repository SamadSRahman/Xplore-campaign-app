import { useState, useEffect, act } from "react";
import { useSearchParams } from "next/navigation";
import DivkitRenderer from "@/components/DivkitRenderer/DivkitRenderer";
import styles from "../../components/Preview/Preview.module.css";
import { productJSON, productOne, productTwo } from "@/assets/layouts/product";
import useProduct from "@/hooks/useProduct";
import { handleBtnClick } from "@/app/utils";

export default function ProductScreen({router}) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const {getProductById} = useProduct();

  const [dynamicProductJSON, setDynamicProductJSON] = useState(productJSON);

  async function injectProductInLayout() {
    const product = await getProductById(id);
    setDynamicProductJSON((prevJSON) => ({
      ...prevJSON,
      card: {
        ...prevJSON.card,
        variables: prevJSON.card.variables.map((variable) =>
          variable.name === "product"
            ? { ...variable, value: product }
            : variable
        ),
      },
    }));
    
  }

  useEffect(() => {
    if(id){
        injectProductInLayout()
    }
    // if (id === "1") {
    //   setDynamicProductJSON((prevJSON) => ({
    //     ...prevJSON,
    //     card: {
    //       ...prevJSON.card,
    //       variables: prevJSON.card.variables.map((variable) =>
    //         variable.name === "product"
    //           ? { ...variable, value: productOne }
    //           : variable
    //       ),
    //     },
    //   }));
    // } else if (id === "2") {
    //   setDynamicProductJSON((prevJSON) => ({
    //     ...prevJSON,
    //     card: {
    //       ...prevJSON.card,
    //       variables: prevJSON.card.variables.map((variable) =>
    //         variable.name === "product"
    //           ? { ...variable, value: productTwo }
    //           : variable
    //       ),
    //     },
    //   }));
    // }
  }, [id]);

  return (
    <div className={styles.cardWrapper} style={{ margin: "auto" }}>
      <DivkitRenderer
        divkitJson={dynamicProductJSON}
        onClick={(action) => handleBtnClick(action, router, window.location.pathname.split("/")[1])}
      />
    </div>
  );
}
