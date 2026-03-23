import type { EdgeProps } from "@xyflow/react";

/**
 * Горизонтальная линия между супругами.
 * Рисуем строго горизонтально, чтобы визуально получилась "перемычка" над вертикальной ветвью.
 */
export default function SpouseEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
}: EdgeProps) {
  const y = (sourceY + targetY) / 2;
  const stroke = (style as any)?.stroke ?? "hsl(43, 76%, 52%)";
  const strokeWidth = (style as any)?.strokeWidth ?? 2;

  return <path d={`M ${sourceX} ${y} L ${targetX} ${y}`} stroke={stroke} strokeWidth={strokeWidth} fill="none" />;
}

