import { objectToQueryString,
         appendQueryStringToURL,
         prefixedTimestamp } from './helpers.es6.js';

let defaultSettings,
    userDefinedSettings,
    properties,
    querystring,
    fetchConfiguration;
    
/************************************/
/* default assignments              */
/************************************/

const QUERYSTRING_PARAMETERS = Symbol();
const BODY_PAYLOAD = Symbol();

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
                         as either querystring parameters or body payload
  * @param {String} httpVerb HTTP method to be specified in the GlobalFetch.fetch
  *                          initialization object (reference: ~/src/client.es6.js)
  * @param {Blob|
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
        
        case QUERYSTRING_PARAMETERS:
             fetchConfiguration = Object.assign({ method: httpVerb }, fetchConfiguration);
             Object.assign(querystring, value);
             break;
            
        case BODY_PAYLOAD:        
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

export default class Configuration {
    
    /************************************/
    /* public methods                   */
    /************************************/
    
    /**
     * Gets an array of properties and methods names invoked on the
     * proxied RestClient class (reference: ~/src/proxy.es6.js)
     *
     * @returns {Array}
     */

    get properties(){

        return properties;

    }
    
    /**
     * Gets an array of values resulting from the parsing of currently
     * stored client settings suitable as an argument to the RestClient class
     * fetch() method (reference: ~/src/client.es6.js)
     *
     * @returns {Array}
     */

    get computed(){

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
        
        this.reset();

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

    settings(obj){
         
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

    init(obj){
    
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

    reset(settings){

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
    
    get(obj){
        
        _httpMethod(QUERYSTRING_PARAMETERS, 'get', obj);

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
     
    head(obj){

        _httpMethod(QUERYSTRING_PARAMETERS, 'head', obj);

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
     
    jsonp(obj){

        _httpMethod(QUERYSTRING_PARAMETERS, 'jsonp', obj);

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

    post(payload){

        _httpMethod(BODY_PAYLOAD, 'post', payload);

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

    put(payload){

        _httpMethod(BODY_PAYLOAD, 'put', payload);

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

    delete(payload){

        _httpMethod(BODY_PAYLOAD, 'delete', payload);

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

    patch(payload){

        _httpMethod(BODY_PAYLOAD, 'patch', payload);

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
     
    options(payload){

        _httpMethod(BODY_PAYLOAD, 'options', payload);

        return true;

    }

}
