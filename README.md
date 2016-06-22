#AJAX_Caching
Javascript utilities API.

##AJAX_Caching.cachedAjaxPromise 
    Function to retieve data from a remote server via AJAX request and cache response for specified period of time.
    Works with JSON and XML data server responses. 

    AJAX_Caching.cachedAjaxPromise(URL, ajaxOptions, TTL, storageType, cacheKey).then(successCallback, errorCallback);
    

###Options

####URL - Required
    Enter URL of destination for data retrieval.
    Type: String

####ajaxOptions - Optional
    Enter optional AJAX options, enter 'false' if none.
    Type: Object {}
    Example: 
        {
            type: "POST",
            data: queryCriteria,
            contentType: 'application/json',
        }

####TTL - Required
    Enter a time-to-live for the cached data in minutes.
    Type: Number

####storageType - Required
    Enter the type of storage to save data to.
    Type: String
    Example: 
        "localStorage"
        "sessionStorage"

####cacheKey - Optional
    Enter an optional cacheKey. if non entered, function will use the URL as the cacheKey.
    Type: String

###Usage

    AJAX_Caching.cachedAjaxPromise(
        jQuery.getDeliveryServiceBase() + '/perc-metadata-services/metadata/get',
        {
            type: "POST",
            data: queryCriteria,
            contentType: 'application/json',
        },
        1, 
        "sessionStorage"
    ).then(successCallback, errorCallback);

