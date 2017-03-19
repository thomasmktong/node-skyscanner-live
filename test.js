var skyscanner = require('./skyscanner');
var util = require('util');

// This API key is shared in API documentation, you should register your own
skyscanner.setApiKey('prtl6749387986743898559646983194');

skyscanner.getLocation('herthrow').then(function (data) {
    console.log(data);
});

skyscanner.search('HKG-sky', 'LHR-sky', '2017-06-20', '2017-06-30').then(function (data) {
    console.log(util.inspect(data[0], false, 99999));
});