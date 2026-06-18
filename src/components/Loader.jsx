const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated Loader */}
        <div className="loader-spinner"></div>
        
        {/* Text */}
        <div className="text-center">
          <h2 className="font-serif text-2xl font-black text-neutral-950">Le Focus</h2>
          <p className="mt-2 font-display text-xs uppercase tracking-[0.2em] text-neutral-400">Chargement...</p>
        </div>
      </div>

      <style>{`
        .loader-spinner {
          width: 44.8px;
          height: 44.8px;
          color: #E60000;
          position: relative;
          background: radial-gradient(11.2px, currentColor 94%, transparent);
        }

        .loader-spinner:before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: 
            radial-gradient(10.08px at bottom right, transparent 94%, currentColor) top left,
            radial-gradient(10.08px at bottom left, transparent 94%, currentColor) top right,
            radial-gradient(10.08px at top right, transparent 94%, currentColor) bottom left,
            radial-gradient(10.08px at top left, transparent 94%, currentColor) bottom right;
          background-size: 22.4px 22.4px;
          background-repeat: no-repeat;
          animation: loader-spin 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
        }

        @keyframes loader-spin {
          33% {
            inset: -11.2px;
            transform: rotate(0deg);
          }
          66% {
            inset: -11.2px;
            transform: rotate(90deg);
          }
          100% {
            inset: 0;
            transform: rotate(90deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
