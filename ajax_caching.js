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

var AJAX_Caching = (function ($) {
    var oKeyDeferredMap = {};
    
    var cachedAjaxPromise = function (url, ajaxOptions, TTL, storageType, cacheKey) {
        var cacheKey;
        if (!(cacheKey)){
            cacheKey = url;
        }
        // convert TTL in Minutes to milliseconds
        var TTL = TTL * 60 * 1000;
        var oDeferred = oKeyDeferredMap[cacheKey];
        var cacheAvailable = storageAvailable(storageType);
        var sValue;

        if (!oDeferred) {
            oDeferred = new jQuery.Deferred();
            oKeyDeferredMap[cacheKey] = oDeferred;
            if (cacheAvailable){
                sValue = readFromStorage(cacheKey, TTL);
            }

            if (sValue) {
                console.info('Cached Data found for AJAX query: ');
                console.info(cacheKey);
                oDeferred.resolve(sValue);
            } else {
                if (!ajaxOptions) {
                    ajaxOptions = {};
                }

                $.extend(ajaxOptions, {
                    error: function (xhr, textStatus, errorThrown) {
                        console.error('customer info request failed: ' + errorThrown);
                        oDeferred.reject(xhr, textStatus, errorThrown);
                    },
                    success: function (response, status, xhr) {
                        var dataType = xhr.getResponseHeader("content-type");
                        console.info('AJAX query successful');
                        if(cacheAvailable){
                            writeToStorage(cacheKey, response, dataType, TTL);
                        }
                        oDeferred.resolve(response);
                    }
                });

                $.ajax(url, ajaxOptions);
            }
        } else {
            console.info('Cached Data found in Deferred Object for AJAX query: ');
            console.info(cacheKey);
        }
        return oDeferred.promise();
    };
    
    function readFromStorage(cacheKey, TTL) {
        var sValue = percStorage.load(cacheKey, "sessionStorage", TTL);
        return sValue;
    }

    function writeToStorage(cacheKey, response, dataType, TTL) {
        percStorage.save(cacheKey, response, TTL, "sessionStorage", dataType);
        console.info('Storing AJAX Response data to local Cache');
    }

    var percStorage = {
        save : function(cacheKey, data, TTL, storageType, dataType){
            if (!(storageAvailable(storageType))){return false;}
            if (dataType == "application/json"){
                data = JSON.stringify(data);
            } else if (dataType == "application/xml"){
                var oSerializer = new XMLSerializer();
                data = oSerializer.serializeToString(data);
            }
            var record = {timestamp: (new Date().getTime() + TTL), dataType: dataType, value: data}
            window[storageType].setItem(cacheKey, JSON.stringify(record));
            return data;
        },
        load : function(cacheKey, storageType, TTL){
            if (!(storageAvailable(storageType))){return false;}
            var record = JSON.parse(window[storageType].getItem(cacheKey));
            if (!record){
                return false;
            }
            // check TTL and if expired, remove stored item from storage
            if (new Date().getTime() - TTL > record.timestamp){
                window[storageType].removeItem(cacheKey);
                return false;
            }
            var dataType = record.dataType;
            if (dataType == "application/json"){
                return (new Date().getTime() < record.timestamp && JSON.parse(record.value));
            } else if (dataType == "application/xml"){
                var oParser = new DOMParser();
                var XMLResponse = oParser.parseFromString(record.value, "text/xml");
                return (new Date().getTime() < record.timestamp && XMLResponse);
            }
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