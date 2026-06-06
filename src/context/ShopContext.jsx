import { createContext, useContext, useEffect, useState } from "react";
import { readStorage, writeStorage } from "../lib/storage";
import {
  STORAGE_KEYS,
  addHours,
  createId,
  getBrowserName,
  getCartTotal,
  getCountryFromLocale,
  getDeviceType,
  getEmailTemplate,
  getSessionId,
} from "../lib/shop-utils";

const ShopContext = createContext(null);
const ABANDONMENT_MS = 60 * 60 * 1000;

function buildEvent(event, profile, page, extra = {}) {
  return {
    id: createId("evt"),
    event,
    timestamp: new Date().toISOString(),
    user: profile.email || profile.name || "guest",
    session: getSessionId(),
    page,
    device: getDeviceType(),
    country: getCountryFromLocale(),
    browser: getBrowserName(),
    ...extra,
  };
}

export function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState(() =>
    readStorage(STORAGE_KEYS.cart, [])
  );
  const [checkoutProfile, setCheckoutProfile] = useState(() =>
    readStorage(STORAGE_KEYS.checkoutProfile, {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      shippingMethod: "standard",
      paymentMethod: "card",
      cardHolder: "",
      cardLast4: "",
    })
  );
  const [orders, setOrders] = useState(() =>
    readStorage(STORAGE_KEYS.orders, [])
  );
  const [analyticsEvents, setAnalyticsEvents] = useState(() =>
    readStorage(STORAGE_KEYS.analytics, [])
  );
  const [abandonedCarts, setAbandonedCarts] = useState(() =>
    readStorage(STORAGE_KEYS.abandonedCarts, [])
  );
  const [emailLogs, setEmailLogs] = useState(() =>
    readStorage(STORAGE_KEYS.emails, [])
  );
  const [lastCartActivityAt, setLastCartActivityAt] = useState(() =>
    readStorage(STORAGE_KEYS.lastActivity, null)
  );

  useEffect(() => writeStorage(STORAGE_KEYS.cart, cartItems), [cartItems]);
  useEffect(
    () => writeStorage(STORAGE_KEYS.checkoutProfile, checkoutProfile),
    [checkoutProfile]
  );
  useEffect(() => writeStorage(STORAGE_KEYS.orders, orders), [orders]);
  useEffect(
    () => writeStorage(STORAGE_KEYS.analytics, analyticsEvents),
    [analyticsEvents]
  );
  useEffect(
    () => writeStorage(STORAGE_KEYS.abandonedCarts, abandonedCarts),
    [abandonedCarts]
  );
  useEffect(() => writeStorage(STORAGE_KEYS.emails, emailLogs), [emailLogs]);
  useEffect(
    () => writeStorage(STORAGE_KEYS.lastActivity, lastCartActivityAt),
    [lastCartActivityAt]
  );

  function trackEvent(event, page, extra = {}) {
    setAnalyticsEvents((current) => [
      ...current,
      buildEvent(event, checkoutProfile, page, extra),
    ]);
  }

  function touchCartActivity() {
    setLastCartActivityAt(new Date().toISOString());
  }

  function addToCart(product) {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.image,
          price: product.price,
          quantity: 1,
        },
      ];
    });

    touchCartActivity();
    trackEvent("product_added_to_cart", `/product/${product.slug}`, {
      productId: product.id,
      productName: product.name,
    });
  }

  function updateCartQuantity(productId, quantity) {
    setCartItems((current) =>
      current
        .map((item) =>
          item.id === productId ? { ...item, quantity: Number(quantity) } : item
        )
        .filter((item) => item.quantity > 0)
    );

    touchCartActivity();
  }

  function removeFromCart(productId) {
    setCartItems((current) => current.filter((item) => item.id !== productId));
    touchCartActivity();
  }

  function viewProduct(product, page) {
    trackEvent("product_viewed", page, {
      productId: product.id,
      productName: product.name,
    });
  }

  function startCheckout() {
    trackEvent("checkout_started", "/checkout", {
      cartSize: cartItems.length,
      total: getCartTotal(cartItems),
    });
    touchCartActivity();
  }

  function saveCartLead(data) {
    setCheckoutProfile((current) => ({ ...current, ...data }));
  }

  function completeShipping(data) {
    const nextProfile = { ...checkoutProfile, ...data };
    setCheckoutProfile(nextProfile);
    trackEvent("shipping_info_completed", "/checkout", {
      shippingMethod: data.shippingMethod || nextProfile.shippingMethod,
    });
    touchCartActivity();
  }

  function completePayment(data) {
    const sanitized = {
      paymentMethod: data.paymentMethod,
      cardHolder: data.cardHolder,
      cardLast4: data.cardNumber.slice(-4),
    };

    setCheckoutProfile((current) => ({ ...current, ...sanitized }));
    trackEvent("payment_info_completed", "/checkout", {
      paymentMethod: data.paymentMethod,
    });
    touchCartActivity();
  }

  function markRecovered(order) {
    setAbandonedCarts((current) =>
      current.map((cart) => {
        const sameEmail =
          cart.email && order.email && cart.email.toLowerCase() === order.email.toLowerCase();
        const sameSession = cart.sessionId === order.sessionId;

        if ((sameEmail || sameSession) && !cart.recoveredAt) {
          return {
            ...cart,
            recoveredAt: new Date().toISOString(),
            status: "recovered",
          };
        }

        return cart;
      })
    );
  }

  function completePurchase() {
    const order = {
      id: createId("order"),
      sessionId: getSessionId(),
      name: checkoutProfile.name,
      email: checkoutProfile.email,
      items: cartItems,
      total: getCartTotal(cartItems),
      createdAt: new Date().toISOString(),
    };

    setOrders((current) => [...current, order]);
    writeStorage(STORAGE_KEYS.latestOrder, order);
    trackEvent("purchase_completed", "/confirmation", {
      orderId: order.id,
      total: order.total,
    });
    markRecovered(order);
    setCartItems([]);
    setLastCartActivityAt(null);
  }

  function ensureAbandonedCart(reason = "inactivity") {
    if (!cartItems.length || !lastCartActivityAt) {
      return;
    }

    const elapsed = Date.now() - new Date(lastCartActivityAt).getTime();
    if (elapsed < ABANDONMENT_MS) {
      return;
    }

    const hasOpenRecord = abandonedCarts.some((cart) => {
      const sameEmail =
        cart.email &&
        checkoutProfile.email &&
        cart.email.toLowerCase() === checkoutProfile.email.toLowerCase();
      const sameSession = cart.sessionId === getSessionId();
      return (sameEmail || sameSession) && !cart.recoveredAt;
    });

    if (hasOpenRecord) {
      return;
    }

    const record = {
      id: createId("abandoned"),
      userId: checkoutProfile.email || getSessionId(),
      sessionId: getSessionId(),
      email: checkoutProfile.email || "",
      name: checkoutProfile.name || "",
      products: cartItems,
      total: getCartTotal(cartItems),
      abandonedAt: new Date().toISOString(),
      email1Sent: false,
      email2Sent: false,
      email3Sent: false,
      recoveredAt: null,
      status: "open",
      reason,
    };

    setAbandonedCarts((current) => [...current, record]);
    trackEvent("cart_abandoned_detected", window.location.pathname, {
      abandonedCartId: record.id,
      total: record.total,
      reason,
    });
  }

  function processRecoveryEmails() {
    const now = new Date();
    const logsToAdd = [];

    const nextCarts = abandonedCarts.map((cart) => {
      if (cart.recoveredAt || !cart.email) {
        return cart;
      }

      let updatedCart = { ...cart };
      const checkpoints = [
        { key: "email1Sent", hours: 1, sequence: 1 },
        { key: "email2Sent", hours: 12, sequence: 2 },
        { key: "email3Sent", hours: 24, sequence: 3 },
      ];

      checkpoints.forEach((checkpoint) => {
        const dueAt = addHours(cart.abandonedAt, checkpoint.hours);
        if (now >= dueAt && !updatedCart[checkpoint.key]) {
          const template = getEmailTemplate(checkpoint.sequence, cart);
          logsToAdd.push({
            id: createId(`email-${checkpoint.sequence}`),
            cartId: cart.id,
            email: cart.email,
            sequence: checkpoint.sequence,
            subject: template.subject,
            body: template.body,
            ctaLabel: template.ctaLabel,
            ctaUrl: "/cart",
            sentAt: now.toISOString(),
            openedAt: null,
          });

          updatedCart[checkpoint.key] = true;
        }
      });

      return updatedCart;
    });

    if (logsToAdd.length) {
      setAbandonedCarts(nextCarts);
      setEmailLogs((current) => [...current, ...logsToAdd]);
    }
  }

  function markEmailOpened(emailId) {
    setEmailLogs((current) =>
      current.map((log) =>
        log.id === emailId && !log.openedAt
          ? { ...log, openedAt: new Date().toISOString() }
          : log
      )
    );
  }

  function simulateAbandonmentNow() {
    const simulatedAt = new Date(Date.now() - ABANDONMENT_MS - 60000).toISOString();
    setLastCartActivityAt(simulatedAt);
  }

  function accelerateEmailSequence() {
    setAbandonedCarts((current) =>
      current.map((cart) =>
        cart.recoveredAt
          ? cart
          : {
              ...cart,
              abandonedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
            }
      )
    );
  }

  function clearDemoData() {
    setCartItems([]);
    setCheckoutProfile({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      shippingMethod: "standard",
      paymentMethod: "card",
      cardHolder: "",
      cardLast4: "",
    });
    setOrders([]);
    setAnalyticsEvents([]);
    setAbandonedCarts([]);
    setEmailLogs([]);
    setLastCartActivityAt(null);
    writeStorage(STORAGE_KEYS.latestOrder, null);
  }

  useEffect(() => {
    ensureAbandonedCart("inactivity");
    processRecoveryEmails();

    const interval = window.setInterval(() => {
      ensureAbandonedCart("inactivity");
      processRecoveryEmails();
    }, 60000);

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        ensureAbandonedCart("left_site");
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleVisibilityChange);
    };
  }, [cartItems, lastCartActivityAt, abandonedCarts, checkoutProfile.email, checkoutProfile.name]);

  const value = {
    cartItems,
    checkoutProfile,
    orders,
    analyticsEvents,
    abandonedCarts,
    emailLogs,
    cartTotal: getCartTotal(cartItems),
    addToCart,
    updateCartQuantity,
    removeFromCart,
    viewProduct,
    startCheckout,
    saveCartLead,
    completeShipping,
    completePayment,
    completePurchase,
    markEmailOpened,
    clearDemoData,
    ensureAbandonedCart,
    processRecoveryEmails,
    simulateAbandonmentNow,
    accelerateEmailSequence,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used inside ShopProvider");
  }

  return context;
}
