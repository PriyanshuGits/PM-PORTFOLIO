
import { useEffect, useState } from "react";

function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = 2200;
    const interval = 25;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((previous) => {
        const next = Math.min(previous + increment, 100);

        if (next >= 100) {
          clearInterval(timer);
          setIsExiting(true);

          setTimeout(onComplete, 800);
        }

        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={`preloader ${isExiting ? "preloader-exit" : ""}`}>
      <div className="preloader-content">
        <h1>
          PM<span>.</span>
        </h1>

        <p>BUILDING BEYOND THE ORDINARY</p>

        <div className="preloader-track">
          <div
            className="preloader-progress"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="preloader-bottom">
          <span>INITIALIZING EXPERIENCE</span>
          <span>
            {Math.floor(progress).toString().padStart(2, "0")}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default Preloader;
