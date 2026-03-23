import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Archive } from "lucide-react";
import { artifacts, type Artifact } from "@/data/artifactsData";
import { useState } from "react";

const Artifacts = () => {
  const [selected, setSelected] = useState<Artifact | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 border-2 border-accent/30">
              <Archive className="w-7 h-7 text-accent" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Артефакты
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Ордена, документы, фотографии и личные вещи наших предков.
            </p>
            <div className="mt-12">
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {artifacts.map((a) => (
                  <motion.div
                    key={a.id}
                    layout
                    className="break-inside-avoid mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35 }}
                  >
                    <button
                      type="button"
                      className="card-heritage overflow-hidden group w-full text-left cursor-pointer hover:shadow-heritage-lg transition-shadow duration-300"
                      onClick={() => setSelected(a)}
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={a.photoSrc}
                          alt={a.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-display text-base font-semibold text-foreground">
                            {a.title}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {a.year} · Предок: <span className="text-foreground/90 font-medium">{a.ancestorName}</span>
                        </p>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full-screen modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[80] bg-background/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="absolute inset-0 overflow-y-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-5xl mx-auto px-6 pt-24 pb-12">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-accent font-medium">
                      Артефакт
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                      {selected.title}
                    </h2>
                    <p className="text-muted-foreground mt-3">
                      {selected.year} · Предок: <span className="text-foreground/90 font-medium">{selected.ancestorName}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    className="rounded-full border border-border bg-card hover:bg-secondary transition-colors px-4 py-2 text-sm text-muted-foreground"
                    onClick={() => setSelected(null)}
                  >
                    Закрыть
                  </button>
                </div>

                <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-card">
                  <img src={selected.photoSrc} alt={selected.title} className="w-full h-full object-cover" />
                </div>

                <div className="mt-8 card-heritage p-8 border-border">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3">История</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{selected.history}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Artifacts;
