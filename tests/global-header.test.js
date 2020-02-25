const config = require('../config');
var _ = require('lodash');

const headerLinks = {
  'my.ryerson': 'https://my.ryerson.ca/',
  'Renew Loans': 'https://catalogue.library.ryerson.ca/patroninfo',
  'Catalogue': 'https://catalogue.library.ryerson.ca',
  'Articles': 'https://library.ryerson.ca/articles',
  'Research': 'https://library.ryerson.ca/guides',
  'Services': 'https://library.ryerson.ca/services',
  'About Us': 'https://library.ryerson.ca/info/about-us/'
}

describe(('Global Header'), () => {
  beforeAll(async () => {
    await page.goto(config.libapps.libguides.homepageUrl);
  });

  _.forEach( headerLinks, (linkHref, linkText) => {
    it('should have a link with text ' + linkText + ' pointing to ' + linkHref, async () => {
      const catalogueLink = await expect(page).toMatchElement('.global-header-top a, .global-header-bottom a', { text: linkText });
      expect( await catalogueLink.evaluate( a => a.href ) ).toMatch(linkHref);
    });
  });
});
