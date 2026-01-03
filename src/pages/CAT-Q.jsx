// src/pages/WURS.js
import React from "react";

import Navigation from "../components/other/Navigation";
import { Container } from "../components/ui/Container";
import { Title } from "../components/ui/Title";
import { QuestionList } from "../components/ui/QuestionItem";
import { PatientInfo } from "../components/other/PatientInfoSection";
import { QuestionnaireForm } from "../components/other/QuestionnarieFrom";
import { CATQuestions } from "../components/questionnaire/CATQuestions";
import { useCAT } from '../hooks/useCAT';


const CAT_Q = () => {
  const { formRef, handleSubmit } = useCAT();
 
  return (
    <Container>
      <Title>
        Опитувальник маскування аутичних рис (CAT-Q)
      </Title>

      <Navigation isBottom={false} />

      <QuestionnaireForm
        formRef={formRef}
        onSubmit={handleSubmit}
        bothButtons={false}
      >
        <PatientInfo includeSex={true} />

        <QuestionList>
          <CATQuestions />
        </QuestionList>
      </QuestionnaireForm>

      <Navigation isBottom={true} />
    </Container>
  );
};

export default CAT_Q;
