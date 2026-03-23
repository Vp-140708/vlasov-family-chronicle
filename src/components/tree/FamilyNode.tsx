import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { User } from "lucide-react";
import type { BranchType } from "@/data/familyData";

export interface FamilyNodeData {
  name: string;
  years: string;
  title: string;
  branch: BranchType;
  memberId: string;
  [key: string]: unknown;
}

const branchStyles: Record<BranchType, string> = {
  paternal: "border-[hsl(222,42%,30%)] shadow-[0_0_12px_hsl(222,42%,30%,0.15)]",
  maternal: "border-[hsl(152,40%,38%)] shadow-[0_0_12px_hsl(152,40%,38%,0.15)]",
  both: "border-accent shadow-heritage",
};

const dotStyles: Record<BranchType, string> = {
  paternal: "bg-[hsl(222,42%,30%)]",
  maternal: "bg-[hsl(152,40%,38%)]",
  both: "bg-accent",
};

const FamilyNode = ({ data }: NodeProps) => {
  const d = data as unknown as FamilyNodeData;

  return (
    <div
      className={`
        px-5 py-4 rounded-xl bg-card border-2 cursor-pointer
        transition-all duration-300 hover:scale-105 hover:shadow-heritage-lg
        min-w-[180px] text-center
        ${branchStyles[d.branch]}
      `}
    >
      <Handle id="top" type="target" position={Position.Top} className="!bg-border !w-2 !h-2" />

      <div className={`w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-2 border ${dotStyles[d.branch]} border-opacity-30`}>
        <User className="w-5 h-5 text-muted-foreground" />
      </div>

      <p className="font-display text-sm font-semibold text-foreground leading-tight">{d.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{d.years}</p>

      <div className="flex items-center justify-center gap-1.5 mt-2">
        <span className={`w-2 h-2 rounded-full ${dotStyles[d.branch]}`} />
        <span className="text-[10px] text-muted-foreground">{d.title}</span>
      </div>

      <Handle id="right" type="source" position={Position.Right} className="!bg-border !w-2 !h-2" />
      <Handle id="left" type="target" position={Position.Left} className="!bg-border !w-2 !h-2" />

      <Handle id="bottom" type="source" position={Position.Bottom} className="!bg-border !w-2 !h-2" />
    </div>
  );
};

export default memo(FamilyNode);
