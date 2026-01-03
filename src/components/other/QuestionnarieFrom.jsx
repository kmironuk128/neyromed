// src/components/questionnaire/QuestionnaireForm.jsx
import React from "react";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Input";
import { OutlineButton, Button } from "../ui/Button";

export const QuestionnaireForm = ({
  children,
  formRef,
  onSubmit,
  onQuickResult,
  bothButtons = true,
}) => {
  return (
    <form ref={formRef} onSubmit={onSubmit}>
      {children}

      <Label style={{ marginTop: "3rem" }} htmlFor="optional_text">
        Додатковий текст:
      </Label>
      <Textarea id="optional_text" name="optional_text" />

      {bothButtons && (
        <OutlineButton type="button" onClick={onQuickResult}>
          Швидкий результат
        </OutlineButton>
      )}

      <Button type="submit">Зберегти</Button>
    </form>
  );
};
