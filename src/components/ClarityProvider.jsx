import { useEffect } from "react";

function ClarityProvider() {
  useEffect(() => {
    const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
    if (!projectId || typeof window === "undefined") {
      return;
    }

    if (window.clarity) {
      return;
    }

    window.clarity =
      window.clarity ||
      function clarityProxy() {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${projectId}`;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}

export default ClarityProvider;
