/*
 * 有一个收集回调函数的对象
 * 提供三个基础方法：on（订阅）、 emit（发布）、 off（注销）
 */

// class Event {
// 	/*
// 	* on 方法把订阅者所想要订阅的事件及相应的回调函数记录在 Event 对象的 _cbs 属性中
// 	*/
// 	on (event, fn) {
// 		this._cbs = this._cbs || {};
// 		if(Object.prototype.toString.call(fn).slice(8,-1) !== 'Function') {
// 			console.error('fn must be Function');
// 			return;
// 		}
// 		(this._cbs[event] = this._cbs[event] || []).push(fn);
// 	}

// 	/*
// 	* emit 方法接受一个事件名称参数，在 Event 对象的 _cbs 属性中取出对应的数组，并逐个执行里面的回调函数
// 	*/
// 	emit (event) {
// 		this._cbs = this._cbs || {};
// 		var cb = this._cbs[event], args;
// 		if(cb) {
// 		/*
// 		* function t(x,y) {}    t('a','b','c')
// 		* arguments代表实参对象是一个类数组对象 {'0':'a', '1':'b', '2':'c'}
// 		* 扩展运算符（...）把类数组转化为真正的数组
// 		*/
// 			args = [...arguments];
// 			for (var i = 0, len = cb.length; i < len; i++) {

// 				* ES6的方法,将数组args做为函数cb[i]的参数调用

// 				cb[i](...args);
// 			}
// 		}
// 	}

// 	/*
// 	* off 方法接受事件名称和当初注册的回调函数作参数，在 Event 对象的 _cbs 属性中删除对应的回调函数。
// 	*/
// 	off (event, fn) {
// 		this._cbs = this._cbs || {};
// 		// all
// 		if(!arguments.length) {
// 			this._cbs = {};
// 			return;
// 		}

// 		var callbacks = this._cbs[event];
// 		if(!callbacks) return;

//  		// remove all handlers
//         if (arguments.length === 1) {
//             delete this._cbs[event];
//             return;
//         }

// 		// remove specific handler
//         var cb
//         for (var i = 0, len = callbacks.length; i < len; i++) {
//             cb = callbacks[i]
//             if (cb === fn || cb.fn === fn) {
//                 callbacks.splice(i, 1)
//                 break
//             }
//         }
//         return
// 	}
// }

class Event {
    on(event, fn, ctx) {
        if (typeof fn != "function") {
            console.error('fn must be a function')
            return
        }

        this._stores = this._stores || {};
        (this._stores[event] = this._stores[event] || []).push({
            cb: fn,
            ctx: ctx
        })
    }
    emit(event) {
        this._stores = this._stores || {}
        var store = this._stores[event],args
        if (store) {
            store = store.slice(0)
            args = [].slice.call(arguments, 1)
            for (var i = 0, len = store.length; i < len; i++) {
                store[i].cb.apply(store[i].ctx, args)
            }
        }
    }
    off(event, fn) {
        this._stores = this._stores || {}
            // all
        if (!arguments.length) {
            this._stores = {}
            return
        }
        // specific event
        var store = this._stores[event]
        if (!store) return
            // remove all handlers
        if (arguments.length === 1) {
            delete this._stores[event]
            return
        }
        // remove specific handler
        var cb
        for (var i = 0, len = store.length; i < len; i++) {
            cb = store[i].cb
            if (cb === fn) {
                store.splice(i, 1)
                break
            }
        }
        return
    }
}

exports.Event = Event;