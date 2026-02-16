export default function Footer() {
  return (
    <footer className="w-full bg-neutral-950 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* DaisyUI Divider with consistent dark styling */}
        <div className="divider before:bg-white/10 after:bg-white/10 italic text-gray-600 text-xs">
          PricePulse Smart Tracking
        </div>

        <div className="flex flex-col items-center justify-center mt-10 gap-3">
          {/* Copyright */}
          <p className="text-gray-500 text-xs tracking-widest uppercase">
            © {new Date().getFullYear()} All Rights Reserved
          </p>

          {/* Signature */}
          <p className="text-gray-400 text-sm">
            Made with <span className="text-orange-500 animate-pulse">❤️</span>{" "}
            by{" "}
            <span className="text-white font-bold hover:scale-110 transition-transform inline-block">
              Sadat the Handsomest.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
