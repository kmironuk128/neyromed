// src/pages/CAARS.js
import { Container } from "../components/ui/Container";
import { Title } from "../components/ui/Title";
import { QuestionList } from "../components/ui/QuestionItem";
import Navigation from "../components/other/Navigation";
import { PatientInfo } from "../components/other/PatientInfoSection";
import { QuestionnaireForm } from "../components/other/QuestionnarieFrom";
import { CAARSQuestions } from "../components/questionnaire/CAARSQuestions";
import { useCAARS } from "../hooks/useCAARS";

const CAARS = () => {
  const { formRef, handleSubmit, handleQuickResult } = useCAARS();

  return (
    <Container>
      <Title>CAARS-Самооцінка: Повна версія (CAARS-S:L)</Title>

      <Navigation isBottom={false} />

      <QuestionnaireForm
        formRef={formRef}
        onSubmit={handleSubmit}
        onQuickResult={handleQuickResult}
        bothButtons={false}
      >
        <PatientInfo includeSex={true} />

        <QuestionList>
          <CAARSQuestions />
        </QuestionList>
      </QuestionnaireForm>

      <Navigation isBottom={true} />
    </Container>
  );
};

export default CAARS;
