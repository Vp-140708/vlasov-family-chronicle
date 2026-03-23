import type { EdgeProps } from "@xyflow/react";

/**
 * Ветвление "Т-схемы" под 90 градусов:
 * вертикаль вниз от центра, затем горизонтальная подводка к ребёнку.
 */
export default function BranchEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
}: EdgeProps) {
  const stroke = (style as any)?.stroke ?? "hsl(43, 76%, 52%)";
  const strokeWidth = (style as any)?.strokeWidth ?? 2;

  return (
    <path
      d={`M ${sourceX} ${sourceY} V ${targetY} H ${targetX}`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
    />
  );
}

