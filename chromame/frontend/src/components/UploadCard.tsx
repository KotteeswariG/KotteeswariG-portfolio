import { useState } from "react";
import { Button, Card, Tabs, Typography, Upload, message } from "antd";
import { CameraOutlined, InboxOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { WebcamCapture } from "./WebcamCapture";

const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

type Props = {
  onAnalyze: (file: File) => void;
  loading: boolean;
};

export function UploadCard({ onAnalyze, loading }: Props) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleAnalyze = () => {
    const file = fileList[0]?.originFileObj;
    if (!file) {
      message.warning("Please select a photo first.");
      return;
    }
    onAnalyze(file as File);
  };

  return (
    <Card style={{ maxWidth: 560, margin: "48px auto", textAlign: "center" }}>
      <Title level={2} style={{ marginBottom: 8 }}>
        ChromaMe
      </Title>
      <Paragraph type="secondary">
        Take or upload a clear, well-lit face photo. We'll return your personal color
        season, makeup palette, and clothing recommendations.
      </Paragraph>

      <Tabs
        defaultActiveKey="upload"
        centered
        items={[
          {
            key: "upload",
            label: (
              <span>
                <InboxOutlined /> Upload
              </span>
            ),
            children: (
              <>
                <Dragger
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  beforeUpload={() => false}
                  maxCount={1}
                  fileList={fileList}
                  onChange={({ fileList: list }) => setFileList(list.slice(-1))}
                  onRemove={() => setFileList([])}
                  style={{ marginBottom: 16 }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag a photo to upload</p>
                  <p className="ant-upload-hint">JPG, PNG, WebP, or GIF</p>
                </Dragger>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleAnalyze}
                  loading={loading}
                  disabled={fileList.length === 0}
                  block
                >
                  {loading ? "Analyzing…" : "Analyze"}
                </Button>
              </>
            ),
          },
          {
            key: "webcam",
            label: (
              <span>
                <CameraOutlined /> Webcam
              </span>
            ),
            children: <WebcamCapture onCapture={onAnalyze} />,
          },
        ]}
      />
    </Card>
  );
}
