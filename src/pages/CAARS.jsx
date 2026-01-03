// src/pages/CAARS.js
import { Container } from "../components/ui/Container";
import { Title, SmallText } from "../components/ui/Title";
import { QuestionList } from "../components/ui/QuestionItem";
import Navigation from "../components/other/Navigation";
import { PatientInfo } from "../components/other/PatientInfoSection";
import { QuestionnaireForm } from "../components/other/QuestionnarieFrom";
import { CAARSQuestions } from "../components/questionnaire/CAARSQuestions";
import { useCAARS } from "../hooks/useCAARS";

const CAARS = () => {
  const { formRef, handleSubmit } = useCAARS({
    size: "full",
  });

  return (
    <Container>
      <Title>CAARS-Самооцінка: Повна версія (CAARS-S:L)</Title>

      <Navigation isBottom={false} />

      <QuestionnaireForm
        formRef={formRef}
        onSubmit={handleSubmit}
        bothButtons={false}
      >
        <PatientInfo includeSex={true} />

        <SmallText>
          0 = Зовсім не стосується, ніколи; 1 = Трохи, іноді; 2 = Досить часто;
          3 = Дуже сильно, дуже часто
        </SmallText>
        <QuestionList>
          <CAARSQuestions size="full" />
        </QuestionList>
      </QuestionnaireForm>

      <Navigation isBottom={true} />
    </Container>
  );
};

export default CAARS;
