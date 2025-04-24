"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CheckoutPage.module.css";
import { handleCreateOrder } from "@/app/utils";
import { useSearchParams } from "next/navigation";
import usePayment from "@/hooks/usePayment";

const CheckoutPage = ({router, shortId}) => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const variantId = searchParams.get("variantId");

  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [variantData, setVariantData] = useState(null);

  const {getProducts, getOrderSummary, placeOrder} = usePayment();

 

  async function handleGetProducts(){
    console.log("triggered", variantId, productId);
    const response = await getProducts(productId, variantId)
    if (response) {
      setProductData(response.prod);
      setVariantData(response.variant);
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!productId || !variantId) return;
    handleGetProducts();
  }, [productId, variantId]);

  // 3) shipping & coupons remain unchanged…
  const [shippingForm, setShippingForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    country: "",
    couponCode: "",
  });
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [currentStep, setCurrentStep] = useState("shipping");
  const validCoupons = {
    DISCOUNT10: { type: "percent", value: 10 },
    SAVE20: { type: "fixed", value: 20 },
  };



  const handleApplyCoupon = () => {
    if (!variantData) return;
    const code = shippingForm.couponCode.trim().toUpperCase();
    const coupon = validCoupons[code];
    if (!coupon) {
      setCouponApplied(false);
      setDiscount(0);
      setCouponError("Invalid coupon code");
      return;
    }
    let discountAmount =
      coupon.type === "percent"
        ? (parseFloat(variantData.price) * coupon.value) / 100
        : coupon.value;
    if (discountAmount > parseFloat(variantData.price)) {
      discountAmount = parseFloat(variantData.price);
    }
    setDiscount(discountAmount);
    setCouponApplied(true);
    setCouponError("");
  };

  const handleContinue = async () => {
    const required = [
      "name",
      "phone",
      "address",
      "city",
      "pincode",
      "country",
    ];
    if (required.every((f) => shippingForm[f].trim() !== "")) {
     const orderSummary = await getOrderSummary(productId, variantId, shippingForm.pincode);
      if (orderSummary) {
        setShipping(orderSummary.shippingCharge);
      } else {
        alert("Error fetching order summary. Please try again.");
        return;
      }
      setCurrentStep("payment");
    } else {
      alert("Please fill in all required shipping fields.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData || !variantData) return;
    const total = parseFloat(variantData.price) - discount + shipping;
    console.log("Order submitted", {
      ...shippingForm,
      couponCode: shippingForm.couponCode,
      discount,
      total,
    });
    // handleCreateOrder(productData.name, total);
    const orderDetails = await placeOrder(
      productId,
      variantId,
      shippingForm,
      total,
      shipping,
      shortId
    );
   
  };

  // 4) render
  if (loading) {
    return <div className={styles.container}>Loading product…</div>;
  }
  if (!productData || !variantData) {
    return (
      <div className={styles.container}>
        Could not load product or variant.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form className={styles.checkoutForm} onSubmit={handleSubmit}>
        {currentStep === "shipping" ? (
        
            <div key='shipping' className={styles.shippingStep}>
            <h2>Shipping Details</h2>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">
                Full Name
              </label>
              <input
                className={styles.input}
                type="text"
                id="name"
                required
                onChange={(e) =>
                  setShippingForm({ ...shippingForm, name: e.target.value })
                }
                value={shippingForm.name}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="phone">
                Phone Number
              </label>
              <input
                className={styles.input}
                type="tel"
                id="phone"
                required
                onChange={(e) =>
                  setShippingForm({ ...shippingForm, phone: e.target.value })
                }
                value={shippingForm.phone}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="address">
                Street Address
              </label>
              <input
                className={styles.input}
                type="text"
                id="address"
                required
                onChange={(e) =>
                  setShippingForm({ ...shippingForm, address: e.target.value })
                }
                value={shippingForm.address}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="city">
                City
              </label>
              <input
                className={styles.input}
                type="text"
                id="city"
                required
                onChange={(e) =>
                  setShippingForm({ ...shippingForm, city: e.target.value })
                }
                value={shippingForm.city}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="pincode">
                Postal Code
              </label>
              <input
                className={styles.input}
                type="text"
                id="pincode"
                required
                onChange={(e) =>
                  setShippingForm({
                    ...shippingForm,
                    pincode: e.target.value,
                  })
                }
                value={shippingForm.pincode}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="country">
                Country
              </label>
              <input
                className={styles.input}
                type="text"
                id="country"
                required
                onChange={(e) =>
                  setShippingForm({ ...shippingForm, country: e.target.value })
                }
                value={shippingForm.country}
              />
            </div>
            <button
              type="button"
              onClick={handleContinue}
              className={styles.continueButton}
            >
              Continue to Payment
            </button>
          </div>
        ) : (
          <div className={styles.paymentStep}>
            <div className={styles.productCard}>
              <div className={styles.productImageContainer}>
                <img
                  src={
                    productData.images[0]?.url ||
                    "/placeholder.png"
                  }
                  alt={productData.name}
                />
              </div>
              <h1 className={styles.productName}>
                {productData.name}
              </h1>
              <p className={styles.productDescription}>
                {productData.description}
              </p>
            </div>

            <h2>Payment Details</h2>
            <div className={styles.priceSummary}>
              <div className={styles.priceRow}>
                <span>Price:</span>
                <span>${parseFloat(variantData.price).toFixed(2)}</span>
              </div>
              {couponApplied && (
                <div className={styles.priceRow}>
                  <span>Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className={styles.priceRow}>
                <span>Shipping:</span>
                <span>+${shipping.toFixed(2)}</span>
              </div>
              <div className={styles.priceRow}>
                <strong>Total:</strong>
                <strong>
                  $
                  {(
                    parseFloat(variantData.price) -
                    discount +
                    shipping
                  ).toFixed(2)}
                </strong>
              </div>
            </div>

            {/* coupon input and apply button */}
            <div className={styles.formGroup}>
              <label htmlFor="couponCode">Coupon Code</label>
              <div className={styles.couponContainer}>
                <input
                  id="couponCode"
                  type="text"
                  className={styles.input}
                  value={shippingForm.couponCode}
                  onChange={(e) =>
                    setShippingForm({
                      ...shippingForm,
                      couponCode: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className={styles.applyButton}
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className={styles.errorMessage}>
                  {couponError}
                </p>
              )}
              {couponApplied && (
                <p className={styles.successMessage}>
                  Coupon applied!
                </p>
              )}
            </div>

            <div className={styles.paymentActions}>
              <button
                type="button"
                onClick={() => setCurrentStep("shipping")}
                className={styles.backButton}
              >
                Back
              </button>
              <button
                type="submit"
                className={styles.submitButton}
              >
                Place Order ($
                {(
                  parseFloat(variantData.price) -
                  discount +
                  shipping
                ).toFixed(2)}
                )
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutPage;
