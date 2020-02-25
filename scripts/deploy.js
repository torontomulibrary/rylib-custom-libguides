const fs = require('fs');
const sass = require('node-sass');
const config = require('../config');
const lgClient = require('../lib/libguides-client');

const opts = (option) => process.argv.indexOf(option) > -1;

(async () => {
  const lg = new lgClient(config);

  await lg.open();
  
  // Render SCSS and combine with jscss.html before updating the JS/CSS options
  var renderedCss = sass.renderSync({
    file: 'custom-libguides/scss/styles.scss',
    outFile: 'styles.css',
    outputStyle: 'expanded'
  }).css.toString();
  renderedCss = `<style>\n${renderedCss}</style>\n\n`;
  var jscssCode = fs.readFileSync('custom-libguides/jscss.html', 'utf8');
  await lg.updatejscssCode(renderedCss + jscssCode, opts('--live') );
  
  var headerHtml = fs.readFileSync('custom-libguides/header.html', 'utf8');
  await lg.updateHeaderHtml(headerHtml, opts('--live') );

  var footerCode = fs.readFileSync('custom-libguides/footer.html', 'utf8');
  await lg.updateFooterHtml(footerCode, opts('--live') );

  await lg.close();
})();
