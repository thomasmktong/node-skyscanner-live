var skyscanner = require('./skyscanner');

// This API key is shared in API documentation, you should register your own
skyscanner.setApiKey('prtl6749387986743898559646983194'); 

skyscanner.getLocation('hong').then(function (data) {
    console.log(data);
});

skyscanner.search('HKG-sky', 'LHR-sky', '2017-03-08', '2017-03-31').then(function (data) {
    console.log(data[0]);
});