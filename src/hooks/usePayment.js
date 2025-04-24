import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";

export default function usePayment() {
  const campaignId = localStorage.getItem("longId");
  const accessToken = localStorage.getItem("endUserToken");
  const getEncodedKey = async () => {
    const { data } = await axios.get("https://xplr.live/api/v1/auth/key");
    return data.key;
  };
  const getProducts = async (productId, variantId) => {
    console.log("triggered", variantId, productId);
    try {
      const encodedKey = await getEncodedKey();
      const res = await fetch(`https://xplr.live/api/v1/product/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-encrypted-auth": encodedKey,
        },
      });
      if (!res.ok) throw new Error("Fetch product failed");
      const json = await res.json();
      const prod = json.data;
      const variant = prod.ProductVariants.find((v) => v.id === variantId);

      return { prod, variant };
    } catch (e) {
      console.error("Error fetching product:", e);
    }
  };
  const getOrderSummary = async (productId, variantId, pincode) => {
    try {
      const response = await axios.post(
        `https://xplr.live/api/v1/payment/order-summery`,
        {
          campaignId: campaignId,
          productId: productId,
          variantId: variantId,
          quantity: 1,
          shippingPincode: pincode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const { data } = response.data;
      console.log("Buy now response", data);
      return { total: data.total, shippingCharge: data.shippingCharge };
    } catch (error) {
      console.error("Error buying product:", error);
      return false;
    }
  };

  const placeOrder = async (
    productId,
    variantId,
    shippingDetails,
    total,
    shippingCharge,
    shortId
  ) => {
try {
    const response = await axios.post(
      `https://xplr.live/api/v1/payment/order`,
      {
        campaignId: campaignId,
        productId: productId,
        variantId: variantId,
        quantity: 1,
        shippingAddress: shippingDetails,
        total: total,
        shippingCharge: shippingCharge,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const { data } = response.data;
    console.log("Order placed:", data);
    localStorage.setItem("orderId", data.order.id);
    let checkoutOptions = {
        paymentSessionId: data.payment.payment_session_id,
        returnUrl:
          `${window.location.origin}/${shortId}/orderStatus?orderId=${data.order.id}`, // URL to redirect after payment
      };
      try {
        const cashfree = await load({
          mode:"sandbox", //or production
          // redirectTarget: "_self" 
      });
      
        cashfree.checkout(checkoutOptions).then(function (result) {
          if (result.error) {
            alert(result.error);
          }
          if (result.redirect) {
            console.log("redirection");
            console.log(result);
          }
        });
      } catch (error) {
        console.error("Error creating order:", error);
        
      }
    
    return data;

} catch (error) {
    error.response && error.response.data
      ? console.error("Error placing order:", error.response.data)
      : console.error("Error placing order:", error);
}

  };
  return {
    getProducts,
    getOrderSummary,
    placeOrder,
  };
}
