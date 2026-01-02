// src/pages/CAARS.js
import { Container } from "../components/ui/Container";
import { Title, SmallText, SectionTitle } from "../components/ui/Title";
import { QuestionList } from "../components/ui/QuestionItem";
import Navigation from "../components/other/Navigation";
import { PatientInfo } from "../components/other/PatientInfoSection";
import { QuestionnaireForm } from "../components/other/QuestionnarieFrom";
import { InformantInfo } from "../components/other/PatientInfoSection";
import { CAARSQuestions } from "../components/questionnaire/CAARSQuestions";
import { useCAARS } from "../hooks/useCAARS";

const CAARS_Small = () => {
  const { formRef, handleSubmit, handleQuickResult } = useCAARS({ size: "small" });

  return (
    <Container>
      <Title>CAARS-Інформант: Коротка версія (CAARS-O:S)</Title>

      <Navigation isBottom={false} />

      <QuestionnaireForm
        formRef={formRef}
        onSubmit={handleSubmit}
        onQuickResult={handleQuickResult}
        bothButtons={false}
      >
        <SectionTitle><strong>Інформація про пацієнта</strong></SectionTitle>
        <PatientInfo includeSex={true} />
        <SectionTitle><strong>Інформація про інформанта</strong></SectionTitle>
        <InformantInfo />

       <SmallText>
0 = Зовсім не стосується, ніколи; 
1 = Трохи, іноді; 
2 = Досить часто; 
3 = Дуже сильно, дуже часто</SmallText>

        <QuestionList>
          <CAARSQuestions size='small' />
        </QuestionList>
      </QuestionnaireForm>

      <Navigation isBottom={true} />
    </Container>
  );
};

export default CAARS_Small;
