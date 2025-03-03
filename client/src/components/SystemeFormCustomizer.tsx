import { useEffect, useRef } from 'react';

/**
 * SystemeFormCustomizer applies custom styling to a Systeme.io form loaded in an iframe.
 * Since we can't directly style the content inside cross-domain iframes with CSS,
 * this component injects a style element into the iframe when it loads.
 */
const SystemeFormCustomizer: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // The custom CSS we want to inject into the iframe
    const customCSS = `
      body, html {
        background: transparent !important;
        font-family: 'Poppins', sans-serif !important;
      }
      
      .form-container {
        background: transparent !important;
        box-shadow: none !important;
        border: none !important;
        max-width: 100% !important;
        padding: 0 !important;
      }
      
      h1, .form-title {
        font-family: 'Poppins', sans-serif !important;
        font-weight: bold !important;
        font-size: 1.5rem !important;
        color: #20B2AA !important;
        text-align: center !important;
      }
      
      h2, .form-subtitle {
        font-family: 'Poppins', sans-serif !important;
        font-weight: medium !important;
        font-size: 1.2rem !important;
        color: #FFD166 !important;
        text-align: center !important;
      }
      
      input, select, textarea {
        width: 100% !important;
        padding: 12px !important;
        margin-top: 5px !important;
        border: 2px solid #FF6B6B !important;
        border-radius: 8px !important;
        background-color: #3C3C3C !important;
        color: #F4E9D9 !important;
        font-size: 16px !important;
      }
      
      button, .btn, .form-button {
        width: 100% !important;
        margin-top: 20px !important;
        background-color: #FF6B6B !important;
        color: #3C3C3C !important;
        font-family: 'Poppins', sans-serif !important;
        font-weight: 600 !important;
        padding: 12px 20px !important;
        border-radius: 50px !important;
        border: 2px solid #FF6B6B !important;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2) !important;
        transition: background 0.3s ease-in-out !important;
      }
      
      button:hover, .btn:hover, .form-button:hover {
        background-color: rgba(255, 107, 107, 0.9) !important;
      }
      
      label {
        font-family: 'Poppins', sans-serif !important;
        font-size: 1rem !important;
        color: #F4E9D9 !important;
        margin-bottom: 5px !important;
        display: block !important;
      }
      
      /* Custom field styling */
      .form-field {
        margin-bottom: 15px !important;
      }
      
      /* Payment info */
      .payment-info {
        text-align: center;
        margin-top: 15px;
        font-size: 0.8rem;
        color: #F4E9D9;
      }
      
      /* Add placeholder styling */
      ::placeholder {
        color: rgba(244, 233, 217, 0.6) !important;
      }
    `;

    // Function to inject CSS into iframe
    const injectCSS = () => {
      if (!iframeRef.current) return;
      
      try {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (!iframeDoc) return;
        
        // Create style element
        const styleElement = iframeDoc.createElement('style');
        styleElement.textContent = customCSS;
        
        // Append to iframe head
        iframeDoc.head.appendChild(styleElement);
        
        console.log('Custom styles injected into Systeme.io iframe');
      } catch (error) {
        console.error('Failed to inject styles into iframe:', error);
      }
    };

    // Try to inject CSS when iframe loads
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', injectCSS);
      
      // Also try after a short delay in case the iframe already loaded
      setTimeout(injectCSS, 1000);
    }

    // Cleanup
    return () => {
      if (iframe) {
        iframe.removeEventListener('load', injectCSS);
      }
    };
  }, []);

  return (
    <div className="systeme-form-container h-full flex flex-col justify-center">
      <iframe 
        ref={iframeRef}
        src="https://1903-brad.systeme.io/42eeb962" 
        width="100%" 
        height="600px" 
        style={{ border: 'none', overflow: 'hidden' }}
        title="FlingPing.co Signup Form"
      />
      
      {/* Payment info - similar to what was in the original form */}
      <div className="text-center text-xs sm:text-sm mt-3 sm:mt-4">
        <p className="mb-1 sm:mb-2">Secure payment powered by Stripe</p>
        <p className="mb-1 sm:mb-2 text-xs">(Opens in a new tab)</p>
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
          {/* Payment method icons */}
          <svg className="h-4 sm:h-6" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="visa-label">
            <title id="visa-label">Visa</title>
            <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" opacity=".07"/>
            <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#fff"/>
            <path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"/>
          </svg>
          <svg className="h-4 sm:h-6" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="mastercard-label">
            <title id="mastercard-label">Mastercard</title>
            <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" opacity=".07"/>
            <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#fff"/>
            <circle fill="#EB001B" cx="15" cy="12" r="7"/>
            <circle fill="#F79E1B" cx="23" cy="12" r="7"/>
            <path d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z" fill="#FF5F00"/>
          </svg>
          <svg className="h-4 sm:h-6" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="amex-label">
            <title id="amex-label">American Express</title>
            <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" opacity=".07"/>
            <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#006FCF"/>
            <path d="M8.971 10.268l.774 1.876H8.203l.768-1.876zm16.075-4.878h-7.965v1.944h7.965v-1.944zm-16.075.386L7.46 7.216h1.02l.336-.691h1.775l.336.691h1.014l-1.51-3.44h-.933zm-1.896 2.41h-1.95v-3.44h1.95s.927-.017 1.36.25c.242.149.51.522.51 1.199 0 .676-.157 1.151-.5 1.407-.343.256-1.37.584-1.37.584zm10.24-2.41h.952v3.44h-1.347l-1.743-2.636v2.636H9.814v-3.44h1.394l1.606 2.442v-2.442zm3.77 3.44h-3.585v-3.44h3.585v.697h-2.383v.697h2.322v.697h-2.322v.697h2.383v.652zm1.288-2.743h.993c.167 0 .265.092.265.23 0 .14-.088.233-.265.233h-.993v-.463zm0 1.353h1.076c.21.015.445.097.445.386 0 .26-.183.421-.513.421h-1.008v-.807zm-.317 1.39h1.339c.315 0 .891-.053 1.172-.403.203-.25.132-.597.058-.723.1-.08.316-.275.316-.7 0-1.454-1.776-1.14-2.195-1.14H20.21v-1.777h7.965v8.76H20.21v-2.44h1.856v-1.577zm9.643-5.311h-7.965v1.944h7.965v-1.944zm-4.295 2.897h-.96v.943h.96s.433.02.433-.472c0-.491-.433-.471-.433-.471zm3.031 4.007c.701.045 1.085-.51 1.085-.51s.04-.344.215-.344c.176 0 .588 0 .588 0s.204.014.204.254c0 .916-1.062 1.14-2.031 1.14-1.462 0-2.031-.38-2.031-2.453 0-1.995.952-2.265 2.11-2.265 1.257 0 1.939.738 1.939 2.103v.201s-.9.017-.97.017h-2.302s-.085 1.857 1.193 1.857zm.025-2.243c-.54 0-1.124.363-1.124 1.202h2.083c0-.862-.436-1.202-1.103-1.202h.144z" fill="#fff"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SystemeFormCustomizer;