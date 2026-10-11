import fs from 'fs';
import path from 'path';
import esbuild from 'esbuild';

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

  // Bundle and inline JS
  // Find all entry scripts
  const scriptRegex = /<script[^>]+type="module"[^>]+src="([^"]+)"[^>]*><\/script>/g;
  const scriptMatches = [...htmlContent.matchAll(scriptRegex)];
  
  if (scriptMatches.length > 0) {
    const entrySrc = scriptMatches[0][1];
    const cleanSrc = entrySrc.startsWith('/') ? entrySrc.slice(1) : entrySrc;
    const entryJsPath = path.join(distDir, cleanSrc);
    
    if (fs.existsSync(entryJsPath)) {
      // Use esbuild to merge all dynamic chunks into a 100% self-contained ESM script with NO external import statements
      const bundled = esbuild.buildSync({
        entryPoints: [entryJsPath],
        bundle: true,
        write: false,
        format: 'esm',
        minify: true,
        target: 'es2020'
      });
      
      const bundledJs = bundled.outputFiles[0].text;
      
      // Remove all module script tags and replace with single inlined bundle
      htmlContent = htmlContent.replace(scriptRegex, '');
      htmlContent = htmlContent.replace(
        '</body>',
        `<script type="module">\n/* 100% Inlined Self-Contained React & Panchanga Bundle */\n${bundledJs}\n</script>\n</body>`
      );
    }
  }

  // Also remove modulepreload tags since everything is inlined
  htmlContent = htmlContent.replace(/<link[^>]+rel="modulepreload"[^>]*>/g, '');

  const outputPath = path.join(publicDir, 'hcmm-react-singlefile.html');
  fs.writeFileSync(outputPath, htmlContent, 'utf-8');

  const distOutputPath = path.join(distDir, 'index-singlefile.html');
  fs.writeFileSync(distOutputPath, htmlContent, 'utf-8');

  console.log(`Successfully generated 100% self-contained single-file bundle at: ${outputPath}`);
}

bundleSingleHtml();
