import Header from "./Header";

export default function PageShell({ children, compact = false, gameFit = false }) {
  return (
    <>
      <Header compact={compact} />
      <main
        className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${
          gameFit ? "h-[calc(100vh-72px)] overflow-hidden pb-2" : "pb-10"
        }`}
      >
        {children}
      </main>
    </>
  );
}
