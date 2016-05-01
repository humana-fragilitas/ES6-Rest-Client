/**
 * es6-rest-client - v3.0.3 - Sun, 01 May 2016 19:19:42 GMT
 * https://github.com/humana-fragilitas/ES6-Rest-Client.git
 * Copyright (c) 2016 Andrea Blasio (https://github.com/humana-fragilitas); Licensed MIT
 */
/**
 * Given an object, serializes its own key/value pairs into
 * querystring; values can be either primitive types or
 * function expressions
 *
 * @param {Object} obj Object to be serialized into querystring
 * @return {String}
 */

function objectToQueryString(obj){

    return Object.keys(obj || {})
                 .filter((key) => { return ((obj[key] !== '') &&
                                            (obj[key] !== null)); })
                 .map((key) => {
                    
                     const value = (typeof obj[key] === 'function') ?
                                      encodeURIComponent(obj[key]()) :
                                         encodeURIComponent(obj[key]);
                    
                     return `${key}=${value}`;

                 })
                 .join('&');

}

/**
 * Returns a string identifier composed by a prefix
 * followed by current timestamp
 *
 * @return {String}
 */
 
function prefixedTimestamp(){
    
    const PREFIX = '__es6-rest-client__';
    const TIMESTAMP = (new Date()).getTime();
    
    return `${PREFIX}${TIMESTAMP}`;
    
}

/**
 * Allows to concatenate an existing URL with a querystring fragment
 *
 * @param {String} url URL to be concatenated with the given querystring
 * @return {String} queryString Querystring fragment to be appended
 *                              to the specified URL
 * @return {String}
 */

function appendQueryStringToURL(url, queryString){
    
    const mark = (queryString) ? (((url || '').indexOf('?') === -1) ? '?' : '&') : '';
    
    return `${url}${mark}${queryString}`;
    
}

const __COMPUTED__               = Symbol('ES6_REST_CLIENT_COMPUTED');
const __ROUTES__                 = Symbol('ES6_REST_CLIENT_ROUTES');
const __QUERYSTRING_PARAMETERS__ = Symbol('ES6_REST_CLIENT_QUERYSTRING_PARAMETERS');
const __BODY_PAYLOAD__           = Symbol('ES6_REST_CLIENT_BODY_PAYLOAD');

const SETTINGS                   = Symbol('ES6_REST_CLIENT_SETTINGS');
const INIT                       = Symbol('ES6_REST_CLIENT_INIT');
const RESET                      = Symbol('ES6_REST_CLIENT_RESET');

const GET                        = Symbol('ES6_REST_CLIENT_HTTP_GET');
const HEAD                       = Symbol('ES6_REST_CLIENT_HTTP_HEAD');
const JSONP                      = Symbol('ES6_REST_CLIENT_HTTP_JSONP');
const POST                       = Symbol('ES6_REST_CLIENT_HTTP_POST');
const PUT                        = Symbol('ES6_REST_CLIENT_HTTP_PUT');
const DELETE                     = Symbol('ES6_REST_CLIENT_HTTP_DELETE');
const PATCH                      = Symbol('ES6_REST_CLIENT_HTTP_PATCH');
const OPTIONS                    = Symbol('ES6_REST_CLIENT_HTTP_OPTIONS');

let defaultSettings;
let userDefinedSettings;
let properties;
let querystring;
let fetchConfiguration;
/************************************/
/* default assignments              */
/************************************/

/**
 * Stores client default configuration settings
 *
 * @type Object
 */

defaultSettings = {
    
    method: 'get', 
    baseURI: '/',
    params: {},
    jsonp: { callback: prefixedTimestamp }

};

/**
 * Stores user defined client configuration settings
 *
 * @type Object
 */

userDefinedSettings = {};

/**
 * Stores properties and methods names invoked on the
 * proxied RestClient class (reference: ~/src/proxy.es6.js)
 *
 * @type Array
 */

properties = [];

/**
 * Stores key/value pairs meant to be
 * serialized into querystring
 *
 * @type Object
 */

querystring = {};

/**
 * GlobalFetch.fetch method initialization object
 * (reference: https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch#Parameters)
 *
 * @type Object
 */

fetchConfiguration = {};

/************************************/
/* private methods                  */
/************************************/

 /**
  * Helps to configure the client by creating an initialization object suitable
  * as an argument for the GlobalFetch.fetch method; will conveniently be turned into
  * an higher-order function via ES7 decorator in the next releases
  *  
  * @method _httpMethod
  * @param {Symbol} type Determines whether any contents should be sent
  *                      as either querystring parameters or body payload
  * @param {String} httpVerb HTTP method to be specified in the GlobalFetch.fetch
  *                          initialization object (reference: ~/src/client.es6.js)
  * @param {Object|
  *         Blob|
  *         BufferSource|
  *         FormData|
  *         URLSearchParams|
  *         USVString} value Value to be either serialized to querystring or
  *                          specified as body payload in the GlobalFetch.fetch
  *                          initialization object, depending on the
  *                          chosen HTTP method (reference: ~/src/client.es6.js)
  *                                                                      
  * @private
  */

const _httpMethod = function _httpMethod(type, httpVerb, value){
    
    switch (type) {
        
        case __QUERYSTRING_PARAMETERS__:
             fetchConfiguration = Object.assign({ method: httpVerb }, fetchConfiguration);
             Object.assign(querystring, value);
             break;
            
        case __BODY_PAYLOAD__:        
             fetchConfiguration = Object.assign({ method: httpVerb },
                                                (value) ? { body: value } : null);
             break;
        
    }
    
};

/************************************/
/* class                            */
/************************************/

/**
 * Provides logic to store and parse configuration options, properties
 * and methods names invoked on the proxied RestClient class
 * (reference: ~/src/proxy.es6.js)
 *
 * @class Configuration
 * @constructor
 */

class Configuration {
    
    /************************************/
    /* public methods                   */
    /************************************/
    
    /**
     * Gets an array of properties and methods names invoked on the
     * proxied RestClient class (reference: ~/src/proxy.es6.js)
     *
     * @returns {Array}
     */
    
    get [__ROUTES__](){

        return properties;

    }
    
    /**
     * Gets an array of values resulting from the parsing of currently
     * stored client settings suitable as an argument to the RestClient class
     * fetch() method (reference: ~/src/client.es6.js)
     *
     * @returns {Array}
     */
    
    get [__COMPUTED__](){

        let settings,
            configuration,
            params,
            route,
            jsonPCallback;

        settings = Object.assign({}, defaultSettings, userDefinedSettings);
        configuration = Object.assign({ method: settings.method }, fetchConfiguration);
        params = objectToQueryString(Object.assign({}, querystring, settings.params));
        
        route = appendQueryStringToURL((settings.baseURI + properties.join('/')),
                                        params);
        jsonPCallback = settings.jsonp;
        
        this[RESET]();

        return [route, configuration, jsonPCallback];
 
    }
    
    /**
     * Allows to override client defaults with user defined settings,
     * persisting them across subsequent calls, unless explicitly
     * either modified or reset
     *  
     * @method settings
     * @param {Object} obj An object containing key/value pairs meant
     *                     to override client default settings
     * @return {Boolean} Determines whether the method should be
     *                   marked as HTTP-related
     */
     
    [SETTINGS](obj){
         
        Object.assign(userDefinedSettings, obj);
        
        return false;

    }
    
    /**
     * Allows to specify a per-call initialization object suitable 
     * for the underlying call to the GlobalFetch.fetch method
     * (reference: ~/src/client.es6.js)
     *  
     * @method init
     * @param {Object} obj GlobalFetch.fetch initialization object
     *                     (reference: https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch#Parameters)
     * @return {Boolean} Determines whether the method should be
     *                   marked as HTTP-related
     */
    
    [INIT](obj){
    
        fetchConfiguration = obj;
        
        return false;

    }
    
    /**
     * Restores client settings (routes, querystring parameters,
     * GlobalFetch.fetch initialization object, user defined settings)
     * to their defaults
     * 
     * @method reset
     * @param {Boolean} [settings] Optionally allows to also clear any user defined
     *                             settings specified via settings() method
     * @return {Boolean} Determines whether the method should be
     *                   marked as HTTP-related
     */
    
    [RESET](settings){

        properties.length = 0; 
        querystring = {};
        fetchConfiguration = {};
        
        if (settings) {
            
            userDefinedSettings = Object.assign({}, defaultSettings);
            
        }
        
        return false;

    }
    
    /**
     * Configures the client to fetch a resource via HTTP GET
     * 
     * @method get
     * @param {Object} [obj] Object whose key/value pairs are meant
     *                       to be serialized into querystring; values
     *                       can be either primitive types or function expressions
     * @return {Boolean} Determines whether the method should be
     *                   marked as HTTP-related
     */
    
    [GET](obj){
        
        _httpMethod(__QUERYSTRING_PARAMETERS__, 'get', obj);

        return true;

    }
    
    /**
     * Configures the client to fetch a resource via HTTP HEAD
     * 
     * @method head
     * @param {Object} [obj] Object whose key/value pairs are meant
     *                       to be serialized into querystring; values
     *                       can be either primitive types or function expressions
     * @return {Boolean} Determines whether the method should be
     *                   marked as HTTP-related
     */
    
    [HEAD](obj){

        _httpMethod(__QUERYSTRING_PARAMETERS__, 'head', obj);

        return true;

    }
    
    /**
     * Configures the client to fetch a resource via JSONP technique
     * 
     * @method jsonp
     * @param {Object} [obj] Object whose key/value pairs are meant
     *                       to be serialized into querystring; values
     *                       can be either primitive types or function expressions
     * @return {Boolean} Determines whether the method should be
     *                   marked as HTTP-related
     */
    
    [JSONP](obj){

        _httpMethod(__QUERYSTRING_PARAMETERS__, 'jsonp', obj);

        return true;

    }
    
    /**
     * Configures the client to fetch a resource via HTTP POST
     * 
     * @method post
     * @param {Blob|
     *         BufferSource|
     *         FormData|
     *         URLSearchParams|
     *         USVString} [payload] Value meant to be specified as body payload
     *                              in the underlying GlobalFetch.fetch implementation
     *                              initialization object
     * @return {Boolean} Determines whether the method should be
     *                   marked as HTTP-related
     */
    
    [POST](payload){

        _httpMethod(__BODY_PAYLOAD__, 'post', payload);

        return true;

    }
    
    /**
     * Configures the client to fetch a resource via HTTP PUT
     * 
     * @method put
     * @param {Blob|
     *         BufferSource|
     *         FormData|
     *         URLSearchParams|
     *         USVString} [payload] Value meant to be specified as body payload
     *                              in the underlying GlobalFetch.fetch implementation
     *                              initialization object
     * @return {Boolean} Determines whether the method should be
     *                   marked as HTTP-related
     */
    
    [PUT](payload){

        _httpMethod(__BODY_PAYLOAD__, 'put', payload);

        return true;

    }
    
    /**
     * Configures the client to fetch a resource via HTTP DELETE
     * 
     * @method delete
     * @param {Blob|
     *         BufferSource|
     *         FormData|
     *         URLSearchParams|
     *         USVString} [payload] Value meant to be specified as body payload
     *                              in the underlying GlobalFetch.fetch implementation
     *                              initialization object
     * @return {Boolean} Determines whether the method should be
     *                   marked as HTTP-related
     */
    
    [DELETE](payload){

        _httpMethod(__BODY_PAYLOAD__, 'delete', payload);

        return true;

    }
    
    /**
     * Configures the client to fetch a resource via HTTP PATCH
     * 
     * @method patch
     * @param {Blob|
     *         BufferSource|
     *         FormData|
     *         URLSearchParams|
     *         USVString} [payload] Value meant to be specified as body payload
     *                              in the underlying GlobalFetch.fetch implementation
     *                              initialization object
     * @return {Boolean} Determines whether the method should be
     *                   marked as HTTP-related
     */
    
    [PATCH](payload){

        _httpMethod(__BODY_PAYLOAD__, 'patch', payload);

        return true;

    }

    /**
     * Configures the client to fetch a resource via HTTP OPTIONS
     * 
     * @method options
     * @param {Blob|
     *         BufferSource|
     *         FormData|
     *         URLSearchParams|
     *         USVString} [payload] Value meant to be specified as body payload
     *                              in the underlying GlobalFetch.fetch implementation
     *                              initialization object
     * @return {Boolean} Determines whether the method should be
     *                   marked as HTTP-related
     */
    
    [OPTIONS](payload){

        _httpMethod(__BODY_PAYLOAD__, 'options', payload);

        return true;

    }
    
}

/************************************/
/* private methods                  */
/************************************/
         
/**
 * Fetches a remote JSON-encoded file via JSONP technique
 *  
 * @method _jsonpFetch
 * @for RestClient
 * @param {String} url A string containing the URL to which the request is sent
 * @param {Object} callback An object whose first key/value pair respectively contains
 *                          names of the JSONP callback querystring parameter and of its
 *                          related function meant to accept the JSON-encoded data as
 *                          an argument
 * @private
 * @return {Promise<any>}
 */
         
const _jsonpFetch = function _jsonpFetch(url, callback){
    
    let callbackParamName,
        callbackFunctionName,  
        querystring,
        scriptId,
        scriptElement,
        scriptSource;

    callbackParamName = Object.keys(callback)[0];
    callbackFunctionName = callback[callbackParamName];
    querystring = objectToQueryString(callback);
    scriptId = prefixedTimestamp();
    scriptSource = appendQueryStringToURL(url, querystring);

    return new Promise((resolve, reject) => {

        scriptElement = document.createElement('script');
        scriptElement.src = scriptSource;
        scriptElement.id = scriptId;
        scriptElement.addEventListener('error', reject);

        window[callbackFunctionName] = function(data){

            Reflect.deleteProperty(window[callbackFunctionName]);
            scriptElement.parentNode.removeChild(scriptElement);
            resolve(data);

        };

        (document.getElementsByTagName('head')[0] ||
                document.body || document.documentElement).appendChild(scriptElement);

    });

};

/**
 * Proxy target object (reference: ~/src/proxy.es6.js);
 * provides logic to fetch remote resources
 *  
 * @class RestClient
 * @static
 */

class RestClient {

    /**
     * Wraps the native GlobalFetch.fetch method providing
     * additional support for cross-domain fetching of
     * JSON-encoded resources via JSONP technique
     *  
     * @method fetch
     * @param {String} url A string containing the URL to which the request is sent
     * @param {Object} initObj GlobalFetch.fetch initialization object
     *                         (reference: https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch#Parameters)
     * @param {Object} callback An object whose first key/value pair respectively contains
     *                          names of the JSONP callback querystring parameter and of its
     *                          related function meant to accept the JSON-encoded data as
     *                          an argument
     * @return {Promise<Response>|Promise<any>}
     * @static
     */
    
    static fetch(url, initObj, callback){

        if (initObj.method === 'jsonp') {

            return _jsonpFetch(url, callback);

        }

        return fetch(url, initObj);

    }

}

/************************************/
/* default assignments              */
/************************************/

const configuration = new Configuration();

/************************************/
/* helper functions                 */
/************************************/

/**
 * Processes any method invokation on the proxied RestClient class by
 * checking whether the former exists in the definition of the latter: if positive,
 * configures the client with any provided arguments and forwards the call
 * to the original method implementation; if negative, stores the non-existing
 * method name as route fragment in the configuration and performs a default
 * get() method call on the target RestClient class interface.
 *
 * @param {RestClient} target The RestClient class to which the Proxy has been applied
 * @param {Object} thisArg The 'this' argument for the call
 * @param {Array} argumentsList Array of arguments passed to the trapped method call
 * @return {RestClient|Promise<Response>|Promise<any>} 
 */

const _trapMethod = function _trapMethod(target, thisArg, argumentsList){
    
    let properties,
        propertiesLength,
        currentProperty,
        isMethodName,
        isHTTPVerb,
        hasDefaultHTTPVerb;

    properties = configuration[__ROUTES__];
    propertiesLength = properties.length;
    currentProperty = properties[propertiesLength-1];
    isMethodName = (typeof configuration[currentProperty] === 'function');
    isHTTPVerb = isMethodName && Reflect.apply(configuration[properties.pop()],
                                               configuration,
                                               argumentsList);
    hasDefaultHTTPVerb = !isMethodName &&
                         !isHTTPVerb &&
                          Reflect.apply(configuration[GET],
                                        configuration,
                                        argumentsList);
        
    return (isHTTPVerb || hasDefaultHTTPVerb) ?
        Reflect.apply(target.fetch, target, configuration[__COMPUTED__]) :
            restClientProxy;
                    
};

/**
 * Processes any getter invokation on the proxied RestClient class
 * by storing properties keys as route fragments in the configuration object
 *  
 * @param {RestClient} target The RestClient class to which the Proxy has been applied
 * @param {String} propKey The trapped property key
 * @param {Proxy} receiver The Proxy object applied to the RestClient class
 * @return {RestClient} 
 */

const _trapProperty = function _trapProperty(target, propKey, receiver){
    
    configuration[__ROUTES__].push(propKey); 

    return receiver;

}

/************************************/
/* library entry point              */
/************************************/

/**
 * Wraps the RestClient static class with a Proxy object
 * in order to trap and subsequently process any properties
 * and methods invoked on the former
 */

const restClientProxy = new Proxy(RestClient,
{

    get(target, propKey, receiver) {

        return _trapProperty(target, propKey, receiver);

    },

    apply(target, thisArg, argumentsList) {

        return _trapMethod(target, thisArg, argumentsList);

    }

});

export { INIT, SETTINGS, RESET, GET, HEAD, JSONP, POST, PUT, DELETE, PATCH, OPTIONS };export default restClientProxy;
//# sourceMappingURL=client.es6.js.map
