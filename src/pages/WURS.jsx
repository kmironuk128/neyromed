// src/pages/WURS.js
import React from "react";

import Navigation from "../components/other/Navigation";
import { Container } from "../components/ui/Container";
import { Title } from "../components/ui/Title";
import { QuestionList } from "../components/ui/QuestionItem";
import { PatientInfo } from "../components/other/PatientInfoSection";
import { QuestionnaireForm } from "../components/other/QuestionnarieFrom";
import { WURSQuestions } from "../components/questionnaire/WURSQuestions";
import { useWURS } from '../hooks/useWURS';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import { useEffect } from "react";

const WURS = () => {
  const { formRef, handleSubmit, handleQuickResult } = useWURS();
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
      <Title>
        Вендер-Ютська шкала оцінювання симптомів РДУГ в дитинстві (WURS-25)
      </Title>

      <Navigation isBottom={false} />

      <QuestionnaireForm
        formRef={formRef}
        onSubmit={handleSubmit}
        onQuickResult={handleQuickResult}
      >
        <PatientInfo />

        <QuestionList>
          <WURSQuestions />
        </QuestionList>
      </QuestionnaireForm>

      <Navigation isBottom={true} />
    </Container>
  );
};

export default WURS;
