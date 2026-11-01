import { SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Link2,
  MousePointerClick,
  PanelsTopLeft,
  Sparkles,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

async function RedirectIfSignedIn() {
  const { isAuthenticated } = await auth();
  if (isAuthenticated) redirect("/dashboard");
  return null;
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[#080d18] text-white">
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>

      <main className="relative isolate flex-1 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[34rem] w-[56rem] -translate-x-1/2 rounded-full bg-blue-500/15 blur-[120px]"
        />

        <section className="mx-auto grid w-full max-w-7xl items-center gap-16 px-6 pb-24 pt-20 sm:px-10 lg:grid-cols-[1fr_0.95fr] lg:gap-12 lg:px-12 lg:pb-32 lg:pt-28">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-slate-300">
              <Sparkles aria-hidden="true" className="size-4 text-cyan-300" />
              A simpler way to share
            </div>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
              Make every link
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                easier to share.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400 sm:text-xl">
              Turn long, messy URLs into clean short links that are easy to
              remember, share, and manage.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <SignUpButton mode="modal">
                <Button
                  className="h-12 rounded-full bg-cyan-300 px-6 text-base font-semibold text-slate-950 hover:bg-cyan-200"
                  size="lg"
                >
                  Get started for free
                  <ArrowRight aria-hidden="true" />
                </Button>
              </SignUpButton>
            </div>
            <p className="mt-5 text-sm text-slate-500">
              A tidy home for links you want to share.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-violet-500/20 blur-2xl"
            />
            <div className="relative rounded-[1.75rem] border border-white/10 bg-[#111827]/95 p-4 shadow-2xl shadow-black/40 sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300">
                    <Link2 aria-hidden="true" className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Your links</p>
                    <p className="text-xs text-slate-500">A clean place to start</p>
                  </div>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                  Workspace preview
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-[#0b1220] p-4 sm:p-5">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  Long link
                </p>
                <p className="mt-2 truncate text-sm text-slate-300">
                  example.com/resources/guides/getting-started
                </p>
                <div className="my-4 flex items-center gap-3 text-slate-600">
                  <span className="h-px flex-1 bg-white/10" />
                  <ArrowRight aria-hidden="true" className="size-4 text-cyan-300" />
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/[0.05] px-4 py-3">
                  <span className="font-mono text-sm text-cyan-200">
                    short.link/guide
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300">
                    <Check aria-hidden="true" className="size-3.5" />
                    Ready to share
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-3 grid size-8 place-items-center rounded-lg bg-violet-400/10 text-violet-300">
                    <PanelsTopLeft aria-hidden="true" className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-slate-200">
                    Easy to organize
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Keep useful links close at hand.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-3 grid size-8 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
                    <MousePointerClick aria-hidden="true" className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-slate-200">
                    Ready to share
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Short, clear links for anywhere.
                  </p>
                </div>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute -bottom-6 -right-4 hidden size-16 place-items-center rounded-2xl border border-white/10 bg-[#151e30] text-cyan-300 shadow-xl sm:grid"
            >
              <ArrowUpRight className="size-7" />
            </div>
          </div>
        </section>

        <section
          className="border-y border-white/[0.08] bg-white/[0.02]"
          id="features"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Made for sharing
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Less link clutter. More clarity.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-400">
                Link Shortener keeps the little details simple, so your links
                are ready whenever you need them.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-white/10 bg-[#101827] p-6 sm:p-7">
                <div className="grid size-11 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300">
                  <Link2 aria-hidden="true" className="size-5" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  Short and memorable
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Replace unwieldy URLs with links that are easier to read and
                  pass along.
                </p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-[#101827] p-6 sm:p-7">
                <div className="grid size-11 place-items-center rounded-xl bg-violet-300/10 text-violet-300">
                  <PanelsTopLeft aria-hidden="true" className="size-5" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  Keep links together
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Bring your shareable links into one straightforward
                  workspace.
                </p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-[#101827] p-6 sm:p-7">
                <div className="grid size-11 place-items-center rounded-xl bg-emerald-300/10 text-emerald-300">
                  <MousePointerClick aria-hidden="true" className="size-5" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  Share with confidence
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Make your URLs cleaner for messages, profiles, and everywhere
                  else you share.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-20 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Your next link starts here
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Make sharing the easy part.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Get started and give your links a little more room to breathe.
            </p>
          </div>
          <SignUpButton mode="modal">
            <Button
              className="h-12 rounded-full bg-cyan-300 px-6 text-base font-semibold text-slate-950 hover:bg-cyan-200"
              size="lg"
            >
              Create your account
              <ArrowRight aria-hidden="true" />
            </Button>
          </SignUpButton>
        </section>
      </main>
    </div>
  );
}
