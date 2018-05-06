/* @flow */

import { assert } from 'chai';
import { ZalgoPromise } from 'zalgo-promise/src';

import { testComponent, testComponentVue } from '../component';

describe('vue drivers', () => {

    it('should enter a component rendered with vue and call onEnter', done => {

        if (!document.body) {
            return done(new Error('Can not find document.body'));
        }

        let app = document.createElement('div');
        if (!document.body) {
            throw new Error(`Expected document.body to be present`);
        }
        document.body.appendChild(app);
        app.setAttribute('id', 'container');

        window.Vue.component('comp', {
            template:   `<vue-component :onEnter = "onEnter"></vue-component>`,
            components: {
                'vue-component': testComponent.driver('vue')
            },
            computed: {
                onEnter: () => {
                    return function onEnter() : ZalgoPromise<void> {
                        return this.close().then(done);
                    };
                }
            }
        });

        // eslint-disable-next-line no-unused-vars
        let vm = new window.Vue({
            el:       '#container',
            template: `<comp></comp>`
        });
    });


    it('should enter a component rendered with vue and call a prop', done => {

        if (!document.body) {
            return done(new Error('Can not find document.body'));
        }

        let app = document.createElement('div');
        if (!document.body) {
            throw new Error(`Expected document.body to be present`);
        }
        document.body.appendChild(app);
        app.setAttribute('id', 'container');

        window.Vue.component('comp', {
            template: `<vue-component :foo = "foo" :run = "this.run"></vue-component>`,
            data:     () => {
                return {
                    run: `window.xprops.foo('bar');`
                };
            },
            components: {
                'vue-component': testComponent.driver('vue')
            },
            computed: {
                foo: () => {
                    return function foo(bar) : ZalgoPromise<void> {
                        assert.equal(bar, 'bar');
                        return this.close().then(done);
                    };
                }
            }
        });

        // eslint-disable-next-line no-unused-vars
        let vm = new window.Vue({
            el:       '#container',
            template: `<comp></comp>`
        });
    });
});

describe('vue clients', () => {
    it('should not conflict with the Vue reactivity observer', done => {
        testComponentVue.renderIframe({
            onError:        done,
            objectProp:     { key: 'testval' },
            // This lookup causes a recursion loop as the xcomponent getter, which modifies state,
            // bounces off the Vue observer which calls the getter in response to state change
            run:            'console.log(this.objectProp.key)',
            childMounted:   () => done()
        }, document.body);
    });
});
