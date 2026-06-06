import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { formatCurrency } from "../lib/shop-utils";

function Checkout() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    checkoutProfile,
    completeShipping,
    completePayment,
    completePurchase,
  } = useShop();
  const [step, setStep] = useState(1);
  const [shippingForm, setShippingForm] = useState({
    name: checkoutProfile.name,
    email: checkoutProfile.email,
    phone: checkoutProfile.phone,
    address: checkoutProfile.address,
    city: checkoutProfile.city,
    country: checkoutProfile.country || "Guatemala",
    shippingMethod: checkoutProfile.shippingMethod || "standard",
  });
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: checkoutProfile.paymentMethod || "card",
    cardHolder: checkoutProfile.cardHolder,
    cardNumber: "",
  });

  if (!cartItems.length) {
    return <Navigate to="/cart" replace />;
  }

  function submitShipping(event) {
    event.preventDefault();
    completeShipping(shippingForm);
    setStep(2);
  }

  function submitPayment(event) {
    event.preventDefault();
    completePayment(paymentForm);
    completePurchase();
    navigate("/confirmation");
  }

  return (
    <main className="commerce-layout">
      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Secure checkout</p>
          <h1>Checkout</h1>
        </div>

        <div className="cart-layout">
          <div className="summary-card">
            <div className="checkout-steps">
              <span className={step === 1 ? "step-pill step-pill-active" : "step-pill"}>
                1. Envio
              </span>
              <span className={step === 2 ? "step-pill step-pill-active" : "step-pill"}>
                2. Pago
              </span>
            </div>

            {step === 1 ? (
              <form className="checkout-form" onSubmit={submitShipping}>
                <label>
                  Nombre completo
                  <input
                    required
                    value={shippingForm.name}
                    onChange={(event) =>
                      setShippingForm({ ...shippingForm, name: event.target.value })
                    }
                  />
                </label>
                <label>
                  Correo electronico
                  <input
                    required
                    type="email"
                    value={shippingForm.email}
                    onChange={(event) =>
                      setShippingForm({ ...shippingForm, email: event.target.value })
                    }
                  />
                </label>
                <label>
                  Telefono
                  <input
                    required
                    value={shippingForm.phone}
                    onChange={(event) =>
                      setShippingForm({ ...shippingForm, phone: event.target.value })
                    }
                  />
                </label>
                <label>
                  Direccion
                  <input
                    required
                    value={shippingForm.address}
                    onChange={(event) =>
                      setShippingForm({ ...shippingForm, address: event.target.value })
                    }
                  />
                </label>
                <label>
                  Ciudad
                  <input
                    required
                    value={shippingForm.city}
                    onChange={(event) =>
                      setShippingForm({ ...shippingForm, city: event.target.value })
                    }
                  />
                </label>
                <label>
                  Pais
                  <input
                    required
                    value={shippingForm.country}
                    onChange={(event) =>
                      setShippingForm({ ...shippingForm, country: event.target.value })
                    }
                  />
                </label>
                <label>
                  Metodo de envio
                  <select
                    value={shippingForm.shippingMethod}
                    onChange={(event) =>
                      setShippingForm({
                        ...shippingForm,
                        shippingMethod: event.target.value,
                      })
                    }
                  >
                    <option value="standard">Standard 3-5 dias</option>
                    <option value="express">Express 24h</option>
                  </select>
                </label>
                <button className="primary-button" type="submit">
                  Continuar a pago
                </button>
              </form>
            ) : (
              <form className="checkout-form" onSubmit={submitPayment}>
                <label>
                  Metodo de pago
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(event) =>
                      setPaymentForm({
                        ...paymentForm,
                        paymentMethod: event.target.value,
                      })
                    }
                  >
                    <option value="card">Tarjeta</option>
                    <option value="cash">Pago contra entrega</option>
                  </select>
                </label>
                <label>
                  Titular de la tarjeta
                  <input
                    required={paymentForm.paymentMethod === "card"}
                    value={paymentForm.cardHolder}
                    onChange={(event) =>
                      setPaymentForm({
                        ...paymentForm,
                        cardHolder: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Numero de tarjeta
                  <input
                    required={paymentForm.paymentMethod === "card"}
                    value={paymentForm.cardNumber}
                    onChange={(event) =>
                      setPaymentForm({
                        ...paymentForm,
                        cardNumber: event.target.value.replace(/\D/g, "").slice(0, 16),
                      })
                    }
                    placeholder="4242424242424242"
                  />
                </label>
                <button className="secondary-button" type="button" onClick={() => setStep(1)}>
                  Volver
                </button>
                <button className="primary-button" type="submit">
                  Finalizar compra
                </button>
              </form>
            )}
          </div>

          <aside className="summary-card">
            <h2>Tu pedido</h2>
            {cartItems.map((item) => (
              <div className="summary-row" key={item.id}>
                <span>
                  {item.name} x {item.quantity}
                </span>
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
              </div>
            ))}
            <div className="summary-row summary-total">
              <span>Total</span>
              <strong>{formatCurrency(cartTotal)}</strong>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Checkout;
