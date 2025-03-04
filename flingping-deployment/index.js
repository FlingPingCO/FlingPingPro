// FlingPing.co main JavaScript file
console.log('FlingPing.co application loaded');

// Display a message when no JavaScript bundle is available
window.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; text-align: center;">
        <h1 style="color: #2DD4BF; margin-bottom: 20px;">FlingPing.co</h1>
        <p style="font-size: 18px; line-height: 1.6;">
          A cutting-edge sexual health platform providing inclusive, private, and 
          accessible digital health communication through innovative technology.
        </p>
        <div style="margin: 40px 0;">
          <p style="background: #FF695E; color: white; padding: 10px 20px; display: inline-block; border-radius: 4px;">
            This is a placeholder page for the AWS S3 deployment.
          </p>
        </div>
      </div>
    `;
  }
});