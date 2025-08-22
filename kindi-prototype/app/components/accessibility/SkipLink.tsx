"use client";

const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white"
      tabIndex={0}
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
