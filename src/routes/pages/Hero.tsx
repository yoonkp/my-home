import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Hero = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const heroRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    gsap.set(titleRef.current, { opacity: 1, scale: 0.8, rotateX: -30 });
    gsap.set(subtitleRef.current, { opacity: 0, y: 100, skewY: 10 });

    setTimeout(() => {
      const tl = gsap.timeline();
      tl.to(titleRef.current, {
        scale: 1,
        rotateX: 0,
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
      }).to(
        subtitleRef.current,
        {
          y: 0,
          skewY: 0,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
        },
        "-=0.8"
      );
    }, 600);

    setTimeout(() => {
      gsap.to(heroRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => setIsVisible(false),
      });
    }, 2000);
  }, []);

  if (!isVisible) return null;

  return (
    <section ref={heroRef} className="hero">
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          Hi, I'm Yoonkyung Park
        </h1>
        <h2 ref={subtitleRef} className="hero-subtitle">
          UI Developer
        </h2>
      </div>
    </section>
  );
};

export default Hero;
