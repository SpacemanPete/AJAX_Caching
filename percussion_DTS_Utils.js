// ************************************************************************
//
//  Percussion DTS Utilities 
//  Written by Piotr Butkiewicz of Percussion Software
//
//  Function:
//    A collection of JavaScript utilities for working with   
//    Percussion DTS Metadata Service
//
//  Dependencies:
//    None.
//
// ************************************************************************

function percDTS(criteria, callback) {
    // POST request to Percussion DTS

}

// copied ajax caching script here from 
//      http://stackoverflow.com/questions/33717097/what-are-possible-techniques-to-cache-an-ajax-response-in-javascript
// for inspection, testing and modification later on:


/*----------------------------*/
/* set ajax caching variables */
/*----------------------------*/
$.set_Ajax_Cache_filters = function () {
    var localCache = {
        timeout: 600000, // 10 minutes
        data: {}, //@type {{_: number, data: {}}}
        remove: function (url) {
            delete localCache.data[url];
        },
        exist: function (url) {
            return !!localCache.data[url] && ((new Date().getTime() - localCache.data[url]._) < localCache.timeout);
        },
        get: function (url) {
            return localCache.data[url].data;
        },
        set: function (url, cachedData, callback) {
            localCache.remove(url);
            localCache.data[url] = {
                _: new Date().getTime(),
                data: cachedData
            };
            if ($.isFunction(callback))
                callback(cachedData);
        }
    };

    /*----------------------*/
    /* set ajax pre filters */
    /*----------------------*/
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        // list of allowed url to cache
        if (url !== '..............file.php') {
            return false;
        }
        if (options.cache) {
            var complete = originalOptions.complete || $.noop,
                    url = originalOptions.url;

            options.cache = false;//remove jQuery cache using proprietary one
            options.beforeSend = function () {
                if (localCache.exist(url)) {
                    complete(localCache.get(url));
                    return false;
                }
                return true;
            };
            options.complete = function (data, textStatus) {
                localCache.set(url, data, complete);
            };
        }
    });
};