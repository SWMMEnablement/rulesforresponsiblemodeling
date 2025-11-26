import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Keyboard } from "lucide-react";

interface ShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShortcutsModal = ({ open, onOpenChange }: ShortcutsModalProps) => {
  const shortcuts = [
    {
      category: "Navigation",
      items: [
        { keys: ["H"], description: "Go to Home page" },
        { keys: ["G"], description: "Go to Glossary" },
        { keys: ["S"], description: "Go to Study Guide" },
        { keys: ["R"], description: "Go to Resources" },
        { keys: ["←"], description: "Previous chapter (when on a chapter page)" },
        { keys: ["→"], description: "Next chapter (when on a chapter page)" },
      ],
    },
    {
      category: "Actions",
      items: [
        { keys: ["D"], description: "Toggle dark mode" },
        { keys: ["?"], description: "Show this help dialog" },
        { keys: ["Esc"], description: "Close dialogs/modals" },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Keyboard className="w-6 h-6 text-primary" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate faster and enhance your reading experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut, index) => (
                  <Card key={index} className="p-3 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd
                          key={keyIndex}
                          className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded shadow-sm min-w-[2rem] text-center"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Keyboard shortcuts won't work when you're typing in text fields or search boxes.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
