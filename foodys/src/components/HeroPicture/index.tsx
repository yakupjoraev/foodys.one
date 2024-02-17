import Image from "next/image";
import burgersSrc from "./img/burgers.png";
import sushiSrc from "./img/sushi.png";
import saladeSrc from "./img/salade.png";
import steakSrc from "./img/steak.png";
import spaghettiSrc from "./img/spaghetti.png";
import dessertSrc from "./img/dessert.png";

export interface HeroPictureProps {
  picId: number;
}

export function HeroPicture(props: HeroPictureProps) {
  switch (props.picId) {
    case 1: {
      return (
        <div className="hero__picture hero__picture--burger">
          <Image src={burgersSrc} alt="#Burgers!" />
        </div>
      );
    }
    case 2: {
      return (
        <div className="hero__picture">
          <Image src={sushiSrc} alt="#Sushi!" />
        </div>
      );
    }
    case 3: {
      return (
        <div className="hero__picture hero__picture--salade">
          <Image src={saladeSrc} alt="#Salade!" />
        </div>
      );
    }
    case 4: {
      return (
        <div className="hero__picture hero__picture--steak">
          <Image src={steakSrc} alt="#Steak!" />
        </div>
      );
    }
    case 5: {
      return (
        <div className="hero__picture hero__picture--pasta">
          <Image src={spaghettiSrc} alt="#Spaghetti!" />
        </div>
      );
    }
    case 6: {
      return (
        <div className="hero__picture hero__picture--pizza">
          <picture>
            <source
              media="(max-width:767px)"
              srcSet="/img/main-page/hero/mob/pizza.png"
              type="image/png"
            />
            <source
              media="(min-width:768px)"
              srcSet="/img/main-page/hero/pizza.png"
              type="image/png"
            />
            <source
              media="(max-width:767px)"
              srcSet="/img/main-page/hero/mob/pizza.webp"
              type="image/webp"
            />
            <source
              media="(min-width:768px)"
              srcSet="/img/main-page/hero/pizza.webp"
              type="image/webp"
            />
            <img src="/img/main-page/hero/pizza.png" alt="#Pizza!" />
          </picture>
        </div>
      );
    }
    case 7: {
      return (
        <div className="hero__picture hero__picture--desert">
          <Image src={dessertSrc} alt="#OnTop!" />
        </div>
      );
    }
    default: {
      return (
        <div className="hero__picture">
          <Image src={burgersSrc} alt="#Burgers!" />
        </div>
      );
    }
  }
}
