// src/pages/ADHD_DIVA_5.js
import React, { useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionItem, QuestionText} from "../components/ui/QuestionItem";
import { RadioGroup, RadioLabel, HiddenRadio } from "../components/ui/RadioGroup";
import { SmallTextarea } from "../components/ui/Input";
import {
  Container,
  HorizontalContainer12to80,
} from "../components/ui/Container";
import { Title, Subtitle, SmallText, ExtraBigH1 } from "../components/ui/Title";
import { PatientInfo } from "../components/other/PatientInfoSection";
import Navigation from "../components/other/Navigation";
import { QuestionnaireForm } from "../components/other/QuestionnarieFrom";
import { A_H_Group } from "../components/questionnaire/DIVA5Questions";
import { C_Group } from "../components/questionnaire/DIVA5Questions"; // припускаю, що це той самий файл
import { useAuth } from "../hooks/AuthProvider";
import { useDIVA5 } from "../hooks/useDIVA5";

const ADHD_DIVA_5 = () => {
  const { formRef, handleSubmit, handleQuickResult } = useDIVA5();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      alert("Введіть пароль для входу!");
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <Container>
      <Title>DIVA-5 Діагностичне інтерв'ю для РДУГ у дорослих</Title>
      <Navigation isBottom={false} />

      <QuestionnaireForm formRef={formRef} onSubmit={handleSubmit} onQuickResult={handleQuickResult}>
        <PatientInfo includeSex={true} />

        <SmallText>
          *Якщо діяльність включає в себе дещо близьке і цікаве (комп’ютер чи
          книга)
        </SmallText>

        {/* Частина 1: Дефіцит уваги */}
        <Section title="Частина 1: Симптоми дефіциту уваги (критерій A1 за DSM-5)">
          <IntroText />
          <A_H_Group letter="A" />
        </Section>

        {/* Частина 2: Гіперактивність/імпульсивність */}
        <Section title="Частина 2: Симптоми гіперактивності/імпульсивності (критерій A2 за DSM-5)">
          <IntroText />
          <A_H_Group letter="H" />
        </Section>

        {/* Частина 3: Порушення */}
        <Subtitle style={{ marginTop: "5%" }}>
          Частина 3: Порушення на підставі симптомів (критерій B, C та D за
          DSM-5)
        </Subtitle>

        <AgeOfOnsetSection />
        <C_Group />

        <ImpairmentQuestion period="Дорослий вік" name="part_C_adult" />
        <ImpairmentQuestion period="Дитинство" name="part_C_child" />

        <Subtitle style={{ margin: "3rem 0" }}>
          Кінець опитування. Будь ласка, продовжіть з підсумками
        </Subtitle>
      </QuestionnaireForm>

      <Navigation isBottom={true} />
    </Container>
  );
};

// Невеликі допоміжні компоненти

const IntroText = memo(() => (
  <SmallText>
    <strong>Вступ:</strong> Симптоми в дорослому віці повинні бути присутніми
    щонайменше 6 місяців. Симптоми в дитячому віці відносяться до віку 5-12
    років. Для того, щоб симптом можна було віднести до СДУГ, він повинен мати
    хронічний перебіг і не повинен бути епізодичним.
  </SmallText>
));

const Section = memo(({ title, children }) => (
  <>
    <Subtitle style={{ margin: "5% 0 3%" }}>{title}</Subtitle>
    {children}
  </>
));

// Окремий компонент для питання про вік початку
const AgeOfOnsetSection = memo(() => (
  <div>
    <HorizontalContainer12to80>
      <ExtraBigH1>B</ExtraBigH1>
      <ImpairmentQuestion
        text="Чи завжди у вас були ці симптоми дефіциту уваги та/або гіперактивності/імпульсивності?"
        name="part_B"
        showTextareaOnNo
      />
    </HorizontalContainer12to80>
  </div>
));

// Універсальний компонент для питань Так/Ні про порушення
const ImpairmentQuestion = memo(
  ({ period, text, name, showTextareaOnNo = false }) => {
    const fullText = text ? (
      text
    ) : (
      <>
        <strong>{period}:</strong> Ознаки порушення в двох або більше сферах?
      </>
    );
    return (
      <div style={{ marginBottom: "2rem" }}>
        <QuestionItem>
          <QuestionText>{fullText}</QuestionText>
          <RadioGroup columns={2}>
            <HiddenRadio name={name} value="так" id={`${name}_yes`} />
            <RadioLabel htmlFor={`${name}_yes`}>Так</RadioLabel>
            <HiddenRadio name={name} value="ні" id={`${name}_no`} />
            <RadioLabel htmlFor={`${name}_no`}>Ні</RadioLabel>
          </RadioGroup>
        </QuestionItem>

        {showTextareaOnNo && (
          <SmallTextarea
            id={`${name}_text`}
            placeholder="Якщо вище було вибрано «ні», вказати з якого віку"
          />
        )}
      </div>
    );
  }
);

export default memo(ADHD_DIVA_5);
