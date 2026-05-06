"use client";
import Transcript from "@/components/Transcript";
import useVapi from "@/lib/hooks/useVapi";
import { getVoice } from "@/lib/utils";
import { IBook } from "@/types";
import { Mic, MicOff } from "lucide-react";
import Image from "next/image";

const VapiControls = ({ book }: { book: IBook }) => {
  const {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    start,
    stop,
    clearErrors,
  } = useVapi(book);

  const voice = getVoice(book.persona);

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-8">
      {/* Header Card */}
      <section className="vapi-header-card">
        <div className="vapi-cover-wrapper">
          {book.coverURL ? (
            <Image
              src={book.coverURL}
              alt={`${book.title} cover`}
              width={120}
              height={180}
              className="w-30 h-45 rounded-lg object-cover"
            />
          ) : (
            <div className="w-30 h-45 rounded-lg bg-white/60" />
          )}

          <div className="vapi-mic-wrapper relative">
            {(status === "speaking" || status === "thinking") && (
              <span className="absolute inset-0 rounded-full bg-white animate-ping" />
            )}
            <button
              onClick={isActive ? stop : start}
              disabled={status === "connecting"}
              type="button"
              className={`vapi-mic-btn shadow-md !w-[60px] !h-[60px] z-10 ${isActive ? "vapi-mic-btn-active" : "vapi-mic-btn-inactive"}`}
              aria-label={isActive ? "Stop conversation" : "Start conversation"}
            >
              {isActive ? (
                <Mic className="size-5 text-(--text-primary)" />
              ) : (
                <MicOff className="size-5 text-(--text-primary)" />
              )}
            </button>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black font-serif leading-tight">
              {book.title}
            </h1>
            <p className="text-xl text-[#4b4b4b]">by {book.author}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="vapi-status-indicator">
              <span className="vapi-status-dot vapi-status-dot-ready" />
              <span className="vapi-status-text">Ready</span>
            </div>

            <div className="vapi-status-indicator">
              <span className="vapi-status-text">Voice: {voice.name}</span>
            </div>

            <div className="vapi-status-indicator">
              <span className="vapi-status-text">0:00/15:00</span>
            </div>
          </div>
        </div>
      </section>

      <section className="vapi-transcript-wrapper">
        <Transcript
          messages={messages}
          currentMessage={currentMessage}
          currentUserMessage={currentUserMessage}
        />
      </section>
    </div>
  );
};

export default VapiControls;
