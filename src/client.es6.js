import { objectToQueryString,
         appendQueryStringToURL,
         prefixedTimestamp } from './helpers.es6.js';

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

export default class RestClient {

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
