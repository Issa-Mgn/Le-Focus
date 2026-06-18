const SpinnerSmall = ({ size = 18, color = "#E60000" }) => {
  const sizeInPx = `${size}px`;
  const dotSize = size / 4;
  const dotSizeInPx = `${dotSize}px`;
  const bgSize = `${size / 2}px ${size / 2}px`;
  const inset = `${size / 4}px`;
  
  return (
    <>
      <div className="spinner-small" style={{ width: sizeInPx, height: sizeInPx }}></div>
      <style>{`
        .spinner-small {
          color: ${color};
          position: relative;
          background: radial-gradient(${dotSizeInPx}, currentColor 94%, transparent);
          display: inline-block;
        }

        .spinner-small:before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: 
            radial-gradient(${dotSizeInPx} at bottom right, transparent 94%, currentColor) top left,
            radial-gradient(${dotSizeInPx} at bottom left, transparent 94%, currentColor) top right,
            radial-gradient(${dotSizeInPx} at top right, transparent 94%, currentColor) bottom left,
            radial-gradient(${dotSizeInPx} at top left, transparent 94%, currentColor) bottom right;
          background-size: ${bgSize};
          background-repeat: no-repeat;
          animation: spinner-small-spin 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
        }

        @keyframes spinner-small-spin {
          33% {
            inset: -${inset};
            transform: rotate(0deg);
          }
          66% {
            inset: -${inset};
            transform: rotate(90deg);
          }
          100% {
            inset: 0;
            transform: rotate(90deg);
          }
        }
      `}</style>
    </>
  );
};

export default SpinnerSmall;
