import { useEffect, useState } from "react";

interface TopProgressBarProps {
  loading: boolean;
}

export default function TopProgressBar({ loading }: TopProgressBarProps) {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 5));
      }, 25);
    } else {
      setProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  return (
    <div
      className="position-fixed top-0 start-0 w-100"
      style={{ zIndex: 2000 }}
    >
      {loading && (
        <div
          className="progress"
          style={{ height: "4px", backgroundColor: "gray" }}
        >
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${progress}%`,
              transition: "width 25ms linear",
              backgroundColor: "#89e7ffff",
            }}
          />
        </div>
      )}
    </div>
  );
}
