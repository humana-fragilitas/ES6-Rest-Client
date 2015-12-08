/*global sinon*/
    
QUnit.module('ES6 Rest Client', (hooks) => {
    
    'use strict';
    
    const restClient = ES6RestClient.default;
    
    hooks.beforeEach(() => {
            
        sinon.stub(window, 'fetch');
        restClient.reset(true);
        
    });
    
    hooks.afterEach(() => {
            
        window.fetch.restore();
        
    });
    
    QUnit.module( 'Public non-HTTP methods', () => {

        QUnit.test('Interface fluency', () => { 

            expect(3);
            
            strictEqual(restClient.settings(), restClient, 'settings() method returns the ES6 Rest Client Proxy object instance.');
            strictEqual(restClient.init(), restClient, 'init() method returns the ES6 Rest Client Proxy object instance.');
            strictEqual(restClient.reset(), restClient, 'reset() method returns the ES6 Rest Client Proxy object instance.');

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
            
            restClient.settings(testSettings);
            restClient.routeFragment1();        
            assert.ok(window.fetch.calledWithExactly('http://www.humanafragilitas.com/routeFragment1?x=1&y=8', { method: 'get' }), 'The settings() method should allow to configure the route base url and optional querystring parameters.');
            
            restClient.routeFragment2.routeFragment3();
            assert.ok(window.fetch.calledWithExactly('http://www.humanafragilitas.com/routeFragment2/routeFragment3?x=1&y=8', { method: 'get' }), 'Configuration options set via settings() method should persist across subsequent queries unless explicitly reset.');
            
            restClient.reset(true);
            restClient.init(testParams);
            restClient.routeFragment1();            
            assert.ok(window.fetch.calledWithExactly('/routeFragment1', testParams), 'The init() method should allow to pass an options object to the underlying GlobalFetch.Fetch method.');
            
            restClient.settings(testSettings);
            restClient.init(testParams);
            restClient.routeFragment1.routeFragment2.routeFragment3;
            restClient.reset();
            restClient();
            
            assert.ok(window.fetch.calledWithExactly('http://www.humanafragilitas.com/?x=1&y=8', { method: 'get' }), 'If called with a falsy argument, the reset() method should allow to restore the ES6-Rest-Client configuration defaults except for possible values previously set via settings() method.');
            
            restClient.reset(true);
            restClient.settings(testSettings);
            restClient.init(testParams);
            restClient.routeFragment1.routeFragment2.routeFragment3;
            restClient.reset(true);
            restClient();
            
            assert.ok(window.fetch.calledWithExactly('/', { method: 'get' }), 'If called with a truthy argument, the reset() method should allow to completely restore the ES6-Rest-Client configuration defaults.');

        });
        
        QUnit.test('Default behaviour', (assert) => {
            
            expect(2);
            
            restClient();
            assert.ok(window.fetch.calledWithExactly('/', { method: 'get' }), 'Invoking the restClient instance as a function should cause the public method get() to be called by default.');
            
            restClient.routeFragment1();
            assert.ok(window.fetch.calledWithExactly('/routeFragment1', { method: 'get' }), 'Invoking a non existent method should cause its name to be evaluated as route fragment and the public method get() to be called as fallback.');

        }); 

    });
    
    QUnit.module( 'Public HTTP methods', () => {

        QUnit.test('Verbs', (assert) => {
            
            expect(7); 
            
            restClient.__GET__.routeFragment1.routeFragment2();
            assert.ok(window.fetch.calledWithExactly('/__GET__/routeFragment1/routeFragment2', { method: 'get' }), 'Invoking the get() method on the ES6-Rest-Client instance causes the underlying GlobalFetch.fetch to be called with an accordingly set configuration object.');
            
            restClient.__HEAD__.routeFragment1.routeFragment2.head();
            assert.ok(window.fetch.calledWithExactly('/__HEAD__/routeFragment1/routeFragment2', { method: 'head' }), 'Invoking the head() method on the ES6-Rest-Client instance causes the underlying GlobalFetch.fetch to be called with an accordingly set configuration object.');
            
            restClient.__POST__.routeFragment1.routeFragment2.post();
            assert.ok(window.fetch.calledWithExactly('/__POST__/routeFragment1/routeFragment2', { method: 'post' }), 'Invoking the post() method on the ES6-Rest-Client instance causes the underlying GlobalFetch.fetch to be called with an accordingly set configuration object.');
            
            restClient.__PUT__.routeFragment1.routeFragment2.put();
            assert.ok(window.fetch.calledWithExactly('/__PUT__/routeFragment1/routeFragment2', { method: 'put' }), 'Invoking the put() method on the ES6-Rest-Client instance causes the underlying GlobalFetch.fetch to be called with an accordingly set configuration object.');
            
            restClient.__DELETE__.routeFragment1.routeFragment2.delete();
            assert.ok(window.fetch.calledWithExactly('/__DELETE__/routeFragment1/routeFragment2', { method: 'delete' }), 'Invoking the delete() method on the ES6-Rest-Client instance causes the underlying GlobalFetch.fetch to be called with an accordingly set configuration object.');
            
            restClient.__PATCH__.routeFragment1.routeFragment2.patch();
            assert.ok(window.fetch.calledWithExactly('/__PATCH__/routeFragment1/routeFragment2', { method: 'patch' }), 'Invoking the patch() method on the ES6-Rest-Client instance causes the underlying GlobalFetch.fetch to be called with an accordingly set configuration object.');
                    
            restClient.__OPTIONS__.routeFragment1.routeFragment2.options();
            assert.ok(window.fetch.calledWithExactly('/__OPTIONS__/routeFragment1/routeFragment2', { method: 'options' }), 'Invoking the options() method on the ES6-Rest-Client instance causes the underlying GlobalFetch.fetch to be called with an accordingly set configuration object.');
            
        });
        
    });

});
 