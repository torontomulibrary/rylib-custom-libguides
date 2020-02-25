const puppeteer = require('puppeteer');

class libguidesClient {
  constructor(config) {
    this.libappsUrl = config.libapps.url;
    this.libappsEmail = config.libapps.email;
    this.libappsPassword = config.libapps.password;
    this.libguidesDevGroupId = config.libguides.devGroupId;
  }

  async open() {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
    
    const emailInputId = '#s-libapps-email';
    const passwordInputId = '#s-libapps-password';
    
    await this.page.goto(this.libappsUrl);
    await this.page.$eval(emailInputId, (el, value) => el.value = value, this.libappsEmail);
    await this.page.$eval(passwordInputId, (el, value) => el.value = value, this.libappsPassword);
    await Promise.all([
      this.page.click('#s-libapps-login-button'),
      this.page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);
  }

  async updateHeaderHtml(headerHtml, live) {
    if ( live ) {
      var headerHtmlUrl = this.libappsUrl + '/libguides/lookfeel.php?action=0';
    } else {
      var headerHtmlUrl = this.libappsUrl + '/libguides/groups.php?action=2&group_id=' + this.libguidesDevGroupId;
    }
    await this.page.goto(headerHtmlUrl);
    await this.page.$eval('#banner_html', (el, headerHtml) => {
      // TODO: Add logic to compare what is in the interface with what is in the working directory
      el.value = headerHtml
    }, headerHtml);
    await this.page.click('#s-lg-banners button');
  }

  async updateFooterHtml(footerCode, live) {
    if ( live ) {
      var footerHtmlUrl = this.libappsUrl + '/libguides/lookfeel.php?action=0';
    } else {
      var footerHtmlUrl = this.libappsUrl + '/libguides/groups.php?action=2&group_id=' + this.libguidesDevGroupId;
    }
    await this.page.goto(footerHtmlUrl);
    await this.page.click('#s-lg-footer_link'); // Expand the "Page Footer" accordion tab
    await this.page.$eval('#footer_code', (el, footerCode) => {
      // TODO: Add logic to compare what is in the interface with what is in the working directory
      el.value = footerCode
    }, footerCode);
    await this.page.click('#s-lg-btn-save-footer');
  }

  async updatejscssCode(jscssCode, live) {
    if ( live ) {
      var jscssCodeUrl = this.libappsUrl + '/libguides/lookfeel.php?action=1';
      // Include autotrack.js if pushing to live
      jscssCode += '<script type="text/javascript" src="//libapps-ca.s3.amazonaws.com/sites/2734/include/autotrack.js"></script>';
    } else {
      var jscssCodeUrl = this.libappsUrl + '/libguides/groups.php?action=3&group_id=' + this.libguidesDevGroupId;
    }
    await this.page.goto(jscssCodeUrl);
    await this.page.$eval('#jscss_code', (el, jscssCode) => {
      // TODO: Add logic to compare what is in the interface with what is in the working directory
      el.value = jscssCode
    }, jscssCode);
    await this.page.click('#s-lg-btn-save-jscss');
  }

  async screenshot(path) {
    await this.page.screenshot( { path: path } );
  }

  async close() {
    await this.browser.close();
  }

}

module.exports = libguidesClient;