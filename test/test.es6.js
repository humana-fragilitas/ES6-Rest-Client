/*global sinon*/

import restClient, { SETTINGS,
                     INIT,
                     RESET,
                     GET, 
                     HEAD,
                     JSONP,
                     POST, 
                     PUT,
                     DELETE,
                     PATCH,
                     OPTIONS } from '../dist/client.es6.js';
                     
            
QUnit.module('ES6 Rest Client', (hooks) => {
    
    hooks.beforeEach(() => {
            
        sinon.stub(window, 'fetch');
        restClient[RESET](true);
        
    });
    
    hooks.afterEach(() => {
            
        window.fetch.restore();
        
    });
    
    QUnit.module( 'Public non-HTTP methods', () => {

        QUnit.test('Interface fluency', () => { 

            expect(3);
            
            strictEqual(restClient[SETTINGS](), restClient, '[SETTINGS]() method returns the ES6 Rest Client Proxy object instance.');
            strictEqual(restClient[INIT](), restClient, '[INIT]() method returns the ES6 Rest Client Proxy object instance.');
            strictEqual(restClient[RESET](), restClient, '[RESET]() method returns the ES6 Rest Client Proxy object instance.');

        });
        
        QUnit.test('Configuration', (assert) => {
            
            let testSettings,
                testParams,
                testHeaders;
            
            testSettings = {
                
                baseURI: 'http://www.humanafragilitas.com/',
                params: {
                    
                    x: '1',
                    y() { return Math.pow(2, 3); }
                    
                }
                
            };
            
            testHeaders = new Headers();
            testHeaders.append('Content-Type', 'application/json');
            
            testParams = {
                
                method: 'POST',
                headers: testHeaders,
                body: JSON.stringify({ testKey: 'testValue' }),
                mode: 'cors',
                cache: 'default'
                
            };
            
            expect(5);
            
            restClient[SETTINGS](testSettings);
            restClient.routeFragment1();        
            assert.ok(window.fetch.calledWithExactly('http://www.humanafragilitas.com/routeFragment1?x=1&y=8', { method: 'get' }), 'The [SETTINGS]() method should allow to configure the route base url and optional querystring parameters.');
            
            restClient.routeFragment2.routeFragment3();
            assert.ok(window.fetch.calledWithExactly('http://www.humanafragilitas.com/routeFragment2/routeFragment3?x=1&y=8', { method: 'get' }), 'Configuration options set via [SETTINGS]() method should persist across subsequent queries unless explicitly reset.');
            
            restClient[RESET](true);
            restClient[INIT](testParams);
            restClient.routeFragment1();            
            assert.ok(window.fetch.calledWithExactly('/routeFragment1', testParams), 'The [INIT]() method should allow to pass an options object to the underlying GlobalFetch.Fetch method.');
            
            restClient[SETTINGS](testSettings);
            restClient[INIT](testParams);
            restClient.routeFragment1.routeFragment2.routeFragment3;
            restClient[RESET]();
            restClient();
            
            assert.ok(window.fetch.calledWithExactly('http://www.humanafragilitas.com/?x=1&y=8', { method: 'get' }), 'If called with a falsy argument, the [RESET]() method should allow to restore the ES6-Rest-Client configuration defaults except for possible values previously set via [SETTINGS]() method.');
            
            restClient[RESET](true);
            restClient[SETTINGS](testSettings);
            restClient[INIT](testParams);
            restClient.routeFragment1.routeFragment2.routeFragment3;
            restClient[RESET](true);
            restClient();
            
            assert.ok(window.fetch.calledWithExactly('/', { method: 'get' }), 'If called with a truthy argument, the [RESET]() method should allow to completely restore the ES6-Rest-Client configuration defaults.');

        });
        
        QUnit.test('Default behaviour', (assert) => {
            
            expect(2);
            
            restClient();
            assert.ok(window.fetch.calledWithExactly('/', { method: 'get' }), 'Invoking the restClient instance as a function should cause the public method [GET]() to be called by default.');
            
            restClient.routeFragment1();
            assert.ok(window.fetch.calledWithExactly('/routeFragment1', { method: 'get' }), 'Invoking a non existent method should cause its name to be evaluated as route fragment and the public method [GET]() to be called as fallback.');

        }); 

    });
    
    QUnit.module( 'Public HTTP methods', () => {

        QUnit.test('Verbs', (assert) => {
            
            expect(7); 
            
            restClient.__GET__.routeFragment1.routeFragment2[GET]();
            assert.ok(window.fetch.calledWithExactly('/__GET__/routeFragment1/routeFragment2', { method: 'get' }), 'Invoking the [GET]() method on the ES6-Rest-Client instance causes the underlying GlobalFetch.fetch to be called with an accordingly set configuration object.');
            
            restClient.__HEAD__.routeFragment1.routeFragment2[HEAD]();
            assert.ok(window.fetch.calledWithExactly('/__HEAD__/routeFragment1/routeFragment2', { method: 'head' }), 'Invoking the [HEAD]() method on the ES6-Rest-Client instance causes the underlying GlobalFetch.fetch to be called with an accordingly set configuration object.');
            
            restClient.__POST__.routeFragment1.routeFragment2[POST]();
            assert.ok(window.fetch.calledWithExactly('/__POST__/routeFragment1/routeFragment2', { method: 'post' }), 'Invoking the [POST]() method on the ES6-Rest-Client instance causes the underlying GlobalFetch.fetch to be called with an accordingly set configuration object.');
            
            restClient.__PUT__.routeFragment1.routeFragment2[PUT]();
            assert.ok(window.fetch.calledWithExactly('/__PUT__/routeFragment1/routeFragment2', { method: 'put' }), 'Invoking the [PUT]() method on the ES6-Rest-Client instance causes the underlying GlobalFetch.fetch to be called with an accordingly set configuration object.');
            
            restClient.__DELETE__.routeFragment1.routeFragment2[DELETE]();
            assert.ok(window.fetch.calledWithExactly('/__DELETE__/routeFragment1/routeFragment2', { method: 'delete' }), 'Invoking the [DELETE]() method on the ES6-Rest-Client instance causes the underlying GlobalFetch.fetch to be called with an accordingly set configuration object.');
            
            restClient.__PATCH__.routeFragment1.routeFragment2[PATCH]();
            assert.ok(window.fetch.calledWithExactly('/__PATCH__/routeFragment1/routeFragment2', { method: 'patch' }), 'Invoking the [PATCH]() method on the ES6-Rest-Client instance causes the underlying GlobalFetch.fetch to be called with an accordingly set configuration object.');
                    
            restClient.__OPTIONS__.routeFragment1.routeFragment2[OPTIONS]();
            assert.ok(window.fetch.calledWithExactly('/__OPTIONS__/routeFragment1/routeFragment2', { method: 'options' }), 'Invoking the [OPTIONS]() method on the ES6-Rest-Client instance causes the underlying GlobalFetch.fetch to be called with an accordingly set configuration object.');
            
        });
        
    });

});