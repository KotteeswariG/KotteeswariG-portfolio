import { useEffect, useState } from "react";
import { Layout, message } from "antd";
import { analyzeImage } from "./api";
import type { Profile } from "./types";
import { UploadCard } from "./components/UploadCard";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { PaletteExplorer } from "./components/PaletteExplorer";

const { Content } = Layout;

type View = "upload" | "results" | "explore";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [view, setView] = useState<View>("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleAnalyze = async (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setLoading(true);
    try {
      const result = await analyzeImage(file);
      setProfile(result);
      setView("results");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProfile(null);
    setView("upload");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#faf7f5" }}>
      <Content>
        {loading && previewUrl ? (
          <LoadingOverlay imageUrl={previewUrl} />
        ) : view === "explore" && profile ? (
          <PaletteExplorer profile={profile} onBack={() => setView("results")} />
        ) : view === "results" && profile ? (
          <ResultsDashboard
            profile={profile}
            onReset={handleReset}
            onExplore={() => setView("explore")}
          />
        ) : (
          <UploadCard onAnalyze={handleAnalyze} loading={loading} />
        )}
      </Content>
    </Layout>
  );
}
