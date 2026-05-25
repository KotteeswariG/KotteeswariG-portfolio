import { useEffect, useState } from "react";
import { Card, Typography } from "antd";

const { Title, Text } = Typography;

const STAGES = [
  "Detecting face…",
  "Reading skin tone…",
  "Analyzing undertones…",
  "Matching color season…",
  "Curating your palette…",
];

const cornerStyle: React.CSSProperties = {
  position: "absolute",
  width: 32,
  height: 32,
  borderColor: "#c44569",
  borderStyle: "solid",
  borderWidth: 0,
};

export function LoadingOverlay({ imageUrl }: { imageUrl: string }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => (s + 1) % STAGES.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <Card style={{ maxWidth: 560, margin: "48px auto", textAlign: "center" }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        Analyzing your colors
      </Title>

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 12,
          marginBottom: 16,
          aspectRatio: "1 / 1",
        }}
      >
        <img
          src={imageUrl}
          alt="analyzing"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        <div
          style={{
            ...cornerStyle,
            top: 12,
            left: 12,
            borderTopWidth: 3,
            borderLeftWidth: 3,
            borderTopLeftRadius: 6,
            animation: "chromame-pulse 1.4s ease-in-out infinite",
          }}
        />
        <div
          style={{
            ...cornerStyle,
            top: 12,
            right: 12,
            borderTopWidth: 3,
            borderRightWidth: 3,
            borderTopRightRadius: 6,
            animation: "chromame-pulse 1.4s ease-in-out infinite 0.2s",
          }}
        />
        <div
          style={{
            ...cornerStyle,
            bottom: 12,
            left: 12,
            borderBottomWidth: 3,
            borderLeftWidth: 3,
            borderBottomLeftRadius: 6,
            animation: "chromame-pulse 1.4s ease-in-out infinite 0.4s",
          }}
        />
        <div
          style={{
            ...cornerStyle,
            bottom: 12,
            right: 12,
            borderBottomWidth: 3,
            borderRightWidth: 3,
            borderBottomRightRadius: 6,
            animation: "chromame-pulse 1.4s ease-in-out infinite 0.6s",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 3,
            background:
              "linear-gradient(90deg, transparent, rgba(196,69,105,0.9), transparent)",
            boxShadow: "0 0 12px rgba(196,69,105,0.7)",
            animation: "chromame-scan 2.4s ease-in-out infinite",
          }}
        />

        <style>{`
          @keyframes chromame-scan {
            0%   { top: 0%; }
            50%  { top: calc(100% - 3px); }
            100% { top: 0%; }
          }
          @keyframes chromame-pulse {
            0%, 100% { opacity: 0.4; }
            50%      { opacity: 1; }
          }
        `}</style>
      </div>

      <Text type="secondary">{STAGES[stage]}</Text>
    </Card>
  );
}
