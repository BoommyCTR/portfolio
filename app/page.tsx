"use client";

import { useEffect, useRef, useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { JetBrains_Mono, Inter } from "next/font/google";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowUp, ChevronDown, Code2, Server, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// import aboutme from "../../public/aboutme.jpg";

/**
 * Colorful, motion-forward rewrite.
 *
 * Design tokens (see explanation in chat):
 *  bg          #0B0F1A   ink       #EDF0F7   muted   #8D96AC
 *  surface     #131A2B   border    #232B40
 *  violet      #9A8CFF   cyan/teal #63D2C0   amber   #F5B95C   coral #FF8F6B
 *
 * Fonts: JetBrains Mono (display/code) + Inter (body) via next/font.
 *
 * New deps to install:
 *   npm i framer-motion
 *   npx shadcn-ui@latest add button input textarea
 */

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const inter = Inter({ subsets: ["latin"] });

const MotionButton = motion(Button);

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const nav = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#journey", label: "Journey" },
  { href: "#skill", label: "Skill" },
  { href: "#contact", label: "Contact" },
];

const stackTags = [
  { label: "React", color: "#63D2C0" },
  { label: "TypeScript", color: "#9A8CFF" },
  { label: "Spring Boot", color: "#F5B95C" },
];

type CodeToken = { text: string; color?: string };
const codeLines: CodeToken[][] = [
  [
    { text: "const ", color: "#9A8CFF" },
    { text: "developer", color: "#63D2C0" },
    { text: " = {" },
  ],
  [
    { text: "  name: " },
    { text: "'Phurinat Wongkasetchai'", color: "#F5B95C" },
    { text: "," },
  ],
  [
    { text: "  role: " },
    { text: "'Frontend Developer'", color: "#F5B95C" },
    { text: "," },
  ],
  [
    { text: "  stack: [" },
    { text: "'React'", color: "#F5B95C" },
    { text: ", " },
    { text: "'TypeScript'", color: "#F5B95C" },
    { text: ", " },
    { text: "'Spring Boot'", color: "#F5B95C" },
    { text: "]," },
  ],
  [
    { text: "  focus: " },
    { text: "'clean UI, solid systems'", color: "#F5B95C" },
    { text: "," },
  ],
  [{ text: "};" }],
];
const codeLineStrings = codeLines.map((line) =>
  line.map((t) => t.text).join(""),
);

const experience = [
  {
    year: "2021 — 2022",
    title: "Frontend Developer, Company",
    desc: "Built and maintained customer-facing React applications end to end.",
  },
  {
    year: "2023 — 2024",
    title: "Fullstack Developer, Company",
    desc: "Shipped features across a React/TypeScript frontend and a Spring Boot backend.",
  },
  {
    year: "2025 — Present",
    title: "Frontend Developer, MWA E-Service",
    desc: "Payment gateway integrations, PDPA-compliant UX, and platform reliability work.",
  },
];

const skillGroups = [
  {
    title: "Frontend",
    icon: Code2,
    accent: "#63D2C0",
    items: [
      { name: "React / Next.js", level: 92 },
      { name: "TypeScript", level: 85 },
      { name: "Tailwind CSS", level: 90 },
    ],
  },
  {
    title: "Backend",
    icon: Server,
    accent: "#9A8CFF",
    items: [
      { name: "Spring Boot", level: 82 },
      { name: "Java", level: 80 },
      { name: "REST APIs", level: 88 },
    ],
  },
  {
    title: "Tooling",
    icon: Wrench,
    accent: "#F5B95C",
    items: [
      { name: "Git & CI/CD", level: 85 },
      { name: "Docker / K8s", level: 70 },
      { name: "Figma", level: 65 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function useTypewriter(lines: string[], speed = 26) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= lines.length) return;
    const current = lines[lineIndex] ?? "";

    if (charIndex < current.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), speed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLineIndex((l) => l + 1);
      setCharIndex(0);
    }, 200);
    return () => clearTimeout(t);
  }, [lineIndex, charIndex, lines, speed]);

  return { lineIndex, charIndex, done: lineIndex >= lines.length };
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Orbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-32 top-10 h-72 w-72 rounded-full opacity-30 blur-[90px]"
        style={{ background: "#9A8CFF" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-6rem] top-40 h-80 w-80 rounded-full opacity-20 blur-[100px]"
        style={{ background: "#63D2C0" }}
        animate={{ x: [0, -24, 0], y: [0, 24, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full opacity-20 blur-[90px]"
        style={{ background: "#F5B95C" }}
        animate={{ x: [0, 20, 0], y: [0, 16, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function CodeWindow() {
  const { lineIndex, charIndex } = useTypewriter(codeLineStrings);

  return (
    <div className="relative rounded-xl border border-[#232B40] bg-[#0E1524]/90 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur">
      <div className="flex items-center gap-1.5 border-b border-[#232B40] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF8F6B]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#F5B95C]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#63D2C0]" />
        <span className="ml-3 text-xs text-[#8D96AC]">profile.ts</span>
      </div>
      <pre
        className={`${mono.className} min-h-[220px] px-5 py-5 text-[13px] leading-6`}
      >
        {codeLines.map((tokens, i) => {
          if (i > lineIndex) return null;

          if (i < lineIndex) {
            return (
              <div key={i}>
                {tokens.map((t, j) => (
                  <span key={j} style={{ color: t.color ?? "#EDF0F7" }}>
                    {t.text}
                  </span>
                ))}
              </div>
            );
          }

          const full = codeLineStrings[i] ?? "";
          return (
            <div key={i}>
              <span className="text-[#EDF0F7]">{full.slice(0, charIndex)}</span>
              <span className="animate-pulse text-[#63D2C0]">▍</span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}

function SkillBar({
  name,
  level,
  accent,
  delay,
}: {
  name: string;
  level: number;
  accent: string;
  delay: number;
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="text-[#EDF0F7]">{name}</span>
        <span className="text-[#8D96AC]">{level}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1B2334]">
        <motion.div
          className="h-1.5 rounded-full"
          style={{ background: accent }}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const Home: NextPage = () => {
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState<number | null>(null);

  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <>
      <Head>
        <title>Phurinat Wongkasetchai — Frontend Developer</title>
        <meta
          name="description"
          content="Portfolio of Phurinat Wongkasetchai, Frontend Developer."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        className={`${inter.className} min-h-screen overflow-x-hidden bg-[#0B0F1A] text-[#EDF0F7] antialiased`}
      >
        {/* Nav */}
        <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
          <nav className="mx-auto flex max-w-3xl items-center justify-between rounded-full border border-[#232B40] bg-[#0B0F1A]/80 px-3 py-2 backdrop-blur">
            <Link
              href="#home"
              className={`${mono.className} px-3 text-sm font-medium`}
            >
              boom<span className="text-[#63D2C0]">.dev</span>
            </Link>
            <div className="hidden gap-1 sm:flex">
              {nav.map((item, i) => (
                <a
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative rounded-full px-3 py-1.5 text-sm text-[#8D96AC] transition-colors hover:text-[#EDF0F7]"
                >
                  {hovered === i && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-[#161D2E]"
                      transition={{
                        type: "spring",
                        bounce: 0.25,
                        duration: 0.4,
                      }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              ))}
            </div>
            <Button
              size="sm"
              className="rounded-full bg-[#FF8F6B] text-[#0B0F1A] hover:bg-[#FF8F6B]/90"
            >
              <a href="#contact">Say hi</a>
            </Button>
          </nav>
        </header>

        {/* Hero */}
        <section
          id="home"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setSpotlight({
              x: ((e.clientX - rect.left) / rect.width) * 100,
              y: ((e.clientY - rect.top) / rect.height) * 100,
            });
          }}
          className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28"
        >
          <Orbs />
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background: `radial-gradient(500px circle at ${spotlight.x}% ${spotlight.y}%, rgba(154,140,255,0.12), transparent 45%)`,
            }}
          />

          <div className="relative mx-auto grid w-full max-w-5xl items-center gap-14 lg:grid-cols-2">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 text-sm font-medium text-[#63D2C0]"
              >
                Hi, I&apos;m
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`${mono.className} text-4xl font-bold leading-tight sm:text-5xl`}
              >
                Phurinat
                <br />
                Wongkasetchai
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-5 max-w-md text-[#8D96AC]"
              >
                Frontend developer building fast, accessible interfaces — and
                the payment flows, forms, and compliance UX behind them.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 flex flex-wrap gap-2"
              >
                {stackTags.map((tag) => (
                  <span
                    key={tag.label}
                    className="flex items-center gap-1.5 rounded-full border border-[#232B40] bg-[#131A2B] px-3 py-1 text-xs text-[#8D96AC]"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: tag.color }}
                    />
                    {tag.label}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <MotionButton
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-[#9A8CFF] text-[#0B0F1A] hover:bg-[#9A8CFF]/90"
                >
                  <a href="#contact">Hire me</a>
                </MotionButton>
                <MotionButton
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  variant="outline"
                  className="border-[#232B40] bg-transparent text-[#EDF0F7] hover:bg-[#161D2E] hover:text-[#EDF0F7]"
                >
                  <a href="#journey">See my work</a>
                </MotionButton>

                <div className="ml-1 flex gap-1">
                  {/* {[
                    { Icon: Twitter, href: "#", label: "Twitter" },
                    {
                      Icon: Linkedin,
                      href: "https://www.linkedin.com/in/phurinat/",
                      label: "LinkedIn",
                    },
                    { Icon: Facebook, href: "#", label: "Facebook" },
                  ].map(({ Icon, href, label }) => (
                    <Button key={label} variant="ghost" size="icon" asChild>
                      <a
                        href={href}
                        aria-label={label}
                        className="text-[#8D96AC] hover:text-[#EDF0F7]"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </Button>
                  ))} */}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <CodeWindow />
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#8D96AC]"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </section>

        {/* About */}
        <section id="about" className="relative px-6 py-28">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 text-center lg:flex-row lg:text-left">
            <Reveal className="relative mx-auto h-48 w-48 shrink-0 lg:mx-0">
              <div
                className="absolute -inset-3 rounded-[2rem] opacity-60 blur-2xl"
                style={{
                  background: "linear-gradient(135deg, #9A8CFF, #63D2C0)",
                }}
              />
              <motion.div
                whileHover={{ rotate: -2, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative h-full w-full overflow-hidden rounded-[2rem] border border-[#232B40]"
              >
                {/* <Image
                  src={aboutme}
                  alt="Portrait of Phurinat Wongkasetchai"
                  className="h-full w-full object-cover"
                /> */}
              </motion.div>
            </Reveal>

            <div>
              <Reveal>
                <p className="mb-2 text-sm font-medium text-[#F5B95C]">
                  About me
                </p>
                <h2
                  className={`${mono.className} text-2xl font-bold sm:text-3xl`}
                >
                  I like software that feels obvious once it&apos;s finished.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mx-auto mt-4 max-w-xl text-[#8D96AC] lg:mx-0">
                  A few years into building web applications end to end — from
                  React interfaces down to the Spring Boot services and payment
                  integrations behind them. I care about the details most people
                  never notice: the state that never breaks, the form that never
                  confuses.
                </p>
              </Reveal>
              <Reveal delay={0.2} className="mt-6">
                <Button
                  variant="outline"
                  className="border-[#232B40] bg-transparent text-[#EDF0F7] hover:bg-[#161D2E] hover:text-[#EDF0F7]"
                >
                  Download résumé
                </Button>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Journey */}
        <section id="journey" className="relative px-6 py-28">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-2 text-sm font-medium text-[#63D2C0]">Journey</p>
            <h2 className={`${mono.className} text-2xl font-bold sm:text-3xl`}>
              Experience
            </h2>
          </Reveal>

          <div ref={timelineRef} className="relative mx-auto max-w-2xl">
            <div className="absolute left-[7px] top-0 h-full w-px bg-[#232B40]" />
            <motion.div
              className="absolute left-[7px] top-0 w-px origin-top bg-gradient-to-b from-[#9A8CFF] via-[#63D2C0] to-[#F5B95C]"
              style={{ scaleY: lineScale, height: "100%" }}
            />

            <div className="space-y-10">
              {[...experience]
                .sort((a, b) => a.year.localeCompare(b.year))
                .map((item, i) => (
                  <Reveal
                    key={item.title}
                    delay={(i % 4) * 0.05}
                    className="relative pl-8"
                  >
                    <span className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-[#0B0F1A] bg-[#63D2C0]" />
                    <p className={`${mono.className} text-xs text-[#8D96AC]`}>
                      {item.year}
                    </p>
                    <p className="mt-1 font-medium">{item.title}</p>
                    <p className="mt-1 text-sm text-[#8D96AC]">{item.desc}</p>
                  </Reveal>
                ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skill" className="relative px-6 py-28">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-2 text-sm font-medium text-[#9A8CFF]">Skills</p>
            <h2 className={`${mono.className} text-2xl font-bold sm:text-3xl`}>
              What I work with
            </h2>
          </Reveal>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            {skillGroups.map((group, gi) => {
              const Icon = group.icon;
              return (
                <Reveal key={group.title} delay={gi * 0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 250, damping: 20 }}
                    className="h-full rounded-2xl border border-[#232B40] bg-[#131A2B] p-6"
                    style={{ boxShadow: `0 0 0 1px transparent` }}
                  >
                    <div
                      className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        background: `${group.accent}22`,
                        color: group.accent,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className={`${mono.className} mb-5 font-semibold`}>
                      {group.title}
                    </h3>
                    <div className="space-y-4">
                      {group.items.map((item, ii) => (
                        <SkillBar
                          key={item.name}
                          name={item.name}
                          level={item.level}
                          accent={group.accent}
                          delay={ii * 0.1}
                        />
                      ))}
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="relative px-6 py-28">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-2 text-sm font-medium text-[#F5B95C]">Contact</p>
            <h2 className={`${mono.className} text-2xl font-bold sm:text-3xl`}>
              Let&apos;s build something
            </h2>
            <p className="mt-3 text-[#8D96AC]">
              Have a project in mind, or just want to say hi? My inbox is open.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto max-w-xl">
            <div className="rounded-2xl border border-[#232B40] bg-[#131A2B] p-6 transition-shadow duration-300 focus-within:shadow-[0_0_0_1px_#9A8CFF,0_0_40px_-12px_#9A8CFF] sm:p-8">
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    placeholder="Full name"
                    required
                    className="border-[#232B40] bg-[#0E1524] placeholder:text-[#8D96AC]"
                  />
                  <Input
                    placeholder="Email address"
                    type="email"
                    required
                    className="border-[#232B40] bg-[#0E1524] placeholder:text-[#8D96AC]"
                  />
                </div>
                <Input
                  placeholder="Subject"
                  required
                  className="border-[#232B40] bg-[#0E1524] placeholder:text-[#8D96AC]"
                />
                <Textarea
                  placeholder="Your message"
                  required
                  rows={5}
                  className="resize-none border-[#232B40] bg-[#0E1524] placeholder:text-[#8D96AC]"
                />
                <MotionButton
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#FF8F6B] text-[#0B0F1A] hover:bg-[#FF8F6B]/90"
                >
                  Send message
                </MotionButton>
              </form>
            </div>
          </Reveal>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#232B40] px-6 py-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-[#8D96AC]">
              © 2026 Phurinat Wongkasetchai. All rights reserved.
            </p>
            <MotionButton
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              variant="outline"
              size="icon"
              className="rounded-full border-[#232B40] bg-transparent text-[#EDF0F7] hover:bg-[#161D2E]"
            >
              <a href="#home" aria-label="Back to top">
                <ArrowUp className="h-4 w-4" />
              </a>
            </MotionButton>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;
