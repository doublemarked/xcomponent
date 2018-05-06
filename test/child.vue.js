/* @flow */

import Vue from './lib/vue_v2.5.16.min';
import './component';

new Vue({
    render(createElement) : Element {
        return createElement('div');
    },
    propsData: window.xprops,
    props:
    {
        stringProp:    Boolean,
        objectProp:     Object,
        childMounted:   Function,
        run:            String
    },
    created() {
        if (this.run) {
            try {
                eval(`(function() { ${ this.run } }).call(this);`); // eslint-disable-line no-eval, security/detect-eval-with-expression
            } catch (err) {
                window.xchild.error(err);
            }
        }
    },
    mounted() {
        if (this.childMounted) {
            this.childMounted();
        }
    }
}).$mount('#app');
