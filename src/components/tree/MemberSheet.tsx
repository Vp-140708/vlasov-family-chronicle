import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Heart, Stethoscope, BookOpen, Users } from "lucide-react";
import type { FamilyMember } from "@/data/familyData";
import { getKinshipStatus } from "@/lib/kinship";

interface MemberSheetProps {
  member: FamilyMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: FamilyMember[];
  currentUserId: string | null;
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

const MemberSheet = ({ member, open, onOpenChange, members, currentUserId }: MemberSheetProps) => {
  if (!member) return null;

  const relationship =
    currentUserId && members.length ? getKinshipStatus(currentUserId, member.id, members) : "Родственник";
  const bio = member.bio?.trim() ? member.bio : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full h-full max-w-none p-0 overflow-y-auto bg-background border-border">
        <div className="min-h-full">
          <div className="border-b border-border px-6 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <SheetTitle className="font-display text-xl break-words">{member.name}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{member.years}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-secondary text-foreground font-medium">
                  <Users className="w-4 h-4 text-accent" />
                  {relationship}
                </span>
                <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${branchColor[member.branch]}`}>
                  {branchLabel[member.branch]}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
              <div>
                <div className="rounded-2xl overflow-hidden border border-border bg-card">
                  <img
                    src={member.photo_url ?? "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-[360px] object-cover"
                  />
                </div>
                <div className="mt-4 card-heritage p-4 border-border">
                  <div className="text-xs uppercase tracking-[0.2em] text-accent font-medium">Статус</div>
                  <div className="mt-2 font-display text-lg font-semibold text-foreground">{member.title}</div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="card-heritage p-6 border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-accent" />
                    <h3 className="font-display text-sm font-semibold text-foreground">Подробная Биография</h3>
                  </div>
                  {bio ? (
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{bio}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">Биография пока не заполнена.</p>
                  )}
                </div>

                <div className="card-heritage p-6 border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-accent" />
                    <h3 className="font-display text-sm font-semibold text-foreground">Привычки</h3>
                  </div>
                  {member.habits.length ? (
                    <ul className="space-y-2">
                      {member.habits.map((h) => (
                        <li key={h} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">Нет данных.</p>
                  )}
                </div>

                <div className="card-heritage p-6 border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Stethoscope className="w-4 h-4 text-destructive" />
                    <h3 className="font-display text-sm font-semibold text-foreground">Здоровье</h3>
                  </div>
                  {member.medical.length ? (
                    <ul className="space-y-2">
                      {member.medical.map((m) => (
                        <li key={m} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">Нет данных.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MemberSheet;
