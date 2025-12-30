// src/pages/Wechsler.js
import { Container } from "../components/ui/Container";
import { Title, Subtitle } from "../components/ui/Title";
import Navigation from "../components/other/Navigation";
import { PatientInfo } from "../components/other/PatientInfoSection";
import { QuestionnaireForm } from "../components/other/QuestionnarieFrom";
import { WechslerForm } from "../components/questionnaire/WechslerQuestions";
import { useWechsler } from "../hooks/useWechsler";
import { QuestionList } from "../components/ui/QuestionItem";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import { useEffect } from "react";

const Wechsler = () => {
  const { formRef, handleSubmit, handleQuickResult } = useWechsler();

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      alert('Введіть пароль для входу!')
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <Container>
      <Title>Тест Векслера для дітей (WISC)</Title>

      <Navigation isBottom={false} />

      <QuestionnaireForm
        formRef={formRef}
        onSubmit={handleSubmit}
        onQuickResult={handleQuickResult}
      >
        <PatientInfo />

        <Subtitle>Сирі бали субтестів</Subtitle>

        <QuestionList>
          <WechslerForm />
        </QuestionList>
      </QuestionnaireForm>

      <Navigation isBottom={true} />
    </Container>
  );
};

export default Wechsler;
