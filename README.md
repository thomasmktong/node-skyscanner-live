# node-skyscanner-live

This Node.js module provides a simplified call to poll Skyscanner Live Prices.

## Installation

    npm insall node-skyscanner-live --save

## Usage

 Require this library and set the API key. You can get your API key by signing into the [Skyscanner Business Portal](http://portal.business.skyscanner.net/en-gb/accounts/login/).

```javascript
var skyscanner = require('node-skyscanner-live');
skyscanner.setApiKey('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
```

Use `getLocation` function to retrieve a well-formatted location ID. This ID will be used for fetching flight ticket prices.

```javascript
skyscanner.getLocation('hong').then(function (data) {
    console.log(data);
});
```

Results is shown below:

```javascript
[ { id: 'HKG-sky', name: 'Hong Kong International' },
  { id: 'SHA-sky', name: 'Shanghai Hongqiao' },
  { id: 'HGN-sky', name: 'Mae Hong Son' },
  { id: 'PYY-sky', name: 'Pai (Mae Hong Son)' },
  { id: 'HPG-sky', name: 'Hongping' },
  { id: 'AHJ-sky', name: 'Aba/Hongyuan' },
  { id: 'PVG-sky', name: 'Shanghai Pu Dong' },
  { id: 'HGH-sky', name: 'Hangzhou' },
  { id: 'CKG-sky', name: 'Chongqing' },
  { id: 'HU-sky', name: 'Hungary' } ]
```

Use `search` function to poll Skyscanner's API and get a list of air tickets. Since this is on-demand real-time search, the time takes to execute this function varies. In Skyscanner's original API, you have to continuously polling a URL until the result JSON is fully proulated. This has caused complexities in handling Promise of waits, retries, together with logic to determine if API limit has been breached. This module has encapsulated all this in a simple function.

```javascript
skyscanner.search('HKG-sky', 'LHR-sky', '2017-03-08', '2017-03-31').then(function (data) {
    console.log(data[0]);
});
```

Results is shown below:

```javascript
{ outbound: 
   { departTime: '2017-03-08T11:55:00',
     arriveTime: '2017-03-08T21:05:00',
     stops: 2,
     carriers: [ 'Aeroflot' ] },
  inbound: 
   { departTime: '2017-03-31T10:40:00',
     arriveTime: '2017-04-01T09:45:00',
     stops: 2,
     carriers: [ 'Aeroflot' ] },
  price: 6446,
  url: 'http://partners.api.skyscanner.net/apiservices/deeplink/v2?_cje=xxx' }
```

## More Details

[Skyscanner API Documentation](https://skyscanner.github.io/slate/)

## Credits

This is a part of the work done in Hong Kong #1 Bot Hackathon organized by [Recime.io](https://docs.recime.io/). I and my teammates built a chatbot to suggest tourist attractions and find cheapest flight tickets. We have become one of the winning teams.

[Photo 1](https://twitter.com/thomasmktong/status/838347846663426049), [Photo 2](https://twitter.com/thomasmktong/status/838395615134400512)