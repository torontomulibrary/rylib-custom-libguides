const fs = require('fs');
const sass = require('node-sass');
const pug = require('pug');
const config = require('../config');
const lgClient = require('../lib/libguides-client');

const opts = (option) => process.argv.indexOf(option) > -1;

(async () => {
  const lg = new lgClient(config);

  await lg.open();
  
  // Render SCSS and combine with jscss.pug before updating the JS/CSS options
  var renderedCss = sass.renderSync({
    file: 'custom-libguides/scss/styles.scss',
    outFile: 'styles.css',
    outputStyle: 'compressed'
  }).css.toString();
  var jscssCode = pug.renderFile('custom-libguides/templates/jscss.pug', {
    rylibLibGudesStyle : renderedCss.trim(),
    rylibCommonStyle : 'https://ryersonlibrary.nyc3.digitaloceanspaces.com/rylib-common/v0.2.x/rylib-common.css',
    rylibCommonScript : 'https://ryersonlibrary.nyc3.digitaloceanspaces.com/rylib-common/v0.2.x/rylib-common.js',
    live: opts('--live')
  });
  await lg.updatejscssCode( jscssCode, opts('--live') );
  
  var headerHTML = pug.renderFile('custom-libguides/templates/header.pug');
  await lg.updateHeaderHtml( headerHTML, opts('--live') );
  
  var footerHTML = pug.renderFile('custom-libguides/templates/footer.pug');
  await lg.updateFooterHtml( footerHTML, opts('--live') );

  await lg.close();
})();
