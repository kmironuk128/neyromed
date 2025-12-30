// src/pages/ASRS.js

import { Container } from "../components/ui/Container";
import { Title } from "../components/ui/Title";
import { Subtitle } from "../components/ui/Title";
import { QuestionList } from "../components/ui/QuestionItem";
import Navigation from "../components/other/Navigation";
import { PatientInfo } from "../components/other/PatientInfoSection";
import { QuestionnaireForm } from "../components/other/QuestionnarieFrom";
import { ASRSQuestions } from "../components/questionnaire/ASRSQuestions";
import { QUESTIONS_PART_A, QUESTIONS_PART_B } from "../data/ASRS_data";
import { useASRS } from "../hooks/useASRS";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import { useEffect } from "react";

const ASRS = () => {
  const { formRef, handleSubmit, handleQuickResult } = useASRS();
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
      <Title>Шкала самооцінки РДУГ для дорослих (ASRS v1.1)</Title>

      <Navigation isBottom={false} />

      <QuestionnaireForm
        formRef={formRef}
        onSubmit={handleSubmit}
        onQuickResult={handleQuickResult}
      >
        <PatientInfo />

        <Subtitle>Частина А</Subtitle>
        <QuestionList>
          <ASRSQuestions part={QUESTIONS_PART_A} letter='A'/>
        </QuestionList>

        <Subtitle>Частина Б</Subtitle>
        <QuestionList>
          <ASRSQuestions part={QUESTIONS_PART_B} letter='B' />
        </QuestionList>
      </QuestionnaireForm>

      <Navigation isBottom={true} />
    </Container>
  );
};

export default ASRS;
