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

$.createCache = function( requestFunction ) {
    return function( key, callback ) {
        if ( !lscache.get(key) ) {
            lscache.set(key, function(){
                return $.Deferred(function( defer ) {
                    requestFunction( defer, key );
                }).promise();
            });
        }
        return cache[ key ].done( callback );
    };
}