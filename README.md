#Perc_JS_Utils
Javascript utilities API.

##PercUtils.cachedAjaxPromise 
    Function to retieve data from a remote server via AJAX request and cache response for specified period of time.
    Works with JSON and XML data server responses. 

    PercUtils.cachedAjaxPromise(URL, ajaxOptions, TTL, storageType).then(successCallback, errorCallback);
    

###Options

####URL - Required
    Enter URL of destination for data retrieval.
    Type: String

####ajaxOptions - Optional
    Enter optional AJAX options.
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

####storageType
    Enter the type of storage to save data to.
    Type: String
    Example: 
        "localStorage"
        "sessionStorage"

###Usage

    PercUtils.cachedAjaxPromise(
        jQuery.getDeliveryServiceBase() + '/perc-metadata-services/metadata/get',
        {
            type: "POST",
            data: queryCriteria,
            contentType: 'application/json',
        },
        1, 
        "sessionStorage"
    ).then(successCallback, errorCallback);

