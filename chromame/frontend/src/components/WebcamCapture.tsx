import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button, Space, message } from "antd";
import { CameraOutlined, RedoOutlined } from "@ant-design/icons";

type Props = {
  onCapture: (file: File) => void;
};

function dataUrlToFile(dataUrl: string, name: string): File {
  const [meta, b64] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], name, { type: mime });
}

export function WebcamCapture({ onCapture }: Props) {
  const webcamRef = useRef<Webcam>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const snap = useCallback(() => {
    const shot = webcamRef.current?.getScreenshot();
    if (!shot) {
      message.error("Could not capture image. Check camera permissions.");
      return;
    }
    setPreview(shot);
  }, []);

  const confirm = () => {
    if (!preview) return;
    onCapture(dataUrlToFile(preview, `chromame-${Date.now()}.jpg`));
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 12,
          border: "1px solid rgba(0,0,0,0.08)",
          background: "#000",
        }}
      >
        {preview ? (
          <img src={preview} alt="captured" style={{ width: "100%", display: "block" }} />
        ) : (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            style={{ width: "100%", display: "block" }}
          />
        )}
      </div>

      {preview ? (
        <Space>
          <Button icon={<RedoOutlined />} onClick={() => setPreview(null)}>
            Retake
          </Button>
          <Button type="primary" onClick={confirm}>
            Use this photo
          </Button>
        </Space>
      ) : (
        <Button type="primary" icon={<CameraOutlined />} onClick={snap}>
          Take photo
        </Button>
      )}
    </div>
  );
}
