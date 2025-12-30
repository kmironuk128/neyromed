// src/components/questionnaire/PatientInfo.js

import { Label } from "../ui/Label";
import { Input, Select } from "../ui/Input";
import { PatientInputGroup } from "../ui/PatientInfoGroup";

export const PatientInfo = ({ includeSex = false }) => {
  return (
    <PatientInputGroup>
      <Label htmlFor="patient_name">Імʼя пацієнта:</Label>
      <Input
        type="text"
        name="patient_name"
        id="patient_name"
        placeholder="Імʼя Прізвище"
        required
      />

      <Label htmlFor="patient_year">Дата народження:</Label>
      <Input
        type="text"
        name="patient_year"
        id="patient_year"
        pattern="\d{2}\.\d{2}\.\d{4}"
        placeholder="дд.мм.рррр"
        required
      />

      {includeSex && (
        <>
          <Label htmlFor="patient_sex">Стать:</Label>
          <Select
            name="patient_sex"
            id="patient_sex"
          >
            <option value="Чоловіча">Чоловіча</option>
            <option value="Жіноча">Жіноча</option>
          </Select>
        </>
      )}
    </PatientInputGroup>
  );
};
