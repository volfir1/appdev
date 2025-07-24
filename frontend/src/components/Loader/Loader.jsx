import React from 'react';

// Modern Pulse Spinner (Recommended)
export const PulseSpinner = ({ 
  size = 40, 
  color = '#EF4444', 
  className = '',
  overlay = false,
  text = '',
  textColor = '#374151'
}) => {
  const keyframes = `
    @keyframes pulse-scale {
      0%, 100% { transform: scale(0); opacity: 1; }
      50% { transform: scale(1); opacity: 0.5; }
    }
    @keyframes pulse-fade {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 0.3; }
    }
  `;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  };

  const spinnerContainer = {
    width: size,
    height: size,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const dot = {
    width: size * 0.3,
    height: size * 0.3,
    borderRadius: '50%',
    backgroundColor: color,
    position: 'absolute',
    animation: 'pulse-scale 1.5s ease-in-out infinite'
  };

  const outerRing = {
    width: size,
    height: size,
    borderRadius: '50%',
    border: `2px solid ${color}`,
    opacity: 0.3,
    animation: 'pulse-fade 2s ease-in-out infinite'
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(2px)'
  };

  const SpinnerElement = (
    <div style={containerStyle} className={className}>
      <style>{keyframes}</style>
      <div style={spinnerContainer}>
        <div style={outerRing} />
        <div style={dot} />
      </div>
      {text && <div style={{ color: textColor, fontSize: '14px', fontWeight: '500' }}>{text}</div>}
    </div>
  );

  return overlay ? <div style={overlayStyle}>{SpinnerElement}</div> : SpinnerElement;
};

// Bouncing Dots Spinner
export const BouncingDots = ({ 
  size = 40, 
  color = '#DC2626', 
  className = '',
  overlay = false,
  text = '',
  textColor = '#374151'
}) => {
  const keyframes = `
    @keyframes bounce-dot {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1.2); opacity: 1; }
    }
  `;

  const dotSize = size * 0.2;
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  };

  const dotsContainer = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: dotSize * 0.5,
    width: size,
    height: size
  };

  const dotStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: '50%',
    backgroundColor: color,
    animation: 'bounce-dot 1.4s ease-in-out infinite both'
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(2px)'
  };

  const SpinnerElement = (
    <div style={containerStyle} className={className}>
      <style>{keyframes}</style>
      <div style={dotsContainer}>
        <div style={{...dotStyle, animationDelay: '0s'}} />
        <div style={{...dotStyle, animationDelay: '0.16s'}} />
        <div style={{...dotStyle, animationDelay: '0.32s'}} />
      </div>
      {text && <div style={{ color: textColor, fontSize: '14px', fontWeight: '500' }}>{text}</div>}
    </div>
  );

  return overlay ? <div style={overlayStyle}>{SpinnerElement}</div> : SpinnerElement;
};

// Orbit Spinner
export const OrbitSpinner = ({ 
  size = 40, 
  color = '#B91C1C', 
  className = '',
  overlay = false,
  text = '',
  textColor = '#374151'
}) => {
  const keyframes = `
    @keyframes orbit {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes counter-orbit {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(-360deg); }
    }
  `;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  };

  const spinnerContainer = {
    width: size,
    height: size,
    position: 'relative',
    animation: 'orbit 2s linear infinite'
  };

  const dotStyle = {
    width: size * 0.25,
    height: size * 0.25,
    borderRadius: '50%',
    backgroundColor: color,
    position: 'absolute',
    animation: 'counter-orbit 2s linear infinite'
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(2px)'
  };

  const SpinnerElement = (
    <div style={containerStyle} className={className}>
      <style>{keyframes}</style>
      <div style={spinnerContainer}>
        <div style={{...dotStyle, top: 0, left: '50%', transform: 'translateX(-50%)'}} />
        <div style={{...dotStyle, bottom: 0, left: '50%', transform: 'translateX(-50%)', opacity: 0.7}} />
        <div style={{...dotStyle, top: '50%', left: 0, transform: 'translateY(-50%)', opacity: 0.5}} />
        <div style={{...dotStyle, top: '50%', right: 0, transform: 'translateY(-50%)', opacity: 0.3}} />
      </div>
      {text && <div style={{ color: textColor, fontSize: '14px', fontWeight: '500' }}>{text}</div>}
    </div>
  );

  return overlay ? <div style={overlayStyle}>{SpinnerElement}</div> : SpinnerElement;
};

// Gradient Ring Spinner
export const GradientRing = ({ 
  size = 40, 
  className = '',
  overlay = false,
  text = '',
  textColor = '#374151'
}) => {
  const keyframes = `
    @keyframes gradient-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  };

  const spinnerStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: `conic-gradient(transparent, transparent, transparent, #EF4444)`,
    animation: 'gradient-spin 1s linear infinite',
    position: 'relative'
  };

  const innerStyle = {
    position: 'absolute',
    top: '3px',
    left: '3px',
    right: '3px',
    bottom: '3px',
    borderRadius: '50%',
    background: '#FFF1F2'
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(2px)'
  };

  const SpinnerElement = (
    <div style={containerStyle} className={className}>
      <style>{keyframes}</style>
      <div style={spinnerStyle}>
        <div style={innerStyle} />
      </div>
      {text && <div style={{ color: textColor, fontSize: '14px', fontWeight: '500' }}>{text}</div>}
    </div>
  );

  return overlay ? <div style={overlayStyle}>{SpinnerElement}</div> : SpinnerElement;
};

// Morphing Spinner
export const MorphingSpinner = ({ 
  size = 40, 
  color = '#F87171', 
  className = '',
  overlay = false,
  text = '',
  textColor = '#374151'
}) => {
  const keyframes = `
    @keyframes morph {
      0% { border-radius: 50%; transform: rotate(0deg) scale(1); }
      25% { border-radius: 0%; transform: rotate(90deg) scale(0.8); }
      50% { border-radius: 50%; transform: rotate(180deg) scale(1); }
      75% { border-radius: 0%; transform: rotate(270deg) scale(0.8); }
      100% { border-radius: 50%; transform: rotate(360deg) scale(1); }
    }
  `;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  };

  const spinnerStyle = {
    width: size,
    height: size,
    background: `linear-gradient(45deg, ${color}, ${color}88)`,
    animation: 'morph 2s ease-in-out infinite',
    willChange: 'transform'
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(2px)'
  };

  const SpinnerElement = (
    <div style={containerStyle} className={className}>
      <style>{keyframes}</style>
      <div style={spinnerStyle} />
      {text && <div style={{ color: textColor, fontSize: '14px', fontWeight: '500' }}>{text}</div>}
    </div>
  );

  return overlay ? <div style={overlayStyle}>{SpinnerElement}</div> : SpinnerElement;
};

// Loading Wrapper Component
export const LoadingWrapper = ({ 
  isLoading, 
  spinner = 'pulse', 
  text = 'Loading...', 
  children,
  size = 40,
  color = '#EF4444'
}) => {
  if (!isLoading) return children;

  const spinnerProps = { size, color, text, overlay: true };
  
  const SpinnerComponent = {
    pulse: PulseSpinner,
    dots: BouncingDots,
    orbit: OrbitSpinner,
    gradient: GradientRing,
    morph: MorphingSpinner
  }[spinner] || PulseSpinner;

  return (
    <div style={{ position: 'relative' }}>
      {children}
      <SpinnerComponent {...spinnerProps} />
    </div>
  );
};

// Default export for convenience
export default PulseSpinner;