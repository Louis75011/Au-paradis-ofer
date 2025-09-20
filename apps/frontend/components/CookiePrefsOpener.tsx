"use client";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export default function CookiePrefsOpener({
  children,
  className = "underline text-brand-dark hover:text-brand-sky hover:decoration-2 transition-colors duration-200",
}: Props) {
  function open(ev?: React.MouseEvent) {
    ev?.preventDefault();
    document.dispatchEvent(new CustomEvent("open-cookieprefs"));
  }

  return (
    <button
      type="button"
      onClick={open}
      data-cookieprefs-open="true"
      aria-controls="cookieprefs-dialog"
      className={className}
    >
      {children ?? "Gérer mes cookies"}
    </button>
  );
}
