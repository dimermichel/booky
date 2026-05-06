import VapiControls from "@/components/VapiControls";
import { getBookBySlug } from "@/lib/actions/book.actions";
import { getVoice } from "@/lib/utils";
import { IBook } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const BookPage = async ({ params }: PageProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { slug } = await params;
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect("/");
  }

  const book = result.data as IBook;

  return (
    <main className="book-page-container">
      <Link href="/" aria-label="Back to library" className="back-btn-floating">
        <ArrowLeft className="size-5 text-(--text-primary)" />
      </Link>

      <VapiControls book={book} />
    </main>
  );
};

export default BookPage;
