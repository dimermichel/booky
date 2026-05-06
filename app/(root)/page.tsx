import BookCard from "@/components/BookCard";
import HeroSection from "@/components/HeroSection";
import { getAllBooks } from "@/lib/actions/book.actions";
import { auth } from "@clerk/nextjs/server";

const Page = async () => {
  const { userId } = await auth();
  const bookResults = await getAllBooks(userId ?? undefined);
  const books = bookResults.success ? (bookResults.data ?? []) : [];

  return (
    <main className="container wrapper">
      <HeroSection />

      <div className="library-books-grid">
        {books.map((book) => (
          <BookCard
            key={book._id}
            title={book.title}
            author={book.author}
            coverURL={book.coverURL}
            slug={book.slug}
          />
        ))}
      </div>
    </main>
  );
};

export default Page;
