export const STORAGE_KEYS = {
  cart: "owna.cart",
  checkoutProfile: "owna.checkoutProfile",
  orders: "owna.orders",
  analytics: "owna.analytics",
  abandonedCarts: "owna.abandonedCarts",
  emails: "owna.emailLogs",
  lastActivity: "owna.lastCartActivityAt",
  latestOrder: "owna.latestOrder",
};

export function createId(prefix = "id") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getSessionId() {
  if (typeof window === "undefined") {
    return "server-session";
  }

  const existing = window.sessionStorage.getItem("owna.sessionId");
  if (existing) {
    return existing;
  }

  const sessionId = createId("session");
  window.sessionStorage.setItem("owna.sessionId", sessionId);
  return sessionId;
}

export function getDeviceType() {
  if (typeof navigator === "undefined") {
    return "unknown";
  }

  const userAgent = navigator.userAgent.toLowerCase();
  if (/tablet|ipad/.test(userAgent)) {
    return "tablet";
  }
  if (/mobile|android|iphone/.test(userAgent)) {
    return "mobile";
  }
  return "desktop";
}

export function getBrowserName() {
  if (typeof navigator === "undefined") {
    return "unknown";
  }

  const userAgent = navigator.userAgent;
  if (userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Firefox")) return "Firefox";
  return "Unknown";
}

export function getCountryFromLocale() {
  if (typeof navigator === "undefined") {
    return "Unknown";
  }

  const locale = navigator.language || "";
  const parts = locale.split("-");
  return parts[1] || "Unknown";
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function getCartTotal(cartItems) {
  return cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

export function addHours(dateString, hours) {
  return new Date(new Date(dateString).getTime() + hours * 60 * 60 * 1000);
}

export function getEmailTemplate(sequence, cart) {
  const name = cart.name || "Cliente";

  if (sequence === 1) {
    return {
      subject: "👉 ¿Olvidaste algo en tu carrito?",
      ctaLabel: "Completar compra",
      body: `Hola ${name},\n\nNotamos que dejaste algunos productos en tu carrito de OWNA.\n\nTus articulos siguen disponibles y te estan esperando.\n\nFinaliza tu compra aqui:`,
    };
  }

  if (sequence === 2) {
    return {
      subject: "👉 Tus productos favoritos aun estan disponibles",
      ctaLabel: "Regresar al carrito",
      body: `Hola ${name},\n\nLos articulos que agregaste al carrito siguen reservados temporalmente.\n\nNo pierdas la oportunidad de completar tu pedido.`,
    };
  }

  return {
    subject: "👉 Ultima oportunidad para recuperar tu carrito",
    ctaLabel: "Finalizar compra",
    body: `Hola ${name},\n\nDetectamos que tu compra sigue pendiente.\n\nVuelve ahora y termina tu pedido antes de que los productos cambien de disponibilidad.`,
  };
}
