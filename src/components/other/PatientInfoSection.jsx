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
          <Select name="patient_sex" id="patient_sex">
            <option value="Чоловіча">Чоловіча</option>
            <option value="Жіноча">Жіноча</option>
          </Select>
        </>
      )}
    </PatientInputGroup>
  );
};

export const InformantInfo = () => {
  return (
    <PatientInputGroup>
      <Label htmlFor="informant_name">Імʼя інформанта:</Label>
      <Input
        type="text"
        name="informant_name"
        id="informant_name"
        placeholder="Імʼя Прізвище"
        required
      />
      <Label htmlFor="informant_year">Дата народження:</Label>
      <Input
        type="text"
        name="informant_year"
        id="informant_year"
        pattern="\d{2}\.\d{2}\.\d{4}"
        placeholder="дд.мм.рррр"
        required
      />
      <Label htmlFor="informant_sex">Стать:</Label>
      <Select name="informant_sex" id="informant_sex">
        <option value="Чоловіча">Чоловіча</option>
        <option value="Жіноча">Жіноча</option>
      </Select>
      <Label htmlFor="informant_relation">Я для цієї персони:</Label>
      <Input 
      type="text"
        name="informant_relation"
        id="informant_relation"
        placeholder="чоловік/батько/інше"
        required
      />
    </PatientInputGroup>
  );
};
