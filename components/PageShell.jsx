import Header from "./Header";

export default function PageShell({ children, compact = false, gameFit = false }) {
  return (
    <>
      <Header compact={compact} />
      <main
        className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${
          gameFit
            ? "min-h-[calc(100dvh-72px)] pb-5 lg:h-[calc(100dvh-72px)] lg:overflow-hidden lg:pb-2"
            : "pb-10"
        }`}
      >
        {children}
      </main>
    </>
  );
}
