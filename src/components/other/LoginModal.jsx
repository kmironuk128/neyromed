// src/components/auth/LoginModal.jsx
import React, { useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import { Button, OutlineButton } from "../ui/Button";
import { Input } from "../ui/Input";
import { Container } from "../ui/Container";
import { Subtitle } from "../ui/Title";

/**
 * Модальне вікно для входу лікаря
 * @param {Object} props
 * @param {boolean} props.isOpen - чи відкрито модальне вікно
 * @param {() => void} props.onClose - обробник закриття
 * @param {() => void} props.onSuccess - обробник успішного входу
 */
export const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  // Якщо модалка закрита — нічого не рендеримо
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      onSuccess(); // наприклад, редирект або закриття модалки
    } catch (err) {
      // Firebase повертає різні коди помилок — обробляємо найпоширеніші
      const code = err.code;
      if (code === "auth/user-not-found" || code === "auth/wrong-password") {
        setError("Невірний email або пароль");
      } else if (code === "auth/invalid-email") {
        setError("Некоректний формат email");
      } else if (code === "auth/too-many-requests") {
        setError("Забагато спроб. Спробуйте пізніше.");
      } else {
        setError("Помилка входу. Спробуйте ще раз.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    // Закриваємо тільки при кліку на overlay, а не на контент
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={handleOverlayClick}
    >
      <Container style={{maxWidth: '75%'}}>
        <Subtitle style={{ marginBottom: "1rem" }}>
          Вхід для лікаря
        </Subtitle>

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          {error && <p style={{ color: "red", margin: "10px 0" }}>{error}</p>}

          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
             <OutlineButton
             style={{  borderRadius: '7px' , padding: '2% 4%'}}
              type="button"
              onClick={onClose}
            >
              Скасувати
            </OutlineButton>
            <Button type="submit" style={{  borderRadius: '7px' , padding: '2% 4%'}} disabled={loading}>
              {loading ? "Вхід..." : "Увійти"}
            </Button>
           
          </div>
        </form>
      </Container>
    </div>
  );
};
