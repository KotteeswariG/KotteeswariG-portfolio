import { Button, Card, Col, Row, Space, Typography, message } from "antd";
import { ArrowLeftOutlined, CopyOutlined } from "@ant-design/icons";
import type { Profile } from "../types";

const { Title, Text } = Typography;

function copy(hex: string) {
  navigator.clipboard.writeText(hex).then(
    () => message.success(`Copied ${hex}`),
    () => message.error("Copy failed"),
  );
}

function BigSwatch({ hex, label }: { hex: string; label?: string }) {
  return (
    <div
      onClick={() => copy(hex)}
      style={{
        cursor: "pointer",
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
        transition: "transform 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{ background: hex, height: 96 }} />
      <div style={{ padding: "8px 10px", background: "#fff" }}>
        {label && (
          <Text style={{ display: "block", fontSize: 13, fontWeight: 500 }}>{label}</Text>
        )}
        <Space size={4}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {hex}
          </Text>
          <CopyOutlined style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }} />
        </Space>
      </div>
    </div>
  );
}

type Props = {
  profile: Profile;
  onBack: () => void;
};

export function PaletteExplorer({ profile, onBack }: Props) {
  const sections: { title: string; items: { hex: string; label?: string }[] }[] = [
    {
      title: "Foundation",
      items: [{ hex: profile.foundationHex, label: "Match" }],
    },
    { title: "Blush", items: profile.blushShades },
    { title: "Lip Colors", items: profile.lipColors },
    { title: "Eyeshadow Palette", items: profile.eyeshadowPalette },
    {
      title: "Clothing Colors",
      items: profile.clothingColors.map((hex) => ({ hex })),
    },
    {
      title: "Accent Colors",
      items: profile.accentColors.map((hex) => ({ hex })),
    },
    {
      title: "Hair — Natural",
      items: profile.hairRecommendations.filter((h) => h.category === "natural"),
    },
    {
      title: "Hair — Bold",
      items: profile.hairRecommendations.filter((h) => h.category === "bold"),
    },
    {
      title: "Colors to Avoid",
      items: profile.avoidColors.map((hex) => ({ hex })),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "32px auto", padding: "0 16px" }}>
      <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>
          Palette Explorer · {profile.season}
        </Title>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          Back to profile
        </Button>
      </Space>

      <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
        Tap any swatch to copy the hex code.
      </Text>

      {sections.map((section) =>
        section.items.length === 0 ? null : (
          <Card key={section.title} title={section.title} size="small" style={{ marginBottom: 16 }}>
            <Row gutter={[12, 12]}>
              {section.items.map((item, i) => (
                <Col key={`${item.hex}-${i}`} xs={12} sm={8} md={6} lg={4}>
                  <BigSwatch hex={item.hex} label={item.label} />
                </Col>
              ))}
            </Row>
          </Card>
        ),
      )}
    </div>
  );
}
