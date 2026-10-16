import { Globe, EyeOff, Lock } from "lucide-svelte";

export const TYPE_META = {
  public: { label: "Publik", icon: Globe, badge: "bg-emerald-100 text-emerald-800" },
  unlisted: { label: "Tidak Terdaftar", icon: EyeOff, badge: "bg-amber-100 text-amber-800" },
  private: { label: "Privat", icon: Lock, badge: "bg-slate-200 text-slate-800" },
};

export const TYPE_OPTIONS = Object.entries(TYPE_META).map(([value, meta]) => ({
  value,
  label: meta.label,
}));
