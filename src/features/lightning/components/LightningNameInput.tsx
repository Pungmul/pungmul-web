import React from "react";

interface LightningNameInputProps {
  title: string;
  setTitle: (value: string) => void;
}

export default function LightningNameInput({ title, setTitle }: LightningNameInputProps) {
  return (
    <div style={{ paddingLeft: 24, paddingRight: 24, gap: 6 }} className="w-full flex flex-col overflow-y-auto">
      <div style={{ marginLeft: 4, fontSize: 14, color: "#9A9A9A" }}>
        번개 이름
      </div>
      <input
        type="text"
        name="lightningName"
        id="lightningName"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        style={{
          borderColor: "#CDC5FF",
          fontSize: 14,
          outlineColor: "#816DFF",
        }}
        className="px-2 py-3 w-full border rounded"
        placeholder="번개의 이름을 입력해주세요."
      />
    </div>
  );
} 