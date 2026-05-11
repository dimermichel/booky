import Link from "next/link";
import Image from "next/image";

const socialLinks = [
  {
    href: "https://github.com/dimermichel",
    icon: "/assets/github.svg",
    label: "GitHub",
  },
  {
    href: "https://linkedin.com/in/dimermichel",
    icon: "/assets/linkedin.svg",
    label: "LinkedIn",
  },
  {
    href: "https://x.com/DMichelMaia",
    icon: "/assets/x.svg",
    label: "Twitter",
  },
];

const footerLinks = [
  { label: "Library", href: "/" },
  { label: "Pricing", href: "/subscriptions" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#f3e4c7] mt-auto">
      <div className="wrapper py-6 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <Link href="/" className="flex gap-1.5 items-center group">
            <Image
              src="/assets/logo.png"
              alt="Booky"
              width={36}
              height={22}
              className="opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <span className="font-serif font-semibold text-lg tracking-tight">
              Booky
            </span>
          </Link>
        </div>

        <div className="w-full h-px bg-white/10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-black/40 order-2 sm:order-1">
            &copy; {year} Booky — built by{" "}
            <Link
              href="https://michelmaia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:opacity-70 transition-colors underline underline-offset-2"
            >
              Michel Maia
            </Link>
          </p>

          <div className="flex gap-4 order-1 sm:order-2">
            {socialLinks.map(({ href, icon, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <Image src={icon} alt={label} width={18} height={18} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
