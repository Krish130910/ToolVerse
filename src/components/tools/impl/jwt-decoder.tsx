"use client";

import React, { useState, useMemo } from "react";
import { parseJWT, JWT_SAMPLES } from "@/lib/jwt/decoder";
import { InputTokenCard } from "./jwt-decoder/InputTokenCard";
import { SummaryCard } from "./jwt-decoder/SummaryCard";
import { DecodedViewCard } from "./jwt-decoder/DecodedViewCard";

export const JwtDecoderTool: React.FC = () => {
  const [jwtInput, setJwtInput] = useState<string>(JWT_SAMPLES[0].token);

  // Compute live validation & decoding result
  const result = useMemo(() => {
    return parseJWT(jwtInput);
  }, [jwtInput]);

  const handleClear = () => {
    setJwtInput("");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Encoded JWT Input Card */}
      <InputTokenCard
        jwtInput={jwtInput}
        onInputChange={setJwtInput}
        onClear={handleClear}
        parts={result.parts}
      />

      {/* 2. Summary & Claims Card */}
      <SummaryCard result={result} />

      {/* 3. Decoded Header & Payload View Card */}
      <DecodedViewCard
        header={result.header}
        payload={result.payload}
        rawHeader={result.rawHeader}
        rawPayload={result.rawPayload}
        signature={result.signature}
      />
    </div>
  );
};
