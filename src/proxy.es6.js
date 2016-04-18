import Configuration from './configuration.es6.js';
import RestClient from './client.es6.js';
import { __ROUTES__, __COMPUTED__, GET } from './symbols.es6.js';

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

export default restClientProxy;

export { INIT,
         SETTINGS,
         RESET,
         GET, 
         HEAD,
         JSONP,
         POST, 
         PUT,
         DELETE,
         PATCH,
         OPTIONS } from './symbols.es6.js';