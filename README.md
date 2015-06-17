# oath [![Build Status](https://travis-ci.org/SteefH/oath.svg?branch=master)](https://travis-ci.org/SteefH/oath)

Utilities for breaking and keeping promises.

## API documentation

### oath.breaker()
Wrap a function so that it abandons previously returned pending promises when called.

#### Example

Suppose you have a search endpoint living at the URL `/api/search/autocomplete`. You can send HTTP GET requests to it, using a query parameter named `query`. When the endpoint receives such a request, it returns a JSON document containing strings that are partially matched by the value you passed in `query`.

Now, typically you would present the user of your web app a text input with a change event listener attached to it, and when the user types something in the text input, the event listener will perform an AJAX request on the autocomplete endpoint, resulting in a promise that will be resolved with the matches found by the endpoint.

    function getAutoCompleteItems(query) {
      var deferred = q.defer();
      var request = new XmlHttpRequest();
      request.open('/api/search/autocomplete')
    }


_Under development_
