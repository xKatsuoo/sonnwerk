import { ScrollStory } from "@/components/scroll-story/ScrollStory";
import { Vorteile } from "@/sections/Vorteile";
import { WarumPhotovoltaik } from "@/sections/WarumPhotovoltaik";
import { Stromspeicher } from "@/sections/Stromspeicher";
import { Wallbox } from "@/sections/Wallbox";
import { Foerderungen } from "@/sections/Foerderungen";
import { Ablauf } from "@/sections/Ablauf";
import { Referenzen } from "@/sections/Referenzen";
import { Faq } from "@/sections/Faq";
import { Kontakt } from "@/sections/Kontakt";

export default function Home() {
  return (
    <>
      <ScrollStory />
      <Vorteile />
      <WarumPhotovoltaik />
      <Stromspeicher />
      <Wallbox />
      <Foerderungen />
      <Ablauf />
      <Referenzen />
      <Faq />
      <Kontakt />
    </>
  );
}
