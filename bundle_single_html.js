import fs from 'fs';
import path from 'path';

/**
 * Bundles the built Vite production output into a single, 100% self-contained HTML file in public/
 */
function bundleSingleHtml() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const publicDir = path.resolve(process.cwd(), 'public');

  if (!fs.existsSync(distDir)) {
    console.error('Error: dist directory does not exist. Run "npm run build" first.');
    process.exit(1);
  }

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('Error: dist/index.html does not exist.');
    process.exit(1);
  }

  let htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Find and inline all CSS files
  const cssRegex = /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g;
  htmlContent = htmlContent.replace(cssRegex, (match, href) => {
    const cleanHref = href.startsWith('/') ? href.slice(1) : href;
    const cssPath = path.join(distDir, cleanHref);
    if (fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      return `<style>/* Inlined CSS: ${cleanHref} */\n${cssContent}</style>`;
    }
    return match;
  });

  // Find and inline all JS module scripts
  const scriptRegex = /<script[^>]+type="module"[^>]+src="([^"]+)"[^>]*><\/script>/g;
  htmlContent = htmlContent.replace(scriptRegex, (match, src) => {
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
    const jsPath = path.join(distDir, cleanSrc);
    if (fs.existsSync(jsPath)) {
      const jsContent = fs.readFileSync(jsPath, 'utf-8');
      return `<script type="module">/* Inlined JS: ${cleanSrc} */\n${jsContent}</script>`;
    }
    return match;
  });

  const outputPath = path.join(publicDir, 'hcmm-react-singlefile.html');
  fs.writeFileSync(outputPath, htmlContent, 'utf-8');
  console.log(`Successfully generated single-file bundle at: ${outputPath}`);
}

bundleSingleHtml();
