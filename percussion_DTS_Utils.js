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

var PercUtils = (function ($) {
    var oKeyDeferredMap = {};

    function readFromStorage(key) {
        var sValue = percStorage.load(key, "sessionStorage");
        return sValue;
    }

    function writeToStorage(key, DtsData, xhr, TTL) {
        var dataType = xhr.getResponseHeader("content-type");
        percStorage.save(key, DtsData, TTL, "sessionStorage", dataType);
        console.info('Storing AJAX Response data to local Cache');
    }
    
    var cachedAjaxPromise = function (url, ajaxOptions, TTL, storageType) {
        var oDeferred = oKeyDeferredMap[url];
        var cacheAvailable = storageAvailable(storageType);
        var sValue;

        if (!oDeferred) {
            oDeferred = new jQuery.Deferred();
            oKeyDeferredMap[url] = oDeferred;
            if (cacheAvailable){
                sValue = readFromStorage(url);
            }

            if (sValue) {
                console.info('Cached Data found for AJAX query: ');
                console.info(url);
                oDeferred.resolve(sValue);
            } else {
                if (!ajaxOptions) {
                    ajaxOptions = {};
                }

                $.extend(ajaxOptions, {
                    error: function (xhr, textStatus, errorThrown) {
                        console.error('customer info request failed: ' + errorThrown);
                        oDeferred.reject();
                    },
                    success: function (DtsData, status, xhr) {
                        console.info('AJAX query successful');
                        if(cacheAvailable){
                            writeToStorage(url, DtsData, xhr, TTL);
                        }
                        oDeferred.resolve(DtsData);
                    }
                });

                $.ajax(url, ajaxOptions);
            }
        }
        return oDeferred.promise();
    };

    var percStorage = {
        save : function(key, data, TTL, storageType, dataType){
            if (!(storageAvailable(storageType))){return false;}
            var TTL = TTL * 60 * 1000;
            if (dataType == "application/json"){
                data = JSON.stringify(data);
            } else if (dataType == "application/xml"){
                var oSerializer = new XMLSerializer();
                data = oSerializer.serializeToString(data);
            }
            var record = {value: data, timestamp: new Date().getTime() + TTL}
            window[storageType].setItem(key, JSON.stringify(record));
            return data;
        },
        load : function(key, storageType){
            if (!(storageAvailable(storageType))){return false;}
            var record = JSON.parse(window[storageType].getItem(key));
            if (!record){
                return false;
            }
            return (new Date().getTime() < record.timestamp && JSON.parse(record.value));
        }
    }
    // 
    // Function for testing the availability of browser storage.
    // 
    function storageAvailable(type) {
        try {
            var storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return false;
        }
    }

    return {
        cachedAjaxPromise: cachedAjaxPromise,
        percStorage: percStorage
    }

} (jQuery));