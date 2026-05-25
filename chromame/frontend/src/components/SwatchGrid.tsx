import { Tooltip, Typography } from "antd";

const { Text } = Typography;

type Swatch = { name: string; hex: string };

export function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {swatches.map((s) => (
        <Tooltip key={`${s.name}-${s.hex}`} title={`${s.name} · ${s.hex}`}>
          <div style={{ textAlign: "center", width: 80 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                background: s.hex,
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            />
            <Text style={{ fontSize: 12, display: "block", marginTop: 4 }}>
              {s.name}
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {s.hex}
            </Text>
          </div>
        </Tooltip>
      ))}
    </div>
  );
}

export function HexStrip({ hexes }: { hexes: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {hexes.map((hex) => (
        <Tooltip key={hex} title={hex}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 6,
              background: hex,
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          />
        </Tooltip>
      ))}
    </div>
  );
}
