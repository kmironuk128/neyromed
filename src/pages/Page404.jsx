// src/pages/CAARS.js
import { Container } from "../components/ui/Container";
import { Title } from "../components/ui/Title";

import Navigation from "../components/other/Navigation";

const Page404 = () => {
  return (
    <Container>
      <Title>Сторінку не знайдено</Title>

      <Navigation isBottom={false} />

    </Container>
  );
};

export default Page404;
