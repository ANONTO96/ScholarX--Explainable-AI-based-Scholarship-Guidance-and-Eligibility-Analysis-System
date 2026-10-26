
import { GraduationCap, LoaderCircle } from "lucide-react";

const Loader = ({
  fullScreen = false,
  message = "Loading...",
  size = "md",
  showBrand = true,
}) => {
  const sizes = {
    sm: "size-5",
    md: "size-8",
    lg: "size-12",
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-9999 flex min-h-screen flex-col items-center justify-center bg-[#E5F1F7] px-4">
        {showBrand && (
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 shadow-sm">
              <GraduationCap size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                Scholar<span className="text-sky-600">X</span>
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Your Scholarship Journey
              </p>
            </div>
          </div>
        )}

        <LoaderCircle
          className="size-9 animate-spin text-sky-600"
          strokeWidth={2.5}
          aria-hidden="true"
        />

        <p
          className="mt-4 text-sm font-medium text-slate-600"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <LoaderCircle
        className={`${sizes[size] || sizes.md} animate-spin text-sky-600`}
        strokeWidth={2.5}
        aria-hidden="true"
      />

      <span
        className="text-sm font-medium text-slate-600"
        role="status"
        aria-live="polite"
      >
        {message}
      </span>
    </div>
  );
};

export default Loader;
