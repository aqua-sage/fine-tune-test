"use client";
import { ThemeToggle } from "@/components/buttons/theme-toggle";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Loader2 } from "lucide-react";
import { useOpenAI } from "@/hooks/useOpenAI";
import Link from "next/link";

export default function TadleChat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  const tadleHook = useOpenAI({
    model: "ft:gpt-4.1-2025-04-14:aqualabs:tadle-4-mini:BfohYmDE",
    name: "Tadle",
    isCharacter: true,
    onSuccess: (data) => {
      setResponse(data.output[0]?.content[0]?.text || "No response");
    },
    onError: (error) => {
      console.error("tadle Error:", error);
      setResponse("Error fetching response");
    },
  });

  const isLoading = tadleHook.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setResponse(null);
    tadleHook.mutate(input);
  };

  return (
    <div className="grid grid-rows-[40px_1fr_20px] items-center justify-items-center min-h-screen font-sans p-8 select-none">
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Link
          href="/"
          className={buttonVariants({
            variant: "ghost",
            size: "icon",
            className: "p-2 rounded-full",
          })}
        >
          <span className="sr-only">Home</span>
          <Home />
        </Link>
      </div>
      <main className="flex flex-col items-center justify-center gap-8 w-full max-w-2xl">
        <div className="text-center">
          <h1 className="font-bold text-4xl mb-2">Tadle</h1>
          <span className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-medium">
            Tadle
          </span>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Ask Tadle anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Asking...
                </>
              ) : (
                "Send"
              )}
            </Button>
          </div>

          <div className="border rounded-lg p-4 min-h-32">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-5 w-5 animate-spin text-foreground/50" />
              </div>
            ) : response ? (
              <p className="whitespace-pre-wrap">{response}</p>
            ) : (
              <p className="text-foreground/50 italic text-center">
                Response will appear here
              </p>
            )}
          </div>
        </form>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <h3 className="text-sm text-foreground/60">
          Tadle AI &copy; {new Date().getFullYear()}
        </h3>
      </footer>
    </div>
  );
}
