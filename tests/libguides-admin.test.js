const config = require('../config');
var _ = require('lodash');

describe(('LibGuides Admin'), () => {
  // var response;
  beforeAll(async () => {
    var response = await page.goto(config.libapps.libguides.adminUrl);
  });
  
  it('should load the page', async () => {
  });
});
