var promise = require('bluebird');
var request = require('request-promise');
var lodash = require('lodash');
var util = require('util');

module.exports = {

    setApiKey: function (apiKey) {
        this.apiKey = apiKey;
    },

    getLocation: function (searchLocation) {
        var url = util.format(
            'http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/HK/HKD/en-US/?query=%s&apiKey=%s',
            encodeURIComponent(searchLocation),
            this.apiKey);

        return request(url).then(function (body) {
            var data = JSON.parse(body);

            return data.Places.map(function (loc) {
                return { id: loc.PlaceId, name: loc.PlaceName };
            });
        });
    },

    search: function (fromLocation, toLocation, fromDate, toDate, adults, children, infants) {

        var apiKey = this.apiKey;
        var delay = 1000;
        var pull = this.pull;

        var options = {
            method: 'POST',
            uri: 'http://partners.api.skyscanner.net/apiservices/pricing/v1.0',
            form: {
                cabinclass: 'Economy',
                country: 'HK',
                currency: 'HKD',
                locale: 'en-US',
                locationSchema: 'iata',
                originplace: fromLocation,
                destinationplace: toLocation,
                outbounddate: fromDate,
                inbounddate: toDate,
                adults: adults || 1,
                children: children || 0,
                infants: infants || 0,
                apikey: apiKey,
                GroupPricing: false
            },
            transform: function (body, response) {
                return {
                    url: util.format('%s?apiKey=%s&pageIndex=0&pageSize=10', response.headers['location'], apiKey)
                };
            },
            json: false
        };

        return request(options).then(function (session) {

            return pull(session.url, pull, delay).then(function (body) {
                var data = JSON.parse(body);

                var toReturn = data.Itineraries.map(function (itin) {

                    var outboundLeg = lodash.filter(data.Legs, { Id: itin.OutboundLegId })[0];
                    var inboundLeg = lodash.filter(data.Legs, { Id: itin.InboundLegId })[0];

                    var outboundCarriers = outboundLeg.OperatingCarriers.map(function (cariId) {
                        return lodash.filter(data.Carriers, { Id: cariId })[0].Name;
                    });

                    var inboundCarriers = inboundLeg.OperatingCarriers.map(function (cariId) {
                        return lodash.filter(data.Carriers, { Id: cariId })[0].Name;
                    });

                    return {
                        outbound: {
                            departTime: outboundLeg.Departure,
                            arriveTime: outboundLeg.Arrival,
                            stops: outboundLeg.SegmentIds.length,
                            carriers: outboundCarriers
                        },
                        inbound: {
                            departTime: inboundLeg.Departure,
                            arriveTime: inboundLeg.Arrival,
                            stops: inboundLeg.SegmentIds.length,
                            carriers: inboundCarriers
                        },
                        price: itin.PricingOptions[0].Price,
                        url: itin.PricingOptions[0].DeeplinkUrl
                    };
                });

                return toReturn;
            });
        });
    },

    pull: function (url, self, delay) {

        var pullinner = function () {

            var currentRequest = request(url);
            return currentRequest.then(function (body) {

                var data = JSON.parse(body);
                if (data.Status === "UpdatesPending") {
                    return self(url, self, delay);
                } else if (data.Status === "UpdatesComplete") {
                    return currentRequest;
                } else {
                    return null;
                }
            }, function (error) {

                if (error.statusCode === 304) {
                    return self(url, self, delay);
                } else if (error.statusCode === 429) {
                    return self(url, self, 60000);
                } else {
                    return null;
                }
            });
        };

        return promise.delay(delay).then(pullinner);
    },
};