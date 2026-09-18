import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Flavors } from './components/sections/Flavors';
import { Favorites } from './components/sections/Favorites';
import { Builder } from './components/sections/Builder';
import { About } from './components/sections/About';
import { Features } from './components/sections/Features';
import { Experience } from './components/sections/Experience';
import { Location } from './components/sections/Location';
import { Contact } from './components/sections/Contact';
import { useDeviceTier } from './hooks/useDeviceTier';

/* ==========================================================================
   LUNÉA — montagem da página.

   O "tier" do aparelho é calculado uma única vez aqui e descido para quem
   precisa (Hero e Experience). Assim existe uma só fonte de verdade sobre
   quanto efeito este visitante aguenta, em vez de cada componente descobrir
   isso por conta própria.
   ========================================================================== */

export function App() {
  const tier = useDeviceTier();

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <Navbar />

      <main id="conteudo">
        <Hero tier={tier} />
        <Flavors />
        <Favorites />
        <Builder />
        <About />
        <Features />
        <Experience tier={tier} />
        <Location />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
