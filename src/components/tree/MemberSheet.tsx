import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { User, Heart, Stethoscope, BookOpen, Users } from "lucide-react";
import type { FamilyMember } from "@/data/familyData";
import { getRelationship } from "@/lib/kinship";

interface MemberSheetProps {
  member: FamilyMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const branchLabel: Record<string, string> = {
  paternal: "Папина линия",
  maternal: "Мамина линия",
  both: "Обе линии",
};

const branchColor: Record<string, string> = {
  paternal: "bg-[hsl(222,42%,30%)] text-[hsl(40,40%,95%)]",
  maternal: "bg-[hsl(152,40%,38%)] text-[hsl(40,40%,95%)]",
  both: "bg-accent text-accent-foreground",
};

const MemberSheet = ({ member, open, onOpenChange }: MemberSheetProps) => {
  if (!member) return null;

  const relationship = getRelationship(member.id);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto bg-background border-border">
        <SheetHeader className="pb-4">
          <div className="flex flex-col items-center text-center gap-3 pt-2">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-accent/30">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <SheetTitle className="font-display text-xl">{member.name}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{member.years}</p>

              {/* Relationship badge */}
              <div className="flex items-center justify-center gap-1.5 mt-2 mb-1">
                <Users className="w-3.5 h-3.5 text-accent" />
                <span className="text-sm font-medium text-accent">{relationship}</span>
              </div>

              <span className={`inline-block mt-1 text-xs px-3 py-1 rounded-full font-medium ${branchColor[member.branch]}`}>
                {branchLabel[member.branch]}
              </span>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-4">
          {/* Bio */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-accent" />
              <h3 className="font-display text-sm font-semibold text-foreground">Биография</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
          </div>

          {/* Habits */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-accent" />
              <h3 className="font-display text-sm font-semibold text-foreground">Привычки и увлечения</h3>
            </div>
            <ul className="space-y-1">
              {member.habits.map((h) => (
                <li key={h} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Medical */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="w-4 h-4 text-destructive" />
              <h3 className="font-display text-sm font-semibold text-foreground">Медицинские заметки</h3>
            </div>
            <ul className="space-y-1">
              {member.medical.map((m) => (
                <li key={m} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MemberSheet;
