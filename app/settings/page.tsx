"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Settings as SettingsIcon, User, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/settings&message=Please log in to access settings.");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  if (status === "loading" || !mounted) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading settings…</p>
      </main>
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-7 h-7 text-primary" />
        <h1 className="font-heading text-3xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="space-y-8">
        {/* Appearance Settings */}
        <section className="bg-card border border-border rounded-lg p-6 card-shadow space-y-4">
          <h2 className="font-heading text-xl font-bold text-foreground border-b border-border pb-3">
            Appearance
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose your preferred theme style for reading and browsing Sahifa.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <button
              onClick={() => setTheme("light")}
              className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/10 text-primary font-semibold ring-2 ring-primary/30"
                  : "border-border hover:bg-muted text-foreground"
              }`}
            >
              <Sun className="w-6 h-6" />
              <span className="text-sm">Warm Light</span>
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/10 text-primary font-semibold ring-2 ring-primary/30"
                  : "border-border hover:bg-muted text-foreground"
              }`}
            >
              <Moon className="w-6 h-6" />
              <span className="text-sm">Ink Dark</span>
            </button>

            <button
              onClick={() => setTheme("system")}
              className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                theme === "system"
                  ? "border-primary bg-primary/10 text-primary font-semibold ring-2 ring-primary/30"
                  : "border-border hover:bg-muted text-foreground"
              }`}
            >
              <Monitor className="w-6 h-6" />
              <span className="text-sm">System</span>
            </button>
          </div>
        </section>

        {/* Account Details */}
        <section className="bg-card border border-border rounded-lg p-6 card-shadow space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <User className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-xl font-bold text-foreground">
              Account Profile
            </h2>
          </div>

          {saved && (
            <div className="p-3 bg-green-100 text-green-800 border border-green-200 dark:bg-green-950 dark:text-green-300 rounded-md text-sm flex items-center gap-2">
              <Check className="w-4 h-4" /> Profile settings saved.
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="settings-name">Display Name</Label>
              <Input
                id="settings-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="settings-email">Email Address</Label>
              <Input
                id="settings-email"
                type="email"
                disabled
                value={email}
                className="mt-1 opacity-70 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email address cannot be modified directly.
              </p>
            </div>

            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
