/**
 * Given an object, serializes its own key/value pairs into
 * querystring; values can be either primitive types or
 * function expressions
 *
 * @param {Object} obj Object to be serialized into querystring
 * @return {String}
 */

export function objectToQueryString(obj){

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
 
export function prefixedTimestamp(){
    
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

export function appendQueryStringToURL(url, queryString){
    
    const mark = (queryString) ? (((url || '').indexOf('?') === -1) ? '?' : '&') : '';
    
    return `${url}${mark}${queryString}`;
    
}

