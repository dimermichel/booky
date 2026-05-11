import Image from "next/image";
import Link from "next/link";

const steps = [
  { number: 1, title: "Upload PDF", description: "Add your book file" },
  { number: 2, title: "AI Processing", description: "We analyze the content" },
  { number: 3, title: "Voice Chat", description: "Discuss with AI" },
];

const HeroSection = () => {
  return (
    <section className="library-hero-card mb-10 md:mb-16">
      <div className="library-hero-content">
        <div className="library-hero-text">
          <h1 className="library-hero-title">Your Library</h1>
          <p className="library-hero-description">
            Convert your books into interactive AI conversations.
            <br className="hidden md:block" />
            Listen, learn, and discuss your favorite reads.
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

          <Link href="/books/new" className="library-cta-primary">
            + Add new book
          </Link>
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
  );
};

export default HeroSection;
