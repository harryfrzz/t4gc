export function ThemeScript() {
  const themeScript = `
    (function() {
      function getTheme() {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      const theme = getTheme();
      document.documentElement.classList.add(theme);
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
