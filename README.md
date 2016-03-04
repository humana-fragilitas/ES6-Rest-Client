ES6 Rest Client <sup>(beta)</sup>
==========

The **ES6 Rest Client** is an experimental JavaScript library aimed to ease up communication with HTTP-based RESTful APIs via an highly semantic, fluent interface that leverages rising ECMAScript 6 language features such as [GlobalFetch](https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch), [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and the meta-programming capabilities of the [Proxy](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object, allowing routes to be specified by simply accessing dynamic properties on the client object itself:
```javascript
import catalogue from './node_modules/es6-rest-client/dist/client.es6.js';

catalogue.products.books().then(function(stream){

    stream.json().then(function(response){
        console.log(response);
    });
    
}); // results in: HTTP GET /products/books
```
Required ES6 features
-----
~~**Note:** at time of writing, the only browser with full support for the library code is [Firefox (Developer Edition)](https://www.mozilla.org/en-US/firefox/developer/).~~Proxy is now supported in Chrome 49.

*   **GlobalFetch.fetch**
    -   *polyfillable*: **`yes`**
    -   [reference @ MDN](https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch#Browser_compatibility)
*   **Promise**
    -   *polyfillable*: **`yes`**
    -   [reference @ MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Browser_compatibility)
*   **Proxy**
    -   *polyfillable*: **`no`**
    -   [reference @ MDN](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Browser_compatibility)

Install
-----
#### NPM ####
```javascript
npm install es6-rest-client
```
#### Bower ####
```javascript
bower install es6-rest-client
```
Usage
-----
Import the module referenced in the `package.json` file's **`jsnext:main`** field and employ an [ES6-aware bundling tool](https://github.com/rollup/rollup) in the build process of your project; a transpiled, [UMD](https://github.com/umdjs/umd) version of **ES6 Rest Client** is however provided in the `dist` folder for testing purposes. 
#### ES6 modules (recommended) ####
```javascript
'use strict';
import restClient from './node_modules/es6-rest-client/dist/client.es6.js';
. . .
```
#### UMD (global object) ####
```html
<!DOCTYPE html>
<html>
   <head>
      <meta charset="utf-8">
      <title>Sample ES6 Rest Client Project</title>
      <script src="node_modules/es6-rest-client/dist/client.umd.js"></script>
      <script>
         'use strict';
         const restClient = ES6RestClient.default;
         . . .
      </script>
   </head>
. . .
```
#### UMD (AMD) ####
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Sample ES6 Rest Client Project</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.22/require.min.js"></script>
        <script>
            'use strict';

            requirejs.config({
                baseUrl: 'node_modules',
                paths: {
                    ES6RestClient: 'es6-rest-client/dist/client.umd'
                }
            });

            require(['ES6RestClient'] , function(ES6RestClient) {
                const restClient = ES6RestClient.default;
                . . .
            });
        </script>
    </head>
. . .
```
#### UMD (CommonJS) ####
```javascript
'use strict';
const restClient = require('es6-rest-client')['default'];
. . .
```
Documentation
-----
### Public properties ###

| *name* | *chainable* | *getter returns* | *description* |
| :--    | :--         | :--       | :--           |
| `[any]` | `yes` | `RestClient` | Any property getter invoked on the client instance causes an equally named, slash separated route fragment to be incrementally stored in the current configuration cache. |

### Public methods ###
#### Configuration ####
| *name* | *chainable* | *description* |
| :--    | :--         | :--           |
| `settings(obj?:Object):RestClient` | `yes` | Overrides client instance [default settings](#settings-object) with user defined values, persisting them in the configuration cache across subsequent calls, unless explicitly either modified or reset. |
| `init(obj?:Object):RestClient` | `yes` | Allows to pass an [initialization object](https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch#Parameters) to the underlying **`GlobalFetch.fetch`** method call. |
| `reset(settings?:Boolean):RestClient` | `yes` | Restores client to its defaults, except for the settings; passing a truthy value as an argument also reestablishes the latter. |

#### HTTP verbs ####
| *name* | *chainable* | *description* |
| :--    | :--         | :--           |
| `get(params?:Object):Promise<Response>` | `no` | Starts the process of fetching a resource via **`HTTP GET`**. Any object passed as argument is serialized into querystring.  |
| `head(params?:Object):Promise<Response>` | `no` | Starts the process of fetching a resource via **`HTTP HEAD`**. Any object passed as argument is serialized into querystring. |
| `jsonp(params?:Object):Promise<any>` | `no` | Starts the process of fetching a JSON-encoded resource via **`JSONP`** technique. Any object passed as argument is serialized into querystring. |
| `post(payload?:Blob | BufferSource | FormData | URLSearchParams | USVString):Promise<Response>` | `no` | Starts the process of fetching a resource via **`HTTP POST`**. Any object passed as argument is sent as payload. |
| `put(payload?:Blob | BufferSource | FormData | URLSearchParams | USVString):Promise<Response>` | `no` | Starts the process of fetching a resource via **`HTTP PUT`**. Any object passed as argument is sent as payload. |
| `delete(payload?:Blob | BufferSource | FormData | URLSearchParams | USVString):Promise<Response>` | `no` | Starts the process of fetching a resource via **`HTTP DELETE`**. Any object passed as argument is sent as payload. |
| `patch(payload?:Blob | BufferSource | FormData | URLSearchParams | USVString):Promise<Response>` | `no` | Starts the process of fetching a resource via **`HTTP PATCH`**. Any object passed as argument is sent as payload. |
| `options(payload?:Blob | BufferSource | FormData | URLSearchParams | USVString):Promise<Response>` | `no` | Starts the process of fetching a resource via **`HTTP OPTIONS`**. Any object passed as argument is sent as payload. |

**Note:** invoking a non-existent method on the **ES6 Rest Client** causes its name to be parsed as a route fragment and the **`get()`** method to be implicitly called with any arguments given in the former (see the [example](#es6-rest-client-beta) above).

### Settings object ###

|*key*|*default*|*description*|
| :-- | :--     | :--         |
| `method?:String` | `'GET'` | Default HTTP verb; it can be set to one of the following values: `'GET'`, `'HEAD'`, `'JSONP'`, `'POST'`, `'PUT'`, `'DELETE'`, `'PATCH'`, `'OPTIONS'`. |
| `baseURI?:String` | `'/'` | Remote resource base URI; it must end with a trailing slash. |
| `params?:Object` | `{}` | An object whose key/value pairs are serialized to querystring; values can be either primitive types or function expressions. |
| `jsonp?:Object` | `{ callback: '__es6-rest-client__[[CURRENT_TIMESTAMP]]' }` | An object whose first key/value pair allows to respectively specify the jsonP callback querystring parameter name and the chosen function name. |

Examples
-----

### 1. Creating and exporting a third-party API client ###
**Note:** the term 'Etsy' is a trademark of Etsy, Inc. The following code sample uses the [Etsy API](https://www.etsy.com/developers/) but is not endorsed or certified by Etsy, Inc.

##### `~/scripts/helpers/etsyAPIClient.js `#####
```javascript
import etsyAPIClient from '../../node_modules/es6-rest-client/dist/client.es6.js';

etsyAPIClient.settings({
    
    method: 'JSONP',
    baseURI: 'https://openapi.etsy.com/v2/',
    params: { fields: 'url,description,url_170x135',
              includes: 'Images(url_170x135):1',
              api_key: ETSY_API_KEY },
    jsonp: { callback: 'jsonpCallback' }

});

export default etsyAPIClient;
```

##### `~/scripts/app.js `#####
```javascript
import Etsy from 'helpers/etsyAPIClient.js';

/**
 * Enclosing a route fragment into square brackets
 * prevents it from being undesirably split into
 * separate entities by dot characters
 */

Etsy.listings['active.js']().then((response) => {
    console.dir(response.results);
});
```

### 2. Fetching a resource upon successful existence check ###
##### `~/scripts/helpers/fetchIfExists.js` #####
```javascript
import restClient from '../../node_modules/es6-rest-client/dist/client.es6.js';

function fileExists(fileName, interval){

    restClient.settings({
        method: 'head',
        params: { _: function(){ return (new Date()).getTime(); } }
    });
    
    return new Promise((resolve) => {
        (function checkFile(){
            restClient[fileName]().then((response) => {
                (response.ok) ? resolve(response) :
                        setTimeout(checkFile, interval)
            });
        }());
    });
    
}

function fetchIfExists(fileName, interval){

    return fileExists(fileName, interval).then(() => {
        return restClient.reset(true)[fileName]();
    });
    
}

export default fetchIfExists
```

##### `~/scripts/app.js `#####
```javascript
import fetchIfExists from './helpers/fetchIfExists.js';

fetchIfExists('catalogue_01062015.json', 2000).then((stream) => {

    stream.json().then((response) => {
        console.log(response);
    });
    
});
```

### Testing ###

##### Browser #####

**Note:** you may want to check the [required ES6 features](#required-es6-features) first.

1. Open a shell in the package root folder
2. `npm install --global gulp`
3. `npm install`
4. `gulp test`
