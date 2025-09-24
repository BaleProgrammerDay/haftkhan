import React from "react";
import { useChaosItem } from "./audioChaos";

interface ChaosItemProps {
  id: string;
  children: React.ReactNode;
}

function ChaosItem({ id, children }: ChaosItemProps) {
  const { style } = useChaosItem(id);
  return <div style={style as React.CSSProperties}>{children}</div>;
}

export default ChaosItem;


