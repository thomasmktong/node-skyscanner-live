# node-skyscanner-live

This Node.js module provides a simplified call to poll Skyscanner Live Prices.

## Installation

    npm insall node-skyscanner-live --save

## Usage

Set the API key. You can get your API key by signing into the [Skyscanner Business Portal](http://portal.business.skyscanner.net/en-gb/accounts/login/).

```javascript
var skyscanner = require('node-skyscanner-live');
skyscanner.setApiKey('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
```

Use `getLocation` function to find location IDs by keywords. The Skyscanner API can handle typos too. These IDs are needed when fetching flight ticket prices.

```javascript
skyscanner.getLocation('herthrow').then(function (data) {
    console.log(data);
});
```

```javascript
[ { id: 'LHR-sky', name: 'London Heathrow' } ]
```

Use `search` function to poll Skyscanner's API and get a list of air tickets. You have to use location IDs and “yyyy-mm-dd”, “yyyy-mm” or “anytime” for the dates.

Since this is real-time search, the time takes to execute this function may vary. In Skyscanner's original API, you have to continuously poll a URL until the result JSON is fully propulated. It has caused complexities in handling Promise of waits, retries, together with logic to determine if API limit has been breached. This module has encapsulated all those in a simple function.

```javascript
skyscanner.search('HKG-sky', 'LHR-sky', '2017-06-20', '2017-06-30').then(function (data) {
    console.log(util.inspect(data[0], false, 99999));
});
```

```javascript
{ segments: 
   [ { departAirport: { code: 'HKG', name: 'Hong Kong International' },
       arriveAirport: { code: 'PEK', name: 'Beijing Capital' },
       departCity: { code: 'HKG', name: 'Hong Kong' },
       arriveCity: { code: 'BJS', name: 'Beijing' },
       departTime: '2017-06-20T10:30:00',
       arriveTime: '2017-06-20T13:55:00',
       carrier: [ 'Air China' ] },
     { departAirport: { code: 'PEK', name: 'Beijing Capital' },
       arriveAirport: { code: 'LHR', name: 'London Heathrow' },
       departCity: { code: 'BJS', name: 'Beijing' },
       arriveCity: { code: 'LON', name: 'London' },
       departTime: '2017-06-20T17:05:00',
       arriveTime: '2017-06-20T20:40:00',
       carrier: [ 'Air China' ] },
     { departAirport: { code: 'LHR', name: 'London Heathrow' },
       arriveAirport: { code: 'PEK', name: 'Beijing Capital' },
       departCity: { code: 'LON', name: 'London' },
       arriveCity: { code: 'BJS', name: 'Beijing' },
       departTime: '2017-06-30T22:40:00',
       arriveTime: '2017-07-01T15:50:00',
       carrier: [ 'Air China' ] },
     { departAirport: { code: 'PEK', name: 'Beijing Capital' },
       arriveAirport: { code: 'HKG', name: 'Hong Kong International' },
       departCity: { code: 'BJS', name: 'Beijing' },
       arriveCity: { code: 'HKG', name: 'Hong Kong' },
       departTime: '2017-07-02T08:05:00',
       arriveTime: '2017-07-02T11:35:00',
       carrier: [ 'Air China' ] } ],
  price: 4301.11,
  url: 'http://partners.api.skyscanner.net/apiservices/deeplink/v2?_cje=x' }
```

## Improvements Needed

Right now this API is mainly targeting users in Hong Kong. There are works needed to be done to make this more global and generic. Pull requests are welcome.

## More Details

[Skyscanner API Documentation](https://skyscanner.github.io/slate/)

## Credits

This is a part of the work done in Hong Kong First Bot Hackathon organized by [Recime.io](https://docs.recime.io/). I and my teammates built a chatbot that suggests tourist attractions and finds cheapest flight tickets. We became the 1st runner-up in the event.

[Photo 1](https://twitter.com/thomasmktong/status/838347846663426049), [Photo 2](https://twitter.com/thomasmktong/status/838395615134400512), [Photos by Recime](https://twitter.com/GetRecime/status/838463271128596483)
