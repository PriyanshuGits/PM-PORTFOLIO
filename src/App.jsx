import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroScene from "./components/HeroScene";
import { useEffect, useRef, useState, useCallback } from "react";
import Preloader from "./components/Preloader";
import NotFound from "./components/NotFound";
import InteractiveWorld from "./components/InteractiveWorld";
import VirtualWorkspace from "./components/VirtualWorkspace";
import AIDigitalTwin from "./components/AIDigitalTwin";

gsap.registerPlugin(ScrollTrigger);

// FEATURE 22: PERSONALIZED VISITOR STORAGE
const VISITOR_STORAGE_KEY = "pm-portfolio-visitor-v1";

function getInitialVisitorProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(VISITOR_STORAGE_KEY));
    const previousVisitCount = Number(saved?.visitCount) || 0;

    return {
      visitCount: previousVisitCount + 1,
      isReturningVisitor: previousVisitCount > 0,
    };
  } catch {
    return {
      visitCount: 1,
      isReturningVisitor: false,
    };
  }
}

// FEATURE 29: DEDICATED MORPHING STUDIO
function MorphingStudio() {
  const shapeRef = useRef(null);
  const sectionRef = useRef(null);
  const [activeShape, setActiveShape] = useState("BLOB");

  const shapes = {
    BLOB: {
      borderRadius: "42% 58% 65% 35% / 45% 40% 60% 55%",
      rotate: 0,
      scale: 1,
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    },
    CIRCLE: {
      borderRadius: "50%",
      rotate: 90,
      scale: 0.9,
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    },
    SQUARE: {
      borderRadius: "12%",
      rotate: 135,
      scale: 0.82,
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    },
    DIAMOND: {
      borderRadius: "8%",
      rotate: 45,
      scale: 0.82,
      clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    },
  };

  const morphTo = (shapeName) => {
    if (!shapeRef.current || !shapes[shapeName]) return;

    setActiveShape(shapeName);

    const shape = shapes[shapeName];

    gsap.to(shapeRef.current, {
      borderRadius: shape.borderRadius,
      rotate: shape.rotate,
      scale: shape.scale,
      clipPath: shape.clipPath,
      duration: 1.1,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      gsap.fromTo(
        ".morph-studio-content",
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".morph-studio-visual",
        {
          scale: 0.7,
          opacity: 0,
          rotate: -15,
        },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="morphing"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/10 px-8 py-28 md:px-20"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#E53945]/10 blur-[120px]" />

      <div className="morph-studio-content relative z-10 mb-16">
        <p className="mb-6 text-xs tracking-[4px] text-[#E53945]">
          FEATURE 29 / EXPERIMENT
        </p>

        <h2 className="text-4xl font-bold md:text-6xl">
          Shapes in <span className="text-[#E53945]">Motion.</span>
        </h2>

        <p className="mt-6 max-w-xl leading-7 text-white/60">
          A playground of fluid geometry. Explore different forms and watch
          shapes transform through interactive motion.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* Morphing visual */}
        <div className="morph-studio-visual relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#111] md:min-h-[480px]">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:45px_45px]" />
          </div>

          <div className="absolute left-7 top-7 text-[10px] tracking-[3px] text-white/40">
            MORPH ENGINE / 01
          </div>

          <div className="absolute bottom-7 left-7 text-xs tracking-widest text-white/40">
            INTERACTIVE GEOMETRY
          </div>

          <div
            ref={shapeRef}
            className="relative h-52 w-52 bg-gradient-to-br from-[#ff7777] via-[#E53945] to-[#6d101a] shadow-[0_0_90px_rgba(229,57,69,0.35)] sm:h-64 sm:w-64"
            style={{
              borderRadius: shapes.BLOB.borderRadius,
              clipPath: shapes.BLOB.clipPath,
            }}
          >
            <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-tr from-transparent via-white/20 to-white/40" />
          </div>

          <span className="absolute right-7 top-7 text-xs tracking-widest text-[#E53945]">
            {activeShape}
          </span>
        </div>

        {/* Controls */}
        <div className="morph-studio-content">
          <p className="mb-4 text-sm tracking-[3px] text-white/40">
            SELECT A FORM
          </p>

          <h3 className="mb-8 text-3xl font-bold md:text-4xl">
            Transform the <span className="text-[#E53945]">Shape.</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {Object.keys(shapes).map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => morphTo(shape)}
                aria-pressed={activeShape === shape}
                className={`rounded-xl border px-5 py-5 text-left transition-all duration-300 ${
                  activeShape === shape
                    ? "border-[#E53945] bg-[#E53945]/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/50 hover:border-[#E53945]/50 hover:text-white"
                }`}
              >
                <span className="mb-3 block text-xs text-[#E53945]">
                  / 0{Object.keys(shapes).indexOf(shape) + 1}
                </span>

                <span className="text-sm font-semibold tracking-widest">
                  {shape}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10 border-t border-white/10 pt-7">
            <p className="text-xs tracking-[3px] text-white/40">
              CURRENT TRANSFORMATION
            </p>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-2xl font-bold">{activeShape}</span>

              <span className="text-sm text-[#E53945]">MORPH ACTIVE ↗</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  const pageRef = useRef(null);
  const menuRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeProjectFilter, setActiveProjectFilter] = useState("All");
  const [projectOrder, setProjectOrder] = useState(["01", "02", "04"]);
  const [draggedProject, setDraggedProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  // FEATURE 35: LIVE PROJECT PREVIEW
  const [livePreviewProject, setLivePreviewProject] = useState(null);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [activeSection, setActiveSection] = useState("work");
  const [typedRole, setTypedRole] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // FEATURE: STANDALONE DRAGGABLE CARDS
  const [dragCards, setDragCards] = useState([
    {
      id: "01",
      title: "Creative Thinking",
      subtitle: "Ideas into experiences",
      icon: "✦",
    },
    {
      id: "02",
      title: "Web Development",
      subtitle: "Building digital products",
      icon: "⌘",
    },
    {
      id: "03",
      title: "3D Experiences",
      subtitle: "Exploring digital dimensions",
      icon: "◈",
    },
    {
      id: "04",
      title: "Innovation",
      subtitle: "Beyond the ordinary",
      icon: "✧",
    },
  ]);

  const [draggedCard, setDraggedCard] = useState(null);

  // FEATURE 23: INTERACTIVE AI TERMINAL
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState([
    {
      type: "system",
      text: "PM TERMINAL v1.0 — Welcome to my interactive portfolio terminal.",
    },
    {
      type: "system",
      text: 'Type "help" to explore available commands.',
    },
  ]);

  const terminalInputRef = useRef(null);
  const terminalOutputRef = useRef(null);

  // FEATURE 42: PWA INSTALL PROMPT
  useEffect(() => {
    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);

      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // INSTALL APP FUNCTION
  const handleInstallApp = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
  };

  // FEATURE 23: TERMINAL AUTO SCROLL
  useEffect(() => {
    if (terminalOpen && terminalOutputRef.current) {
      terminalOutputRef.current.scrollTo({
        top: terminalOutputRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [terminalHistory, terminalOpen]);

  // FEATURE 21: VOICE INTERACTION
  const [voicePanelOpen, setVoicePanelOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Ready to listen");

  const recognitionRef = useRef(null);

  // FEATURE 22: PERSONALIZED VISITOR EXPERIENCE
  const [visitorProfile, setVisitorProfile] = useState(
    getInitialVisitorProfile
  );

  const [welcomeVisible, setWelcomeVisible] = useState(false);

  // FEATURE 25: GESTURE-BASED INTERACTION
  const projectTouchStartX = useRef(0);
  const projectTouchStartY = useRef(0);

  // FEATURE 25: LAPTOP MOUSE DRAG SUPPORT
  const projectMouseStartX = useRef(null);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // FEATURE 22: SAVE VISITOR COUNT
  useEffect(() => {
    try {
      localStorage.setItem(
        VISITOR_STORAGE_KEY,
        JSON.stringify({
          visitCount: visitorProfile.visitCount,
          lastVisit: Date.now(),
        })
      );
    } catch {
      // Portfolio continues working if local storage is unavailable.
    }
  }, [visitorProfile]);

  // FEATURE 22: PERSONALIZED WELCOME MESSAGE
  useEffect(() => {
    if (isLoading) return;

    setWelcomeVisible(true);

    const timeout = window.setTimeout(() => {
      setWelcomeVisible(false);
    }, 9000);

    return () => window.clearTimeout(timeout);
  }, [isLoading]);

  // FEATURE 21: TEXT TO SPEECH
  const speakResponse = useCallback((message) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }, []);

  // FEATURE 23: INTERACTIVE TERMINAL COMMAND HANDLER
  const handleTerminalCommand = useCallback(
    (event) => {
      event.preventDefault();

      const rawCommand = terminalInput.trim().toLowerCase();

      if (!rawCommand) return;

      const aliases = {
        "about me": "about",
        "open about": "about",
        "show about": "about",

        "open projects": "projects",
        "show projects": "projects",
        "open work": "projects",
        "show work": "projects",
        work: "projects",

        "open skills": "skills",
        "show skills": "skills",
        "my skills": "skills",

        "open journey": "journey",
        "show journey": "journey",
        "my journey": "journey",

        "open world": "world",
        "show world": "world",
        "digital world": "world",
        "enter world": "world",

        "open workspace": "workspace",
        "show workspace": "workspace",
        "virtual workspace": "workspace",

        "open contact": "contact",
        "show contact": "contact",
        "go to contact": "contact",

        "open morphing": "morphing",
        "show morphing": "morphing",
        "morphing studio": "morphing",
        "shape studio": "morphing",
        morph: "morphing",
      };

      const command = aliases[rawCommand] || rawCommand;

      const commandHistory = {
        type: "command",
        text: `visitor@pm:~$ ${rawCommand}`,
      };

      // FEATURE: DRAGGABLE CARDS TERMINAL COMMANDS

      // LIST CARDS
      if (command === "draggable list" || command === "list draggable cards") {
        setTerminalHistory((previous) => [
          ...previous,
          commandHistory,
          { type: "output", text: "DRAGGABLE CARD ORDER" },
          ...getDragCardList().map((name) => ({
            type: "output",
            text: name,
          })),
        ]);

        setTerminalInput("");
        return;
      }

      // RESET CARDS
      if (
        rawCommand === "draggable reset" ||
        rawCommand === "reset draggable cards" ||
        rawCommand === "reset cards"
      ) {
        setDragCards((previous) =>
          [...previous].sort((a, b) => Number(a.id) - Number(b.id))
        );

        setTerminalHistory((previous) => [
          ...previous,
          commandHistory,
          {
            type: "system",
            text: "Draggable cards restored to original order.",
          },
        ]);

        setTerminalInput("");
        return;
      }

      // FEATURE: NATURAL LANGUAGE DRAGGABLE TERMINAL CONTROL

      const terminalText = rawCommand
        .replace(/[.!?,]/g, "")
        .replace(
          /\b(the|please|card|cards|my|want|i|would|like|can|you|could|move|put|bring|shift|make|place|set|to|at|position)\b/g,
          " "
        )
        .replace(/\s+/g, " ")
        .trim();

      const terminalPositions = [
        { regex: /\b(first|1st|top|beginning)\b/, position: "first" },
        { regex: /\b(last|final|end|bottom)\b/, position: "last" },
        { regex: /\b(second|2nd)\b/, position: "2" },
        { regex: /\b(third|3rd)\b/, position: "3" },
        { regex: /\b(fourth|4th)\b/, position: "4" },
      ];

      const terminalPosition = terminalPositions.find((item) =>
        item.regex.test(terminalText)
      );

      const terminalCard = dragCards.find((card) =>
        terminalText.includes(card.title.toLowerCase())
      );

      if (terminalCard && terminalPosition) {
        moveDragCard(terminalCard.title, terminalPosition.position);

        const destination =
          terminalPosition.position === "first"
            ? "first position"
            : terminalPosition.position === "last"
            ? "last position"
            : `position ${terminalPosition.position}`;

        setTerminalHistory((previous) => [
          ...previous,
          commandHistory,
          {
            type: "system",
            text: `Moving ${terminalCard.title} to ${destination}.`,
          },
        ]);

        setTerminalInput("");
        return;
      }

      // CLEAR TERMINAL
      if (command === "clear") {
        setTerminalHistory([
          {
            type: "system",
            text: "Terminal cleared.",
          },
          {
            type: "system",
            text: 'Type "help" to explore available commands.',
          },
        ]);

        setTerminalInput("");
        return;
      }

      // EXIT TERMINAL
      if (command === "exit") {
        setTerminalHistory((previous) => [
          ...previous,
          commandHistory,
          {
            type: "system",
            text: "Terminal session closed.",
          },
        ]);

        setTerminalOpen(false);
        setTerminalInput("");
        return;
      }

      // AVAILABLE TERMINAL COMMANDS
      const commands = {
        help: [
          "AVAILABLE COMMANDS",
          "------------------------------",
          "help       - Show available commands",
          "about      - Learn about me",
          "projects   - View my projects",
          "draggable  - Explore draggable cards",
          "skills     - Explore my technologies",
          "journey    - View my development journey",
          "morphing   - Explore the Morphing Studio",
          "world      - Enter my interactive 3D world",
          "workspace  - Visit my virtual workspace",
          "contact    - Go to contact section",
          "clear      - Clear terminal",
          "exit       - Close terminal",
          "------------------------------",
          "TIP: You can also use commands like 'open projects'.",
        ],

        about: [
          "ABOUT ME",
          "------------------------------",
          "I'm a Full-Stack Creative Developer.",
          "I enjoy combining creativity, technology and code",
          "to build meaningful digital experiences.",
        ],

        projects: [
          "PROJECT DIRECTORY",
          "------------------------------",
          "01. PM Watches — 3D Product Experience",
          "02. PM Nexora — SaaS Platform",
          "04. PM Chat — Communication Platform",
          "Opening project showcase...",
        ],

        draggable: [
          "DRAGGABLE CARDS",
          "------------------------------",
          "Explore the interactive draggable cards.",
          "Drag and drop cards to rearrange them.",
          "Opening Draggable Cards...",
        ],

        skills: [
          "TECHNOLOGY STACK",
          "------------------------------",
          "Frontend: HTML, CSS, JavaScript, React, Tailwind CSS",
          "Backend: Node.js, Express.js, REST APIs, MongoDB",
          "Creative: Three.js, React Three Fiber, GSAP, WebGL",
          "Tools: Git, GitHub, VS Code, Vite, Figma",
        ],

        journey: [
          "DEVELOPMENT JOURNEY",
          "------------------------------",
          "01. Frontend Development",
          "02. Full-Stack Development",
          "03. Creative Development",
          "Always building, experimenting and learning.",
        ],

        morphing: [
          "MORPHING STUDIO",
          "------------------------------",
          "Welcome to the Morphing Studio.",
          "Explore interactive shapes and transformations.",
          "Opening Morphing Studio...",
        ],

        world: [
          "INTERACTIVE WORLD",
          "------------------------------",
          "Opening the interactive 3D world...",
        ],

        workspace: [
          "VIRTUAL WORKSPACE",
          "------------------------------",
          "Opening the virtual developer workspace...",
        ],

        contact: [
          "CONTACT",
          "------------------------------",
          "Taking you to the contact section...",
          "Let's build something meaningful together.",
        ],
      };

      const sectionCommands = {
        about: "about",
        projects: "work",
        skills: "skills",
        draggable: "draggable-cards",
        journey: "journey",
        morphing: "morphing",
        world: "world",
        workspace: "workspace",
        contact: "contact",
      };

      const hasCommand = Object.prototype.hasOwnProperty.call(
        commands,
        command
      );

      if (!hasCommand) {
        setTerminalHistory((previous) => [
          ...previous,
          commandHistory,
          {
            type: "error",
            text: `Command not found: "${rawCommand}". Type "help" for available commands.`,
          },
        ]);

        setTerminalInput("");
        return;
      }

      const output = commands[command].map((line) => ({
        type: "output",
        text: line,
      }));

      setTerminalHistory((previous) => [
        ...previous,
        commandHistory,
        ...output,
      ]);

      const targetId = sectionCommands[command];

      if (targetId) {
        const target = document.getElementById(targetId);

        if (target) {
          const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;

          target.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
          });
        } else {
          setTerminalHistory((previous) => [
            ...previous,
            {
              type: "error",
              text: `Section "${targetId}" could not be found.`,
            },
          ]);
        }
      }

      setTerminalInput("");
    },
    [terminalInput, dragCards]
  );

  // TERMINAL INPUT AUTO FOCUS
  useEffect(() => {
    if (!terminalOpen) return;

    const timeout = window.setTimeout(() => {
      terminalInputRef.current?.focus();
    }, 100);

    return () => window.clearTimeout(timeout);
  }, [terminalOpen]);

  // FEATURE 21: VOICE COMMAND HANDLER
  const handleVoiceCommand = useCallback(
    (command) => {
      const text = command.toLowerCase().trim();

      // FEATURE 42: VOICE CONTROLLED PWA INSTALL

      if (
        text.includes("install app") ||
        text.includes("install portfolio") ||
        text.includes("install this portfolio") ||
        text.includes("download portfolio") ||
        text.includes("add to home screen")
      ) {
        if (deferredPrompt) {
          speakResponse("Install is not available through voice right now. Please click the Install App button in the navigation bar, or use Chrome's menu and select Install Page.");

          setVoiceStatus("Use the navbar Install App button or Chrome menu.");

          deferredPrompt.prompt();

          deferredPrompt.userChoice.then((choice) => {
            if (choice.outcome === "accepted") {
              speakResponse("Your portfolio is being installed.");
              setVoiceStatus("Portfolio installation accepted.");
            } else {
              speakResponse("Installation was cancelled.");
              setVoiceStatus("Installation cancelled.");
            }

            setDeferredPrompt(null);
          });
        } else {
          speakResponse(
            "Install is not available through voice right now. Please click the Install App button in the navigation bar, or use Chrome's menu and select Install Page."
          );

          setVoiceStatus("Use the navbar Install App button or Chrome menu.");
        }

        return;
      }

      const commands = [
        {
          keywords: ["home", "go home", "open home"],
          section: "home",
          response: "Taking you to the home section.",
        },
        {
          keywords: ["about", "go to about", "open about"],
          section: "about",
          response: "Opening the about section.",
        },
        {
          keywords: ["workspace", "open workspace", "virtual workspace"],
          section: "workspace",
          response: "Opening my virtual workspace.",
        },
        {
          keywords: ["work", "projects", "open projects", "show projects"],
          section: "work",
          response: "Here are my projects.",
        },
        {
          keywords: ["skills", "open skills", "show skills"],
          section: "skills",
          response: "Opening the skills section.",
        },
        {
          keywords: ["journey", "open journey"],
          section: "journey",
          response: "Opening my development journey.",
        },
        {
          keywords: ["contact", "open contact", "go to contact"],
          section: "contact",
          response: "Taking you to the contact section.",
        },
        {
          keywords: ["digital world", "open world"],
          section: "world",
          response: "Entering my digital world.",
        },
        {
          keywords: [
            "morphing",
            "morphing studio",
            "open morphing",
            "open morphing studio",
          ],
          section: "morphing",
          response: "Opening the Morphing Studio.",
        },
        {
          keywords: [
            "draggable",
            "draggable cards",
            "open draggable cards",
            "show draggable cards",
            "interactive cards",
            "open interactive cards",
            "show interactive cards",
          ],
          section: "draggable-cards",
          response: "Opening the draggable cards experience.",
        },
      ];

      // FEATURE: DRAGGABLE CARDS VOICE CONTROLS

      // LIST CARDS
      if (
        text.includes("list draggable cards") ||
        text.includes("show draggable cards order")
      ) {
        const cardList = getDragCardList();

        speakResponse(`Your draggable cards are: ${cardList.join(", ")}`);

        setVoiceStatus("Showing draggable cards order.");
        return;
      }

      // FEATURE: SMART DRAGGABLE CARD POSITION AWARENESS

      // CURRENT CARD ORDER
      if (
        text.includes("current card order") ||
        text.includes("what is the card order") ||
        text.includes("show card order")
      ) {
        const cardList = getDragCardList();

        speakResponse(`The current card order is: ${cardList.join(", ")}`);
        setVoiceStatus("Current card order announced.");
        return;
      }

      // WHICH CARD IS FIRST
      if (
        text.includes("which card is first") ||
        text.includes("what is the first card")
      ) {
        const firstCard = dragCards[0];

        speakResponse(`The first card is ${firstCard.title}.`);
        setVoiceStatus(`First card: ${firstCard.title}`);
        return;
      }

      // FIND CARD POSITION
      if (
        text.includes("where is") ||
        text.includes("which position is") ||
        text.includes("what position is")
      ) {
        const matchedCard = dragCards.find((card) =>
          text.includes(card.title.toLowerCase())
        );

        if (matchedCard) {
          const position =
            dragCards.findIndex((card) => card.id === matchedCard.id) + 1;

          speakResponse(
            `${matchedCard.title} is currently at position ${position}.`
          );

          setVoiceStatus(`${matchedCard.title}: Position ${position}`);
        } else {
          speakResponse("I couldn't find that card.");
          setVoiceStatus("Card not found.");
        }

        return;
      }

      // WHICH CARD IS AT A POSITION
      const positionQuestion = text.match(
        /(?:which|what) card is (?:at )?(?:position )?(\d+|first|second|third|fourth|last)/
      );

      if (positionQuestion) {
        const positions = {
          first: 1,
          second: 2,
          third: 3,
          fourth: 4,
          last: dragCards.length,
        };

        const position =
          positions[positionQuestion[1]] || Number(positionQuestion[1]);

        const card = dragCards[position - 1];

        if (card) {
          speakResponse(`Position ${position} has ${card.title}.`);
          setVoiceStatus(`Position ${position}: ${card.title}`);
        } else {
          speakResponse("That position does not exist.");
          setVoiceStatus("Invalid card position.");
        }

        return;
      }

      // FEATURE: VOICE AI DRAGGABLE CARDS RESET

      if (
        text.includes("reset draggable cards") ||
        text.includes("reset draggable card") ||
        text.includes("restore draggable cards") ||
        text.includes("restore original card order") ||
        text.includes("reset cards") ||
        text.includes("put cards back") ||
        text.includes("restore cards")
      ) {
        setDragCards((previous) =>
          [...previous].sort((a, b) => Number(a.id) - Number(b.id))
        );

        speakResponse(
          "All draggable cards have been restored to their original order."
        );

        setVoiceStatus("Draggable cards reset successfully.");

        return;
      }

      // FEATURE: VOICE AI DRAGGABLE CARD SHUFFLE

      if (
        text.includes("shuffle draggable cards") ||
        text.includes("shuffle cards") ||
        text.includes("randomize cards") ||
        text.includes("mix draggable cards") ||
        text.includes("mix the cards")
      ) {
        setDragCards((previous) => {
          const shuffled = [...previous];

          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }

          return shuffled;
        });

        speakResponse("Your draggable cards have been shuffled.");
        setVoiceStatus("Draggable cards shuffled.");

        return;
      }

      // FEATURE: VOICE AI REVERSE DRAGGABLE CARDS

      if (
        text.includes("reverse draggable cards") ||
        text.includes("reverse card order") ||
        text.includes("reverse cards") ||
        text.includes("flip card order")
      ) {
        setDragCards((previous) => [...previous].reverse());

        speakResponse("Draggable card order has been reversed.");
        setVoiceStatus("Draggable card order reversed.");

        return;
      }

      // FEATURE: VOICE AI MOVE CARD UP / DOWN

      const moveDirection = text.match(
        /(?:move|shift|take)\s+(.+?)\s+(up|down)(?:\s+one)?(?:\s+position)?$/
      );

      if (moveDirection) {
        const cardName = moveDirection[1]
          .replace(/\b(the|card|cards|please)\b/g, "")
          .trim();

        const direction = moveDirection[2];

        const cardIndex = dragCards.findIndex(
          (card) => card.title.toLowerCase() === cardName
        );

        if (cardIndex === -1) {
          speakResponse("Sorry, that card was not found.");
          setVoiceStatus("Card not found.");
          return;
        }

        const targetIndex = direction === "up" ? cardIndex - 1 : cardIndex + 1;

        if (targetIndex < 0 || targetIndex >= dragCards.length) {
          speakResponse("That card is already at the edge.");
          setVoiceStatus("Card cannot move further.");
          return;
        }

        setDragCards((previous) => {
          const updated = [...previous];

          [updated[cardIndex], updated[targetIndex]] = [
            updated[targetIndex],
            updated[cardIndex],
          ];

          return updated;
        });

        speakResponse(
          `${dragCards[cardIndex].title} moved one position ${direction}.`
        );

        setVoiceStatus(`Card moved ${direction}.`);
        return;
      }

      // FEATURE: VOICE AI CARD COUNT & SUMMARY

      if (
        text.includes("how many cards") ||
        text.includes("total draggable cards") ||
        text.includes("count draggable cards")
      ) {
        speakResponse(
          `There are ${dragCards.length} draggable cards in total.`
        );

        setVoiceStatus(`Total cards: ${dragCards.length}`);
        return;
      }

      if (
        text.includes("describe card order") ||
        text.includes("read all card positions") ||
        text.includes("card position summary")
      ) {
        const summary = dragCards
          .map((card, index) => `Position ${index + 1}: ${card.title}`)
          .join(". ");

        speakResponse(summary);
        setVoiceStatus("Card position summary announced.");
        return;
      }

      // FEATURE: NATURAL LANGUAGE DRAGGABLE CARD VOICE CONTROL

      const normalizedText = text
        .toLowerCase()
        .replace(/[.!?,]/g, "")
        .replace(
          /\b(the|please|card|cards|my|want|i|would|like|can|you|could|move|put|bring|shift|make|place|set|to|at|position)\b/g,
          " "
        )
        .replace(/\s+/g, " ")
        .trim();

      const positionPatterns = [
        { regex: /\b(first|1st|top|beginning)\b/, position: "first" },
        { regex: /\b(last|final|end|bottom)\b/, position: "last" },
        { regex: /\b(second|2nd)\b/, position: "2" },
        { regex: /\b(third|3rd)\b/, position: "3" },
        { regex: /\b(fourth|4th)\b/, position: "4" },
      ];

      const matchedPosition = positionPatterns.find((item) =>
        item.regex.test(normalizedText)
      );

      const matchedCard = dragCards.find((card) =>
        normalizedText.includes(card.title.toLowerCase())
      );

      if (matchedCard && matchedPosition) {
        moveDragCard(matchedCard.title, matchedPosition.position);

        const destination =
          matchedPosition.position === "first"
            ? "the first position"
            : matchedPosition.position === "last"
            ? "the last position"
            : `position ${matchedPosition.position}`;

        speakResponse(`Moving ${matchedCard.title} to ${destination}.`);
        setVoiceStatus(`Moving ${matchedCard.title} to ${destination}.`);

        return;
      }

      // FEATURE: VOICE AI READ CARD DETAILS

      const detailCard = dragCards.find((card) =>
        text.includes(card.title.toLowerCase())
      );

      if (
        detailCard &&
        (text.includes("read details") ||
          text.includes("describe") ||
          text.includes("tell me about") ||
          text.includes("what is"))
      ) {
        speakResponse(`${detailCard.title}. ${detailCard.subtitle}.`);

        setVoiceStatus(`Reading details: ${detailCard.title}`);
        return;
      }

      const matchedCommand = commands.find((item) =>
        item.keywords.some(
          (keyword) => text === keyword || text.includes(keyword)
        )
      );

      if (matchedCommand) {
        const section = document.getElementById(matchedCommand.section);

        if (section) {
          section.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth",
            block: "start",
          });

          speakResponse(matchedCommand.response);
          setVoiceStatus(`Command: ${matchedCommand.section}`);
        } else {
          setVoiceStatus("Section not found.");
        }
      } else {
        setVoiceStatus("Command not recognized. Try again.");
        speakResponse("Sorry, I didn't understand that command.");
      }
    },
    [speakResponse, dragCards, deferredPrompt]
  );

  // FEATURE 21: START VOICE RECOGNITION
  const startVoiceRecognition = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus(
        "Voice recognition is not supported in this browser. Try Chrome or Edge."
      );
      setIsListening(false);
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Recognition may already be stopped.
      }

      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus("Listening...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setVoiceStatus(`Heard: ${transcript}`);
      handleVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      setIsListening(false);

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        setVoiceStatus(
          "Microphone permission denied. Allow microphone access."
        );
      } else if (event.error === "no-speech") {
        setVoiceStatus("No speech detected. Try again.");
      } else if (event.error === "audio-capture") {
        setVoiceStatus("No microphone detected.");
      } else {
        setVoiceStatus("Voice recognition error. Try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);

      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
      setVoiceStatus("Unable to start microphone. Try again.");
    }
  }, [handleVoiceCommand]);

  // FEATURE 21: STOP VOICE RECOGNITION
  const stopVoiceRecognition = useCallback(() => {
    if (recognitionRef.current) {
      const recognition = recognitionRef.current;

      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;

      try {
        recognition.stop();
      } catch {
        // Recognition may already be stopped.
      }

      recognitionRef.current = null;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsListening(false);
    setVoiceStatus("Voice interaction stopped.");
  }, []);

  // FEATURE 21: VOICE CLEANUP
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Recognition may already be stopped.
        }

        recognitionRef.current = null;
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // FEATURE 7: MULTI-LINE TYPEWRITER EFFECT
  useEffect(() => {
    if (isLoading) return;

    const roles = [
      "FULL-STACK CREATIVE DEVELOPER",
      "CREATIVE TECHNOLOGIST",
      "INTERACTIVE DEVELOPER",
      "BUILDING DIGITAL EXPERIENCES",
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId;
    let cancelled = false;

    const type = () => {
      if (cancelled) return;

      const currentRole = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        setTypedRole(currentRole.slice(0, charIndex));

        if (charIndex >= currentRole.length) {
          deleting = true;
          timeoutId = setTimeout(type, 1600);
          return;
        }
      } else {
        charIndex--;
        setTypedRole(currentRole.slice(0, charIndex));

        if (charIndex <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }

      timeoutId = setTimeout(type, deleting ? 35 : 65);
    };

    type();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isLoading]);

  // FEATURE 30: INTERACTIVE PROJECT CARD TILT
  const handleProjectMouseMove = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 8;
    const rotateX = (0.5 - y) * 8;

    card.style.transform = `
      perspective(1000px)
      translateY(-8px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;
  };

  const handleProjectMouseLeave = (event) => {
    event.currentTarget.style.transform = "";
  };

  // GSAP ANIMATIONS
  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(".hero-eyebrow", {
        y: 25,
        opacity: 0,
        duration: 0.7,
      })
        .from(
          ".hero-title",
          {
            y: 60,
            opacity: 0,
            duration: 1,
          },
          "-=0.35"
        )
        .from(
          ".hero-description",
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.45"
        )
        .from(
          ".hero-actions",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.35"
        )
        .from(
          ".hero-scene-wrapper",
          {
            opacity: 0,
            scale: 0.85,
            y: 35,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.8"
        );

      // FEATURE 6: TEXT REVEAL ANIMATION
      gsap.utils.toArray(".reveal").forEach((element) => {
        const headings = element.querySelectorAll("h2");

        const revealTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        revealTimeline.from(element, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });

        if (headings.length) {
          revealTimeline.from(
            headings,
            {
              y: 38,
              opacity: 0,
              clipPath: "inset(0 0 100% 0)",
              duration: 0.85,
              stagger: 0.14,
              ease: "power4.out",
              clearProps: "clipPath",
            },
            "-=0.4"
          );
        }
      });
    }, pageRef);

    return () => ctx.revert();
  }, [isLoading]);

  // FEATURE 34: STAGGERED PROJECT REVEAL
  useEffect(() => {
    if (isLoading) return;

    const cards = gsap.utils.toArray(".project-card");

    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          y: 60,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#work",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [isLoading]);

  // SCROLL PROGRESS BAR
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      document.documentElement.style.setProperty(
        "--scroll-progress",
        `${progress}%`
      );
    };

    window.addEventListener("scroll", updateScrollProgress);
    updateScrollProgress();

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
    };
  }, []);

  // BACK TO TOP BUTTON VISIBILITY
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // SMART MOBILE MENU
  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

  // FEATURE 33: ACTIVE NAVBAR LINK INDICATOR
  useEffect(() => {
    const sections = ["work", "about", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.2, 0.5, 0.8],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // 404 PAGE ROUTING
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const isNotFound = currentPath !== "/";

  if (isNotFound) {
    return <NotFound />;
  }

  // FEATURE 28 + 29 + 35: DYNAMIC PROJECT DATA + LIVE PREVIEW
  const projects = [
    {
      number: "01",
      name: "PM Watches",
      category: "3D PRODUCT EXPERIENCE",
      description:
        "An immersive smartwatch website featuring interactive 3D product visualization and a modern product experience.",
      technologies: ["React", "Three.js", "React Three Fiber"],
      status: "COMPLETED",
      symbol: "⌚",
      filter: "3D & Creative",
      liveUrl: "https://pm-watches.vercel.app/",
    },
    {
      number: "02",
      name: "PM Nexora",
      category: "SAAS PLATFORM",
      description:
        "A SaaS project exploring modern software experiences, digital workflows and product-focused interfaces.",
      technologies: ["SaaS", "Web Development"],
      status: "COMPLETED",
      symbol: "N",
      filter: "SaaS",
      liveUrl: "https://pm-nexora.vercel.app/",
    },
    {
      number: "04",
      name: "PM Chat",
      category: "COMMUNICATION PLATFORM",
      description:
        "An upcoming cross-device chat platform concept with group conversations and real-time communication features.",
      technologies: ["React", "Real-time Communication"],
      status: "PLANNED",
      symbol: "✉",
      filter: "Upcoming",
      liveUrl: "",
    },
  ];

  // FEATURE 29: PROJECT FILTERS
  const projectFilters = ["All", "3D & Creative", "SaaS", "Upcoming"];

  const filteredProjects =
    activeProjectFilter === "All"
      ? projects
      : projects.filter((project) => project.filter === activeProjectFilter);

  // FEATURE 25: PROJECT SWIPE GESTURES
  const handleProjectTouchStart = (event) => {
    projectTouchStartX.current = event.touches[0].clientX;
    projectTouchStartY.current = event.touches[0].clientY;
  };

  const handleProjectTouchEnd = (event) => {
    if (!selectedProject) return;

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - projectTouchStartX.current;
    const deltaY = touchEndY - projectTouchStartY.current;

    // Ignore vertical scrolling and small movements.
    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    const currentIndex = projects.findIndex(
      (project) => project.number === selectedProject.number
    );

    if (currentIndex === -1) return;

    // Swipe left = next project.
    if (deltaX < 0) {
      const nextIndex = (currentIndex + 1) % projects.length;
      setSelectedProject(projects[nextIndex]);
    }

    // Swipe right = previous project.
    if (deltaX > 0) {
      const previousIndex =
        (currentIndex - 1 + projects.length) % projects.length;

      setSelectedProject(projects[previousIndex]);
    }
  };

  // FEATURE 25: LAPTOP MOUSE DRAG HANDLERS
  const handleProjectMouseDown = (event) => {
    if (event.button !== 0) return;

    projectMouseStartX.current = event.clientX;
  };

  const handleProjectMouseUp = (event) => {
    if (projectMouseStartX.current === null) return;

    const deltaX = event.clientX - projectMouseStartX.current;

    projectMouseStartX.current = null;

    if (Math.abs(deltaX) < 60 || !selectedProject) return;

    const currentIndex = projects.findIndex(
      (project) => project.number === selectedProject.number
    );

    if (currentIndex === -1) return;

    // Drag left = next project.
    if (deltaX < 0) {
      const nextIndex = (currentIndex + 1) % projects.length;
      setSelectedProject(projects[nextIndex]);
    }

    // Drag right = previous project.
    if (deltaX > 0) {
      const previousIndex =
        (currentIndex - 1 + projects.length) % projects.length;

      setSelectedProject(projects[previousIndex]);
    }
  };

  const handlePopupMouseLeave = () => {
    projectMouseStartX.current = null;
  };

  // FEATURE: DRAGGABLE CARDS CONTROLS
  const resetDragCards = () => {
    setDragCards((previous) =>
      [...previous].sort((a, b) => a.id.localeCompare(b.id))
    );
  };

  const moveDragCard = (cardName, position) => {
    setDragCards((previous) => {
      const updated = [...previous];

      const sourceIndex = updated.findIndex(
        (card) => card.title.toLowerCase() === cardName.toLowerCase()
      );

      if (sourceIndex === -1) return previous;

      const [movedCard] = updated.splice(sourceIndex, 1);

      let targetIndex;

      if (position === "first") {
        targetIndex = 0;
      } else if (position === "last") {
        targetIndex = updated.length;
      } else {
        targetIndex = Math.max(
          0,
          Math.min(Number(position) - 1, updated.length)
        );
      }

      updated.splice(targetIndex, 0, movedCard);

      return updated;
    });
  };

  const getDragCardList = () =>
    dragCards.map((card, index) => `${index + 1}. ${card.title}`);

  // FEATURE: STANDALONE DRAGGABLE CARDS
  const handleDragStart = (event, cardId) => {
    setDraggedCard(cardId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", cardId);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event, targetId) => {
    event.preventDefault();

    const sourceId = event.dataTransfer.getData("text/plain");

    if (!sourceId || sourceId === targetId) {
      setDraggedCard(null);
      return;
    }

    setDragCards((previous) => {
      const updated = [...previous];

      const sourceIndex = updated.findIndex((card) => card.id === sourceId);

      const targetIndex = updated.findIndex((card) => card.id === targetId);

      if (sourceIndex === -1 || targetIndex === -1) {
        return previous;
      }

      const [movedCard] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, movedCard);

      return updated;
    });

    setDraggedCard(null);
  };

  return (
    <>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      <main
        ref={pageRef}
        className={`min-h-screen bg-[#090909] text-white transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="scroll-progress-bar" />

        {/* FEATURE 22: PERSONALIZED VISITOR WELCOME */}
        {welcomeVisible && !isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="fixed right-5 top-24 z-[1500] w-[calc(100%-40px)] max-w-sm animate-[fadeIn_0.5s_ease-out] rounded-2xl border border-white/10 bg-[#151515]/95 p-5 shadow-[0_15px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] tracking-[3px] text-[#E53945]">
                  PM DIGITAL EXPERIENCE
                </p>

                <h3 className="mt-3 text-xl font-bold text-white">
                  {visitorProfile.isReturningVisitor
                    ? "Welcome Back!"
                    : "Welcome to My World!"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  {visitorProfile.isReturningVisitor
                    ? "Great to have you back. Continue exploring my digital space."
                    : "Thanks for visiting! Take a look around and explore what I've created."}
                </p>
              </div>

              <button
                onClick={() => setWelcomeVisible(false)}
                aria-label="Dismiss welcome message"
                className="text-xl text-white/50 transition hover:text-[#E53945]"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* NAVBAR */}
        <nav
          ref={menuRef}
          className="sticky top-0 z-[1000] flex items-center justify-between border-b border-white/10 bg-[#090909]/85 px-5 py-5 backdrop-blur-xl transition-all duration-300 md:px-8"
        >
          <h2 className="text-2xl font-bold">
            PM<span className="text-[#E53945]">.</span>
          </h2>

          {/* DESKTOP LINKS */}
          <div className="hidden gap-8 text-sm sm:flex">
            {["About", "Work", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`group relative py-2 transition-colors duration-300 hover:text-white ${
                  activeSection === item.toLowerCase()
                    ? "text-white"
                    : "text-white/70"
                }`}
              >
                {item}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[#E53945] transition-all duration-300 ${
                    activeSection === item.toLowerCase()
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            ))}
          </div>

          {/* PROFILE IMAGE */}
          <div className="flex items-center gap-3">
            {/* PWA INSTALL BUTTON */}
            {deferredPrompt && (
              <button
                onClick={handleInstallApp}
                className="flex items-center gap-2 rounded-full border border-[#E53945]/50 bg-[#E53945]/10 px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#E53945] hover:shadow-[0_0_20px_rgba(229,57,69,0.3)]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 19h14" />
                </svg>

                <span>Install</span>
              </button>
            )}
            <img
              src="/images/priyanshu.png"
              alt="Priyanshu"
              className="h-11 w-11 rounded-full border-2 border-[#E53945] object-cover transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(229,57,69,0.4)]"
            />

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/15 sm:hidden"
            >
              <span
                className={`h-0.5 w-5 bg-white transition ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-5 bg-white transition ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-5 bg-white transition ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>

          {/* MOBILE DROPDOWN */}
          {menuOpen && (
            <div
              id="mobile-navigation"
              className="absolute left-0 right-0 top-full border-b border-white/10 bg-[#090909] px-6 py-5 shadow-2xl sm:hidden"
            >
              {["About", "Work", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-white/5 py-4 text-sm text-white/75 transition hover:text-[#E53945]"
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </nav>

        {/* HERO */}
        <section
          id="home"
          className="hero relative grid min-h-[85vh] grid-cols-1 items-center gap-8 overflow-hidden px-5 py-12 sm:px-8 sm:py-16 md:px-12 lg:grid-cols-2 lg:px-20"
        >
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {[
              { top: "18%", left: "8%" },
              { top: "35%", left: "48%" },
              { top: "25%", right: "8%" },
              { bottom: "20%", right: "35%" },
              { bottom: "30%", left: "15%" },
            ].map((position, index) => (
              <span
                key={index}
                className={`floating-particle particle-${index + 1}`}
                style={{
                  position: "absolute",
                  ...position,
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#E53945",
                  boxShadow: "0 0 25px 8px rgba(229,57,69,0.8)",
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <p
              className="hero-eyebrow mb-6 min-h-[18px] text-xs tracking-[4px]"
              aria-label="FULL-STACK CREATIVE DEVELOPER"
            >
              <span>{typedRole}</span>
              <span
                className="ml-1 inline-block h-3 w-[2px] animate-pulse bg-[#E53945] align-middle"
                aria-hidden="true"
              />
            </p>

            <h1 className="hero-title text-5xl font-bold leading-[1.1] sm:text-6xl md:text-7xl xl:text-8xl">
              <span className="hero-word">Building</span>{" "}
              <span className="hero-word">Beyond</span>{" "}
              <span className="hero-word">the</span>{" "}
              <span className="hero-word hero-word-accent">Ordinary</span>
              <span className="text-[#E53945]">.</span>
            </h1>

            <p className="hero-description mt-6 max-w-xl text-sm leading-7 text-white/80 sm:mt-8 sm:text-base sm:leading-8">
              Crafting immersive digital experiences through creativity,
              technology and code. Welcome to my digital world.
            </p>

            <div className="hero-actions mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#work"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#E53945] px-8 py-4 font-semibold text-white shadow-[0_5px_25px_rgba(229,57,69,0.15)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(229,57,69,0.35)] active:translate-y-0"
              >
                <span>Explore My Work</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                  ↗
                </span>
              </a>

              <a
                href="#about"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.03] px-8 py-4 font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#E53945]/70 hover:bg-[#E53945]/10 hover:shadow-[0_10px_30px_rgba(229,57,69,0.12)] active:translate-y-0"
              >
                <span>About Me</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full min-w-0 max-w-[550px] lg:max-w-none">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-64 w-64 rounded-full bg-[#E53945]/20 blur-[100px] md:h-96 md:w-96" />
            </div>

            <div className="hero-scene-wrapper relative z-10">
              <HeroScene />
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
            <span className="text-[10px] tracking-[4px] text-white/50">
              SCROLL TO EXPLORE
            </span>
            <div className="flex h-10 w-6 justify-center rounded-full border border-white/30 p-1">
              <div className="h-2 w-1 animate-bounce rounded-full bg-[#E53945]" />
            </div>
          </div>
        </section>

        {/* ABOUT SECTION — FEATURE 15 */}
        <section
          id="about"
          className="reveal relative overflow-hidden border-t border-white/10 px-8 py-28 md:px-20"
        >
          <div
            className="section-illustration about-illustration"
            aria-hidden="true"
          >
            <span className="illustration-orbit orbit-one" />
            <span className="illustration-orbit orbit-two" />
            <span className="illustration-core" />
            <span className="illustration-dot" />
          </div>

          <p className="relative z-10 mb-6 text-xs tracking-[4px]">
            GET TO KNOW ME
          </p>

          <div className="relative z-10 grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-4xl font-bold leading-tight md:text-6xl">
                More Than
                <br />
                Just Code<span className="text-[#E53945]">.</span>
              </h2>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-lg leading-8 text-white/80">
                I'm a developer passionate about building meaningful digital
                experiences. I enjoy combining technology, creativity and
                problem-solving to turn ideas into reality.
              </p>

              <p className="mt-5 leading-8 text-white/80">
                From interactive frontend experiences to powerful backend
                systems, I'm constantly exploring new ways to build beyond the
                ordinary.
              </p>

              <a
                href="#work"
                className="mt-8 inline-flex w-fit border-b border-[#E53945] pb-2 transition hover:text-[#E53945]"
              >
                Discover My Work ↗
              </a>
            </div>
          </div>
        </section>

        {/* FEATURE 28 + 29: PROJECT SHOWCASE & FILTER */}
        <section
          id="work"
          className="reveal border-t border-white/10 px-8 py-28 md:px-20"
        >
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-6 text-xs tracking-[4px] text-[#E53945]">
                SELECTED PROJECTS
              </p>

              <h2 className="text-4xl font-bold md:text-6xl">
                Things I've Built
                <span className="text-[#E53945]">.</span>
              </h2>
            </div>

            <p className="max-w-sm leading-7 text-white/60">
              A collection of digital products, creative experiments and
              interactive experiences built with technology and imagination.
            </p>
          </div>

          <div className="mb-10 flex flex-wrap gap-3">
            {projectFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveProjectFilter(filter)}
                aria-pressed={activeProjectFilter === filter}
                className={`rounded-full border px-5 py-3 text-xs font-medium transition-all duration-300 ${
                  activeProjectFilter === filter
                    ? "border-[#E53945] bg-[#E53945] text-white"
                    : "border-white/15 bg-white/[0.03] text-white/60 hover:border-[#E53945]/60 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
            {filteredProjects.map((project) => (
              <article
                key={project.number}
                onClick={() => setSelectedProject(project)}
                className="project-card holographic group overflow-hidden rounded-2xl border border-white/10 bg-[#111] hover:border-[#E53945]/60 hover:shadow-[0_20px_60px_rgba(229,57,69,0.10)]"
                onMouseMove={handleProjectMouseMove}
                onMouseLeave={handleProjectMouseLeave}
              >
                <div className="product-showcase relative flex h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-[#251014] via-[#141414] to-black">
                  <div className="pointer-events-none absolute inset-0 opacity-20">
                    <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 transition-transform duration-700 group-hover:scale-125" />
                    <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 transition-transform duration-700 group-hover:scale-110" />
                  </div>

                  <span className="absolute left-7 top-7 z-20 text-xs tracking-[3px] text-white/50">
                    PROJECT / {project.number}
                  </span>

                  {project.name === "PM Watches" && (
                    <div className="watch-preview relative z-10 flex h-48 w-36 items-center justify-center rounded-[35px] border-[7px] border-[#777] bg-gradient-to-br from-[#333] to-black shadow-[0_0_45px_rgba(229,57,69,0.2)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-6">
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-[27px] border border-white/10 bg-[#080808]">
                        <span className="text-[10px] tracking-[3px] text-[#E53945]">
                          PM WATCH
                        </span>
                        <span className="mt-3 text-4xl font-bold text-white">
                          10:09
                        </span>
                        <span className="mt-2 text-[9px] text-white/50">
                          MONDAY · 14
                        </span>
                        <div className="mt-4 h-1 w-12 rounded-full bg-[#E53945]" />
                      </div>
                    </div>
                  )}

                  {project.name === "PM Nexora" && (
                    <div className="nexora-preview relative z-10 w-[75%] rounded-xl border border-white/15 bg-[#101010]/95 p-3 shadow-[0_0_45px_rgba(229,57,69,0.18)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105">
                      <div className="mb-3 flex items-center gap-1.5 border-b border-white/10 pb-3">
                        <span className="h-2 w-2 rounded-full bg-[#E53945]" />
                        <span className="h-2 w-2 rounded-full bg-white/30" />
                        <span className="h-2 w-2 rounded-full bg-white/30" />
                        <span className="ml-auto text-[9px] tracking-widest text-white/50">
                          NEXORA
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <div className="w-1/4 space-y-2">
                          <div className="h-3 rounded bg-[#E53945]/70" />
                          <div className="h-2 rounded bg-white/15" />
                          <div className="h-2 rounded bg-white/15" />
                          <div className="h-2 rounded bg-white/15" />
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="h-5 rounded bg-white/10" />

                          <div className="grid grid-cols-2 gap-2">
                            <div className="h-12 rounded border border-white/10 bg-white/[0.04]" />
                            <div className="h-12 rounded border border-white/10 bg-[#E53945]/10" />
                          </div>

                          <div className="flex h-8 items-end gap-1 rounded bg-white/[0.04] p-2">
                            <div className="h-2/5 flex-1 rounded-sm bg-[#E53945]/50" />
                            <div className="h-full flex-1 rounded-sm bg-[#E53945]" />
                            <div className="h-3/5 flex-1 rounded-sm bg-[#E53945]/60" />
                            <div className="h-4/5 flex-1 rounded-sm bg-[#E53945]/80" />
                            <div className="h-1/2 flex-1 rounded-sm bg-[#E53945]/40" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {project.name === "PM Chat" && (
                    <div className="chat-preview relative z-10 w-[70%] rounded-xl border border-white/15 bg-[#101010]/95 p-4 shadow-[0_0_45px_rgba(229,57,69,0.18)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105">
                      <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E53945] text-sm">
                          PM
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-white">
                            PM Chat
                          </div>
                          <div className="text-[9px] text-white/40">
                            Communication concept
                          </div>
                        </div>

                        <span className="ml-auto h-2 w-2 rounded-full bg-[#E53945]" />
                      </div>

                      <div className="space-y-3">
                        <div className="w-fit rounded-xl rounded-tl-sm bg-white/10 px-3 py-2 text-[9px] text-white/70">
                          Hey! Welcome to PM Chat.
                        </div>

                        <div className="ml-auto w-fit rounded-xl rounded-tr-sm bg-[#E53945]/80 px-3 py-2 text-[9px] text-white">
                          Let's build something.
                        </div>

                        <div className="w-fit rounded-xl rounded-tl-sm bg-white/10 px-3 py-2 text-[9px] text-white/70">
                          Sounds good!
                        </div>
                      </div>

                      <div className="mt-4 rounded-full border border-white/10 px-3 py-2 text-[9px] text-white/30">
                        Type a message...
                      </div>
                    </div>
                  )}

                  <span className="absolute bottom-6 right-7 z-20 text-xs tracking-widest text-white/40">
                    PM SYSTEMS
                  </span>
                </div>

                <div className="flex flex-col p-7 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[10px] leading-5 tracking-[2px] text-[#E53945]">
                      {project.category}
                    </p>

                    <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[9px] leading-4 tracking-widest text-white/50">
                      {project.status}
                    </span>
                  </div>

                  <h3 className="!static !mb-0 !mt-0 block w-full text-2xl font-bold leading-[1.3] transition-transform duration-300 group-hover:translate-x-1">
                    {project.name}
                    <span className="text-[#E53945]">.</span>
                  </h3>

                  <p className="!static !m-0 block min-h-[72px] w-full text-sm leading-7 text-white/60">
                    {project.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-white/70 transition-colors group-hover:border-[#E53945]/30"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-xs tracking-widest text-white/40">
                      {project.number} / 04
                    </span>

                    <span className="text-sm text-white/50 transition-colors group-hover:text-[#E53945]">
                      {project.status === "PLANNED"
                        ? "COMING SOON"
                        : project.status === "IN DEVELOPMENT"
                        ? "IN PROGRESS"
                        : "PROJECT SHOWCASE"}
                      <span className="ml-2">↗</span>
                    </span>
                    {project.liveUrl && (
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setLivePreviewProject(project);
                          setIsPreviewFullscreen(false);
                        }}
                        className="rounded-full border border-[#E53945]/50 px-4 py-2 text-xs font-semibold tracking-wider text-white transition-all duration-300 hover:bg-[#E53945] hover:border-[#E53945]"
                      >
                        LIVE PREVIEW ↗
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FEATURE 35: LIVE PROJECT PREVIEW MODAL */}
        {livePreviewProject && (
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-3 backdrop-blur-md sm:p-6"
            onClick={() => {
              setLivePreviewProject(null);
              setIsPreviewFullscreen(false);
            }}
          >
            <div
              className={`relative flex flex-col overflow-hidden border border-white/15 bg-[#101010] shadow-2xl transition-all duration-300 ${
                isPreviewFullscreen
                  ? "h-full w-full rounded-none"
                  : "h-[85vh] w-full max-w-6xl rounded-2xl"
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              {/* PREVIEW HEADER */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#151515] px-4 py-4 sm:px-6">
                <div>
                  <p className="text-xs tracking-[3px] text-[#E53945]">
                    LIVE PROJECT
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-white sm:text-base">
                    {livePreviewProject.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {/* OPEN EXTERNALLY */}
                  <a
                    href={livePreviewProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/70 transition hover:border-[#E53945] hover:text-white"
                  >
                    Open ↗
                  </a>

                  {/* FULLSCREEN */}
                  <button
                    onClick={() =>
                      setIsPreviewFullscreen((previous) => !previous)
                    }
                    className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/70 transition hover:border-[#E53945] hover:text-white"
                  >
                    {isPreviewFullscreen ? "Restore" : "Fullscreen"}
                  </button>

                  {/* CLOSE */}
                  <button
                    onClick={() => {
                      setLivePreviewProject(null);
                      setIsPreviewFullscreen(false);
                    }}
                    aria-label="Close live preview"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/70 transition hover:border-[#E53945] hover:bg-[#E53945] hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* WEBSITE PREVIEW */}
              <div className="relative min-h-0 flex-1 bg-white">
                <iframe
                  key={livePreviewProject.liveUrl}
                  src={livePreviewProject.liveUrl}
                  title={`${livePreviewProject.name} live preview`}
                  className="h-full w-full border-0"
                  allow="fullscreen"
                  loading="lazy"
                />
              </div>

              {/* PREVIEW FOOTER */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-[#151515] px-4 py-3">
                <span className="text-[10px] tracking-wider text-white/40">
                  LIVE WEBSITE PREVIEW
                </span>

                <span className="text-[10px] text-[#E53945]">
                  {livePreviewProject.name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* FEATURE: STANDALONE DRAGGABLE CARDS SECTION */}
        <section
          id="draggable-cards"
          className="reveal border-t border-white/10 px-8 py-28 md:px-20"
        >
          {/* SECTION HEADER */}
          <div className="mb-16">
            <p className="mb-6 flex items-center gap-3 text-xs tracking-[4px] text-[#E53945]">
              <span className="h-px w-8 bg-[#E53945]" />
              INTERACTIVE EXPERIENCE
            </p>

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h2 className="text-4xl font-bold md:text-6xl">
                  Draggable Cards
                  <span className="text-[#E53945]">.</span>
                </h2>

                <p className="mt-6 max-w-xl leading-7 text-white/60">
                  Explore the cards. Pick them up, move them around and create
                  your own arrangement.
                </p>
              </div>

              <span className="text-xs tracking-[3px] text-white/30">
                DRAG · DROP · REARRANGE
              </span>
            </div>
          </div>

          {/* DRAG INSTRUCTION */}
          <div className="mb-8 flex items-center gap-3 text-xs tracking-widest text-white/40">
            <span className="text-lg text-[#E53945]">✥</span>
            GRAB ANY CARD AND CHANGE ITS POSITION
          </div>

          {/* DRAGGABLE CARD GRID */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dragCards.map((card, index) => (
              <article
                key={card.id}
                draggable
                onDragStart={(event) => handleDragStart(event, card.id)}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, card.id)}
                onDragEnd={() => setDraggedCard(null)}
                className={`group relative min-h-[260px] cursor-grab overflow-hidden rounded-2xl border p-7 transition-all duration-300 active:cursor-grabbing ${
                  draggedCard === card.id
                    ? "scale-95 border-[#E53945] opacity-40"
                    : "border-white/10 bg-[#111] hover:-translate-y-2 hover:border-[#E53945]/60 hover:bg-[#151515]"
                }`}
              >
                {/* BACKGROUND GLOW */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#E53945]/10 blur-[70px] transition-all duration-500 group-hover:bg-[#E53945]/25" />

                {/* CARD TOP */}
                <div className="relative flex items-center justify-between">
                  <span className="text-xs tracking-[3px] text-white/30">
                    PM / {card.id}
                  </span>

                  <span className="text-sm text-white/30 transition-colors group-hover:text-[#E53945]">
                    ⠿
                  </span>
                </div>

                {/* ICON */}
                <div className="relative my-9 flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-3xl text-[#E53945] transition-all duration-300 group-hover:border-[#E53945]/40 group-hover:bg-[#E53945]/10 group-hover:scale-110">
                  {card.icon}
                </div>

                {/* CARD CONTENT */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#E53945]">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-sm text-white/40">{card.subtitle}</p>
                </div>

                {/* CARD FOOTER */}
                <div className="relative mt-7 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-[10px] tracking-[2px] text-white/30">
                    DRAGGABLE ELEMENT
                  </span>

                  <span className="text-sm text-[#E53945]">↗</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SKILLS SECTION — FEATURE 15 */}
        <section
          id="skills"
          className="reveal relative overflow-hidden border-t border-white/10 px-8 py-28 md:px-20"
        >
          <div
            className="section-illustration skills-illustration"
            aria-hidden="true"
          >
            <span className="skill-orbit skill-orbit-one" />
            <span className="skill-orbit skill-orbit-two" />
            <span className="skill-core">{"</>"}</span>
            <span className="skill-dot" />
          </div>

          <div className="relative z-10 mb-16">
            <p className="mb-6 text-xs tracking-[4px]">MY TOOLKIT</p>

            <h2 className="text-4xl font-bold md:text-6xl">
              Skills & Technologies
              <span className="text-[#E53945]">.</span>
            </h2>

            <p className="mt-6 max-w-xl leading-7 text-white/80">
              The tools and technologies I use to design, develop and build
              meaningful digital experiences.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                number: "01",
                title: "Frontend",
                skills: [
                  "HTML",
                  "CSS",
                  "JavaScript",
                  "React",
                  "Tailwind CSS",
                  "Motion",
                ],
              },
              {
                number: "02",
                title: "Backend",
                skills: [
                  "Node.js",
                  "Express.js",
                  "REST APIs",
                  "MongoDB",
                  "Mongoose",
                ],
              },
              {
                number: "03",
                title: "Creative Tech",
                skills: [
                  "Three.js",
                  "React Three Fiber",
                  "GSAP",
                  "Motion",
                  "WebGL",
                ],
              },
              {
                number: "04",
                title: "Tools",
                skills: ["Git", "GitHub", "VS Code", "Vite", "Figma"],
              },
            ].map((group) => (
              <div
                key={group.number}
                className="group rounded-2xl border border-white/10 bg-[#141414] p-8 transition duration-300 hover:border-[#E53945]"
              >
                <span className="text-sm text-[#E53945]">{group.number}</span>

                <h3 className="mb-6 mt-5 text-2xl font-bold">{group.title}</h3>

                <div className="flex flex-wrap gap-3">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/20 px-4 py-2 text-sm transition group-hover:border-[#E53945]/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MY JOURNEY SECTION — FEATURE 15 */}
        <section
          id="journey"
          className="reveal relative overflow-hidden border-t border-white/10 px-8 py-28 md:px-20"
        >
          <div
            className="section-illustration journey-illustration"
            aria-hidden="true"
          >
            <span className="journey-ring" />
            <span className="journey-line" />
            <span className="journey-point point-one" />
            <span className="journey-point point-two" />
            <span className="journey-point point-three" />
          </div>

          <div className="relative z-10 mb-16">
            <p className="mb-6 text-xs tracking-[4px]">THE PROCESS</p>

            <h2 className="text-4xl font-bold md:text-6xl">
              My Development Journey
              <span className="text-[#E53945]">.</span>
            </h2>

            <p className="mt-6 max-w-xl leading-7 text-white/80">
              Every project is an opportunity to learn, experiment and push
              creative boundaries.
            </p>
          </div>

          <div className="relative z-10 max-w-4xl">
            <div className="absolute bottom-3 left-[7px] top-3 w-px bg-[#E53945]/50" />

            <div className="space-y-12">
              {[
                {
                  number: "01",
                  label: "THE FOUNDATION",
                  title: "Frontend Development",
                  description:
                    "Exploring HTML, CSS and JavaScript while learning to create responsive and engaging user interfaces with React.",
                },
                {
                  number: "02",
                  label: "BUILDING SYSTEMS",
                  title: "Full-Stack Development",
                  description:
                    "Learning backend development, REST APIs, databases and how complete web applications work together.",
                },
                {
                  number: "03",
                  label: "CREATIVE EXPLORATION",
                  title: "Creative Development",
                  description:
                    "Exploring Three.js, GSAP, 3D experiences and interactive animations to build memorable digital experiences.",
                },
              ].map((stage) => (
                <div key={stage.number} className="relative pl-12">
                  <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-[#E53945] bg-[#090909]" />

                  <p className="mb-3 text-sm">
                    {stage.number} — {stage.label}
                  </p>

                  <h3 className="text-2xl font-bold md:text-3xl">
                    {stage.title}
                  </h3>

                  <p className="mt-4 max-w-2xl leading-7 text-white/80">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURE 29: MORPHING STUDIO */}
        <MorphingStudio />

        {/* FEATURE 16: INTERACTIVE 3D WORLD */}
        <section
          id="world"
          className="reveal border-t border-white/10 px-8 py-28 md:px-20"
        >
          <div className="mb-12">
            <p className="mb-4 text-sm tracking-[0.3em] text-[#E53945]">
              FEATURE 16 / EXPLORE
            </p>

            <h2 className="text-4xl font-bold md:text-6xl">
              Enter My <span className="text-[#E53945]">Digital World.</span>
            </h2>

            <p className="mt-5 max-w-xl text-white/50">
              An interactive 3D environment where creativity, technology and
              imagination come together.
            </p>
          </div>

          <InteractiveWorld />
        </section>

        {/* FEATURE 19: VIRTUAL 3D WORKSPACE */}
        <section
          id="workspace"
          className="reveal border-t border-white/10 px-8 py-28 md:px-20"
        >
          <div className="mb-12">
            <p className="mb-4 text-sm tracking-[0.3em] text-[#E53945]">
              FEATURE 19 / MY ENVIRONMENT
            </p>

            <h2 className="text-4xl font-bold md:text-6xl">
              My Creative <span className="text-[#E53945]">Workspace.</span>
            </h2>

            <p className="mt-5 max-w-xl text-white/50">
              A little look inside my virtual developer studio. Explore the
              setup and interact with the 3D environment.
            </p>
          </div>

          <VirtualWorkspace />
        </section>

        <AIDigitalTwin />

        {/* CONTACT SECTION */}
        <section
          id="contact"
          className="reveal border-t border-white/10 px-8 py-28 md:px-20"
        >
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <p className="mb-6 text-xs tracking-[4px]">GET IN TOUCH</p>

              <h2 className="text-5xl font-bold leading-tight md:text-7xl">
                Let's Build
                <br />
                Something
                <br />
                Great<span className="text-[#E53945]">.</span>
              </h2>

              <p className="mt-8 max-w-md leading-8 text-white/80">
                Have an idea, a project or an interesting opportunity? Let's
                connect and create something meaningful together.
              </p>

              <p className="mt-12 text-sm tracking-widest">
                OPEN TO INTERESTING OPPORTUNITIES
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#141414] p-8">
              <h3 className="mb-8 text-2xl font-bold">Send a Message</h3>

              <div className="space-y-6">
                <div>
                  <label className="mb-3 block text-sm">Your Name</label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-white/20 bg-[#090909] px-4 py-4 text-white placeholder:text-white/50 outline-none focus:border-[#E53945]"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm">Email Address</label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-white/20 bg-[#090909] px-4 py-4 text-white placeholder:text-white/50 outline-none focus:border-[#E53945]"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm">Your Message</label>

                  <textarea
                    rows="5"
                    placeholder="Tell me about your idea..."
                    className="w-full resize-none rounded-lg border border-white/20 bg-[#090909] px-4 py-4 text-white placeholder:text-white/50 outline-none focus:border-[#E53945]"
                  />
                </div>

                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-full bg-[#E53945] px-7 py-4 font-semibold text-white opacity-70"
                >
                  Message System Coming Soon
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE 11 + 25: PROJECT DETAILS POPUP + MOUSE DRAG + TOUCH SWIPE */}
        {selectedProject && (
          <div
            className="popup-backdrop fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 p-5 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="popup-content relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#141414] p-7 shadow-[0_20px_80px_rgba(229,57,69,0.15)] sm:p-10"
              onClick={(event) => event.stopPropagation()}
              onTouchStart={handleProjectTouchStart}
              onTouchEnd={handleProjectTouchEnd}
              onMouseDown={handleProjectMouseDown}
              onMouseUp={handleProjectMouseUp}
              onMouseLeave={handlePopupMouseLeave}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-popup-title"
            >
              <button
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xl text-white/70 transition hover:border-[#E53945] hover:bg-[#E53945] hover:text-white"
              >
                ×
              </button>

              <p className="mb-4 text-xs tracking-[3px] text-[#E53945]">
                {selectedProject.category}
              </p>

              <h2
                id="project-popup-title"
                className="mb-5 pr-8 text-3xl font-bold sm:text-4xl"
              >
                {selectedProject.name}
                <span className="text-[#E53945]">.</span>
              </h2>

              <p className="leading-8 text-white/60">
                {selectedProject.description}
              </p>

              <div className="mt-8">
                <p className="mb-4 text-xs tracking-[3px] text-white/40">
                  TECHNOLOGIES
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/70"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>

              {/* FEATURE 25: SWIPE + MOUSE DRAG INSTRUCTIONS */}
              <div className="mt-7 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <span className="text-xl text-[#E53945]">↔</span>

                <p className="text-center text-xs leading-5 text-white/50">
                  Swipe or drag left and right to explore other projects
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-xs tracking-widest text-white/40">
                  STATUS: {selectedProject.status}
                </span>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="rounded-full bg-[#E53945] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                >
                  Close ↗
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="border-t border-white/10 px-8 py-8 md:px-20">
          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
            <h2 className="text-2xl font-bold">
              PM<span className="text-[#E53945]">.</span>
            </h2>

            <p className="text-sm text-white/80">
              Building Beyond the Ordinary.
            </p>

            <p className="text-sm">© 2026 PM Portfolio</p>
          </div>
        </footer>

        {/* FEATURE 21: VOICE INTERACTION */}
        <div className="fixed bottom-7 left-7 z-[9999]">
          {voicePanelOpen && (
            <div className="mb-4 w-[280px] rounded-2xl border border-white/10 bg-[#141414] p-5 shadow-2xl sm:w-[320px]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs tracking-[3px] text-[#E53945]">
                    PM VOICE SYSTEM
                  </p>

                  <h3 className="mt-2 text-lg font-bold">Voice Interaction</h3>
                </div>

                <button
                  onClick={() => {
                    stopVoiceRecognition();
                    setVoicePanelOpen(false);
                  }}
                  aria-label="Close voice panel"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xl text-white/60 transition hover:border-[#E53945] hover:text-[#E53945]"
                >
                  ×
                </button>
              </div>

              <div className="mb-5 rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isListening ? "animate-pulse bg-[#E53945]" : "bg-white/30"
                    }`}
                  />

                  <span className="text-xs text-white/70">
                    {isListening ? "MICROPHONE ACTIVE" : "SYSTEM READY"}
                  </span>
                </div>

                <p className="text-sm leading-6 text-white/60">{voiceStatus}</p>
              </div>

              <button
                onClick={
                  isListening ? stopVoiceRecognition : startVoiceRecognition
                }
                className={`w-full rounded-full px-5 py-4 text-sm font-semibold transition ${
                  isListening
                    ? "border border-[#E53945] bg-transparent text-[#E53945] hover:bg-[#E53945]/10"
                    : "bg-[#E53945] text-white hover:bg-white hover:text-black"
                }`}
              >
                {isListening ? "■ Stop Listening" : "🎙 Start Listening"}
              </button>

              <p className="mt-4 text-[11px] leading-5 text-white/40">
                Try: "Open Projects", "Go to About", "Open Skills" or "Go to
                Contact".
              </p>
            </div>
          )}

          <button
            onClick={() => {
              if (voicePanelOpen) {
                stopVoiceRecognition();
                setVoicePanelOpen(false);
              } else {
                setVoicePanelOpen(true);
              }
            }}
            aria-label="Toggle voice interaction"
            aria-expanded={voicePanelOpen}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E53945]/50 bg-[#141414] text-xl text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#E53945]"
          >
            {voicePanelOpen ? "×" : "🎙"}
          </button>
        </div>

        {/* FEATURE 23: INTERACTIVE AI TERMINAL */}
        <div className="fixed bottom-7 right-24 z-[3000] md:right-24">
          {terminalOpen && (
            <div
              className="
                fixed inset-x-3 bottom-24
                z-[3000] flex h-[min(68dvh,520px)]
                max-h-[520px] min-h-[300px]
                flex-col overflow-hidden
                rounded-2xl border border-[#E53945]/30
                bg-[#0c0c0c]
                shadow-[0_0_60px_rgba(229,57,69,0.2)]

                sm:absolute sm:inset-x-auto
                sm:bottom-20 sm:right-0
                sm:h-[430px] sm:w-[430px]
                sm:min-h-0
              "
            >
              {/* TERMINAL HEADER */}
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#151515] px-3 py-3 sm:px-4 sm:py-4">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <div className="flex shrink-0 gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#E53945] sm:h-2.5 sm:w-2.5" />
                    <span className="h-2 w-2 rounded-full bg-yellow-500 sm:h-2.5 sm:w-2.5" />
                    <span className="h-2 w-2 rounded-full bg-green-500 sm:h-2.5 sm:w-2.5" />
                  </div>

                  <span className="truncate text-[10px] font-semibold tracking-wider text-white/80 sm:text-xs sm:tracking-widest">
                    PM INTERACTIVE TERMINAL
                  </span>
                </div>

                <button
                  onClick={() => setTerminalOpen(false)}
                  aria-label="Close terminal"
                  className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xl text-white/50 transition hover:bg-white/5 hover:text-[#E53945]"
                >
                  ×
                </button>
              </div>

              {/* TERMINAL OUTPUT */}
              <div
                ref={terminalOutputRef}
                className="
    min-h-0 flex-1 space-y-3
    overflow-y-auto overscroll-contain
    break-words p-3
    font-mono text-[11px] leading-6
    [overflow-wrap:anywhere]
    [scrollbar-width:none]
    [-ms-overflow-style:none]
    [&::-webkit-scrollbar]:hidden
    sm:p-4 sm:text-xs
  "
              >
                {terminalHistory.map((item, index) => (
                  <p
                    key={index}
                    className={
                      item.type === "command"
                        ? "break-words text-[#E53945]"
                        : item.type === "error"
                        ? "break-words text-red-400"
                        : item.type === "system"
                        ? "break-words text-white/50"
                        : "whitespace-pre-wrap break-words text-green-400"
                    }
                  >
                    {item.text}
                  </p>
                ))}
              </div>

              {/* COMMAND INPUT */}
              <form
                onSubmit={handleTerminalCommand}
                className="
                  flex shrink-0 items-center gap-2
                  border-t border-white/10
                  bg-[#151515]
                  px-3 py-3
                  sm:px-4 sm:py-4
                "
              >
                <span className="shrink-0 font-mono text-sm text-[#E53945]">
                  $
                </span>

                <input
                  ref={terminalInputRef}
                  type="text"
                  value={terminalInput}
                  onChange={(event) => setTerminalInput(event.target.value)}
                  placeholder="Enter a command..."
                  autoComplete="off"
                  spellCheck="false"
                  aria-label="Terminal command"
                  className="
                    min-w-0 flex-1 bg-transparent
                    font-mono text-base text-white
                    outline-none
                    placeholder:text-xs placeholder:text-white/30
                    sm:text-xs
                  "
                />

                <button
                  type="submit"
                  className="
                    shrink-0 rounded-md px-2 py-2
                    text-xs font-semibold text-[#E53945]
                    transition hover:bg-[#E53945]/10 hover:text-white
                  "
                >
                  RUN ↗
                </button>
              </form>
            </div>
          )}

          {/* TERMINAL TOGGLE */}
          <button
            onClick={() => setTerminalOpen((previous) => !previous)}
            aria-label="Toggle interactive terminal"
            aria-expanded={terminalOpen}
            className="
              flex h-14 w-14 items-center justify-center
              rounded-full border border-[#E53945]/50
              bg-[#141414] font-mono text-sm font-bold
              text-[#E53945] shadow-lg
              transition hover:-translate-y-1
              hover:bg-[#E53945] hover:text-white
            "
          >
            {terminalOpen ? "×" : ">_"}
          </button>
        </div>

        {/* BACK TO TOP BUTTON */}
        {showBackToTop && (
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            aria-label="Back to top"
            className="fixed bottom-7 right-7 z-[999] flex h-12 w-12 items-center justify-center rounded-full border border-[#E53945]/50 bg-[#141414] text-2xl text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#E53945]"
          >
            ↑
          </button>
        )}
      </main>
    </>
  );
}

export default App;
