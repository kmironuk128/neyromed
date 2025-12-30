import { Container } from "../components/ui/Container";
import { Title } from "../components/ui/Title";
import {
  CardsHolder,
  Card,
  CardTitle,
  ImageWrapper,
  CoverImage,
} from "../components/ui/Card";
import { CARDS } from "../data/CARDS_data";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LoginModal } from "../components/other/LoginModal";
import { useAuth } from "../hooks/AuthProvider";

const MainPage = () => {
  const PROTECTED_ROUTES = useMemo(() => {
    const envValue = import.meta.env.VITE_PROTECTED_ROUTES || "";
    if (!envValue) return [];
    return envValue.split(",").map((path) => path.trim());
  }, []);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingPath, setPendingPath] = useState("");
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleCardClick = (path) => {
    if (PROTECTED_ROUTES.includes(path)) {
      if (currentUser) {
        navigate(path);
        return;
      }
      setPendingPath(path);
      setShowLoginModal(true);
    } else {
      navigate(path);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    navigate(pendingPath);
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
    setPendingPath("");
  };

  return (
    <Container>
      <Title>Опитувальники Медичного центру Нейромед</Title>
      {/* <button onClick={() => logout()}>ВИЙТИ</button> */}

      <CardsHolder>
        {CARDS.map((card, index) => (
          <Card
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCardClick(card.to);
            }}
            style={{ cursor: "pointer" }}
          >
            <ImageWrapper>
              <CoverImage src={card.cover} alt={card.title} />
            </ImageWrapper>
            <CardTitle>{card.title}</CardTitle>
          </Card>
        ))}
      </CardsHolder>

      <LoginModal
        isOpen={showLoginModal}
        onClose={handleModalClose}
        onSuccess={handleLoginSuccess}
      />
    </Container>
  );
};

export default MainPage;
