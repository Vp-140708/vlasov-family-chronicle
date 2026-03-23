import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

/**
 * Невидимая узловая точка для "Т-схемы":
 * от нижней ручки центра идёт вертикальная линия к детям.
 */
const CoupleCenterNode = ({ data }: NodeProps) => {
  const d = data as any;
  return (
    <div
      style={{
        width: 1,
        height: 1,
        pointerEvents: "none",
        opacity: 0,
      }}
    >
      <Handle id="bottom" type="source" position={Position.Bottom} className="!bg-transparent !w-2 !h-2" />
      {/* keep ids in case ReactFlow wants them */}
      <span style={{ display: "none" }}>{d?.id ?? ""}</span>
    </div>
  );
};

export default memo(CoupleCenterNode);

