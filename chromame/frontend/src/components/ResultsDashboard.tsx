import { useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import {
  AppstoreOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { Profile } from "../types";
import { HexStrip, SwatchGrid } from "./SwatchGrid";
import { exportElementToPdf } from "../utils/exportPdf";

const { Title, Paragraph } = Typography;

const SEASON_COLOR: Record<Profile["season"], string> = {
  Spring: "#f5b75c",
  Summer: "#a3c2d6",
  Autumn: "#c97b3a",
  Winter: "#4a5fa3",
};

type Props = {
  profile: Profile;
  onReset: () => void;
  onExplore: () => void;
};

export function ResultsDashboard({ profile, onReset, onExplore }: Props) {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!dashboardRef.current) return;
    setExporting(true);
    try {
      await exportElementToPdf(dashboardRef.current, `chromame-${profile.season.toLowerCase()}.pdf`);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "PDF export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: "32px auto", padding: "0 16px" }}>
      <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }} wrap>
        <Title level={2} style={{ margin: 0 }}>
          Your ChromaMe Profile
        </Title>
        <Space wrap>
          <Button icon={<AppstoreOutlined />} onClick={onExplore}>
            Explore palette
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport} loading={exporting}>
            Export PDF
          </Button>
          <Button icon={<ReloadOutlined />} onClick={onReset}>
            Analyze another
          </Button>
        </Space>
      </Space>

      <div ref={dashboardRef}>
        <Card style={{ marginBottom: 16, borderTop: `4px solid ${SEASON_COLOR[profile.season]}` }}>
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} size="small">
            <Descriptions.Item label="Season">
              <Tag color={SEASON_COLOR[profile.season]} style={{ color: "#fff" }}>
                {profile.season}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Skin Tone">{profile.skinTone}</Descriptions.Item>
            <Descriptions.Item label="Undertone">{profile.undertone}</Descriptions.Item>
            <Descriptions.Item label="Fitzpatrick">{profile.fitzpatrick}</Descriptions.Item>
            <Descriptions.Item label="Jewelry">{profile.jewelryMetal}</Descriptions.Item>
            <Descriptions.Item label="Confidence">
              <Tag
                color={
                  profile.confidence === "high"
                    ? "green"
                    : profile.confidence === "medium"
                      ? "gold"
                      : "red"
                }
              >
                {profile.confidence}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
          <Paragraph style={{ marginTop: 12, marginBottom: 0 }}>{profile.notes}</Paragraph>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Foundation Match" size="small">
              <Space>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    background: profile.foundationHex,
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                />
                <Typography.Text code>{profile.foundationHex}</Typography.Text>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Blush" size="small">
              <SwatchGrid swatches={profile.blushShades} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Lip Colors" size="small">
              <SwatchGrid swatches={profile.lipColors} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Eyeshadow Palette" size="small">
              <SwatchGrid swatches={profile.eyeshadowPalette} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Best Clothing Colors" size="small">
              <HexStrip hexes={profile.clothingColors} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Accent Colors" size="small">
              <HexStrip hexes={profile.accentColors} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Colors to Avoid" size="small">
              <HexStrip hexes={profile.avoidColors} />
            </Card>
          </Col>
          <Col xs={24}>
            <Card title="Hair Recommendations" size="small">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Typography.Text strong>Natural</Typography.Text>
                  <div style={{ marginTop: 8 }}>
                    <SwatchGrid
                      swatches={profile.hairRecommendations.filter((h) => h.category === "natural")}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <Typography.Text strong>Bold</Typography.Text>
                  <div style={{ marginTop: 8 }}>
                    <SwatchGrid
                      swatches={profile.hairRecommendations.filter((h) => h.category === "bold")}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
