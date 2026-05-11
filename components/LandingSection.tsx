"use client";

import Image from "next/image";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { BookOpen, Mic, Sparkles } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Upload Any Book",
    description: "Add PDFs to your personal library in seconds.",
  },
  {
    icon: Mic,
    title: "Voice Conversations",
    description: "Talk to AI about any book — ask questions, explore themes.",
  },
  {
    icon: Sparkles,
    title: "Personalized Insights",
    description: "Every discussion is tailored to the book and your questions.",
  },
];

const steps = [
  { number: 1, title: "Upload PDF", description: "Add your book file" },
  { number: 2, title: "AI Processing", description: "We analyze the content" },
  { number: 3, title: "Voice Chat", description: "Discuss with AI" },
];

const LandingSection = () => {
  return (
    <main className="container wrapper">
      {/* Hero */}
      <section className="library-hero-card mb-10 md:mb-16">
        <div className="library-hero-content">
          <div className="library-hero-text">
            <h1 className="library-hero-title">
              Your books,
              <br />
              now in conversation
            </h1>
            <p className="library-hero-description">
              Upload any book and have AI-powered voice discussions about its
              content, themes, and insights.
            </p>

            <div className="library-hero-illustration">
              <Image
                src="/assets/booky-modern-illustration.png"
                alt="Books illustration"
                width={260}
                height={200}
                className="object-contain"
                priority
              />
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-fit">
              <SignInButton mode="modal">
                <button className="btn-primary flex-1 lg:flex-none">
                  Get Started Free
                </button>
              </SignInButton>
              <Link
                href="/subscriptions"
                className="btn-secondary flex-1 lg:flex-none text-center"
              >
                View Pricing
              </Link>
            </div>
          </div>

          <div className="library-hero-illustration-desktop">
            <Image
              src="/assets/booky-modern-illustration.png"
              alt="Books illustration"
              width={380}
              height={295}
              className="object-contain"
              priority
            />
          </div>

          <div className="library-steps-card flex flex-col gap-4">
            {steps.map(({ number, title, description }) => (
              <div key={number} className="library-step-item">
                <span className="library-step-number">{number}</span>
                <div>
                  <p className="library-step-title">{title}</p>
                  <p className="library-step-description">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mb-10 md:mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-[14px] p-6 flex flex-col gap-3 shadow-soft"
            >
              <div className="w-10 h-10 rounded-[10px] bg-[var(--bg-tertiary)] flex items-center justify-center">
                <Icon size={20} className="text-[var(--color-brand)]" />
              </div>
              <h3 className="font-semibold text-base text-[var(--text-primary)] font-serif leading-6">
                {title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-5">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#f3e4c7] rounded-[14px] p-8 md:p-12 flex flex-col items-center gap-4 text-center mb-10">
        <h2 className="library-hero-title max-w-xs md:max-w-none">
          Start your first conversation
        </h2>
        <p className="library-hero-description max-w-md">
          Join readers who are getting more from every book.
        </p>
        <SignInButton mode="modal">
          <button className="btn-primary mt-2">Get Started Free</button>
        </SignInButton>
        <p className="text-sm text-[var(--text-secondary)]">
          Join free. No credit card required.
        </p>
      </section>
    </main>
  );
};

export default LandingSection;
