import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollText() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;

    if (!section || !text) return;

    const ctx = gsap.context(() => {
      const orbit = { angle: Math.PI };

      const updateText = () => {
        const angle = orbit.angle;

        const radiusX = Math.min(window.innerWidth * 0.38, 650);
        const radiusY = 150;

        const x = Math.cos(angle) * radiusX;
        const y = -Math.sin(angle) * radiusY;

        const rotateY = -Math.cos(angle) * 45;
        const rotateZ = -Math.cos(angle) * 12;

        gsap.set(text, {
          x,
          y,
          rotationY: rotateY,
          rotationZ: rotateZ,
          rotationX: 8,
        });
      };

      gsap.set(text, {
        xPercent: -50,
        yPercent: -50,
        transformPerspective: 1200,
      });

      updateText();

      gsap.to(orbit, {
        angle: 0,
        ease: "none",
        onUpdate: updateText,

        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=1200",
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="scroll-text-section">
      <div className="scroll-text-stage">
        <p ref={textRef} className="scroll-moving-text">
          I believe great digital experiences are created where creativity
          meets technology. Every interaction tells a story, and every
          detail creates an experience worth remembering.
        </p>
      </div>
    </section>
  );
}