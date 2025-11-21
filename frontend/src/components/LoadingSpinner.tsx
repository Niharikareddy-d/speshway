import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface LoadingSpinnerProps {
  size?: "small" | "default" | "large";
  tip?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ 
  size = "large", 
  tip = "Loading...",
  fullScreen = false 
}: LoadingSpinnerProps) => {
  const spinner = (
    <Spin 
      size={size} 
      tip={tip}
      indicator={<LoadingOutlined style={{ fontSize: size === "large" ? 48 : size === "default" ? 32 : 24 }} spin />}
    />
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {spinner}
      </div>
    );
  }

  return spinner;
};

