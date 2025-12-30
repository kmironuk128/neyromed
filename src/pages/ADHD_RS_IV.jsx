// src/pages/ADHD_RS_IV.js
import React, { useEffect, useState } from "react";
import { Container } from "../components/ui/Container";
import { Title } from "../components/ui/Title";
import { QuestionList } from "../components/ui/QuestionItem";
import Navigation from "../components/other/Navigation";
import { PatientInfo } from "../components/other/PatientInfoSection";
import { QuestionnaireForm } from "../components/other/QuestionnarieFrom";
import { ADHDRSQuestions } from "../components/questionnaire/ADHDRSQuestions";
import { useADHDRS } from "../hooks/useADHDRS";
import { useAuth } from "../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";

const ADHD_RS_IV = () => {
  const { formRef, handleSubmit, handleQuickResult, maxes, updateAllMaxes } = useADHDRS();

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      alert('Введіть пароль для входу!')
      navigate('/');
    }
  }, [currentUser, navigate]);


  useEffect(() => {
    const timer = setTimeout(() => {
      updateAllMaxes();
    }, 500);

    return () => clearTimeout(timer);
  }, [formRef, updateAllMaxes]);

  return (
    <Container>
      <Title>Рейтингова шкала оцінки РДУГ (ADHD-RS-IV) для дорослих</Title>

      <Navigation isBottom={false} />

      <QuestionnaireForm
        formRef={formRef}
        onSubmit={handleSubmit}
        onQuickResult={handleQuickResult}
      >
        <PatientInfo />

        <QuestionList>
          <ADHDRSQuestions maxes={maxes} />
        </QuestionList>
      </QuestionnaireForm>

      <Navigation isBottom={true} />
    </Container>
  );
};

export default ADHD_RS_IV;