/*!
 * jQuery JavaScript Library v1.6.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Jun 30 14:16:56 2011 -0400
 */

(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z])/ig,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.6.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.done( fn );

		return this;
	},

	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).unbind( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery._Deferred();

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNaN: function( obj ) {
		return obj == null || !rdigit.test( obj ) || isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw msg;
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return (new Function( "return " + data ))();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	// (xml & tmp used internally)
	parseXML: function( data , xml , tmp ) {

		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}

		tmp = xml.documentElement;

		if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
			jQuery.error( "Invalid XML: " + data );
		}

		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Converts a dashed string to camelCased string;
	// Used by both the css and data modules
	camelCase: function( string ) {
		return string.replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {

		if ( indexOf ) {
			return indexOf.call( array, elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return (new Date()).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


var // Promise methods
	promiseMethods = "done fail isResolved isRejected promise then always pipe".split( " " ),
	// Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({
	// Create a simple deferred (one callbacks list)
	_Deferred: function() {
		var // callbacks list
			callbacks = [],
			// stored [ context , args ]
			fired,
			// to avoid firing when already doing so
			firing,
			// flag to know if the deferred has been cancelled
			cancelled,
			// the deferred itself
			deferred  = {

				// done( f1, f2, ...)
				done: function() {
					if ( !cancelled ) {
						var args = arguments,
							i,
							length,
							elem,
							type,
							_fired;
						if ( fired ) {
							_fired = fired;
							fired = 0;
						}
						for ( i = 0, length = args.length; i < length; i++ ) {
							elem = args[ i ];
							type = jQuery.type( elem );
							if ( type === "array" ) {
								deferred.done.apply( deferred, elem );
							} else if ( type === "function" ) {
								callbacks.push( elem );
							}
						}
						if ( _fired ) {
							deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
						}
					}
					return this;
				},

				// resolve with given context and args
				resolveWith: function( context, args ) {
					if ( !cancelled && !fired && !firing ) {
						// make sure args are available (#8421)
						args = args || [];
						firing = 1;
						try {
							while( callbacks[ 0 ] ) {
								callbacks.shift().apply( context, args );
							}
						}
						finally {
							fired = [ context, args ];
							firing = 0;
						}
					}
					return this;
				},

				// resolve with this as context and given arguments
				resolve: function() {
					deferred.resolveWith( this, arguments );
					return this;
				},

				// Has this deferred been resolved?
				isResolved: function() {
					return !!( firing || fired );
				},

				// Cancel
				cancel: function() {
					cancelled = 1;
					callbacks = [];
					return this;
				}
			};

		return deferred;
	},

	// Full fledged deferred (two callbacks list)
	Deferred: function( func ) {
		var deferred = jQuery._Deferred(),
			failDeferred = jQuery._Deferred(),
			promise;
		// Add errorDeferred methods, then and promise
		jQuery.extend( deferred, {
			then: function( doneCallbacks, failCallbacks ) {
				deferred.done( doneCallbacks ).fail( failCallbacks );
				return this;
			},
			always: function() {
				return deferred.done.apply( deferred, arguments ).fail.apply( this, arguments );
			},
			fail: failDeferred.done,
			rejectWith: failDeferred.resolveWith,
			reject: failDeferred.resolve,
			isRejected: failDeferred.isResolved,
			pipe: function( fnDone, fnFail ) {
				return jQuery.Deferred(function( newDefer ) {
					jQuery.each( {
						done: [ fnDone, "resolve" ],
						fail: [ fnFail, "reject" ]
					}, function( handler, data ) {
						var fn = data[ 0 ],
							action = data[ 1 ],
							returned;
						if ( jQuery.isFunction( fn ) ) {
							deferred[ handler ](function() {
								returned = fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise().then( newDefer.resolve, newDefer.reject );
								} else {
									newDefer[ action ]( returned );
								}
							});
						} else {
							deferred[ handler ]( newDefer[ action ] );
						}
					});
				}).promise();
			},
			// Get a promise for this deferred
			// If obj is provided, the promise aspect is added to the object
			promise: function( obj ) {
				if ( obj == null ) {
					if ( promise ) {
						return promise;
					}
					promise = obj = {};
				}
				var i = promiseMethods.length;
				while( i-- ) {
					obj[ promiseMethods[i] ] = deferred[ promiseMethods[i] ];
				}
				return obj;
			}
		});
		// Make sure only one callback list will be used
		deferred.done( failDeferred.cancel ).fail( deferred.cancel );
		// Unexpose cancel
		delete deferred.cancel;
		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = arguments,
			i = 0,
			length = args.length,
			count = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					// Strange bug in FF4:
					// Values changed onto the arguments object sometimes end up as undefined values
					// outside the $.when method. Cloning the object into a fresh array solves the issue
					deferred.resolveWith( deferred, sliceDeferred.call( args, 0 ) );
				}
			};
		}
		if ( length > 1 ) {
			for( ; i < length; i++ ) {
				if ( args[ i ] && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return deferred.promise();
	}
});



jQuery.support = (function() {

	var div = document.createElement( "div" ),
		documentElement = document.documentElement,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		support,
		fragment,
		body,
		testElementParent,
		testElement,
		testElementStyle,
		tds,
		events,
		eventName,
		i,
		isSupported;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName( "tbody" ).length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName( "link" ).length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute( "href" ) === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains it's value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	div.innerHTML = "";

	// Figure out if the W3C box model works as expected
	div.style.width = div.style.paddingLeft = "1px";

	body = document.getElementsByTagName( "body" )[ 0 ];
	// We use our own, invisible, body unless the body is already present
	// in which case we use a div (#9239)
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0
	};
	if ( body ) {
		jQuery.extend( testElementStyle, {
			position: "absolute",
			left: -1000,
			top: -1000
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	support.boxModel = div.offsetWidth === 2;

	if ( "zoom" in div.style ) {
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		// (IE < 8 does this)
		div.style.display = "inline";
		div.style.zoom = 1;
		support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

		// Check if elements with layout shrink-wrap their children
		// (IE 6 does this)
		div.style.display = "";
		div.innerHTML = "<div style='width:4px;'></div>";
		support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
	}

	div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
	tds = div.getElementsByTagName( "td" );

	// Check if table cells still have offsetWidth/Height when they are set
	// to display:none and there are still other visible table cells in a
	// table row; if so, offsetWidth/Height are not reliable for use when
	// determining if an element has been hidden directly using
	// display:none (it is still safe to use offsets if a parent element is
	// hidden; don safety goggles and see bug #4512 for more information).
	// (only IE 8 fails this test)
	isSupported = ( tds[ 0 ].offsetHeight === 0 );

	tds[ 0 ].style.display = "";
	tds[ 1 ].style.display = "none";

	// Check if empty table cells still have offsetWidth/Height
	// (IE < 8 fail this test)
	support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( document.defaultView && document.defaultView.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( document.defaultView.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Remove the body element we added
	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		} ) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Null connected elements to avoid leaks in IE
	testElement = fragment = select = opt = body = marginDiv = div = input = null;

	return support;
})();

// Keep track of boxModel
jQuery.boxModel = jQuery.support.boxModel;




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([a-z])([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];

		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, getByName = typeof name === "string", thisCache,

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || (pvt && id && !cache[ id ][ internalKey ])) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ jQuery.expando ] = id = ++jQuery.uuid;
			} else {
				id = jQuery.expando;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ][ internalKey ] = jQuery.extend(cache[ id ][ internalKey ], name);
			} else {
				cache[ id ] = jQuery.extend(cache[ id ], name);
			}
		}

		thisCache = cache[ id ];

		// Internal jQuery data is stored in a separate object inside the object's data
		// cache in order to avoid key collisions between internal data and user-defined
		// data
		if ( pvt ) {
			if ( !thisCache[ internalKey ] ) {
				thisCache[ internalKey ] = {};
			}

			thisCache = thisCache[ internalKey ];
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
		// not attempt to inspect the internal events object using jQuery.data, as this
		// internal data object is undocumented and subject to change.
		if ( name === "events" && !thisCache[name] ) {
			return thisCache[ internalKey ] && thisCache[ internalKey ].events;
		}

		return getByName ? 
			// Check for both converted-to-camel and non-converted data property names
			thisCache[ jQuery.camelCase( name ) ] || thisCache[ name ] :
			thisCache;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {
			var thisCache = pvt ? cache[ id ][ internalKey ] : cache[ id ];

			if ( thisCache ) {
				delete thisCache[ name ];

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !isEmptyDataObject(thisCache) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( pvt ) {
			delete cache[ id ][ internalKey ];

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		var internalCache = cache[ id ][ internalKey ];

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		if ( jQuery.support.deleteExpando || cache != window ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the entire user cache at once because it's faster than
		// iterating through each key, but we need to continue to persist internal
		// data if it existed
		if ( internalCache ) {
			cache[ id ] = {};
			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}

			cache[ id ][ internalKey ] = internalCache;

		// Otherwise, we need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		} else if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			} else {
				elem[ jQuery.expando ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 ) {
			    var attr = this[0].attributes, name;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		var name = "data-" + key.replace( rmultiDash, "$1-$2" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				!jQuery.isNaN( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// TODO: This is a hack for 1.5 ONLY to allow objects with a single toJSON
// property to be considered empty objects; this property always exists in
// order to make sure JSON.stringify does not expose internal metadata
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery.data( elem, deferDataKey, undefined, true );
	if ( defer &&
		( src === "queue" || !jQuery.data( elem, queueDataKey, undefined, true ) ) &&
		( src === "mark" || !jQuery.data( elem, markDataKey, undefined, true ) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery.data( elem, queueDataKey, undefined, true ) &&
				!jQuery.data( elem, markDataKey, undefined, true ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.resolve();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = (type || "fx") + "mark";
			jQuery.data( elem, type, (jQuery.data(elem,type,undefined,true) || 0) + 1, true );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery.data( elem, key, undefined, true) || 1 ) - 1 );
			if ( count ) {
				jQuery.data( elem, key, count, true );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		if ( elem ) {
			type = (type || "fx") + "queue";
			var q = jQuery.data( elem, type, undefined, true );
			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery.data( elem, type, jQuery.makeArray(data), true );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			defer;

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery._Deferred(), true ) )) {
				count++;
				tmp.done( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	rinvalidChar = /\:|^on/,
	formHook, boolHook;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},
	
	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},
	
	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = (value || "").split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret,
			elem = this[0];
		
		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ? 
					// handle most common string cases
					ret.replace(rreturn, "") : 
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return undefined;
		}

		var isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
					var option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},
	
	attrFix: {
		// Always normalize to ensure hook usage
		tabindex: "tabIndex"
	},
	
	attr: function( elem, name, value, pass ) {
		var nType = elem.nodeType;
		
		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( !("getAttribute" in elem) ) {
			return jQuery.prop( elem, name, value );
		}

		var ret, hooks,
			notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// Normalize the name if needed
		if ( notxml ) {
			name = jQuery.attrFix[ name ] || name;

			hooks = jQuery.attrHooks[ name ];

			if ( !hooks ) {
				// Use boolHook for boolean attributes
				if ( rboolean.test( name ) ) {

					hooks = boolHook;

				// Use formHook for forms and if the name contains certain characters
				} else if ( formHook && name !== "className" &&
					(jQuery.nodeName( elem, "form" ) || rinvalidChar.test( name )) ) {

					hooks = formHook;
				}
			}
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return undefined;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, name ) {
		var propName;
		if ( elem.nodeType === 1 ) {
			name = jQuery.attrFix[ name ] || name;
		
			if ( jQuery.support.getSetAttribute ) {
				// Use removeAttribute in browsers that support it
				elem.removeAttribute( name );
			} else {
				jQuery.attr( elem, name, "" );
				elem.removeAttributeNode( elem.getAttributeNode( name ) );
			}

			// Set corresponding property to false for boolean attributes
			if ( rboolean.test( name ) && (propName = jQuery.propFix[ name ] || name) in elem ) {
				elem[ propName ] = false;
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabIndex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		},
		// Use the value property for back compat
		// Use the formHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( formHook && jQuery.nodeName( elem, "button" ) ) {
					return formHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( formHook && jQuery.nodeName( elem, "button" ) ) {
					return formHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},
	
	prop: function( elem, name, value ) {
		var nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return undefined;
		}

		var ret, hooks,
			notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return (elem[ name ] = value);
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== undefined ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},
	
	propHooks: {}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		return jQuery.prop( elem, name ) ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !jQuery.support.getSetAttribute ) {

	// propFix is more comprehensive and contains all fixes
	jQuery.attrFix = jQuery.propFix;
	
	// Use this for any attribute on a form in IE6/7
	formHook = jQuery.attrHooks.name = jQuery.attrHooks.title = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			// Return undefined if nodeValue is empty string
			return ret && ret.nodeValue !== "" ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Check form objects in IE (multiple bugs related)
			// Only use nodeValue if the attribute node exists on the form
			var ret = elem.getAttributeNode( name );
			if ( ret ) {
				ret.nodeValue = value;
				return value;
			}
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return (elem.style.cssText = "" + value);
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	});
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return (elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0);
			}
		}
	});
});




var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspaces = / /g,
	rescape = /[^\w\s.|`]/g,
	fcleanup = function( nm ) {
		return nm.replace(rescape, "\\$&");
	};

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		} else if ( !handler ) {
			// Fixes bug #7229. Fix recommended by jdalton
			return;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery._data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData.events,
			eventHandle = elemData.handle;

		if ( !events ) {
			elemData.events = events = {};
		}

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			if ( !handleObj.guid ) {
				handleObj.guid = handler.guid;
			}

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		}

		var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			events = elemData && elemData.events;

		if ( !elemData || !events ) {
			return;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" +
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem, undefined, true );
			}
		}
	},
	
	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			exclusive;

		if ( type.indexOf("!") >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.exclusive = exclusive;
		event.namespace = namespaces.join(".");
		event.namespace_re = new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)");
		
		// triggerHandler() and global events don't bubble or run the default action
		if ( onlyHandlers || !elem ) {
			event.preventDefault();
			event.stopPropagation();
		}

		// Handle a global trigger
		if ( !elem ) {
			// TODO: Stop taunting the data cache; remove global events and always attach to document
			jQuery.each( jQuery.cache, function() {
				// internalKey variable is just used to make it easier to find
				// and potentially change this stuff later; currently it just
				// points to jQuery.expando
				var internalKey = jQuery.expando,
					internalCache = this[ internalKey ];
				if ( internalCache && internalCache.events && internalCache.events[ type ] ) {
					jQuery.event.trigger( event, data, internalCache.handle.elem );
				}
			});
			return;
		}

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		event.target = elem;

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		var cur = elem,
			// IE doesn't like method names with a colon (#3533, #8272)
			ontype = type.indexOf(":") < 0 ? "on" + type : "";

		// Fire event on the current element, then bubble up the DOM tree
		do {
			var handle = jQuery._data( cur, "handle" );

			event.currentTarget = cur;
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Trigger an inline bound script
			if ( ontype && jQuery.acceptData( cur ) && cur[ ontype ] && cur[ ontype ].apply( cur, data ) === false ) {
				event.result = false;
				event.preventDefault();
			}

			// Bubble up to document, then to window
			cur = cur.parentNode || cur.ownerDocument || cur === event.target.ownerDocument && window;
		} while ( cur && !event.isPropagationStopped() );

		// If nobody prevented the default action, do it now
		if ( !event.isDefaultPrevented() ) {
			var old,
				special = jQuery.event.special[ type ] || {};

			if ( (!special._default || special._default.call( elem.ownerDocument, event ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction)() check here because IE6/7 fails that test.
				// IE<9 dies on focus to hidden element (#1486), may want to revisit a try/catch.
				try {
					if ( ontype && elem[ type ] ) {
						// Don't re-trigger an onFOO event when we call its FOO() method
						old = elem[ ontype ];

						if ( old ) {
							elem[ ontype ] = null;
						}

						jQuery.event.triggered = type;
						elem[ type ]();
					}
				} catch ( ieError ) {}

				if ( old ) {
					elem[ ontype ] = old;
				}

				jQuery.event.triggered = undefined;
			}
		}
		
		return event.result;
	},

	handle: function( event ) {
		event = jQuery.event.fix( event || window.event );
		// Snapshot the handlers list since a called handler may add/remove events.
		var handlers = ((jQuery._data( this, "events" ) || {})[ event.type ] || []).slice(0),
			run_all = !event.exclusive && !event.namespace,
			args = Array.prototype.slice.call( arguments, 0 );

		// Use the fix-ed Event rather than the (read-only) native event
		args[0] = event;
		event.currentTarget = this;

		for ( var j = 0, l = handlers.length; j < l; j++ ) {
			var handleObj = handlers[ j ];

			// Triggered event must 1) be non-exclusive and have no namespace, or
			// 2) have namespace(s) a subset or equal to those in the bound event.
			if ( run_all || event.namespace_re.test( handleObj.namespace ) ) {
				// Pass in a reference to the handler function itself
				// So that we can later remove it
				event.handler = handleObj.handler;
				event.data = handleObj.data;
				event.handleObj = handleObj;

				var ret = handleObj.handler.apply( this, args );

				if ( ret !== undefined ) {
					event.result = ret;
					if ( ret === false ) {
						event.preventDefault();
						event.stopPropagation();
					}
				}

				if ( event.isImmediatePropagationStopped() ) {
					break;
				}
			}
		}
		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			// Fixes #1925 where srcElement might not be defined either
			event.target = event.srcElement || document;
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var eventDocument = event.target.ownerDocument || document,
				doc = eventDocument.documentElement,
				body = eventDocument.body;

			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
			event.which = event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this,
					liveConvert( handleObj.origType, handleObj.selector ),
					jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) );
			},

			remove: function( handleObj ) {
				jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
			}
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {

	// Check if mouse(over|out) are still within the same parent element
	var related = event.relatedTarget,
		inside = false,
		eventType = event.type;

	event.type = event.data;

	if ( related !== this ) {

		if ( related ) {
			inside = jQuery.contains( this, related );
		}

		if ( !inside ) {

			jQuery.event.handle.apply( this, arguments );

			event.type = eventType;
		}
	}
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( !jQuery.nodeName( this, "form" ) ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						trigger( "submit", this, arguments );
					}
				});

				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( jQuery.nodeName( elem, "select" ) ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery._data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery._data( elem, "_change_data", val );
		}

		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			e.liveFired = undefined;
			jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange,

			beforedeactivate: testChange,

			click: function( e ) {
				var elem = e.target, type = jQuery.nodeName( elem, "input" ) ? elem.type : "";

				if ( type === "radio" || type === "checkbox" || jQuery.nodeName( elem, "select" ) ) {
					testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = jQuery.nodeName( elem, "input" ) ? elem.type : "";

				if ( (e.keyCode === 13 && !jQuery.nodeName( elem, "textarea" ) ) ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery._data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return rformElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return rformElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;

	// Handle when the input is .focus()'d
	changeFilters.focus = changeFilters.beforeactivate;
}

function trigger( type, elem, args ) {
	// Piggyback on a donor event to simulate a different one.
	// Fake originalEvent to avoid donor's stopPropagation, but if the
	// simulated event prevents default then we do the same on the donor.
	// Don't pass args or remember liveFired; they apply to the donor event.
	var event = jQuery.extend( {}, args[ 0 ] );
	event.type = type;
	event.originalEvent = {};
	event.liveFired = undefined;
	jQuery.event.handle.call( elem, event );
	if ( event.isDefaultPrevented() ) {
		args[ 0 ].preventDefault();
	}
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0;

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};

		function handler( donor ) {
			// Donor event is always a native one; fix it and switch its type.
			// Let focusin/out handler cancel the donor focus/blur event.
			var e = jQuery.event.fix( donor );
			e.type = fix;
			e.originalEvent = {};
			jQuery.event.trigger( e, null, e.target );
			if ( e.isDefaultPrevented() ) {
				donor.preventDefault();
			}
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		var handler;

		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}

		if ( arguments.length === 2 || data === false ) {
			fn = data;
			data = undefined;
		}

		if ( name === "one" ) {
			handler = function( event ) {
				jQuery( this ).unbind( event, handler );
				return fn.apply( this, arguments );
			};
			handler.guid = fn.guid || jQuery.guid++;
		} else {
			handler = fn;
		}

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},

	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
			return this.unbind( "live" );

		} else {
			return this.die( types, null, fn, selector );
		}
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );

		if ( typeof types === "object" && !types.preventDefault ) {
			for ( var key in types ) {
				context[ name ]( key, data, types[key], selector );
			}

			return this;
		}

		if ( name === "die" && !types &&
					origSelector && origSelector.charAt(0) === "." ) {

			context.unbind( origSelector );

			return this;
		}

		if ( data === false || jQuery.isFunction( data ) ) {
			fn = data || returnFalse;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( liveMap[ type ] ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				for ( var j = 0, l = context.length; j < l; j++ ) {
					jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				}

			} else {
				// unbind live handler
				context.unbind( "live." + liveConvert( type, selector ), fn );
			}
		}

		return this;
	};
});

function liveHandler( event ) {
	var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = [],
		selectors = [],
		events = jQuery._data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
	if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
		return;
	}

	if ( event.namespace ) {
		namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		close = match[i];

		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) && !close.elem.disabled ) {
				elem = close.elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					event.type = handleObj.preType;
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];

					// Make sure not to accidentally match a child element with the same selector
					if ( related && jQuery.contains( elem, related ) ) {
						related = elem;
					}
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj, level: close.level });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];

		if ( maxLevel && match.level > maxLevel ) {
			break;
		}

		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		ret = match.handleObj.origHandler.apply( match.elem, arguments );

		if ( ret === false || event.isPropagationStopped() ) {
			maxLevel = match.level;

			if ( ret === false ) {
				stop = false;
			}
			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspaces, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.bind( name, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					var first = match[2],
						last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && ( typeof selector === "string" ?
			jQuery.filter( selector, this ).length > 0 :
			this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];
		
		// Array
		if ( jQuery.isArray( selectors ) ) {
			var match, selector,
				matches = {},
				level = 1;

			if ( cur && selectors.length ) {
				for ( i = 0, l = selectors.length; i < l; i++ ) {
					selector = selectors[i];

					if ( !matches[ selector ] ) {
						matches[ selector ] = POS.test( selector ) ?
							jQuery( selector, context || this.context ) :
							selector;
					}
				}

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( selector in matches ) {
						match = matches[ selector ];

						if ( match.jquery ? match.index( cur ) > -1 : jQuery( cur ).is( match ) ) {
							ret.push({ selector: selector, elem: cur, level: level });
						}
					}

					cur = cur.parentNode;
					level++;
				}
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		if ( !elem || typeof elem === "string" ) {
			return jQuery.inArray( this[0],
				// If it receives a string, the selector is used
				// If it receives nothing, the siblings are used
				elem ? jQuery( elem ) : this.parent().children() );
		}
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until ),
			// The variable 'args' was introduced in
			// https://github.com/jquery/jquery/commit/52a0238
			// to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
			// http://code.google.com/p/v8/issues/detail?id=1050
			args = slice.call(arguments);

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, args.join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
}




var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<(?:script|object|embed|option|style)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnocache.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || (l > 1 && i < lastIndex) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var internalKey = jQuery.expando,
		oldData = jQuery.data( src ),
		curData = jQuery.data( dest, oldData );

	// Switch to use the internal data object, if it exists, for the next
	// stage of data copying
	if ( (oldData = oldData[ internalKey ]) ) {
		var events = oldData.events;
				curData = curData[ internalKey ] = jQuery.extend({}, oldData);

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( var type in events ) {
				for ( var i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
				}
			}
		}
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc;

  // nodes may contain either an explicit document object,
  // a jQuery collection or context object.
  // If nodes[0] contains a valid object to assign to doc
  if ( nodes && nodes[0] ) {
    doc = nodes[0].ownerDocument || nodes[0];
  }

  // Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		args[0].charAt(0) === "<" && !rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = (i > 0 ? this.clone(true) : this).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( "getElementsByTagName" in elem ) {
		return elem.getElementsByTagName( "*" );

	} else if ( "querySelectorAll" in elem ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	if ( jQuery.nodeName( elem, "input" ) ) {
		fixDefaultChecked( elem );
	} else if ( "getElementsByTagName" in elem ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var clone = elem.cloneNode(true),
				srcElements,
				destElements,
				i;

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName
			// instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				cloneFixAttributes( srcElements[i], destElements[i] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id, cache = jQuery.cache, internalKey = jQuery.expando, special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ] && cache[ id ][ internalKey ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}



var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^[+\-]=/,
	rrelNumFilter = /[^+\-\.\de]+/g,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Make sure that NaN and null values aren't set. See: #7116
			if ( type === "number" && isNaN( value ) || value == null ) {
				return;
			}

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && rrelNum.test( value ) ) {
				value = +value.replace( rrelNumFilter, "" ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWH( elem, name, extra );
				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val;
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat( value );

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle;

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// Set the alpha filter to set the opacity
			var opacity = jQuery.isNaN( value ) ?
				"" :
				"alpha(opacity=" + value * 100 + ")",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( !(defaultView = elem.ownerDocument.defaultView) ) {
			return undefined;
		}

		if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			rsLeft = elem.runtimeStyle && elem.runtimeStyle[ name ],
			style = elem.style;

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
			// Remember the original values
			left = style.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : (ret || 0);
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		which = name === "width" ? cssWidth : cssHeight;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			jQuery.each( which, function() {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
				}
			});
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ] || 0;
	}
	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		jQuery.each( which, function() {
			val += parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
			}
		});
	}

	return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts;

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for(; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for(; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.bind( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function ( target, settings ) {
		if ( !settings ) {
			// Only one parameter, we extend ajaxSettings
			settings = target;
			target = jQuery.extend( true, jQuery.ajaxSettings, settings );
		} else {
			// target was provided, we extend into it
			jQuery.extend( true, target, jQuery.ajaxSettings, settings );
		}
		// Flatten fields we don't want deep extended
		for( var field in { context: 1, url: 1 } ) {
			if ( field in settings ) {
				target[ field ] = settings[ field ];
			} else if( field in jQuery.ajaxSettings ) {
				target[ field ] = jQuery.ajaxSettings[ field ];
			}
		}
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": "*/*"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery._Deferred(),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, statusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status ? 4 : 0;

			var isSuccess,
				success,
				error,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = statusText;

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.resolveWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.done;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( (ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", */*; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( status < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					jQuery.error( e );
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for( key in s.converters ) {
				if( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow,
	requestAnimationFrame = window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[i];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css( elem, "display" ) === "none" ) {
						jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[i];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data(elem, "olddisplay") || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				if ( this[i].style ) {
					var display = jQuery.css( this[i], "display" );

					if ( display !== "none" && !jQuery._data( this[i], "olddisplay" ) ) {
						jQuery._data( this[i], "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		return this[ optall.queue === false ? "each" : "queue" ](function() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p,
				display, e,
				parts, start, end, unit;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height
					// animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {
						if ( !jQuery.support.inlineBlockNeedsLayout ) {
							this.style.display = "inline-block";

						} else {
							display = defaultDisplay( this.nodeName );

							// inline-level elements accept inline-block;
							// block-level elements need to be inline with layout
							if ( display === "inline" ) {
								this.style.display = "inline-block";

							} else {
								this.style.display = "inline";
								this.style.zoom = 1;
							}
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test(val) ) {
					e[ val === "toggle" ? hidden ? "show" : "hide" : val ]();

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ((end || 1) / e.cur()) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		});
	},

	stop: function( clearQueue, gotoEnd ) {
		if ( clearQueue ) {
			this.queue([]);
		}

		this.each(function() {
			var timers = jQuery.timers,
				i = timers.length;
			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}
			while ( i-- ) {
				if ( timers[i].elem === this ) {
					if (gotoEnd) {
						// force the next step to be the last
						timers[i](true);
					}

					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if ( !gotoEnd ) {
			this.dequeue();
		}

		return this;
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue !== false ) {
				jQuery.dequeue( this );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx,
			raf;

		this.startTime = fxNow || createFxNow();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );
		this.now = this.start;
		this.pos = this.state = 0;

		function t( gotoEnd ) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			// Use requestAnimationFrame instead of setInterval if available
			if ( requestAnimationFrame ) {
				timerId = true;
				raf = function() {
					// When timerId gets set to null at any point, this stops
					if ( timerId ) {
						requestAnimationFrame( raf );
						fx.tick();
					}
				};
				requestAnimationFrame( raf );
			} else {
				timerId = setInterval( fx.tick, fx.interval );
			}
		}
	},

	// Simple 'show' function
	show: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options,
			i, n;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( i in options.animatedProperties ) {
				if ( options.animatedProperties[i] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function (index, value) {
						elem.style[ "overflow" + value ] = options.overflow[index];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery(elem).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( var p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[p] );
					}
				}

				// Execute the complete function
				options.complete.call( elem );
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[ this.prop ] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ((this.end - this.start) * this.pos);
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		for ( var timers = jQuery.timers, i = 0 ; i < timers.length ; ++i ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );

		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );

			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.css(body, "marginTop") ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed";
		checkDiv.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden";
		innerDiv.style.position = "relative";

		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		jQuery.offset.initialize = jQuery.noop;
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if (options.top != null) {
			props.top = (options.top - curOffset.top) + curTop;
		}
		if (options.left != null) {
			props.left = (options.left - curOffset.left) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem && elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem && elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ];
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				elem.document.body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNaN( ret ) ? orig : ret;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});


// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;
})(window);
/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.6.0 or later.
 * https://github.com/rails/jquery-ujs

 * Uploading file using rails.js
 * =============================
 *
 * By default, browsers do not allow files to be uploaded via AJAX. As a result, if there are any non-blank file fields
 * in the remote form, this adapter aborts the AJAX submission and allows the form to submit through standard means.
 *
 * The `ajax:aborted:file` event allows you to bind your own handler to process the form submission however you wish.
 *
 * Ex:
 *     $('form').live('ajax:aborted:file', function(event, elements){
 *       // Implement own remote file-transfer handler here for non-blank file inputs passed in `elements`.
 *       // Returning false in this handler tells rails.js to disallow standard form submission
 *       return false;
 *     });
 *
 * The `ajax:aborted:file` event is fired when a file-type input is detected with a non-blank value.
 *
 * Third-party tools can use this hook to detect when an AJAX file upload is attempted, and then use
 * techniques like the iframe method to upload the file instead.
 *
 * Required fields in rails.js
 * ===========================
 *
 * If any blank required inputs (required="required") are detected in the remote form, the whole form submission
 * is canceled. Note that this is unlike file inputs, which still allow standard (non-AJAX) form submission.
 *
 * The `ajax:aborted:required` event allows you to bind your own handler to inform the user of blank required inputs.
 *
 * !! Note that Opera does not fire the form's submit event if there are blank required inputs, so this event may never
 *    get fired in Opera. This event is what causes other browsers to exhibit the same submit-aborting behavior.
 *
 * Ex:
 *     $('form').live('ajax:aborted:required', function(event, elements){
 *       // Returning false in this handler tells rails.js to submit the form anyway.
 *       // The blank required inputs are passed to this function in `elements`.
 *       return ! confirm("Would you like to submit the form with missing info?");
 *     });
 */


(function($, undefined) {
  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]',

		// Select elements bound by jquery-ujs
		selectChangeSelector: 'select[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input:file',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data,
        crossDomain = element.data('cross-domain') || null,
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

      if (rails.fire(element, 'ajax:before')) {

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is('select')) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params'); 
        } else {
           method = element.data('method');
           url = element.attr('href');
           data = element.data('params') || null; 
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType, crossDomain: crossDomain,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          }
        };
        // Do not pass url to `ajax` options if blank
        if (url) { $.extend(options, { url: url }); }

        rails.ajax(options);
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = link.attr('href'),
        method = link.data('method'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Adds disabled=disabled attribute
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.attr('disabled', 'disabled');
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Removes disabled attribute
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.removeAttr('disabled');
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input,
        selector = specifiedSelector || 'input,textarea';
      form.find(selector).each(function() {
        input = $(this);
        // Collect non-blank inputs if nonBlank option is true, otherwise, collect blank inputs
        if (nonBlank ? input.val() : !input.val()) {
          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(obj.data);
        });
      }
      return continuePropagation;
    }
  };

  $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

  $(rails.linkClickSelector).live('click.rails', function(e) {
    var link = $(this);
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    if (link.data('remote') !== undefined) {
      rails.handleRemote(link);
      return false;
    } else if (link.data('method')) {
      rails.handleMethod(link);
      return false;
    }
  });

	$(rails.selectChangeSelector).live('change.rails', function(e) {
    var link = $(this);
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    rails.handleRemote(link);
    return false;
  });	

  $(rails.formSubmitSelector).live('submit.rails', function(e) {
    var form = $(this),
      remote = form.data('remote') !== undefined,
      blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
      nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

    if (!rails.allowAction(form)) return rails.stopEverything(e);

    // skip other logic when required values are missing or file upload is present
    if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
      return rails.stopEverything(e);
    }

    if (remote) {
      if (nonBlankFileInputs) {
        return rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);
      }

      // If browser does not support submit bubbling, then this live-binding will be called before direct
      // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
      if (!$.support.submitBubbles && rails.callFormSubmitBindings(form) === false) return rails.stopEverything(e);

      rails.handleRemote(form);
      return false;
    } else {
      // slight timeout so that the submit button gets properly serialized
      setTimeout(function(){ rails.disableFormElements(form); }, 13);
    }
  });

  $(rails.formInputClickSelector).live('click.rails', function(event) {
    var button = $(this);

    if (!rails.allowAction(button)) return rails.stopEverything(event);

    // register the pressed submit button
    var name = button.attr('name'),
      data = name ? {name:name, value:button.val()} : null;

    button.closest('form').data('ujs:submit-button', data);
  });

  $(rails.formSubmitSelector).live('ajax:beforeSend.rails', function(event) {
    if (this == event.target) rails.disableFormElements($(this));
  });

  $(rails.formSubmitSelector).live('ajax:complete.rails', function(event) {
    if (this == event.target) rails.enableFormElements($(this));
  });

})( jQuery );
/*!
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Copyright:
 * "Copyright (c) 2010, Daniel Rhatigan(sparky@ultrasparky.org) with Reserved
 * Font Name Copse"
 * 
 * Trademark:
 * Copse is a trademark of Daniel Rhatigan.
 * 
 * Description:
 * "Copyright (c) 2010, Daniel Rhatigan(sparky@ultrasparky.org) with Reserved
 * Font Name Copse"
 * 
 * Manufacturer:
 * Daniel Rhatigan
 * 
 * Designer:
 * Daniel Rhatigan
 * 
 * License information:
 * http://scripts.sil.org/OFL
 */

Cufon.registerFont({"w":183,"face":{"font-family":"Copse","font-weight":400,"font-stretch":"normal","units-per-em":"360","panose-1":"2 0 5 3 8 0 0 2 0 4","ascent":"288","descent":"-72","x-height":"4","bbox":"-16.1726 -350 360.598 85","underline-thickness":"17.9297","underline-position":"-36.0352","unicode-range":"U+0020-U+201D"},"glyphs":{" ":{"w":77},"!":{"d":"52,4v-14,0,-23,-9,-23,-25v0,-15,10,-24,23,-25v12,-1,25,11,25,22v1,18,-11,27,-25,28xm67,-76v0,10,-32,9,-30,0r-8,-187v0,-4,7,-5,23,-5v16,0,24,2,24,6","w":104},"\"":{"d":"81,-270v-1,-8,21,-10,32,-7v6,1,10,3,9,7r-10,70v0,4,-4,5,-13,5v-8,0,-12,-1,-12,-5xm47,-200v-1,7,-24,7,-26,0r-9,-70v0,-6,7,-8,22,-8v10,0,17,3,19,8","w":133,"k":{"\u00fe":-12,"\u00f0":5,"\u00ef":-2,"\u00e3":23,"\u00df":4,"\u00c6":14,"z":17,"x":11,"w":13,"v":12,"t":8,"s":23,"p":14,"g":26,"f":7,"b":-11,"W":-5,"@":8,"4":7,"\/":11,".":47,",":47,"&":4,"y":12,"\u00fd":12,"\u00ff":12,"Y":-4,"\u00dd":-4,"-":5,"\u2013":5,"\u2014":5,"\u00ab":26,"A":18,"\u00c0":18,"\u00c1":18,"\u00c2":18,"\u00c3":18,"\u00c4":18,"\u00c5":18,"a":23,"\u00e0":23,"\u00e1":23,"\u00e2":23,"\u00e4":23,"\u00e5":23,"\u00e6":23,"c":27,"e":27,"o":27,"\u00e7":27,"\u00e8":27,"\u00e9":27,"\u00ea":27,"\u00eb":27,"\u00f2":27,"\u00f3":27,"\u00f4":27,"\u00f5":27,"\u00f6":27,"\u00f8":27,"d":20,"q":20,"\u00bb":16,"u":14,"\u00f9":14,"\u00fa":14,"\u00fb":14,"\u00fc":14,"m":14,"n":14,"r":14,"\u00f1":14}},"#":{"d":"33,-159v-9,0,-12,-27,0,-27r29,0r12,-79v1,-5,22,-5,25,0r-12,79r51,0r11,-79v2,-4,22,-5,25,0r-11,79v21,-4,48,2,29,27r-33,0r-8,54v18,-1,41,-4,31,22v-4,10,-23,3,-35,5r-11,78v0,2,-1,3,-5,3v-7,0,-18,3,-20,-3r11,-78r-50,0r-11,78v-4,5,-23,6,-26,0r11,-78v-17,-2,-38,9,-35,-18v2,-15,25,-7,39,-9r8,-54r-25,0xm76,-105r50,0r8,-54r-51,0","w":209},"$":{"d":"18,-193v0,-43,30,-60,68,-66v2,-14,-7,-31,13,-29v19,-2,10,15,12,28v33,2,73,19,73,50v0,15,-12,27,-27,27v-23,0,-34,-24,-22,-44v-6,-4,-15,-6,-24,-6r0,84v44,22,67,26,75,73v-2,45,-33,65,-75,71v-3,14,9,35,-12,35v-22,0,-10,-19,-13,-34v-34,-1,-75,-19,-75,-49v0,-15,12,-27,27,-27v21,-1,33,21,24,41v7,5,15,7,24,8r0,-89v-41,-19,-68,-27,-68,-73xm111,-32v32,-1,50,-39,27,-61v-6,-5,-15,-10,-27,-16r0,77xm86,-232v-44,8,-39,54,0,70r0,-70","w":198},"%":{"d":"138,-54v1,21,4,38,22,38v15,0,23,-11,23,-33v-1,-22,-4,-38,-23,-38v-15,0,-22,11,-22,33xm115,-212v1,31,-22,58,-54,57v-31,-1,-47,-22,-47,-53v0,-31,23,-57,54,-57v29,0,47,24,47,53xm211,-53v0,31,-23,57,-54,57v-31,-1,-47,-22,-47,-53v-1,-31,22,-57,54,-57v29,0,47,24,47,53xm186,-265v1,-6,28,-8,28,0r-173,265v-2,6,-28,8,-29,0xm42,-212v1,21,4,38,22,38v15,0,23,-12,23,-34v-1,-22,-5,-37,-23,-37v-15,0,-22,11,-22,33","w":225},"&":{"d":"168,-212v0,42,-21,55,-48,86r44,60v14,-22,25,-38,19,-51v-14,-1,-31,6,-29,-14v0,-7,1,-11,4,-11r70,0v3,0,5,5,5,13v0,13,-6,12,-17,12v-3,22,-15,45,-36,71v8,14,16,22,38,21v7,2,4,25,-3,25v-30,0,-42,3,-59,-18v-49,40,-146,24,-143,-48v2,-41,18,-51,45,-81v-11,-17,-23,-44,-23,-64v0,-36,31,-57,69,-57v38,0,64,20,64,56xm75,-125v-31,25,-29,101,15,101v19,0,35,-5,49,-16xm103,-241v-57,0,-24,70,0,93v19,-17,29,-37,29,-61v0,-20,-10,-32,-29,-32","w":238,"k":{"\u201d":8,"\u2019":8,"\u00dd":4,"\u00dc":4,"\u00db":4,"\u00da":4,"\u00d9":4,"\u00c6":-4,"Y":4,"W":7,"V":8,"U":4,"T":9,"J":4,"'":9,"\"":9}},"'":{"d":"13,-270v0,-6,6,-8,20,-8v12,0,20,1,21,8r-8,70v0,4,-4,5,-12,5v-9,0,-13,-1,-13,-5","w":66,"k":{"\u00fe":-12,"\u00f0":5,"\u00e3":23,"\u00df":4,"\u00c6":14,"z":17,"x":11,"w":13,"v":12,"t":8,"s":23,"p":14,"g":26,"f":7,"b":-11,"W":-5,"@":8,"4":7,"\/":11,".":47,",":47,"&":4,"y":12,"\u00fd":12,"\u00ff":12,"Y":-4,"\u00dd":-4,"-":5,"\u2013":5,"\u2014":5,"\u00ab":26,"A":18,"\u00c0":18,"\u00c1":18,"\u00c2":18,"\u00c3":18,"\u00c4":18,"\u00c5":18,"a":23,"\u00e0":23,"\u00e1":23,"\u00e2":23,"\u00e4":23,"\u00e5":23,"\u00e6":23,"c":27,"e":27,"o":27,"\u00e7":27,"\u00e8":27,"\u00e9":27,"\u00ea":27,"\u00eb":27,"\u00f2":27,"\u00f3":27,"\u00f4":27,"\u00f5":27,"\u00f6":27,"\u00f8":27,"d":20,"q":20,"\u00bb":16,"u":14,"\u00f9":14,"\u00fa":14,"\u00fb":14,"\u00fc":14,"m":14,"n":14,"r":14,"\u00f1":14}},"(":{"d":"98,29v1,9,-11,17,-21,11v-54,-53,-81,-172,-43,-264v11,-27,24,-51,43,-70v6,-6,22,1,21,10v-61,93,-57,225,0,313","w":111,"k":{"\u00ff":7,"\u00fe":-7,"\u00fd":7,"\u00fc":7,"\u00fb":7,"\u00fa":7,"\u00f9":7,"\u00f8":7,"\u00f6":7,"\u00f5":7,"\u00f4":7,"\u00f3":7,"\u00f2":7,"\u00f0":5,"\u00eb":7,"\u00ea":7,"\u00e9":7,"\u00e8":7,"\u00e7":7,"\u00e6":5,"\u00e5":5,"\u00e4":5,"\u00e3":5,"\u00e2":5,"\u00e1":5,"\u00e0":5,"\u00df":4,"\u00d8":7,"\u00d6":7,"\u00d5":7,"\u00d4":7,"\u00d3":7,"\u00d2":7,"\u00c7":7,"y":7,"w":7,"v":7,"u":7,"t":6,"s":5,"q":6,"p":6,"o":7,"j":-10,"g":5,"e":7,"d":6,"c":7,"b":-5,"a":5,"S":4,"Q":7,"O":7,"J":-3,"G":7,"C":7,"9":5,"8":5,"6":6,"4":6,"0":6}},")":{"d":"13,-284v-1,-9,15,-16,22,-10v67,64,83,215,23,303v-10,13,-20,41,-40,29v-3,-2,-5,-5,-5,-9v61,-90,59,-227,0,-313","w":111},"*":{"d":"14,-233v-6,-8,1,-28,9,-27r26,12v-7,-20,-1,-45,25,-28r-4,28v17,-13,44,-13,35,15r-29,6v6,8,17,12,21,23v-2,8,-16,19,-23,15r-15,-26v-6,8,-8,21,-17,26v-9,-1,-21,-9,-20,-17r19,-22","w":118,"k":{"\u00ff":10,"\u00fe":-11,"\u00fd":10,"\u00fc":6,"\u00fb":6,"\u00fa":6,"\u00f9":6,"\u00f8":18,"\u00f6":18,"\u00f5":18,"\u00f4":18,"\u00f3":18,"\u00f2":18,"\u00f1":5,"\u00f0":6,"\u00ef":-9,"\u00eb":18,"\u00ea":18,"\u00e9":18,"\u00e8":18,"\u00e7":18,"\u00e6":12,"\u00e5":12,"\u00e4":12,"\u00e2":12,"\u00e1":12,"\u00e0":12,"\u00df":4,"\u00dd":-7,"\u00c6":14,"\u00c5":18,"\u00c4":18,"\u00c3":18,"\u00c2":18,"\u00c1":18,"\u00c0":18,"z":8,"y":10,"x":9,"w":11,"v":11,"u":6,"t":6,"s":12,"r":5,"q":18,"p":5,"o":18,"n":5,"m":5,"g":15,"f":6,"e":18,"d":18,"c":18,"b":-10,"a":12,"Y":-7,"W":-8,"V":-3,"A":18}},"+":{"d":"166,-128v8,0,8,27,0,27r-62,0r0,73v0,2,-5,3,-13,3v-8,0,-12,-1,-12,-3r0,-73r-61,0v-9,0,-11,-27,0,-27r61,0r0,-65v0,-2,4,-4,12,-4v8,0,13,2,13,4r0,65r62,0","k":{"7":10,"1":8}},",":{"d":"41,-44v17,0,29,10,29,24v0,21,-15,43,-46,67v-7,1,-11,-4,-11,-10v12,-14,19,-25,19,-34v-22,-9,-13,-48,9,-47","w":88,"k":{"\u201d":44,"\u201c":46,"\u2019":44,"\u2018":46,"7":7,"4":4,"'":47,"\"":47}},"-":{"d":"27,-90v-9,0,-10,-31,0,-31r78,0v10,1,10,31,0,31r-78,0","w":131,"k":{"x":4,"w":4,"v":5,"t":5,"j":5,"f":6,"Z":9,"X":7,"W":11,"V":12,"T":17,"S":5,"J":5,"7":9,"2":4,"1":8,"\u2019":15,"\u201d":15,"y":5,"\u00fd":5,"\u00ff":5,"\"":5,"'":5,"Y":12,"\u00dd":12,"U":5,"\u00d9":5,"\u00da":5,"\u00db":5,"\u00dc":5,"B":6,"D":6,"E":6,"F":6,"H":6,"I":6,"K":6,"L":6,"M":6,"N":6,"P":6,"R":6,"\u00c8":6,"\u00c9":6,"\u00ca":6,"\u00cb":6,"\u00cc":6,"\u00cd":6,"\u00ce":6,"\u00cf":6,"\u00d0":6,"\u00d1":6,"\u00de":6,"A":5,"\u00c0":5,"\u00c1":5,"\u00c2":5,"\u00c3":5,"\u00c4":5,"\u00c5":5,"h":6,"k":6,"l":6,"m":4,"n":4,"r":4,"\u00f1":4,"i":5,"\u00ec":5,"\u00ed":5,"\u00ee":5,"\u00ef":5}},".":{"d":"43,4v-14,-1,-24,-10,-24,-24v-1,-14,9,-24,24,-25v33,0,31,50,0,49","w":85,"k":{"\u201d":43,"\u201c":46,"\u2019":43,"\u2018":46,"\u00ff":12,"\u00fd":12,"\u00fc":5,"\u00fb":5,"\u00fa":5,"\u00f9":5,"\u00dd":3,"\u00dc":8,"\u00db":8,"\u00da":8,"\u00d9":8,"y":12,"w":11,"v":12,"u":5,"t":6,"p":5,"j":6,"Y":3,"W":17,"V":18,"U":8,"T":9,"J":5,"G":3,"7":6,"4":4,"'":47,"\"":47}},"\/":{"d":"124,-282v9,-8,23,-9,29,0r-117,307v-7,5,-25,8,-30,0","w":160,"k":{"\u00fe":-18,"\u00f8":9,"\u00f6":9,"\u00f5":9,"\u00f4":9,"\u00f3":9,"\u00f2":9,"\u00eb":9,"\u00ea":9,"\u00e9":9,"\u00e8":9,"\u00e7":9,"\u00e6":8,"\u00e5":8,"\u00e4":8,"\u00e3":8,"\u00e2":8,"\u00e1":8,"\u00e0":8,"\u00dd":-3,"\u00c6":8,"\u00c5":12,"\u00c4":12,"\u00c3":12,"\u00c2":12,"\u00c1":12,"\u00c0":12,"z":6,"s":7,"q":8,"o":9,"l":-2,"k":-2,"h":-2,"g":9,"e":9,"d":8,"c":9,"b":-17,"a":8,"Y":-3,"W":-5,"A":12,"4":5,"\/":10}},"0":{"d":"17,-119v0,-85,14,-149,93,-149v68,0,83,56,84,131v1,75,-28,138,-93,141v-53,2,-85,-66,-84,-123xm153,-132v0,-64,-3,-101,-47,-107v-38,-5,-50,58,-49,107v2,62,7,98,49,107v42,-9,47,-53,47,-107","w":210,"k":{"\u00c5":4,"\u00c4":4,"\u00c3":4,"\u00c2":4,"\u00c1":4,"\u00c0":4,"A":4,")":6}},"1":{"d":"101,-213v-18,3,-55,34,-58,1v0,-3,0,-5,2,-6r81,-50v11,0,16,1,16,3r0,240v17,5,50,-12,47,13v0,8,-2,12,-6,12r-127,0v-8,-3,-3,-24,3,-25v14,-2,46,5,46,-7r0,-170v0,-7,-2,-11,-4,-11","w":210,"k":{"\u2014":5,"\u2013":5,"\u00ff":4,"\u00fd":4,"\u00f1":-3,"\u00ef":-3,"\u00ee":-3,"\u00ed":-3,"\u00ec":-3,"\u00dc":5,"\u00db":5,"\u00da":5,"\u00d9":5,"\u00c5":-15,"\u00c4":-15,"\u00c3":-15,"\u00c2":-15,"\u00c1":-15,"\u00c0":-15,"\u00b7":4,"\u00b0":5,"}":-7,"y":4,"x":-10,"r":-3,"n":-3,"m":-3,"l":-9,"k":-9,"i":-3,"h":-9,"f":-2,"]":-6,"X":-12,"V":4,"U":5,"A":-15,"=":4,"-":5,"'":4,"\"":4}},"2":{"d":"66,-229v21,11,14,54,-14,52v-16,0,-27,-12,-27,-29v0,-80,157,-83,158,-4v1,80,-108,109,-124,173r98,0v4,-10,3,-28,16,-28v26,0,5,44,6,65r-149,0v-10,-89,77,-122,107,-181v15,-29,-2,-60,-38,-60v-15,0,-26,4,-33,12","w":210},"3":{"d":"53,-87v27,0,35,36,13,51v27,27,83,6,79,-37v-3,-30,-20,-52,-49,-55r0,-17v50,-5,66,-96,3,-96v-15,0,-26,4,-33,12v21,10,15,54,-13,52v-16,-1,-29,-12,-28,-29v2,-40,39,-59,80,-62v81,-6,99,105,31,127v31,14,49,36,50,70v1,42,-41,75,-84,75v-38,0,-78,-28,-77,-64v0,-16,12,-27,28,-27","w":210,"k":{")":5}},"4":{"d":"73,0v-7,-3,-4,-24,4,-25v14,-2,44,6,45,-7r0,-41r-97,0v-5,-3,-7,-7,-8,-12r81,-183v21,0,30,8,30,23r-73,145r67,0v4,-39,-18,-85,37,-79r0,79v14,3,39,-10,37,11v2,21,-19,15,-37,16r0,48v14,2,33,-8,31,13v0,8,-3,12,-7,12r-110,0","w":210,"k":{"\u00dd":4,"\u00dc":5,"\u00db":5,"\u00da":5,"\u00d9":5,"\u00c5":-3,"\u00c4":-3,"\u00c3":-3,"\u00c2":-3,"\u00c1":-3,"\u00c0":-3,"\u00b0":4,"\\":7,"Y":4,"W":8,"V":9,"U":5,"T":9,"J":4,"A":-3,"7":6,"4":-5,"'":7,"\"":7}},"5":{"d":"53,-87v27,0,36,35,13,51v28,27,82,6,82,-39v0,-52,-47,-64,-105,-59r0,-131r133,0v10,62,-63,30,-106,38r0,66v69,-6,119,23,119,84v0,48,-37,82,-87,81v-38,0,-78,-28,-77,-64v0,-16,12,-27,28,-27","w":210},"6":{"d":"161,-177v-27,2,-37,-41,-14,-52v-20,-20,-54,-15,-69,13v-11,20,-18,44,-18,74v12,-12,32,-20,59,-20v47,2,77,35,77,84v0,45,-41,82,-86,82v-61,0,-91,-43,-91,-129v0,-76,34,-143,97,-143v43,0,70,18,72,58v1,22,-9,32,-27,33xm155,-81v0,-27,-19,-53,-45,-53v-26,0,-42,16,-50,33v-1,36,17,77,48,77v30,0,47,-26,47,-57","w":210,"k":{")":5}},"7":{"d":"66,0v6,-88,47,-169,92,-230r-112,0v-5,9,0,25,-14,25v-31,-1,-7,-39,-9,-60r171,0v4,0,6,4,6,12r-26,45v-38,71,-59,116,-67,208v0,2,-7,4,-21,4v-14,0,-20,-2,-20,-4","w":210,"k":{"\u2014":7,"\u2013":7,"\u00fc":4,"\u00fb":4,"\u00fa":4,"\u00f9":4,"\u00f8":9,"\u00f6":9,"\u00f5":9,"\u00f4":9,"\u00f3":9,"\u00f2":9,"\u00f1":4,"\u00eb":9,"\u00ea":9,"\u00e9":9,"\u00e8":9,"\u00e7":9,"\u00e6":8,"\u00e5":8,"\u00e4":8,"\u00e3":8,"\u00e2":8,"\u00e1":8,"\u00e0":8,"\u00de":-5,"\u00dd":-21,"\u00dc":-9,"\u00db":-9,"\u00da":-9,"\u00d9":-9,"\u00d1":-5,"\u00d0":-5,"\u00cf":-5,"\u00ce":-5,"\u00cd":-5,"\u00cc":-5,"\u00cb":-5,"\u00ca":-5,"\u00c9":-5,"\u00c8":-5,"\u00c5":11,"\u00c4":11,"\u00c3":11,"\u00c2":11,"\u00c1":11,"\u00c0":11,"\u00b7":8,"\u00a2":4,"}":-9,"z":7,"u":4,"s":8,"r":4,"q":9,"o":9,"n":4,"m":4,"l":-17,"k":-17,"h":-17,"g":10,"e":9,"d":9,"c":9,"b":-27,"a":8,"]":-7,"\\":-2,"Y":-21,"X":-11,"W":-22,"V":-19,"U":-9,"T":-8,"R":-5,"P":-5,"N":-5,"M":-5,"L":-5,"K":-5,"J":-6,"I":-5,"H":-5,"F":-5,"E":-5,"D":-5,"B":-5,"A":11,"=":6,"7":-9,"4":6,"\/":9,".":10,"-":7,",":10,"+":8,"\"":-3}},"8":{"d":"110,4v-53,1,-93,-24,-94,-73v0,-27,16,-53,47,-78v-21,-15,-34,-35,-34,-64v0,-74,154,-76,156,-1v1,28,-19,58,-38,75v32,18,49,27,49,68v0,46,-42,72,-86,73xm57,-73v0,61,95,63,98,9v-7,-44,-30,-45,-69,-70v-19,20,-29,40,-29,61xm149,-203v0,-46,-81,-51,-85,-8v6,37,28,41,59,62v17,-22,26,-40,26,-54","w":210,"k":{")":5}},"9":{"d":"51,-87v27,-2,37,40,14,51v18,18,58,16,71,-11v9,-19,16,-43,16,-75v-12,12,-33,20,-59,19v-47,-1,-77,-35,-77,-84v0,-44,42,-82,86,-81v61,0,91,42,91,128v0,90,-22,144,-91,144v-44,0,-78,-24,-78,-64v0,-15,12,-27,27,-27xm57,-184v0,29,19,54,45,54v26,0,42,-16,50,-33v1,-40,-14,-78,-48,-78v-29,0,-47,27,-47,57","w":210,"k":{"\u00c5":4,"\u00c4":4,"\u00c3":4,"\u00c2":4,"\u00c1":4,"\u00c0":4,"A":4,")":6}},":":{"d":"52,-112v-33,4,-34,-46,-6,-48v34,-4,35,47,6,48xm52,-4v-34,4,-34,-48,-6,-49v34,-4,34,47,6,49","w":98},";":{"d":"52,-112v-17,0,-26,-10,-26,-24v-1,-14,9,-23,24,-24v30,-1,31,48,2,48xm48,-44v17,0,28,9,28,24v0,21,-15,43,-46,67v-7,1,-11,-4,-11,-10v12,-14,19,-25,19,-34v-23,-10,-13,-48,10,-47","w":100},"<":{"d":"58,-113r112,79v0,9,-4,14,-11,17r-140,-81v-12,-7,-12,-23,0,-30r139,-78v7,2,11,9,12,18","w":188},"=":{"d":"28,-134v-10,0,-9,-28,0,-27r149,0v8,1,9,27,0,27r-149,0xm29,-68v-9,0,-12,-27,0,-27r148,0v9,0,9,27,0,27r-148,0","w":204,"k":{"7":9,"1":8}},">":{"d":"19,-188v1,-9,4,-16,12,-18r139,78v12,7,12,23,0,30r-140,81v-7,-3,-11,-8,-11,-17r112,-79","w":188},"?":{"d":"106,-169v27,-36,-1,-86,-51,-70v11,17,-2,40,-18,40v-17,1,-27,-10,-27,-24v0,-35,40,-43,75,-45v62,-3,92,69,50,110v-12,12,-29,25,-43,36v-3,22,11,55,-18,55v-30,0,-13,-36,-17,-59v15,-12,39,-30,49,-43xm76,4v-18,0,-26,-9,-27,-25v0,-14,11,-23,22,-24v18,-2,27,11,28,22v2,16,-12,25,-23,27","w":166},"@":{"d":"81,-90v0,-66,56,-108,123,-83v5,-15,28,-9,34,1v-14,35,-9,89,-10,138v0,10,2,11,11,11v29,0,41,-36,42,-66v0,-76,-47,-121,-118,-122v-75,0,-122,54,-122,132v0,100,118,143,196,94v6,2,13,12,15,21v-25,17,-56,26,-92,26v-91,1,-150,-53,-148,-143v2,-92,58,-158,157,-157v84,1,140,61,140,145v0,50,-33,96,-81,95v-16,0,-25,-5,-29,-17v-51,39,-118,18,-118,-75xm117,-90v2,33,5,65,35,66v13,0,28,-5,42,-17r0,-101v-38,-28,-80,0,-77,52","w":323,"k":{"\u201d":6,"\u2019":6,"\u00de":5,"\u00dd":7,"\u00dc":6,"\u00db":6,"\u00da":6,"\u00d9":6,"\u00d1":5,"\u00d0":5,"\u00cf":5,"\u00ce":5,"\u00cd":5,"\u00cc":5,"\u00cb":5,"\u00ca":5,"\u00c9":5,"\u00c8":5,"Z":5,"Y":7,"W":9,"V":10,"U":6,"T":9,"R":5,"P":5,"N":5,"M":5,"L":5,"K":5,"J":6,"I":5,"H":5,"F":5,"E":5,"D":5,"B":5,"'":6,"\"":6}},"A":{"d":"81,-25v7,1,5,26,-2,25r-77,0v-7,-2,-6,-27,6,-25v9,0,14,-3,17,-10r90,-230v1,-5,20,-3,20,0r94,240v12,1,25,-6,25,11v0,8,-3,12,-7,14r-85,0v-8,-2,-5,-26,3,-25v18,-1,23,1,20,-8r-21,-55r-89,0r-25,63r31,0xm85,-115r69,0r-34,-88","w":250,"k":{"\u00ae":10,"}":-8,"w":4,"v":7,"]":-7,"\\":12,"W":19,"V":21,"T":15,"J":5,"G":6,"?":4,"7":6,"*":17}},"B":{"d":"220,-77v3,87,-104,81,-198,77v-9,-6,-5,-33,16,-25v6,-1,12,-2,13,-7r-2,-208v-15,-2,-38,9,-36,-14v0,-7,2,-11,5,-11v79,-2,185,-8,185,65v0,28,-24,51,-48,57v36,5,64,28,65,66xm179,-77v-1,-39,-44,-56,-91,-52v5,41,-18,104,31,104v39,0,61,-12,60,-52xm88,-156v50,7,88,-14,70,-62v-13,-18,-31,-19,-70,-19r0,81","w":233,"k":{"\u00de":4,"\u00dd":8,"\u00dc":4,"\u00db":4,"\u00da":4,"\u00d9":4,"\u00d1":4,"\u00d0":4,"\u00cf":4,"\u00ce":4,"\u00cd":4,"\u00cc":4,"\u00cb":4,"\u00ca":4,"\u00c9":4,"\u00c8":4,"}":4,"]":4,"Z":2,"Y":8,"X":7,"W":4,"V":5,"U":4,"T":3,"R":4,"P":4,"N":4,"M":4,"L":4,"K":4,"J":4,"I":4,"H":4,"F":4,"E":4,"D":4,"B":4,")":6}},"C":{"d":"186,-191v-22,1,-34,-26,-23,-44v-61,-23,-106,29,-104,90v3,73,17,114,72,120v29,3,47,-15,64,-22v7,1,13,12,14,17v-9,24,-49,34,-79,34v-78,0,-111,-56,-112,-133v-2,-81,41,-139,119,-139v33,0,77,20,76,50v0,15,-12,27,-27,27","w":223,"k":{"\u00ef":-7,"\u00ee":-4,"G":3,"4":5,"C":3,"O":3,"Q":3,"\u00c7":3,"\u00d2":3,"\u00d3":3,"\u00d4":3,"\u00d5":3,"\u00d6":3,"\u00d8":3,"-":27,"\u2013":27,"\u2014":27,"\u00ab":7}},"D":{"d":"18,-10v-5,-22,29,-9,33,-22r-2,-208v-15,-3,-37,9,-36,-13v0,-7,1,-12,4,-12r103,0v91,1,128,40,128,132v0,81,-51,133,-128,133r-98,0v-3,0,-4,-3,-4,-10xm207,-127v0,-82,-34,-117,-119,-110r0,210v73,7,119,-33,119,-100","w":266,"k":{"\u00c6":4,"}":5,"]":5,"Z":3,"X":7,"W":3,"V":5,"T":2,"J":5,".":5,",":5,")":7,"Y":9,"\u00dd":9,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"B":6,"D":6,"E":6,"F":6,"H":6,"I":6,"K":6,"L":6,"M":6,"N":6,"P":6,"R":6,"\u00c8":6,"\u00c9":6,"\u00ca":6,"\u00cb":6,"\u00cc":6,"\u00cd":6,"\u00ce":6,"\u00cf":6,"\u00d0":6,"\u00d1":6,"\u00de":6,"A":9,"\u00c0":9,"\u00c1":9,"\u00c2":9,"\u00c3":9,"\u00c4":9,"\u00c5":9}},"E":{"d":"144,-176v1,-7,27,-5,25,3r0,75v0,5,-4,7,-12,7v-22,0,-10,-17,-13,-31r-56,0r0,95r93,0v5,-14,22,-45,37,-21r-16,48r-180,0v-9,-7,-4,-33,16,-25v6,-1,12,-2,13,-7r-2,-208v-15,-3,-37,9,-36,-13v0,-7,1,-12,4,-12r194,0v-1,24,10,72,-25,54v3,-45,-62,-19,-98,-26r0,88v30,-2,65,11,56,-27","w":226,"k":{"\u00fe":-10,"\u00ef":-4,"b":-9,"G":7,"C":6,"O":6,"Q":6,"\u00c7":6,"\u00d2":6,"\u00d3":6,"\u00d4":6,"\u00d5":6,"\u00d6":6,"\u00d8":6,"-":3,"\u2013":3,"\u2014":3}},"F":{"d":"144,-176v1,-7,27,-5,25,3r0,75v0,5,-4,7,-12,7v-22,0,-10,-17,-13,-31r-56,0r0,97v15,4,44,-11,42,11v1,9,-3,13,-7,14r-101,0v-9,-7,-4,-33,16,-25v6,-1,12,-2,13,-7r-2,-208v-15,-3,-37,9,-36,-13v0,-7,1,-12,4,-12r194,0v-1,24,10,72,-25,54v3,-45,-62,-19,-98,-26r0,88v30,-2,65,11,56,-27","w":217,"k":{"\u2014":8,"\u2013":8,"\u00fe":-19,"\u00f8":6,"\u00f6":6,"\u00f5":6,"\u00f4":6,"\u00f3":6,"\u00f2":6,"\u00ef":-13,"\u00ee":-10,"\u00eb":6,"\u00ea":6,"\u00e9":6,"\u00e8":6,"\u00e7":6,"\u00e6":4,"\u00e5":4,"\u00e4":4,"\u00e3":4,"\u00e2":4,"\u00e1":4,"\u00e0":4,"\u00d8":2,"\u00d6":2,"\u00d5":2,"\u00d4":2,"\u00d3":2,"\u00d2":2,"\u00c7":2,"\u00c6":22,"\u00c5":20,"\u00c4":20,"\u00c3":20,"\u00c2":20,"\u00c1":20,"\u00c0":20,"\u00bb":9,"\u00ab":7,"}":-3,"s":4,"q":6,"o":6,"l":-7,"k":-7,"h":-7,"g":7,"e":6,"d":6,"c":6,"b":-18,"a":4,"]":-2,"Y":-3,"W":-5,"Q":2,"O":2,"G":2,"C":2,"A":20,"@":6,";":9,":":8,"7":-6,"4":4,"\/":9,".":15,"-":8,",":15}},"G":{"d":"59,-145v0,90,38,138,114,112v-1,-17,3,-39,-2,-53v-17,-1,-36,7,-36,-15v0,-7,2,-10,5,-10r85,0v8,6,5,34,-14,25r0,60v-23,19,-47,30,-84,30v-72,0,-111,-57,-109,-141v2,-76,43,-131,118,-131v39,0,80,17,81,50v0,15,-12,27,-27,27v-22,1,-33,-25,-24,-44v-62,-23,-107,26,-107,90","w":239},"H":{"d":"162,-10v-4,-22,28,-9,33,-22r0,-90r-107,0r0,97v13,3,36,-9,34,11v1,9,-3,13,-7,14r-94,0v-9,-7,-3,-33,17,-25v6,-1,12,-2,13,-7r-2,-208v-15,-2,-38,9,-36,-14v0,-7,1,-11,4,-11r104,0v3,0,5,5,5,13v2,21,-23,9,-38,12r0,91r107,0v-2,-29,3,-65,-2,-91v-16,-2,-37,8,-36,-14v0,-7,2,-11,5,-11r104,0v3,0,4,5,4,13v2,21,-23,9,-38,12r0,215v14,3,35,-9,35,11v0,9,-3,13,-8,14r-93,0v-3,0,-4,-3,-4,-10","w":283,"k":{"\u00fe":-12,"\u00ef":-5,"\u00ae":4,"w":2,"v":3,"b":-11,"G":5,"C":5,"O":5,"Q":5,"\u00c7":5,"\u00d2":5,"\u00d3":5,"\u00d4":5,"\u00d5":5,"\u00d6":5,"\u00d8":5,"y":3,"\u00fd":3,"\u00ff":3,"-":5,"\u2013":5,"\u2014":5,"\u00ab":5}},"I":{"d":"18,-10v-6,-23,28,-9,33,-22r-2,-208v-15,-2,-38,9,-36,-14v0,-7,2,-11,5,-11r104,0v3,0,4,5,4,13v2,21,-23,9,-38,12r0,215v13,3,36,-9,34,11v1,9,-3,13,-7,14r-93,0v-3,0,-4,-3,-4,-10","w":139,"k":{"\u00fe":-12,"\u00ef":-5,"\u00ae":4,"w":2,"v":3,"b":-11,"G":5,"C":5,"O":5,"Q":5,"\u00c7":5,"\u00d2":5,"\u00d3":5,"\u00d4":5,"\u00d5":5,"\u00d6":5,"\u00d8":5,"y":3,"\u00fd":3,"\u00ff":3,"-":5,"\u2013":5,"\u2014":5,"\u00ab":5}},"J":{"d":"-9,53v-3,-24,34,-33,44,-12v8,-5,13,-19,13,-41r-2,-240v-15,-2,-38,9,-36,-14v0,-7,1,-11,4,-11r104,0v3,0,5,5,5,13v2,21,-23,9,-38,12r0,228v0,44,-23,86,-67,89v-19,2,-26,-10,-27,-24","w":132,"k":{"\u2014":5,"\u2013":5,"\u00ff":3,"\u00fe":-15,"\u00fd":3,"\u00fc":3,"\u00fb":3,"\u00fa":3,"\u00f9":3,"\u00f8":3,"\u00f6":3,"\u00f5":3,"\u00f4":3,"\u00f3":3,"\u00f2":3,"\u00ef":-8,"\u00eb":3,"\u00ea":3,"\u00e9":3,"\u00e8":3,"\u00e7":3,"\u00e6":3,"\u00e5":3,"\u00e4":3,"\u00e3":3,"\u00e2":3,"\u00e1":3,"\u00e0":3,"\u00d8":5,"\u00d6":5,"\u00d5":5,"\u00d4":5,"\u00d3":5,"\u00d2":5,"\u00c7":5,"\u00c6":2,"\u00c5":7,"\u00c4":7,"\u00c3":7,"\u00c2":7,"\u00c1":7,"\u00c0":7,"\u00bb":6,"\u00ae":3,"\u00ab":6,"z":3,"y":3,"w":3,"v":3,"u":3,"t":2,"s":3,"q":3,"p":2,"o":3,"l":-3,"k":-3,"h":-3,"g":4,"e":3,"d":3,"c":3,"b":-14,"a":3,"S":2,"Q":5,"O":5,"G":5,"C":5,"A":7,"@":4,";":5,":":5,".":5,"-":5,",":5}},"K":{"d":"18,-10v-6,-23,28,-9,33,-22r-2,-208v-15,-2,-38,9,-36,-14v0,-7,2,-11,5,-11r94,0v3,0,5,5,5,13v2,19,-16,10,-29,12r0,215v13,3,36,-9,34,11v1,9,-3,13,-7,14r-93,0v-3,0,-4,-3,-4,-10xm248,-265v8,4,5,31,-10,26v-5,1,-8,4,-12,7r-80,91r77,101v8,9,17,15,34,15v7,2,4,25,-3,25v-28,1,-48,0,-61,-18r-93,-122r92,-100v-11,-2,-29,8,-27,-10v-1,-9,2,-14,6,-15r77,0","w":261,"k":{"\u2014":8,"\u2013":8,"\u00ff":16,"\u00fe":-16,"\u00fd":16,"\u00ef":-8,"\u00d8":9,"\u00d6":9,"\u00d5":9,"\u00d4":9,"\u00d3":9,"\u00d2":9,"\u00c7":9,"}":-6,"y":16,"w":9,"v":15,"l":-4,"k":-4,"h":-4,"b":-15,"]":-5,"Q":9,"O":9,"G":9,"C":9,"-":8}},"L":{"d":"17,-10v-5,-23,29,-9,34,-22r-2,-208v-20,3,-47,1,-32,-25r104,0v3,0,5,5,5,13v2,21,-23,9,-38,12r0,213r83,0v8,-10,8,-34,27,-29v6,0,10,3,10,8r-17,48r-170,0v-3,0,-4,-3,-4,-10","w":207,"k":{"\u201d":17,"\u201c":18,"\u2019":17,"\u2018":18,"\u2014":19,"\u2013":19,"\u00ff":9,"\u00fd":9,"\u00dd":9,"\u00dc":9,"\u00db":9,"\u00da":9,"\u00d9":9,"\u00ae":20,"y":9,"w":5,"v":9,"\\":10,"Y":9,"W":20,"V":23,"U":9,"T":15,"J":5,"G":2,"?":5,"7":7,"4":8,"-":19,"*":16,"'":16,"\"":16}},"M":{"d":"225,-10v-4,-22,28,-9,33,-22r0,-165r-79,197v-3,3,-18,2,-20,0r-81,-180r0,155v13,3,36,-9,34,11v1,9,-3,13,-7,14r-83,0v-9,-6,-5,-33,16,-25v6,-1,12,-2,13,-7r-2,-208v-15,-2,-38,9,-36,-14v1,-24,38,-6,57,-11v3,0,5,3,7,6r97,203r84,-205v15,-10,49,-1,71,-4v3,0,4,5,4,13v2,21,-23,9,-38,12r0,215v13,3,36,-9,34,11v1,9,-3,13,-7,14r-93,0v-3,0,-4,-3,-4,-10","w":346,"k":{"\u00fe":-12,"\u00ef":-5,"\u00ae":4,"w":2,"v":3,"b":-11,"G":5,"C":5,"O":5,"Q":5,"\u00c7":5,"\u00d2":5,"\u00d3":5,"\u00d4":5,"\u00d5":5,"\u00d6":5,"\u00d8":5,"y":3,"\u00fd":3,"\u00ff":3,"-":5,"\u2013":5,"\u2014":5,"\u00ab":5}},"N":{"d":"18,-10v-6,-23,28,-9,33,-22r-2,-208v-15,-2,-38,9,-36,-14v0,-7,2,-11,5,-11r61,0r139,204r-2,-179v-15,-2,-38,9,-36,-14v0,-7,2,-11,5,-11r93,0v3,0,5,5,5,13v2,21,-23,9,-38,12r0,240v0,2,-4,4,-13,4v-8,0,-13,-2,-14,-4r-140,-198r0,173v13,3,36,-9,34,11v1,9,-3,13,-7,14r-83,0v-3,0,-4,-3,-4,-10","w":293,"k":{"\u00fe":-15,"\u00ef":-8,"\u00c6":2,"\u00ae":3,"z":3,"w":3,"v":3,"t":2,"s":3,"p":2,"g":4,"b":-14,"S":2,"G":5,"@":4,";":5,":":5,".":5,",":5,"C":5,"O":5,"Q":5,"\u00c7":5,"\u00d2":5,"\u00d3":5,"\u00d4":5,"\u00d5":5,"\u00d6":5,"\u00d8":5,"y":3,"\u00fd":3,"\u00ff":3,"-":6,"\u2013":6,"\u2014":6,"\u00ab":6,"A":6,"\u00c0":6,"\u00c1":6,"\u00c2":6,"\u00c3":6,"\u00c4":6,"\u00c5":6,"a":3,"\u00e0":3,"\u00e1":3,"\u00e2":3,"\u00e3":3,"\u00e4":3,"\u00e5":3,"\u00e6":3,"h":-3,"k":-3,"l":-3,"c":4,"e":4,"o":4,"\u00e7":4,"\u00e8":4,"\u00e9":4,"\u00ea":4,"\u00eb":4,"\u00f2":4,"\u00f3":4,"\u00f4":4,"\u00f5":4,"\u00f6":4,"\u00f8":4,"d":3,"q":3,"\u00bb":6,"u":3,"\u00f9":3,"\u00fa":3,"\u00fb":3,"\u00fc":3}},"O":{"d":"246,-126v0,78,-42,130,-117,130v-75,0,-111,-54,-111,-132v-1,-81,41,-140,118,-140v76,0,110,60,110,142xm58,-145v2,73,17,120,74,120v56,0,72,-41,73,-103v1,-54,-28,-111,-75,-111v-46,0,-73,45,-72,94","w":263,"k":{"}":4,"]":4,"Z":3,"X":6,"W":3,"V":5,"T":2,"J":5,".":3,",":3,")":7,"Y":8,"\u00dd":8,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"B":5,"D":5,"E":5,"F":5,"H":5,"I":5,"K":5,"L":5,"M":5,"N":5,"P":5,"R":5,"\u00c8":5,"\u00c9":5,"\u00ca":5,"\u00cb":5,"\u00cc":5,"\u00cd":5,"\u00ce":5,"\u00cf":5,"\u00d0":5,"\u00d1":5,"\u00de":5,"A":6,"\u00c0":6,"\u00c1":6,"\u00c2":6,"\u00c3":6,"\u00c4":6,"\u00c5":6}},"P":{"d":"18,-265v85,-1,187,-11,186,73v0,54,-39,81,-116,81r0,86v16,4,45,-10,44,11v1,8,-3,12,-7,14r-103,0v-10,-7,-4,-32,16,-25v6,-1,12,-2,13,-7r-2,-208v-15,-2,-38,9,-36,-14v0,-7,2,-11,5,-11xm88,-138v48,0,75,-9,75,-49v0,-45,-25,-49,-75,-50r0,99","w":214,"k":{"\u2014":9,"\u2013":9,"\u00f8":3,"\u00f6":3,"\u00f5":3,"\u00f4":3,"\u00f3":3,"\u00f2":3,"\u00ef":-3,"\u00eb":3,"\u00ea":3,"\u00e9":3,"\u00e8":3,"\u00e7":3,"\u00de":2,"\u00d1":2,"\u00d0":2,"\u00cf":2,"\u00ce":2,"\u00cd":2,"\u00cc":2,"\u00cb":2,"\u00ca":2,"\u00c9":2,"\u00c8":2,"\u00c6":18,"\u00c5":16,"\u00c4":16,"\u00c3":16,"\u00c2":16,"\u00c1":16,"\u00c0":16,"\u00ab":9,"q":3,"o":3,"g":2,"e":3,"d":3,"c":3,"X":3,"R":2,"P":2,"N":2,"M":2,"L":2,"K":2,"I":2,"H":2,"F":2,"E":2,"D":2,"B":2,"A":16,";":3,"\/":8,".":17,"-":9,",":17,")":5}},"Q":{"d":"305,52v-8,21,-41,24,-66,25v-44,2,-78,-26,-110,-73v-72,-1,-111,-56,-111,-132v0,-81,41,-136,118,-140v133,-8,145,233,39,264v30,55,63,67,116,39v8,1,13,10,14,17xm59,-145v2,73,16,120,73,120v56,0,72,-41,73,-103v1,-54,-28,-111,-75,-111v-46,0,-73,45,-71,94","w":264,"k":{"\u00ff":-45,"\u00fe":-61,"\u00fd":-45,"}":-37,"|":-21,"y":-45,"p":-46,"j":-69,"g":-39,"]":-36,"Z":3,"X":6,"W":3,"V":5,"T":2,"J":5,";":-32,"\/":-34,".":3,",":-38,")":-34,"Y":8,"\u00dd":8,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"B":5,"D":5,"E":5,"F":5,"H":5,"I":5,"K":5,"L":5,"M":5,"N":5,"P":5,"R":5,"\u00c8":5,"\u00c9":5,"\u00ca":5,"\u00cb":5,"\u00cc":5,"\u00cd":5,"\u00ce":5,"\u00cf":5,"\u00d0":5,"\u00d1":5,"\u00de":5,"A":6,"\u00c0":6,"\u00c1":6,"\u00c2":6,"\u00c3":6,"\u00c4":6,"\u00c5":6}},"R":{"d":"236,-25v7,2,4,25,-3,25v-28,1,-49,1,-61,-18r-57,-94v-7,1,-17,1,-27,1r0,86v16,4,45,-10,44,11v1,8,-3,12,-7,14r-103,0v-10,-7,-4,-32,16,-25v6,-1,12,-2,13,-7r-2,-208v-15,-2,-38,9,-36,-14v0,-7,2,-11,5,-11v85,-1,187,-11,186,73v0,35,-17,60,-51,72r49,80v7,12,16,15,34,15xm88,-138v48,0,75,-9,75,-49v0,-45,-25,-49,-75,-50r0,99","w":238,"k":{"\u00dd":8,"\u00dc":7,"\u00db":7,"\u00da":7,"\u00d9":7,"\u00d8":3,"\u00d6":3,"\u00d5":3,"\u00d4":3,"\u00d3":3,"\u00d2":3,"\u00c7":3,"\u00ae":3,"\u00ab":5,"}":-7,"]":-6,"\\":4,"Y":8,"W":7,"V":9,"U":7,"T":5,"Q":3,"O":3,"J":4,"G":3,"C":3,"4":5}},"S":{"d":"42,-73v22,0,34,24,22,43v35,15,92,2,88,-36v-6,-57,-131,-65,-131,-136v0,-44,40,-66,87,-66v34,0,81,18,79,50v0,15,-12,27,-27,27v-22,1,-34,-26,-22,-44v-30,-15,-83,-3,-80,33v21,61,131,51,131,133v0,45,-42,73,-89,73v-35,0,-85,-19,-85,-50v0,-16,12,-27,27,-27","w":206,"k":{")":4}},"T":{"d":"27,-211v-4,8,-25,4,-24,-6r7,-48r204,0v-2,20,22,58,-9,58v-15,0,-10,-20,-16,-30r-59,0r0,212v14,3,35,-9,35,12v0,7,-3,12,-7,13r-94,0v-9,-7,-3,-33,17,-25v5,-1,12,-2,12,-7r0,-205r-59,0","w":224,"k":{"\u2014":17,"\u2013":17,"\u00ff":31,"\u00fe":-16,"\u00fd":31,"\u00fc":24,"\u00fb":24,"\u00fa":24,"\u00f9":24,"\u00f8":21,"\u00f6":21,"\u00f5":19,"\u00f4":21,"\u00f3":21,"\u00f2":21,"\u00f1":19,"\u00ef":-14,"\u00ee":-12,"\u00eb":21,"\u00ea":21,"\u00e9":21,"\u00e8":21,"\u00e7":21,"\u00e6":8,"\u00e5":8,"\u00e4":8,"\u00e3":3,"\u00e2":8,"\u00e1":8,"\u00e0":8,"\u00d8":3,"\u00d6":3,"\u00d5":3,"\u00d4":3,"\u00d3":3,"\u00d2":3,"\u00c7":3,"\u00c6":15,"\u00c5":14,"\u00c4":14,"\u00c3":14,"\u00c2":14,"\u00c1":14,"\u00c0":14,"\u00bb":13,"\u00ab":16,"z":5,"y":31,"x":19,"w":29,"v":31,"u":24,"t":6,"s":8,"r":19,"q":21,"p":24,"o":21,"n":19,"m":19,"l":-4,"k":-4,"h":-4,"g":23,"f":2,"e":21,"d":21,"c":21,"b":-15,"a":8,"Q":3,"O":3,"G":3,"C":3,"A":14,"@":9,";":12,":":12,"7":-7,"4":8,"1":-4,"\/":7,".":9,"-":17,",":9}},"U":{"d":"258,-265v6,1,8,26,-1,25r-30,0r0,142v0,67,-30,102,-91,102v-122,0,-82,-140,-93,-244v-16,-2,-37,8,-36,-14v0,-7,2,-11,5,-11r100,0v3,0,5,5,5,13v2,21,-20,9,-35,12v7,82,-28,217,59,215v86,-1,49,-131,57,-212v-6,-11,-38,10,-35,-17v0,-7,2,-11,5,-11r90,0","w":271,"k":{"\u00fe":-17,"\u00ef":-10,"\u00c6":11,"z":2,"w":2,"v":2,"t":2,"s":3,"g":6,"b":-15,"S":2,"G":4,"@":4,";":6,":":6,"\/":7,".":8,",":8,"C":4,"O":4,"Q":4,"\u00c7":4,"\u00d2":4,"\u00d3":4,"\u00d4":4,"\u00d5":4,"\u00d6":4,"\u00d8":4,"y":2,"\u00fd":2,"\u00ff":2,"-":5,"\u2013":5,"\u2014":5,"\u00ab":5,"A":12,"\u00c0":12,"\u00c1":12,"\u00c2":12,"\u00c3":12,"\u00c4":12,"\u00c5":12,"a":3,"\u00e0":3,"\u00e1":3,"\u00e2":3,"\u00e3":3,"\u00e4":3,"\u00e5":3,"\u00e6":3,"h":-4,"k":-4,"l":-4,"c":4,"e":4,"o":4,"\u00e7":4,"\u00e8":4,"\u00e9":4,"\u00ea":4,"\u00eb":4,"\u00f2":4,"\u00f3":4,"\u00f4":4,"\u00f5":4,"\u00f6":4,"\u00f8":4,"d":4,"q":4,"\u00bb":6,"u":2,"\u00f9":2,"\u00fa":2,"\u00fb":2,"\u00fc":2}},"V":{"d":"170,-240v-8,-2,-5,-25,2,-25r76,0v7,3,8,25,-6,25v-9,0,-14,3,-17,10r-88,230v-1,5,-21,5,-22,0r-94,-240v-11,-2,-26,7,-24,-10v-1,-9,2,-14,7,-15r85,0v7,2,4,25,-3,25v-19,0,-24,-1,-20,9r65,170r66,-179r-27,0","w":250,"k":{"\u2014":12,"\u2013":12,"\u00ff":5,"\u00fe":-27,"\u00fd":5,"\u00fc":7,"\u00fb":7,"\u00fa":7,"\u00f9":7,"\u00f8":18,"\u00f6":18,"\u00f5":18,"\u00f4":18,"\u00f3":18,"\u00f2":18,"\u00f1":8,"\u00ef":-20,"\u00ee":-8,"\u00ec":-10,"\u00eb":18,"\u00ea":18,"\u00e9":18,"\u00e8":18,"\u00e7":18,"\u00e6":13,"\u00e5":13,"\u00e4":8,"\u00e3":4,"\u00e2":13,"\u00e1":13,"\u00e0":13,"\u00d8":7,"\u00d6":7,"\u00d5":7,"\u00d4":7,"\u00d3":7,"\u00d2":7,"\u00c7":7,"\u00c6":17,"\u00c5":21,"\u00c4":21,"\u00c3":21,"\u00c2":21,"\u00c1":21,"\u00c0":21,"\u00bb":11,"\u00ab":13,"}":-7,"z":4,"y":5,"x":7,"w":5,"v":5,"u":7,"t":4,"s":13,"r":8,"q":17,"p":5,"o":18,"n":8,"m":8,"l":-15,"k":-15,"h":-15,"g":19,"f":2,"e":18,"d":17,"c":18,"b":-26,"a":13,"]":-7,"Q":7,"O":7,"G":7,"C":7,"A":21,"@":10,";":11,":":11,"7":-8,"6":4,"4":8,"\/":12,".":18,"-":12,",":18,"*":-2,"&":4}},"W":{"d":"277,-240v-7,-1,-5,-26,2,-25r77,0v7,3,7,29,-7,25v-9,0,-15,3,-17,10r-72,230v-1,7,-21,3,-21,0r-58,-149r-49,149v0,5,-20,5,-20,0r-95,-240v-11,-2,-24,6,-24,-10v0,-9,3,-13,7,-15r86,0v7,2,4,25,-3,25v-18,0,-25,-1,-21,9r64,165r40,-122r-20,-52v-12,-2,-26,7,-26,-10v0,-9,3,-13,7,-15r86,0v7,2,4,25,-3,25v-18,0,-25,-1,-21,9r63,165r53,-174r-28,0","w":361,"k":{"\u2014":11,"\u2013":11,"\u00ff":5,"\u00fe":-23,"\u00fd":5,"\u00fc":6,"\u00fb":6,"\u00fa":6,"\u00f9":6,"\u00f8":15,"\u00f6":15,"\u00f5":15,"\u00f4":15,"\u00f3":15,"\u00f2":15,"\u00f1":7,"\u00ef":-16,"\u00ee":-5,"\u00ec":-6,"\u00eb":15,"\u00ea":15,"\u00e9":15,"\u00e8":15,"\u00e7":15,"\u00e6":13,"\u00e5":13,"\u00e4":13,"\u00e3":8,"\u00e2":13,"\u00e1":13,"\u00e0":13,"\u00d8":7,"\u00d6":7,"\u00d5":7,"\u00d4":7,"\u00d3":7,"\u00d2":7,"\u00c7":7,"\u00c6":16,"\u00c5":20,"\u00c4":20,"\u00c3":20,"\u00c2":20,"\u00c1":20,"\u00c0":20,"\u00bb":10,"\u00ab":12,"}":-4,"z":5,"y":5,"x":6,"w":5,"v":5,"u":6,"t":4,"s":12,"r":7,"q":14,"p":5,"o":15,"n":7,"m":7,"l":-11,"k":-11,"h":-11,"g":16,"f":3,"e":15,"d":14,"c":15,"b":-22,"a":13,"]":-2,"S":2,"Q":7,"O":7,"G":7,"C":7,"A":20,"@":9,";":11,":":10,"7":-5,"6":5,"4":8,"0":4,"\/":12,".":16,"-":11,",":16,"&":5}},"X":{"d":"232,-265v7,1,5,27,-3,25v-8,0,-15,3,-19,8r-68,98r61,98v3,17,38,0,38,22v1,8,-3,12,-7,14r-93,0v-7,-1,-6,-24,2,-25r23,0r-52,-84r-50,82v6,8,29,-8,26,13v1,9,-3,13,-7,14r-75,0v-10,-5,-5,-31,12,-26v7,-2,12,-2,16,-8r61,-100r-66,-106v-12,-2,-26,7,-26,-10v0,-9,3,-13,7,-15r90,0v6,2,5,25,-3,25v-16,0,-24,0,-18,8r45,73r56,-81v-13,-3,-35,8,-34,-10v0,-9,3,-13,7,-15r77,0","w":243,"k":{"\u2014":7,"\u2013":7,"\u00ff":12,"\u00fe":-18,"\u00fd":12,"\u00ef":-11,"\u00d8":7,"\u00d6":7,"\u00d5":7,"\u00d4":7,"\u00d3":7,"\u00d2":7,"\u00c7":7,"}":-3,"y":12,"w":7,"v":11,"l":-6,"k":-6,"h":-6,"b":-17,"]":-2,"Q":7,"O":7,"G":7,"C":7,"-":7}},"Y":{"d":"176,-25v7,1,5,27,-3,25r-126,0v-7,-1,-6,-25,3,-25v15,0,46,5,46,-7r0,-66r-77,-142v-11,-2,-26,7,-24,-10v-1,-9,2,-14,6,-15r87,0v7,1,5,27,-3,25v-14,1,-21,2,-17,10r50,101r55,-111v-13,-3,-33,8,-32,-10v0,-9,3,-13,7,-15r76,0v7,3,8,25,-6,25v-8,0,-13,3,-16,8r-69,134r0,73r43,0","w":225,"k":{"\u00fe":-28,"\u00ef":-21,"\u00ee":-9,"\u00ec":-11,"\u00e3":7,"\u00c6":8,"}":-9,"z":2,"w":7,"v":7,"t":3,"s":7,"p":5,"g":15,"b":-27,"]":-7,"\\":-2,"T":-2,"S":3,"G":11,"@":5,";":5,":":5,"7":-10,"4":5,".":3,",":3,"*":-4,"\"":-2,"C":10,"O":10,"Q":10,"\u00c7":10,"\u00d2":10,"\u00d3":10,"\u00d4":10,"\u00d5":10,"\u00d6":10,"\u00d8":10,"y":8,"\u00fd":8,"\u00ff":8,"-":11,"\u2013":11,"\u2014":11,"\u00ab":11,"A":12,"\u00c0":12,"\u00c1":12,"\u00c2":12,"\u00c3":12,"\u00c4":12,"\u00c5":12,"a":7,"\u00e0":7,"\u00e1":7,"\u00e2":7,"\u00e4":7,"\u00e5":7,"\u00e6":7,"h":-16,"k":-16,"l":-16,"c":14,"e":14,"o":14,"\u00e7":14,"\u00e8":14,"\u00e9":14,"\u00ea":14,"\u00eb":14,"\u00f2":14,"\u00f3":14,"\u00f4":14,"\u00f5":14,"\u00f6":14,"\u00f8":14,"d":13,"q":13,"\u00bb":6,"u":8,"\u00f9":8,"\u00fa":8,"\u00fb":8,"\u00fc":8,"m":3,"n":3,"r":3,"\u00f1":3}},"Z":{"d":"189,-53v4,-7,25,-4,24,5r-16,48r-183,0r0,-13r145,-224r-114,0v-6,10,0,30,-16,30v-28,0,-7,-39,-8,-58r190,0r0,12r-145,226r110,0","w":225,"k":{"\u2014":17,"\u2013":17,"\u00ff":2,"\u00fe":-12,"\u00fd":2,"\u00d8":2,"\u00d6":2,"\u00d5":2,"\u00d4":2,"\u00d3":2,"\u00d2":2,"\u00c7":2,"\u00ae":6,"y":2,"w":2,"v":2,"b":-11,"Q":2,"O":2,"G":3,"C":2,"4":8,"-":17}},"[":{"d":"67,3v17,4,48,-11,46,13v0,8,-1,12,-5,12r-75,0r0,-322r75,0v4,0,6,5,6,13v1,23,-30,8,-47,12r0,272","w":114,"k":{"\u00ff":4,"\u00fe":-22,"\u00fd":4,"\u00fc":4,"\u00fb":4,"\u00fa":4,"\u00f9":4,"\u00f8":-4,"\u00f6":4,"\u00f5":4,"\u00f4":4,"\u00f3":4,"\u00f2":4,"\u00eb":4,"\u00ea":4,"\u00e9":4,"\u00e8":4,"\u00e7":4,"\u00dd":-8,"\u00d8":1,"\u00d6":5,"\u00d5":5,"\u00d4":5,"\u00d3":5,"\u00d2":5,"\u00c7":5,"\u00c6":-12,"\u00c5":-7,"\u00c4":-7,"\u00c3":-7,"\u00c2":-7,"\u00c1":-7,"\u00c0":-7,"y":4,"w":5,"v":5,"u":4,"o":4,"l":-10,"k":-10,"j":-14,"h":-10,"e":4,"c":4,"b":-21,"Y":-8,"X":-4,"W":-8,"V":-5,"Q":5,"O":5,"J":-7,"G":5,"C":5,"A":-7}},"\\":{"d":"7,-282v2,-9,22,-7,29,0r119,307v-1,7,-26,6,-31,0","w":160,"k":{"\u201d":10,"\u2019":10,"\u00ff":6,"\u00fd":6,"\u00dc":7,"\u00db":7,"\u00da":7,"\u00d9":7,"\u00c6":-5,"y":6,"w":5,"v":6,"j":-11,"W":11,"V":12,"U":7,"T":7,"J":-5,"7":5,"'":11,"\"":11}},"]":{"d":"48,-269v-17,-4,-48,11,-47,-12v0,-8,2,-13,6,-13r75,0r0,322r-75,0v-4,0,-5,-4,-5,-12v-2,-25,29,-9,46,-13r0,-272","w":114},"^":{"d":"24,-147v-9,0,-14,-5,-14,-15r80,-86v7,-9,19,-7,26,0r81,87v-1,7,-5,15,-14,14r-81,-71","w":207},"_":{"d":"207,29r0,21r-207,0r0,-21r207,0","w":207},"`":{"d":"37,-250v0,-17,9,-27,26,-28r48,50v1,12,-8,19,-17,19","w":187},"a":{"d":"119,-102v2,-47,-11,-54,-53,-53v8,17,-3,35,-22,35v-15,0,-23,-9,-24,-25v5,-29,38,-32,73,-34v76,-4,58,84,60,154v13,3,36,-9,34,11v5,24,-39,15,-56,16v-5,-2,-7,-6,-10,-14v-35,28,-110,20,-109,-34v1,-50,51,-61,107,-56xm48,-51v0,38,50,31,71,10r0,-34v-32,-1,-72,-3,-71,24","k":{"\u00ae":5,"}":-7,"w":4,"v":4,"]":-6,"\\":9,"W":16,"V":18,"T":11,"7":6,"*":15,"\u2019":15,"\u201d":15,"y":4,"\u00fd":4,"\u00ff":4,"\"":26,"'":26,"Y":5,"\u00dd":5,"\u2018":13,"\u201c":13,"U":5,"\u00d9":5,"\u00da":5,"\u00db":5,"\u00dc":5}},"b":{"d":"143,-88v0,-56,-51,-78,-83,-44r0,96v39,28,83,1,83,-52xm-12,-257v-2,-29,36,-17,64,-21v8,-1,9,14,8,24r0,89v60,-38,119,6,119,76v0,69,-68,115,-123,77v-5,16,-29,21,-38,4r8,-32r0,-208v-15,-3,-36,7,-38,-9","w":193,"k":{"}":5,"x":8,"w":2,"v":2,"j":2,"f":2,"]":4,"\\":9,"W":16,"V":18,"T":21,"J":3,"?":7,"7":10,"1":5,"*":15,")":7,"\u2019":14,"\u201d":14,"y":2,"\u00fd":2,"\u00ff":2,"\"":26,"'":26,"Y":14,"\u00dd":14,"\u2018":14,"\u201c":14,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"h":2,"k":2,"l":2,"m":2,"n":2,"r":2,"\u00f1":2,"i":2,"\u00ec":2,"\u00ed":2,"\u00ee":2,"\u00ef":2}},"c":{"d":"162,-148v5,34,-47,33,-48,6v0,-4,0,-9,1,-13v-45,-5,-62,24,-65,65v-5,73,63,78,104,44v8,3,17,16,11,24v-59,51,-151,24,-151,-68v0,-52,36,-89,87,-89v33,0,58,6,61,31","w":176,"k":{"\u00f0":1,"g":2,"\\":5,"W":5,"V":8,"T":7,"?":5,"7":7,"*":9,"\u2019":8,"\u201d":8,"\"":19,"'":19,"Y":8,"\u00dd":8,"-":3,"\u2013":3,"\u2014":3,"\u2018":7,"\u201c":7,"U":2,"\u00d9":2,"\u00da":2,"\u00db":2,"\u00dc":2,"\u00ab":4,"c":1,"e":1,"o":1,"\u00e7":1,"\u00e8":1,"\u00e9":1,"\u00ea":1,"\u00eb":1,"\u00f2":1,"\u00f3":1,"\u00f4":1,"\u00f5":1,"\u00f6":1,"\u00f8":1}},"d":{"d":"96,-256v-5,-29,37,-19,64,-22v8,-1,9,14,8,23r0,230v14,3,34,-8,34,11v0,23,-36,15,-56,16v-7,-2,-7,-6,-11,-14v-56,40,-120,0,-120,-78v0,-63,51,-101,118,-86r0,-72v-14,-3,-35,7,-37,-8xm51,-90v-6,58,43,86,82,49r0,-100v-38,-28,-88,-2,-82,51","w":201,"k":{"\u201d":5,"\u201c":4,"\u2019":5,"\u2018":4,"\u2014":6,"\u2013":6,"\u00ff":2,"\u00fd":2,"\u00ae":4,"}":-6,"y":2,"w":2,"v":2,"]":-4,"-":6,"*":4,"'":4,"\"":4}},"e":{"d":"92,4v-50,0,-78,-40,-78,-94v0,-55,35,-88,86,-89v46,0,70,31,69,79v-8,37,-79,14,-119,20v4,33,14,55,46,56v23,2,44,-17,57,-22v7,1,14,13,14,19v-14,25,-48,31,-75,31xm133,-106v6,-46,-38,-57,-66,-35v-10,9,-16,20,-17,35r83,0","w":182,"k":{"x":3,"\\":8,"W":12,"V":13,"T":10,"J":3,"?":6,"7":9,"*":13,")":5,"\u2019":12,"\u201d":12,"\"":24,"'":24,"Y":8,"\u00dd":8,"\u2018":12,"\u201c":12,"U":3,"\u00d9":3,"\u00da":3,"\u00db":3,"\u00dc":3}},"f":{"d":"119,-25v8,1,6,25,-3,25r-100,0v-7,-1,-5,-27,3,-25v17,-1,24,1,26,-7r0,-117r-34,0v0,-17,0,-24,8,-27v29,2,26,-5,26,-29v0,-44,17,-67,55,-73v44,-7,59,49,19,53v-16,1,-25,-11,-24,-30v-22,0,-15,51,-16,79r47,0v7,1,8,27,-3,27r-44,0r0,124r40,0","w":139,"k":{"\u2014":12,"\u2013":12,"\u00f8":3,"\u00f6":3,"\u00f5":3,"\u00f4":3,"\u00f3":3,"\u00f2":3,"\u00f0":3,"\u00eb":3,"\u00ea":3,"\u00e9":3,"\u00e8":3,"\u00e7":3,"\u00de":-7,"\u00dd":-25,"\u00dc":-12,"\u00db":-12,"\u00da":-12,"\u00d9":-12,"\u00d1":-7,"\u00d0":-7,"\u00cf":-7,"\u00ce":-7,"\u00cd":-7,"\u00cc":-7,"\u00cb":-7,"\u00ca":-7,"\u00c9":-7,"\u00c8":-7,"\u00ab":7,"}":-13,"q":2,"o":3,"g":1,"e":3,"d":2,"c":3,"]":-11,"\\":-7,"Z":-2,"Y":-25,"X":-15,"W":-26,"V":-23,"U":-12,"T":-13,"R":-7,"P":-7,"N":-7,"M":-7,"L":-7,"K":-7,"J":-10,"I":-7,"H":-7,"F":-7,"E":-7,"D":-7,"B":-7,"?":-9,"7":-13,"-":12,"*":-8,"'":-5,"\"":-5}},"g":{"d":"198,-158v1,17,-24,22,-32,10v-6,-5,-13,-8,-21,-9v39,47,-13,108,-76,95v-13,13,-2,28,16,28v50,-1,97,-2,97,48v0,73,-171,92,-171,15v0,-24,18,-36,30,-50v-13,-14,-17,-34,3,-51v-14,-9,-26,-26,-25,-48v4,-71,84,-56,158,-56v14,0,21,5,21,18xm148,13v0,-28,-51,-20,-83,-21v-26,22,-31,58,23,58v28,0,60,-13,60,-37xm94,-156v-46,-6,-49,66,-10,68v44,5,49,-67,10,-68","w":198,"k":{"\u201c":10,"\u2018":10,"\u2014":3,"\u2013":3,"\u00f0":1,"\u00dd":-2,"\u00d8":-4,"\u00d6":-4,"\u00d5":-4,"\u00d4":-4,"\u00d3":-4,"\u00d2":-4,"\u00c7":-4,"\u00c5":-3,"\u00c4":-3,"\u00c3":-3,"\u00c2":-3,"\u00c1":-3,"\u00c0":-3,"\u00ab":5,"Y":-2,"X":-3,"W":-2,"T":3,"S":-3,"Q":-4,"O":-4,"G":-4,"C":-4,"A":-3,"?":7,"7":11,"-":3,"*":13,"'":14,"\"":14}},"h":{"d":"-1,-257v-2,-30,39,-17,64,-21v8,-1,9,14,8,24r0,94v19,-10,34,-18,57,-19v78,-8,51,87,56,154v13,2,32,-8,32,11v0,8,-3,12,-7,14r-80,0v-8,-1,-6,-26,2,-25v35,4,13,-37,19,-60v-1,-40,0,-61,-31,-61v-16,0,-32,6,-48,19r0,102v13,3,36,-9,34,11v1,9,-3,13,-7,14r-90,0v-7,-2,-4,-25,3,-25v17,0,24,1,26,-7r0,-216v-15,-3,-37,7,-38,-9","w":219,"k":{"\u00f0":1,"\u00ae":6,"w":7,"v":7,"t":3,"p":2,"j":3,"\\":11,"W":18,"V":20,"T":14,"J":4,"?":5,"7":8,"*":15,"\u2019":15,"\u201d":15,"y":7,"\u00fd":7,"\u00ff":7,"\"":27,"'":27,"Y":10,"\u00dd":10,"-":4,"\u2013":4,"\u2014":4,"\u2018":13,"\u201c":13,"U":7,"\u00d9":7,"\u00da":7,"\u00db":7,"\u00dc":7,"c":1,"e":1,"o":1,"\u00e7":1,"\u00e8":1,"\u00e9":1,"\u00ea":1,"\u00eb":1,"\u00f2":1,"\u00f3":1,"\u00f4":1,"\u00f5":1,"\u00f6":1,"\u00f8":1,"u":3,"\u00f9":3,"\u00fa":3,"\u00fb":3,"\u00fc":3}},"i":{"d":"82,-248v0,14,-10,24,-25,24v-14,0,-23,-9,-24,-24v-1,-14,10,-23,24,-24v13,-1,25,11,25,24xm6,-158v-2,-30,39,-17,64,-21v8,-2,9,14,8,24r0,130v13,3,36,-9,34,11v1,9,-3,13,-7,14r-89,0v-8,-1,-6,-25,2,-25v17,0,24,1,26,-7r0,-117v-15,-3,-37,7,-38,-9","w":116,"k":{"\u00f0":2,"\u00ae":5,"w":4,"v":4,"t":2,"p":1,"j":2,"*":5,"\u2019":6,"\u201d":6,"y":4,"\u00fd":4,"\u00ff":4,"\"":5,"'":5,"-":6,"\u2013":6,"\u2014":6,"\u2018":6,"\u201c":6,"c":2,"e":2,"o":2,"\u00e7":2,"\u00e8":2,"\u00e9":2,"\u00ea":2,"\u00eb":2,"\u00f2":2,"\u00f3":2,"\u00f4":2,"\u00f5":2,"\u00f6":2,"\u00f8":2,"u":2,"\u00f9":2,"\u00fa":2,"\u00fb":2,"\u00fc":2}},"j":{"d":"-16,53v-3,-22,34,-34,41,-12v11,0,16,-14,16,-41r0,-149v-16,-2,-41,8,-38,-14v3,-23,32,-12,65,-16v8,-2,7,14,7,24v-4,95,23,228,-67,232v-14,1,-22,-9,-24,-24xm79,-248v0,14,-10,24,-25,24v-14,0,-23,-9,-24,-24v-1,-14,10,-23,24,-24v13,-1,25,11,25,24","w":99,"k":{"g":1,"W":-3}},"k":{"d":"-1,-257v-2,-30,39,-17,64,-21v8,-1,9,14,8,24r0,229v11,2,25,-6,23,11v1,9,-3,13,-7,14r-79,0v-7,-2,-4,-25,3,-25v17,0,24,1,26,-7r0,-216v-15,-3,-37,7,-38,-9xm203,-25v8,0,6,25,-3,25r-45,0r-82,-105r71,-71v21,-1,57,-5,40,25v-18,-1,-25,1,-32,8r-39,39r62,67v7,8,16,12,28,12","w":212,"k":{"\u201d":14,"\u201c":16,"\u2019":14,"\u2018":16,"\u2014":13,"\u2013":13,"\u00ff":2,"\u00fd":2,"\u00fc":2,"\u00fb":2,"\u00fa":2,"\u00f9":2,"\u00f8":5,"\u00f6":5,"\u00f5":5,"\u00f4":5,"\u00f3":5,"\u00f2":5,"\u00f0":5,"\u00eb":5,"\u00ea":5,"\u00e9":5,"\u00e8":5,"\u00e7":5,"\u00dd":5,"\u00dc":8,"\u00db":8,"\u00da":8,"\u00d9":8,"\u00ab":9,"y":2,"w":2,"v":2,"u":2,"t":2,"q":4,"o":5,"g":3,"e":5,"d":4,"c":5,"\\":7,"Y":5,"W":16,"V":17,"U":8,"T":17,"J":4,"?":5,"7":8,"-":13,"*":19,"'":20,"\"":20}},"l":{"d":"-1,-257v-2,-30,39,-17,64,-21v8,-1,9,14,8,24r0,229v13,3,36,-9,34,11v1,9,-3,13,-7,14r-90,0v-7,-2,-4,-25,3,-25v17,0,24,1,26,-7r0,-216v-15,-3,-37,7,-38,-9","w":109,"k":{"\u201d":6,"\u201c":5,"\u2019":6,"\u2018":5,"\u2014":7,"\u2013":7,"\u00ff":4,"\u00fd":4,"\u00fc":2,"\u00fb":2,"\u00fa":2,"\u00f9":2,"\u00f8":1,"\u00f6":1,"\u00f5":1,"\u00f4":1,"\u00f3":1,"\u00f2":1,"\u00f0":2,"\u00eb":1,"\u00ea":1,"\u00e9":1,"\u00e8":1,"\u00e7":1,"\u00b7":6,"\u00ae":5,"y":4,"w":4,"v":4,"u":2,"t":2,"p":1,"o":1,"j":2,"e":1,"c":1,"-":7,"*":5,"'":5,"\"":5}},"m":{"d":"62,-180v15,1,12,6,13,22v33,-21,85,-34,107,3v43,-32,122,-39,122,43r0,87v15,2,34,-8,32,13v0,8,-3,12,-7,12r-80,0v-7,-1,-8,-25,2,-25v34,0,14,-37,18,-60v11,-73,-38,-77,-78,-41r0,101v15,2,34,-8,32,13v0,8,-2,12,-7,12r-80,0v-8,-2,-6,-25,3,-25v34,0,15,-37,18,-60v10,-72,-38,-77,-79,-41r0,101v13,3,36,-9,34,11v1,9,-3,13,-7,14r-89,0v-8,-2,-5,-25,2,-25v17,-1,24,1,26,-7r0,-117v-16,-3,-38,9,-38,-13v0,-22,38,-14,56,-18","w":339,"k":{"\u00f0":1,"\u00ae":6,"w":7,"v":7,"t":3,"p":2,"j":3,"\\":11,"W":18,"V":20,"T":14,"J":4,"?":5,"7":8,"*":15,"\u2019":15,"\u201d":15,"y":7,"\u00fd":7,"\u00ff":7,"\"":27,"'":27,"Y":10,"\u00dd":10,"-":4,"\u2013":4,"\u2014":4,"\u2018":13,"\u201c":13,"U":7,"\u00d9":7,"\u00da":7,"\u00db":7,"\u00dc":7,"c":1,"e":1,"o":1,"\u00e7":1,"\u00e8":1,"\u00e9":1,"\u00ea":1,"\u00eb":1,"\u00f2":1,"\u00f3":1,"\u00f4":1,"\u00f5":1,"\u00f6":1,"\u00f8":1,"u":3,"\u00f9":3,"\u00fa":3,"\u00fb":3,"\u00fc":3}},"n":{"d":"62,-180v15,1,12,6,13,22v44,-32,116,-32,116,46r0,87v13,2,32,-8,32,11v0,8,-3,12,-7,14r-80,0v-8,-1,-6,-27,3,-25v34,3,15,-37,18,-60v10,-72,-38,-77,-79,-41r0,101v13,3,36,-9,34,11v1,9,-3,13,-7,14r-89,0v-8,-1,-6,-25,2,-25v17,0,24,1,26,-7r0,-117v-16,-3,-40,9,-38,-14v1,-21,39,-13,56,-17","w":226,"k":{"\u00f0":1,"\u00ae":6,"w":7,"v":7,"t":3,"p":2,"j":3,"\\":11,"W":18,"V":20,"T":14,"J":4,"?":5,"7":8,"*":15,"\u2019":15,"\u201d":15,"y":7,"\u00fd":7,"\u00ff":7,"\"":27,"'":27,"Y":10,"\u00dd":10,"-":4,"\u2013":4,"\u2014":4,"\u2018":13,"\u201c":13,"U":7,"\u00d9":7,"\u00da":7,"\u00db":7,"\u00dc":7,"c":1,"e":1,"o":1,"\u00e7":1,"\u00e8":1,"\u00e9":1,"\u00ea":1,"\u00eb":1,"\u00f2":1,"\u00f3":1,"\u00f4":1,"\u00f5":1,"\u00f6":1,"\u00f8":1,"u":3,"\u00f9":3,"\u00fa":3,"\u00fb":3,"\u00fc":3}},"o":{"d":"178,-89v0,56,-32,93,-87,93v-53,0,-76,-40,-77,-94v-1,-53,35,-89,88,-89v47,0,77,41,76,90xm97,-152v-35,-1,-46,25,-47,61v-1,39,13,66,47,67v32,0,45,-31,45,-65v-1,-39,-11,-62,-45,-63","w":192,"k":{"}":5,"x":8,"w":2,"v":2,"j":2,"f":2,"]":4,"\\":9,"W":16,"V":18,"T":21,"J":3,"?":7,"7":10,"1":5,"*":15,")":7,"\u2019":14,"\u201d":14,"y":2,"\u00fd":2,"\u00ff":2,"\"":26,"'":26,"Y":14,"\u00dd":14,"\u2018":14,"\u201c":14,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"h":2,"k":2,"l":2,"m":2,"n":2,"r":2,"\u00f1":2,"i":2,"\u00ec":2,"\u00ed":2,"\u00ee":2,"\u00ef":2}},"p":{"d":"192,-89v0,67,-60,111,-118,81r0,60v16,4,45,-10,44,11v1,9,-3,13,-8,14r-99,0v-8,-1,-6,-27,3,-25v18,-1,23,0,26,-7r0,-194v-16,-2,-42,8,-39,-14v3,-22,45,-13,66,-16v4,3,3,7,3,17v57,-43,122,-1,122,73xm156,-88v8,-56,-53,-79,-82,-43r0,97v38,23,89,-1,82,-54","w":206,"k":{"}":5,"x":8,"w":2,"v":2,"j":2,"f":2,"]":4,"\\":9,"W":16,"V":18,"T":21,"J":3,"?":7,"7":10,"1":5,"*":15,")":7,"\u2019":14,"\u201d":14,"y":2,"\u00fd":2,"\u00ff":2,"\"":26,"'":26,"Y":14,"\u00dd":14,"\u2018":14,"\u201c":14,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"h":2,"k":2,"l":2,"m":2,"n":2,"r":2,"\u00f1":2,"i":2,"\u00ec":2,"\u00ed":2,"\u00ee":2,"\u00ef":2}},"q":{"d":"197,52v7,2,4,25,-3,25r-102,0v-8,-1,-6,-26,3,-25v14,-1,41,3,38,-7r0,-56v-12,8,-30,15,-53,15v-46,0,-65,-41,-65,-94v0,-68,59,-105,129,-83v5,-15,28,-20,37,-4r-13,43r0,186r29,0xm51,-90v0,56,43,87,82,49r0,-100v-38,-28,-82,-2,-82,51","w":196,"k":{"\u00dd":8,"\u00dc":4,"\u00db":4,"\u00da":4,"\u00d9":4,"g":2,"\\":5,"Y":8,"W":9,"V":12,"U":4,"T":20,"J":-26,"?":5,"7":11,"*":5,")":5,"'":5,"\"":5}},"r":{"d":"6,-162v2,-24,42,-14,65,-17v5,3,2,18,3,28v19,-24,77,-46,83,-4v5,32,-46,33,-47,4v-16,8,-23,21,-32,34r0,92v16,4,47,-11,47,11v0,9,-3,13,-7,14r-102,0v-11,-8,-6,-32,15,-25v6,-1,12,-2,13,-7r0,-116v-16,-3,-41,9,-38,-14","w":158,"k":{"T":4,"?":6,"7":10,"*":3,"'":12,"\"":12}},"s":{"d":"38,-57v16,-1,28,17,23,33v35,8,73,-16,45,-41v-31,-17,-89,-18,-89,-66v0,-30,29,-48,63,-48v33,0,66,9,66,35v0,13,-10,24,-24,24v-18,0,-29,-14,-22,-35v-43,-8,-73,30,-27,46v41,14,76,18,76,63v0,35,-30,50,-65,50v-32,0,-71,-7,-71,-36v0,-16,11,-24,25,-25","w":162,"k":{"\u201d":10,"\u201c":8,"\u2019":10,"\u2018":8,"\u00dd":6,"\u00dc":3,"\u00db":3,"\u00da":3,"\u00d9":3,"\\":7,"Y":6,"W":7,"V":10,"U":3,"T":9,"J":3,"?":6,"7":9,"*":11,")":5,"'":22,"\"":22}},"t":{"d":"121,-15v-25,31,-83,28,-83,-30r0,-104r-33,0v0,-18,-1,-24,7,-27v56,12,10,-53,60,-56r0,56r48,0v7,2,6,27,-4,27r-44,0r0,104v-3,42,47,-4,49,30","w":128,"k":{"\u201d":8,"\u201c":6,"\u2019":8,"\u2018":6,"\u00ab":6,"W":2,"V":3,"T":9,"?":5,"7":7,"*":7,"'":9,"\"":9}},"u":{"d":"174,3v-22,0,-21,-4,-27,-20v-44,39,-112,23,-112,-42r0,-90v-14,-2,-33,8,-31,-13v0,-6,1,-9,3,-10v20,-5,38,-7,54,-7v7,-1,8,12,8,22v0,56,-19,155,59,122r17,-11r0,-103v-15,-2,-33,7,-32,-13v2,-20,34,-15,52,-17v16,-2,13,7,14,22r0,132v14,3,36,-9,34,12v2,21,-27,13,-39,16","w":216,"k":{"\u00f0":2,"\u00ae":5,"w":4,"v":4,"t":2,"p":1,"j":2,"\\":9,"W":18,"V":20,"T":14,"J":4,"?":5,"7":8,"*":12,"\u2019":9,"\u201d":9,"y":4,"\u00fd":4,"\u00ff":4,"\"":12,"'":12,"Y":7,"\u00dd":7,"-":5,"\u2013":5,"\u2014":5,"\u2018":10,"\u201c":10,"U":7,"\u00d9":7,"\u00da":7,"\u00db":7,"\u00dc":7,"c":2,"e":2,"o":2,"\u00e7":2,"\u00e8":2,"\u00e9":2,"\u00ea":2,"\u00eb":2,"\u00f2":2,"\u00f3":2,"\u00f4":2,"\u00f5":2,"\u00f6":2,"\u00f8":2,"u":2,"\u00f9":2,"\u00fa":2,"\u00fb":2,"\u00fc":2}},"v":{"d":"120,-151v-8,-2,-5,-25,2,-25r66,0v8,3,5,31,-10,25v-4,1,-7,3,-9,7r-58,144v-4,5,-25,5,-27,0r-59,-151v-12,-2,-26,6,-24,-11v-1,-9,3,-13,7,-14r76,0v7,1,5,27,-3,25v-10,0,-15,2,-15,7r34,97r43,-104r-23,0","w":192,"k":{"\u201c":7,"\u2018":7,"\u2014":4,"\u2013":4,"\u00f8":3,"\u00f6":3,"\u00f5":3,"\u00f4":3,"\u00f3":3,"\u00f2":3,"\u00f0":4,"\u00eb":3,"\u00ea":3,"\u00e9":3,"\u00e8":3,"\u00e7":3,"\u00de":3,"\u00dd":7,"\u00dc":2,"\u00db":2,"\u00da":2,"\u00d9":2,"\u00d1":3,"\u00d0":3,"\u00cf":3,"\u00ce":3,"\u00cd":3,"\u00cc":3,"\u00cb":3,"\u00ca":3,"\u00c9":3,"\u00c8":3,"\u00c5":7,"\u00c4":7,"\u00c3":7,"\u00c2":7,"\u00c1":7,"\u00c0":7,"\u00ab":5,"}":5,"q":3,"o":3,"l":4,"k":4,"h":4,"g":2,"e":3,"d":3,"c":3,"]":5,"Y":7,"X":10,"W":3,"V":4,"U":2,"T":29,"R":3,"P":3,"N":3,"M":3,"L":3,"K":3,"J":3,"I":3,"H":3,"F":3,"E":3,"D":3,"B":3,"A":7,"?":10,"7":13,"1":9,"\/":5,".":12,"-":4,",":12,"*":11,")":7,"'":12,"\"":12}},"w":{"d":"201,-151v-7,-1,-5,-25,2,-25r66,0v6,2,6,27,-3,25v-8,0,-13,1,-15,7r-43,144v-1,5,-26,5,-26,0r-41,-103r-42,103v-5,5,-25,6,-28,0r-43,-151v-12,-2,-27,7,-27,-11v0,-8,3,-12,7,-14r77,0v7,1,4,25,-3,25v-10,0,-16,2,-16,7r24,106r44,-121v1,-5,17,-5,18,0r45,123r27,-115r-23,0","w":274,"k":{"\u201c":8,"\u2018":8,"\u00f8":2,"\u00f6":2,"\u00f5":2,"\u00f4":2,"\u00f3":2,"\u00f2":2,"\u00f0":3,"\u00eb":2,"\u00ea":2,"\u00e9":2,"\u00e8":2,"\u00e7":2,"\u00de":2,"\u00dd":7,"\u00dc":2,"\u00db":2,"\u00da":2,"\u00d9":2,"\u00d1":2,"\u00d0":2,"\u00cf":2,"\u00ce":2,"\u00cd":2,"\u00cc":2,"\u00cb":2,"\u00ca":2,"\u00c9":2,"\u00c8":2,"\u00c5":3,"\u00c4":3,"\u00c3":3,"\u00c2":3,"\u00c1":3,"\u00c0":3,"}":4,"q":2,"o":2,"l":3,"k":3,"h":3,"g":2,"e":2,"d":2,"c":2,"]":5,"Y":7,"X":5,"W":3,"V":5,"U":2,"T":26,"R":2,"P":2,"N":2,"M":2,"L":2,"K":2,"J":2,"I":2,"H":2,"F":2,"E":2,"D":2,"B":2,"A":3,"?":10,"7":13,"1":8,"\/":4,".":9,",":9,"*":11,")":7,"'":12,"\"":12}},"x":{"d":"194,-176v8,2,5,25,-2,25v-9,0,-16,2,-20,7r-46,59v23,20,28,58,70,60v7,0,5,27,-3,25r-75,0v-6,-1,-6,-26,3,-25r15,0r-39,-48v-10,16,-23,29,-32,46v4,6,17,-5,17,13v0,28,-48,8,-71,14v-7,-2,-8,-28,6,-25v36,-8,42,-45,65,-66r-48,-60v-11,-2,-28,7,-26,-10v-1,-9,2,-14,6,-15r77,0v7,1,5,27,-3,25v-10,0,-14,1,-10,6r33,42r36,-48v-12,-2,-26,7,-26,-11v0,-29,49,-8,73,-14","w":206,"k":{"\u201c":6,"\u2018":6,"\u2014":4,"\u2013":4,"\u00f8":8,"\u00f6":8,"\u00f5":8,"\u00f4":8,"\u00f3":8,"\u00f2":8,"\u00f0":8,"\u00eb":8,"\u00ea":8,"\u00e9":8,"\u00e8":8,"\u00e7":8,"q":7,"o":8,"g":2,"e":8,"d":7,"c":8,"W":4,"V":7,"T":21,"7":5,"-":4,"*":9,"'":11,"\"":11}},"y":{"d":"120,-151v-7,-1,-5,-26,2,-25r66,0v8,3,5,31,-10,25v-4,1,-6,3,-8,7r-75,190v-7,35,-83,46,-87,2v-1,-15,10,-25,22,-26v18,1,25,10,26,28v18,-7,21,-34,28,-51r-59,-150v-12,-1,-24,6,-24,-11v0,-8,3,-12,7,-14r76,0v9,2,5,26,-3,25v-10,0,-15,2,-15,7r36,105r41,-112r-23,0","w":193,"k":{"\u00f0":3,"}":5,"g":2,"]":5,"X":9,"W":3,"V":4,"T":29,"J":3,"?":10,"7":13,"1":9,"\/":5,".":11,",":11,"*":11,")":7,"\"":12,"'":12,"Y":7,"\u00dd":7,"-":3,"\u2013":3,"\u2014":3,"U":2,"\u00d9":2,"\u00da":2,"\u00db":2,"\u00dc":2,"\u00ab":5,"B":3,"D":3,"E":3,"F":3,"H":3,"I":3,"K":3,"L":3,"M":3,"N":3,"P":3,"R":3,"\u00c8":3,"\u00c9":3,"\u00ca":3,"\u00cb":3,"\u00cc":3,"\u00cd":3,"\u00ce":3,"\u00cf":3,"\u00d0":3,"\u00d1":3,"\u00de":3,"A":7,"\u00c0":7,"\u00c1":7,"\u00c2":7,"\u00c3":7,"\u00c4":7,"\u00c5":7,"h":4,"k":4,"l":4,"c":2,"e":2,"o":2,"\u00e7":2,"\u00e8":2,"\u00e9":2,"\u00ea":2,"\u00eb":2,"\u00f2":2,"\u00f3":2,"\u00f4":2,"\u00f5":2,"\u00f6":2,"\u00f8":2,"d":3,"q":3}},"z":{"d":"143,-46v5,-6,25,-3,22,5r-13,41r-136,0r0,-19r100,-131r-69,0v-6,12,-1,28,-21,27v-29,-1,-1,-35,-4,-53r140,0r0,20r-100,130r73,0","w":177,"k":{"\u201c":4,"\u2018":4,"\u2014":6,"\u2013":6,"\u00ab":5,"g":1,"\\":5,"V":2,"T":5,"J":2,"?":7,"7":10,"-":6,"*":13,")":4,"'":15,"\"":15}},"{":{"d":"39,-120v72,14,-16,137,73,123v3,0,5,5,5,13v2,21,-19,10,-34,12v-58,7,-46,-58,-47,-111v7,-32,-39,-13,-20,-49v18,-1,19,-8,20,-25v3,-58,-16,-143,47,-137v14,1,34,-9,34,12v0,16,-7,13,-19,13v-68,-1,12,135,-59,149","w":117,"k":{"\u00fe":-24,"\u00fc":4,"\u00fb":4,"\u00fa":4,"\u00f9":4,"\u00f8":-5,"\u00f6":4,"\u00f5":4,"\u00f4":4,"\u00f3":4,"\u00f2":4,"\u00ec":-3,"\u00eb":4,"\u00ea":4,"\u00e9":4,"\u00e8":4,"\u00e7":4,"\u00dd":-10,"\u00d8":1,"\u00d6":5,"\u00d5":5,"\u00d4":5,"\u00d3":5,"\u00d2":5,"\u00c7":5,"\u00c6":-14,"\u00c5":-9,"\u00c4":-9,"\u00c3":-9,"\u00c2":-9,"\u00c1":-9,"\u00c0":-9,"w":5,"v":5,"u":4,"o":4,"l":-11,"k":-11,"j":-15,"h":-11,"e":4,"c":4,"b":-22,"Y":-10,"X":-6,"W":-10,"V":-7,"Q":5,"O":5,"J":-8,"G":5,"C":5,"A":-9}},"|":{"d":"59,80v0,3,-5,5,-14,5v-9,0,-13,-2,-13,-5r0,-363v0,-3,4,-5,13,-5v9,0,14,2,14,5r0,363","w":90,"k":{"\u201d":4,"\u2019":4}},"}":{"d":"78,-120v-78,-15,22,-160,-73,-149v-3,0,-5,-5,-5,-13v-2,-21,19,-11,34,-12v63,-5,44,79,47,137v-5,30,23,14,25,37v1,24,-31,7,-25,37v0,52,9,118,-47,111v-14,-2,-34,9,-34,-12v0,-16,7,-13,19,-13v64,0,-8,-111,59,-123","w":117},"~":{"d":"149,-78v-41,1,-87,-45,-113,-4v-10,1,-17,-9,-17,-16v16,-41,71,-38,106,-16v28,17,40,-1,54,-16v9,0,17,9,17,16v-9,18,-23,35,-47,36","w":214},"\u00a0":{"w":77},"\u00a1":{"d":"50,-183v14,-1,23,10,24,25v1,32,-48,29,-49,2v0,-17,11,-26,25,-27xm35,-103v1,-10,33,-9,30,1r8,174v-9,7,-39,7,-47,0","w":99,"k":{"\u00dd":5,"\u00dc":7,"\u00db":7,"\u00da":7,"\u00d9":7,"Y":5,"W":10,"V":11,"U":7,"T":10,"J":6}},"\u00a2":{"d":"82,-206v-2,-23,-3,-60,25,-41r0,41r-25,0xm107,0v-6,7,-19,6,-25,0r0,-52r25,0r0,52xm159,-182v4,33,-47,32,-49,6v0,-4,1,-9,2,-13v-45,-5,-63,24,-65,65v-4,73,63,77,104,44v8,3,17,16,11,24v-60,50,-151,23,-151,-68v0,-53,35,-91,87,-90v33,1,58,6,61,32","w":176},"\u00a3":{"d":"194,-43v-11,62,-74,48,-124,34v-20,16,-59,19,-59,-15v-1,-26,32,-34,50,-19v5,-12,7,-34,7,-64v-19,-3,-51,11,-47,-17v2,-19,31,-7,47,-10r0,-76v-1,-35,27,-60,63,-58v23,1,46,-1,46,18v0,9,-3,20,-11,22v-28,-12,-61,-14,-61,34r0,60v19,5,53,-13,53,14v0,25,-35,9,-53,13v-1,29,-5,52,-17,74v17,7,32,9,44,9v35,8,24,-36,56,-27v3,2,6,5,6,8","w":204},"\u00a4":{"d":"144,-44v-25,17,-56,17,-81,1r-20,21v-13,0,-26,-13,-26,-25r21,-21v-20,-28,-19,-64,-1,-92r-20,-21v0,-13,12,-26,26,-25r20,21v25,-16,56,-16,81,1v10,-10,22,-32,39,-15v5,5,8,11,8,18r-22,22v18,27,19,62,1,90v10,11,32,22,13,39v-5,5,-12,8,-18,8xm59,-114v0,27,19,51,45,50v29,0,45,-22,45,-50v1,-29,-19,-51,-45,-51v-26,-1,-45,24,-45,51","w":208},"\u00a5":{"d":"166,-25v8,1,6,26,-2,25r-101,0v-9,-5,-4,-33,14,-25v31,5,15,-26,19,-47v-23,-6,-67,17,-65,-18v5,-19,43,-5,64,-9r-16,-39v-18,-3,-47,10,-49,-13v-1,-20,20,-13,37,-14r-32,-75v-11,-2,-25,6,-25,-10v0,-9,3,-13,7,-15r83,0v7,1,5,27,-3,25v-14,1,-22,1,-18,10r40,93r42,-103v-10,-1,-19,5,-19,-10v0,-30,45,-9,68,-15v7,3,7,29,-7,25v-8,0,-13,3,-15,8r-28,67v22,-6,44,9,26,27r-37,0r-15,39r52,0v9,0,9,27,0,27r-53,0r0,47r33,0","w":224},"\u00a6":{"d":"32,-283v0,-3,5,-5,14,-5v9,0,13,2,13,5r0,161r-27,0r0,-161xm59,80v0,3,-4,5,-13,5v-9,0,-14,-2,-14,-5r0,-171r27,0r0,171","w":91},"\u00a7":{"d":"157,-201v-22,0,-35,-24,-22,-44v-31,-15,-83,-3,-80,33v20,60,133,52,131,128v0,10,-3,24,-10,42v32,56,-17,108,-79,108v-35,0,-86,-18,-85,-49v0,-16,11,-28,27,-28v22,-1,34,27,22,44v36,16,90,0,88,-39v-17,-60,-177,-69,-121,-170v-31,-55,15,-102,77,-102v34,0,81,18,79,50v0,15,-12,27,-27,27xm148,-68v4,-52,-59,-58,-92,-82v-5,52,58,58,92,82","w":201},"\u00a8":{"d":"58,-209v-17,1,-27,-10,-27,-24v0,-14,9,-24,24,-25v31,-1,30,48,3,49xm159,-233v0,14,-9,23,-24,24v-14,0,-24,-9,-24,-24v0,-14,9,-24,24,-25v14,0,24,11,24,25","w":187},"\u00a9":{"d":"148,4v-75,0,-136,-56,-136,-136v0,-80,56,-136,136,-136v80,0,137,57,137,136v0,79,-58,136,-137,136xm148,-247v-69,3,-113,46,-113,115v0,69,45,112,113,115v62,2,114,-52,114,-115v0,-63,-51,-118,-114,-115xm187,-165v-14,0,-28,-13,-23,-29v-41,-9,-64,21,-64,62v0,72,61,79,101,44v8,2,17,13,14,24v-57,50,-151,23,-151,-68v0,-52,35,-92,87,-91v32,1,56,7,60,32v2,18,-10,25,-24,26","w":296},"\u00aa":{"d":"133,-128v7,1,8,23,0,23r-107,0v-4,0,-7,-13,-4,-19v1,-3,2,-4,4,-4r107,0xm28,-245v2,-21,28,-22,49,-23v48,-2,40,52,40,99v7,2,21,-4,21,5v0,19,-11,9,-32,12v-6,-1,-8,-6,-10,-12v-16,16,-73,21,-73,-16v0,-39,32,-43,72,-41v1,-25,-13,-33,-38,-31v6,9,-3,22,-13,22v-8,0,-16,-7,-16,-15xm95,-204v-22,0,-50,-4,-49,19v1,26,39,9,49,3r0,-22","w":160},"\u00ab":{"d":"102,-75v-10,-8,-9,-23,0,-31r74,-58v9,-1,16,10,16,16r-54,54r54,62v1,10,-10,16,-16,16xm15,-75v-11,-7,-8,-24,0,-31r74,-58v9,-1,15,11,15,16r-54,54r54,62v1,9,-8,16,-15,16","w":208,"k":{"W":10,"V":11,"T":13,"J":6,"\u2019":12,"\u201d":12,"\"":16,"'":16,"Y":6,"\u00dd":6,"U":7,"\u00d9":7,"\u00da":7,"\u00db":7,"\u00dc":7}},"\u00ac":{"d":"22,-101v-9,0,-10,-27,0,-27r142,0v25,4,9,53,13,78v0,8,-27,10,-27,0r0,-51r-128,0","w":196},"\u00ad":{"d":"35,-90v-9,0,-9,-30,0,-31r79,0v8,1,8,29,0,31r-79,0","w":131},"\u00ae":{"d":"96,-89v-45,0,-84,-38,-84,-83v0,-46,39,-84,84,-84v45,0,83,39,83,84v0,45,-38,83,-83,83xm31,-172v0,52,67,88,106,50v-27,1,-27,-29,-41,-42v-3,0,-7,1,-10,1r0,30v9,-2,23,0,14,11v-13,-2,-48,7,-37,-11v4,-1,6,0,6,-3v-1,-24,2,-52,-1,-74v-9,3,-13,-5,-8,-11v33,0,74,-5,73,27v0,13,-7,23,-20,28v12,12,12,31,33,35v34,-41,1,-108,-50,-108v-35,0,-65,32,-65,67xm86,-176v21,0,28,-2,29,-18v0,-11,-10,-16,-29,-16r0,34","w":191,"k":{"\u00de":4,"\u00d1":4,"\u00d0":4,"\u00cf":4,"\u00ce":4,"\u00cd":4,"\u00cc":4,"\u00cb":4,"\u00ca":4,"\u00c9":4,"\u00c8":4,"\u00c6":6,"\u00c5":10,"\u00c4":10,"\u00c3":10,"\u00c2":10,"\u00c1":10,"\u00c0":10,"l":3,"k":3,"h":3,"R":4,"P":4,"N":4,"M":4,"L":4,"K":4,"J":3,"I":4,"H":4,"F":4,"E":4,"D":4,"B":4,"A":10}},"\u00af":{"d":"37,-217v-2,0,-3,-4,-3,-12v0,-8,1,-12,3,-12r112,0v4,2,3,22,0,24r-112,0","w":187},"\u00b0":{"d":"40,-200v0,20,14,35,35,35v21,0,35,-13,35,-35v0,-21,-16,-37,-35,-37v-19,0,-35,17,-35,37xm139,-200v0,35,-27,64,-64,62v-37,-1,-63,-26,-63,-62v0,-36,27,-64,63,-64v37,0,64,28,64,64","w":150},"\u00b1":{"d":"22,0v-10,-1,-8,-26,0,-27r148,0v8,0,10,27,0,27r-148,0xm17,-114v-2,0,-3,-4,-3,-12v0,-8,1,-13,3,-13r66,0r0,-54v0,-2,5,-3,13,-3v8,0,13,1,13,3r0,54r66,0v2,0,3,5,3,13v0,8,-1,12,-3,12r-66,0r0,60v0,2,-5,3,-13,3v-8,0,-13,-1,-13,-3r0,-60r-66,0","w":192},"\u00b2":{"d":"83,-210v18,-21,-1,-50,-30,-41v-3,1,-6,3,-9,6v15,6,7,36,-9,34v-9,-1,-19,-8,-19,-19v1,-28,25,-35,54,-38v50,-5,68,48,36,74v-20,16,-51,30,-59,55r58,0v1,-10,11,-24,20,-11r-5,36r-100,0v-9,-42,45,-75,63,-96","w":142},"\u00b3":{"d":"33,-167v20,-2,25,23,11,33v18,16,47,3,47,-24v0,-20,-10,-28,-26,-30r0,-9v28,-7,33,-52,1,-55v-10,0,-18,2,-23,7v14,6,9,36,-9,34v-11,0,-18,-9,-18,-20v2,-47,105,-52,105,-1v1,22,-15,31,-30,37v23,9,34,16,35,40v2,27,-22,43,-54,43v-29,0,-55,-12,-56,-36v-1,-11,8,-19,17,-19","w":140},"\u00b4":{"d":"95,-209v-12,1,-17,-11,-18,-19r48,-50v16,0,27,12,27,28","w":187},"\u00b5":{"d":"140,-36v-5,46,-77,55,-91,12v2,21,7,50,16,88v-1,14,-35,19,-36,3r0,-243r34,0v3,55,-12,147,32,147v53,0,42,-84,44,-147v12,2,33,-5,34,7r0,114v-1,27,5,32,29,30v11,8,4,33,-15,26v-33,6,-47,-8,-47,-37","w":217},"\u00b6":{"d":"257,-25v8,1,6,25,-3,25r-157,0v-10,-7,-4,-32,16,-25v6,-1,12,-2,13,-7r0,-79v-65,5,-116,-15,-116,-73v1,-105,146,-77,251,-81v3,0,4,5,4,13v2,21,-23,9,-38,12r0,215r30,0xm126,-237v-74,-14,-96,54,-53,88v12,9,31,12,53,12r0,-100xm163,-25v17,-1,27,1,27,-7r-2,-208r-25,0r0,215","w":277},"\u00b7":{"d":"70,-99v0,15,-11,23,-24,24v-14,0,-24,-9,-24,-24v0,-15,11,-23,24,-24v14,0,24,9,24,24","w":91,"k":{"l":6,"k":6,"h":6,"L":5,"7":9,"1":8}},"\u00b8":{"d":"77,58v32,4,56,-26,13,-27v-12,-8,-1,-22,2,-34r28,0r-6,19v16,3,30,10,30,25v0,24,-22,36,-65,36v-8,1,-9,-20,-2,-19","w":208},"\u00b9":{"d":"49,-232v-11,6,-35,17,-36,-3v0,-2,1,-3,2,-4v23,-7,43,-29,69,-27r0,134v11,3,29,-8,27,9v0,6,-2,9,-4,9r-84,0v-4,-1,-2,-21,2,-18v8,-1,25,2,26,-4v-1,-31,3,-68,-2,-96","w":126},"\u00ba":{"d":"134,-128v7,1,8,23,0,23r-107,0v-4,0,-7,-13,-4,-19v1,-3,2,-4,4,-4r107,0xm139,-208v0,37,-24,62,-63,61v-36,-1,-56,-25,-56,-62v0,-36,28,-59,64,-59v34,0,55,26,55,60xm79,-250v-20,0,-33,17,-33,42v0,27,11,42,34,43v20,0,33,-19,33,-39v0,-28,-10,-45,-34,-46","w":160},"\u00bb":{"d":"106,-105v11,7,8,24,0,31r-74,58v-9,1,-15,-12,-16,-17r54,-53r-54,-62v0,-8,9,-17,16,-16xm194,-105v11,7,8,24,0,31r-74,58v-10,1,-16,-11,-16,-17r54,-53r-54,-62v0,-8,9,-17,16,-16","w":208,"k":{"z":4,"w":5,"v":6,"j":4,"f":4,"Z":7,"W":12,"V":13,"T":16,"J":6,"\u2019":22,"\u201d":22,"y":6,"\u00fd":6,"\u00ff":6,"\"":26,"'":26,"Y":12,"\u00dd":12,"U":5,"\u00d9":5,"\u00da":5,"\u00db":5,"\u00dc":5,"B":5,"D":5,"E":5,"F":5,"H":5,"I":5,"K":5,"L":5,"M":5,"N":5,"P":5,"R":5,"\u00c8":5,"\u00c9":5,"\u00ca":5,"\u00cb":5,"\u00cc":5,"\u00cd":5,"\u00ce":5,"\u00cf":5,"\u00d0":5,"\u00d1":5,"\u00de":5,"m":4,"n":4,"r":4,"\u00f1":4,"i":4,"\u00ec":4,"\u00ed":4,"\u00ee":4,"\u00ef":4}},"\u00bc":{"d":"233,-265v1,-6,28,-8,28,0r-173,265v-2,6,-28,8,-29,0xm213,0v-5,-1,-3,-18,2,-18v8,0,28,2,28,-4r0,-18r-64,0v-3,-1,-5,-4,-6,-9r56,-106v12,0,28,9,29,19r-58,76r43,0v-1,-28,-6,-46,32,-44r0,44v10,3,27,-7,26,8v2,15,-13,12,-26,12r0,22v10,2,24,-6,22,9v0,6,-2,9,-5,9r-79,0xm48,-232v-11,5,-36,18,-36,-3v17,-16,41,-23,64,-33v4,0,6,1,6,2r0,134v11,3,30,-8,28,9v0,6,-2,9,-4,9r-84,0v-6,-1,-2,-21,2,-18v8,-1,25,2,26,-4v-1,-31,3,-68,-2,-96","w":311},"\u00bd":{"d":"232,-265v1,-6,27,-8,27,0r-173,265v-2,6,-28,8,-29,0xm47,-232v-12,7,-41,17,-35,-7v23,-7,43,-29,69,-27r0,134v10,3,30,-8,27,9v0,6,-1,9,-3,9r-85,0v-4,-1,-2,-21,2,-18v8,-1,25,2,26,-4xm217,-131v15,5,8,35,-10,33v-10,-1,-19,-7,-18,-19v2,-27,25,-35,53,-37v50,-4,68,44,37,73v-19,16,-52,30,-59,55r57,0v1,-10,12,-23,21,-11r-5,37r-100,0v-11,-53,61,-72,69,-113v5,-26,-31,-34,-45,-18","w":310},"\u00be":{"d":"235,-265v1,-6,28,-8,28,0r-173,265v-2,6,-28,8,-29,0xm223,0v-7,-9,2,-24,17,-18v20,2,13,-9,14,-22r-64,0v-3,-1,-5,-4,-6,-9r56,-106v12,0,28,9,29,19r-58,76r43,0v-1,-28,-6,-46,32,-44r0,44v10,3,27,-7,26,8v2,15,-13,12,-26,12r0,22v10,2,24,-6,22,9v0,6,-2,9,-5,9r-80,0xm31,-167v20,-2,27,23,12,33v18,16,47,3,47,-24v0,-20,-10,-28,-26,-30r0,-9v28,-7,33,-52,1,-55v-10,0,-18,2,-23,7v14,6,9,36,-9,34v-11,0,-18,-9,-18,-20v2,-47,105,-52,105,-1v1,22,-15,31,-30,37v23,9,33,16,35,40v1,27,-22,43,-55,43v-28,0,-54,-13,-55,-36v0,-11,8,-18,16,-19","w":321},"\u00bf":{"d":"53,11v0,32,29,45,62,37v-11,-17,2,-40,18,-40v17,-1,27,10,27,24v0,35,-40,43,-75,45v-62,4,-92,-69,-50,-110v12,-12,29,-25,43,-36v1,-19,-6,-39,18,-39v25,0,14,24,16,43v-22,20,-59,38,-59,76xm93,-179v18,0,25,8,27,24v2,33,-49,30,-49,3v-1,-16,10,-26,22,-27","w":166,"k":{"\u00fe":-3,"\u00dd":5,"\u00dc":9,"\u00db":9,"\u00da":9,"\u00d9":9,"j":-18,"Y":5,"W":11,"V":12,"U":9,"T":10,"J":-13}},"\u00c0":{"d":"81,-25v7,1,5,26,-2,25r-77,0v-7,-2,-6,-27,6,-25v9,0,14,-3,17,-10r90,-230v1,-5,20,-3,20,0r94,240v12,1,25,-6,25,11v0,8,-3,12,-7,14r-85,0v-8,-2,-5,-26,3,-25v18,-1,23,1,20,-8r-21,-55r-89,0r-25,63r31,0xm85,-115r69,0r-34,-88xm56,-322v0,-17,9,-27,27,-28r48,50v0,11,-9,19,-18,19","w":250,"k":{"\u00ae":10,"}":-8,"w":4,"v":7,"]":-7,"\\":12,"W":19,"V":21,"T":15,"J":5,"G":6,"?":4,"7":6,"*":17}},"\u00c1":{"d":"81,-25v7,1,5,26,-2,25r-77,0v-7,-2,-6,-27,6,-25v9,0,14,-3,17,-10r90,-230v1,-5,20,-3,20,0r94,240v12,1,25,-6,25,11v0,8,-3,12,-7,14r-85,0v-8,-2,-5,-26,3,-25v18,-1,23,1,20,-8r-21,-55r-89,0r-25,63r31,0xm85,-115r69,0r-34,-88xm137,-281v-12,1,-17,-11,-17,-19r48,-50v15,0,27,12,26,28","w":250,"k":{"\u00ae":10,"}":-8,"w":4,"v":7,"]":-7,"\\":12,"W":19,"V":21,"T":15,"J":5,"G":6,"?":4,"7":6,"*":17}},"\u00c2":{"d":"81,-25v7,1,5,26,-2,25r-77,0v-7,-2,-6,-27,6,-25v9,0,14,-3,17,-10r90,-230v1,-5,20,-3,20,0r94,240v12,1,25,-6,25,11v0,8,-3,12,-7,14r-85,0v-8,-2,-5,-26,3,-25v18,-1,23,1,20,-8r-21,-55r-89,0r-25,63r31,0xm85,-115r69,0r-34,-88xm125,-303v-17,4,-35,26,-53,16v-4,-4,-5,-8,-5,-13v22,-11,40,-44,71,-32r45,32v-5,33,-41,3,-58,-3","w":250,"k":{"\u00ae":10,"}":-8,"w":4,"v":7,"]":-7,"\\":12,"W":19,"V":21,"T":15,"J":5,"G":6,"?":4,"7":6,"*":17}},"\u00c3":{"d":"81,-25v7,1,5,26,-2,25r-77,0v-7,-2,-6,-27,6,-25v9,0,14,-3,17,-10r90,-230v1,-5,20,-3,20,0r94,240v12,1,25,-6,25,11v0,8,-3,12,-7,14r-85,0v-8,-2,-5,-26,3,-25v18,-1,23,1,20,-8r-21,-55r-89,0r-25,63r31,0xm85,-115r69,0r-34,-88xm193,-330v19,24,-23,57,-53,46v-21,-7,-49,-36,-68,-7v-7,12,-24,-4,-21,-11v10,-27,51,-49,77,-22v7,4,14,13,24,13v20,2,23,-32,41,-19","w":250,"k":{"\u00ae":10,"}":-8,"w":4,"v":7,"]":-7,"\\":12,"W":19,"V":21,"T":15,"J":5,"G":6,"?":4,"7":6,"*":17}},"\u00c4":{"d":"81,-25v7,1,5,26,-2,25r-77,0v-7,-2,-6,-27,6,-25v9,0,14,-3,17,-10r90,-230v1,-5,20,-3,20,0r94,240v12,1,25,-6,25,11v0,8,-3,12,-7,14r-85,0v-8,-2,-5,-26,3,-25v18,-1,23,1,20,-8r-21,-55r-89,0r-25,63r31,0xm85,-115r69,0r-34,-88xm89,-285v-17,1,-27,-10,-27,-24v0,-14,7,-24,24,-24v16,0,23,11,24,24v1,12,-9,24,-21,24xm190,-309v0,14,-9,23,-24,24v-14,1,-24,-9,-24,-24v0,-14,8,-25,24,-24v13,0,24,10,24,24","w":250,"k":{"\u00ae":10,"}":-8,"w":4,"v":7,"]":-7,"\\":12,"W":19,"V":21,"T":15,"J":5,"G":6,"?":4,"7":6,"*":17}},"\u00c5":{"d":"80,-25v8,1,6,25,-1,25r-77,0v-7,-2,-6,-27,6,-25v9,0,14,-3,17,-10r90,-230v1,-6,20,-2,20,0r93,240v12,2,28,-7,25,11v1,9,-2,12,-6,14r-86,0v-7,-2,-4,-25,3,-25v18,0,25,1,21,-8r-21,-55r-89,0r-25,63r30,0xm85,-115r68,0r-34,-88xm124,-246v-21,0,-39,-15,-38,-37v1,-23,16,-37,38,-37v21,0,38,16,38,37v0,21,-17,38,-38,37xm125,-298v-8,0,-15,7,-15,15v0,8,7,14,15,14v7,0,14,-7,14,-14v0,-8,-6,-15,-14,-15","w":249,"k":{"\u00ae":10,"}":-8,"w":4,"v":7,"]":-7,"\\":12,"W":19,"V":21,"T":15,"J":5,"G":6,"?":4,"7":6,"*":17}},"\u00c6":{"d":"247,-165v1,-7,27,-5,25,3r0,75v0,5,-4,7,-12,7v-22,0,-10,-17,-13,-31r-59,0r3,84v42,-2,99,10,105,-26v2,-6,28,-4,25,5v-2,17,-10,39,-16,48r-180,0v-9,-7,-4,-33,16,-25v7,0,13,-1,13,-7r-3,-79r-69,0r-34,86v11,2,26,-7,24,10v1,9,-2,14,-6,15r-68,0v-9,-2,-5,-26,3,-25v11,-1,16,-2,20,-10r87,-223v2,-4,5,-7,10,-7r196,0v-1,24,10,72,-25,54v2,-47,-68,-19,-106,-26r4,99v30,-3,70,12,60,-27xm146,-237v-3,-7,-16,0,-17,6r-37,93r58,0","w":329,"k":{"\u00fe":-10,"\u00ef":-4,"b":-9,"G":7,"C":6,"O":6,"Q":6,"\u00c7":6,"\u00d2":6,"\u00d3":6,"\u00d4":6,"\u00d5":6,"\u00d6":6,"\u00d8":6,"-":3,"\u2013":3,"\u2014":3}},"\u00c7":{"d":"186,-191v-22,1,-34,-26,-23,-44v-60,-23,-106,29,-104,90v3,73,17,114,72,120v29,3,47,-15,64,-22v7,1,13,12,14,17v-10,24,-49,34,-79,34v-77,0,-111,-56,-112,-133v-2,-81,41,-139,119,-139v33,0,77,20,76,50v0,15,-12,27,-27,27xm101,58v32,4,56,-26,13,-27v-12,-8,-1,-22,2,-34r28,0r-6,19v16,3,30,10,30,25v0,24,-22,36,-65,36v-8,1,-9,-20,-2,-19","w":224,"k":{"\u00ef":-7,"\u00ee":-4,"G":3,"4":5,"C":3,"O":3,"Q":3,"\u00c7":3,"\u00d2":3,"\u00d3":3,"\u00d4":3,"\u00d5":3,"\u00d6":3,"\u00d8":3,"-":27,"\u2013":27,"\u2014":27,"\u00ab":7}},"\u00c8":{"d":"144,-176v1,-7,27,-5,25,3r0,75v0,5,-4,7,-12,7v-22,0,-10,-17,-13,-31r-56,0r0,95r93,0v5,-14,22,-45,37,-21r-16,48r-180,0v-9,-7,-4,-33,16,-25v6,-1,12,-2,13,-7r-2,-208v-15,-3,-37,9,-36,-13v0,-7,1,-12,4,-12r194,0v-1,24,10,72,-25,54v3,-45,-62,-19,-98,-26r0,88v30,-2,65,11,56,-27xm72,-322v0,-17,9,-27,26,-28r48,50v1,12,-8,19,-17,19","w":226,"k":{"\u00fe":-10,"\u00ef":-4,"b":-9,"G":7,"C":6,"O":6,"Q":6,"\u00c7":6,"\u00d2":6,"\u00d3":6,"\u00d4":6,"\u00d5":6,"\u00d6":6,"\u00d8":6,"-":3,"\u2013":3,"\u2014":3}},"\u00c9":{"d":"144,-176v1,-7,27,-5,25,3r0,75v0,5,-4,7,-12,7v-22,0,-10,-17,-13,-31r-56,0r0,95r93,0v5,-14,22,-45,37,-21r-16,48r-180,0v-9,-7,-4,-33,16,-25v6,-1,12,-2,13,-7r-2,-208v-15,-3,-37,9,-36,-13v0,-7,1,-12,4,-12r194,0v-1,24,10,72,-25,54v3,-45,-62,-19,-98,-26r0,88v30,-2,65,11,56,-27xm120,-281v-12,1,-17,-11,-17,-19r48,-50v15,0,26,13,26,28","w":226,"k":{"\u00fe":-10,"\u00ef":-4,"b":-9,"G":7,"C":6,"O":6,"Q":6,"\u00c7":6,"\u00d2":6,"\u00d3":6,"\u00d4":6,"\u00d5":6,"\u00d6":6,"\u00d8":6,"-":3,"\u2013":3,"\u2014":3}},"\u00ca":{"d":"144,-176v1,-7,27,-5,25,3r0,75v0,5,-4,7,-12,7v-22,0,-10,-17,-13,-31r-56,0r0,95r93,0v5,-14,22,-45,37,-21r-16,48r-180,0v-9,-7,-4,-33,16,-25v6,-1,12,-2,13,-7r-2,-208v-15,-3,-37,9,-36,-13v0,-7,1,-12,4,-12r194,0v-1,24,10,72,-25,54v3,-45,-62,-19,-98,-26r0,88v30,-2,65,11,56,-27xm123,-303v-19,6,-52,36,-59,3v22,-11,40,-45,72,-32r45,32v-5,33,-41,3,-58,-3","w":226,"k":{"\u00fe":-10,"\u00ef":-4,"b":-9,"G":7,"C":6,"O":6,"Q":6,"\u00c7":6,"\u00d2":6,"\u00d3":6,"\u00d4":6,"\u00d5":6,"\u00d6":6,"\u00d8":6,"-":3,"\u2013":3,"\u2014":3}},"\u00cb":{"d":"144,-176v1,-7,27,-5,25,3r0,75v0,5,-4,7,-12,7v-22,0,-10,-17,-13,-31r-56,0r0,95r93,0v5,-14,22,-45,37,-21r-16,48r-180,0v-9,-7,-4,-33,16,-25v6,-1,12,-2,13,-7r-2,-208v-15,-3,-37,9,-36,-13v0,-7,1,-12,4,-12r194,0v-1,24,10,72,-25,54v3,-45,-62,-19,-98,-26r0,88v30,-2,65,11,56,-27xm83,-285v-17,1,-26,-9,-26,-24v0,-14,7,-24,24,-24v16,0,23,11,24,24v1,12,-10,24,-22,24xm184,-309v0,14,-9,23,-24,24v-14,0,-24,-8,-23,-24v0,-13,7,-24,23,-24v13,0,24,9,24,24","w":226,"k":{"\u00fe":-10,"\u00ef":-4,"b":-9,"G":7,"C":6,"O":6,"Q":6,"\u00c7":6,"\u00d2":6,"\u00d3":6,"\u00d4":6,"\u00d5":6,"\u00d6":6,"\u00d8":6,"-":3,"\u2013":3,"\u2014":3}},"\u00cc":{"d":"18,-10v-6,-23,28,-9,33,-22r-2,-208v-15,-2,-38,9,-36,-14v0,-7,2,-11,5,-11r104,0v3,0,4,5,4,13v2,21,-23,9,-38,12r0,215v13,3,36,-9,34,11v1,9,-3,13,-7,14r-93,0v-3,0,-4,-3,-4,-10xm10,-322v0,-17,9,-27,26,-28r48,50v1,12,-8,19,-17,19","w":139,"k":{"\u00fe":-12,"\u00ef":-5,"\u00ae":4,"w":2,"v":3,"b":-11,"G":5,"C":5,"O":5,"Q":5,"\u00c7":5,"\u00d2":5,"\u00d3":5,"\u00d4":5,"\u00d5":5,"\u00d6":5,"\u00d8":5,"y":3,"\u00fd":3,"\u00ff":3,"-":5,"\u2013":5,"\u2014":5,"\u00ab":5}},"\u00cd":{"d":"18,-10v-6,-23,28,-9,33,-22r-2,-208v-15,-2,-38,9,-36,-14v0,-7,2,-11,5,-11r104,0v3,0,4,5,4,13v2,21,-23,9,-38,12r0,215v13,3,36,-9,34,11v1,9,-3,13,-7,14r-93,0v-3,0,-4,-3,-4,-10xm72,-281v-12,1,-17,-11,-17,-19r48,-50v15,0,27,12,26,28","w":139,"k":{"\u00fe":-12,"\u00ef":-5,"\u00ae":4,"w":2,"v":3,"b":-11,"G":5,"C":5,"O":5,"Q":5,"\u00c7":5,"\u00d2":5,"\u00d3":5,"\u00d4":5,"\u00d5":5,"\u00d6":5,"\u00d8":5,"y":3,"\u00fd":3,"\u00ff":3,"-":5,"\u2013":5,"\u2014":5,"\u00ab":5}},"\u00ce":{"d":"18,-10v-6,-23,28,-9,33,-22r-2,-208v-15,-2,-38,9,-36,-14v0,-7,2,-11,5,-11r104,0v3,0,4,5,4,13v2,21,-23,9,-38,12r0,215v13,3,36,-9,34,11v1,9,-3,13,-7,14r-93,0v-3,0,-4,-3,-4,-10xm69,-303v-17,4,-36,25,-53,16v-4,-4,-5,-8,-5,-13v22,-11,40,-44,71,-32r45,32v-5,33,-41,3,-58,-3","w":139,"k":{"\u00fe":-12,"\u00ef":-5,"\u00ae":4,"w":2,"v":3,"b":-11,"G":5,"C":5,"O":5,"Q":5,"\u00c7":5,"\u00d2":5,"\u00d3":5,"\u00d4":5,"\u00d5":5,"\u00d6":5,"\u00d8":5,"y":3,"\u00fd":3,"\u00ff":3,"-":5,"\u2013":5,"\u2014":5,"\u00ab":5}},"\u00cf":{"d":"18,-10v-6,-23,28,-9,33,-22r-2,-208v-15,-2,-38,9,-36,-14v0,-7,2,-11,5,-11r104,0v3,0,4,5,4,13v2,21,-23,9,-38,12r0,215v13,3,36,-9,34,11v1,9,-3,13,-7,14r-93,0v-3,0,-4,-3,-4,-10xm32,-285v-17,1,-26,-10,-26,-24v0,-14,7,-24,24,-24v16,0,23,11,24,24v1,12,-10,24,-22,24xm134,-309v0,14,-9,23,-24,24v-14,1,-24,-9,-24,-24v0,-14,8,-25,24,-24v13,0,24,10,24,24","w":139,"k":{"\u00fe":-12,"\u00ef":-5,"\u00ae":4,"}":-2,"w":2,"v":3,"b":-11,"G":5,"C":5,"O":5,"Q":5,"\u00c7":5,"\u00d2":5,"\u00d3":5,"\u00d4":5,"\u00d5":5,"\u00d6":5,"\u00d8":5,"y":3,"\u00fd":3,"\u00ff":3,"-":5,"\u2013":5,"\u2014":5,"\u00ab":5}},"\u00d0":{"d":"23,-149r111,0r0,27r-111,0r0,-27xm20,-10v-5,-22,29,-9,33,-22r-2,-208v-15,-3,-37,9,-36,-13v0,-7,1,-12,4,-12r102,0v91,1,127,40,129,132v1,82,-52,133,-129,133r-97,0v-3,0,-4,-3,-4,-10xm209,-127v0,-82,-34,-117,-119,-110r0,210v73,7,119,-33,119,-100","w":268,"k":{"\u00c6":4,"}":5,"]":5,"Z":3,"X":7,"W":3,"V":5,"T":2,"J":5,".":5,",":5,")":7,"Y":9,"\u00dd":9,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"B":6,"D":6,"E":6,"F":6,"H":6,"I":6,"K":6,"L":6,"M":6,"N":6,"P":6,"R":6,"\u00c8":6,"\u00c9":6,"\u00ca":6,"\u00cb":6,"\u00cc":6,"\u00cd":6,"\u00ce":6,"\u00cf":6,"\u00d0":6,"\u00d1":6,"\u00de":6,"A":9,"\u00c0":9,"\u00c1":9,"\u00c2":9,"\u00c3":9,"\u00c4":9,"\u00c5":9}},"\u00d1":{"d":"18,-10v-6,-23,28,-9,33,-22r-2,-208v-15,-2,-38,9,-36,-14v0,-7,2,-11,5,-11r61,0r139,204r-2,-179v-15,-2,-38,9,-36,-14v0,-7,2,-11,5,-11r93,0v3,0,5,5,5,13v2,21,-23,9,-38,12r0,240v0,2,-4,4,-13,4v-8,0,-13,-2,-14,-4r-140,-198r0,173v13,3,36,-9,34,11v1,9,-3,13,-7,14r-83,0v-3,0,-4,-3,-4,-10xm217,-330v17,25,-23,55,-54,46v-22,-12,-55,-35,-72,-2v-11,0,-17,-9,-17,-16v11,-27,52,-50,77,-22v18,20,45,10,55,-10v4,0,8,2,11,4","w":293,"k":{"\u00fe":-15,"\u00ef":-8,"\u00c6":2,"\u00ae":3,"z":3,"w":3,"v":3,"t":2,"s":3,"p":2,"g":4,"b":-14,"S":2,"G":5,"@":4,";":5,":":5,".":5,",":5,"C":5,"O":5,"Q":5,"\u00c7":5,"\u00d2":5,"\u00d3":5,"\u00d4":5,"\u00d5":5,"\u00d6":5,"\u00d8":5,"y":3,"\u00fd":3,"\u00ff":3,"-":6,"\u2013":6,"\u2014":6,"\u00ab":6,"A":6,"\u00c0":6,"\u00c1":6,"\u00c2":6,"\u00c3":6,"\u00c4":6,"\u00c5":6,"a":3,"\u00e0":3,"\u00e1":3,"\u00e2":3,"\u00e3":3,"\u00e4":3,"\u00e5":3,"\u00e6":3,"h":-3,"k":-3,"l":-3,"c":4,"e":4,"o":4,"\u00e7":4,"\u00e8":4,"\u00e9":4,"\u00ea":4,"\u00eb":4,"\u00f2":4,"\u00f3":4,"\u00f4":4,"\u00f5":4,"\u00f6":4,"\u00f8":4,"d":3,"q":3,"\u00bb":6,"u":3,"\u00f9":3,"\u00fa":3,"\u00fb":3,"\u00fc":3}},"\u00d2":{"d":"246,-126v0,78,-42,130,-117,130v-75,0,-111,-54,-111,-132v-1,-81,41,-140,118,-140v76,0,110,60,110,142xm58,-145v2,73,17,120,74,120v56,0,72,-41,73,-103v1,-54,-28,-111,-75,-111v-46,0,-73,45,-72,94xm67,-322v-1,-17,8,-27,26,-28r48,50v0,11,-8,19,-17,19","w":263,"k":{"}":4,"]":4,"Z":3,"X":6,"W":3,"V":5,"T":2,"J":5,".":3,",":3,")":7,"Y":8,"\u00dd":8,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"B":5,"D":5,"E":5,"F":5,"H":5,"I":5,"K":5,"L":5,"M":5,"N":5,"P":5,"R":5,"\u00c8":5,"\u00c9":5,"\u00ca":5,"\u00cb":5,"\u00cc":5,"\u00cd":5,"\u00ce":5,"\u00cf":5,"\u00d0":5,"\u00d1":5,"\u00de":5,"A":6,"\u00c0":6,"\u00c1":6,"\u00c2":6,"\u00c3":6,"\u00c4":6,"\u00c5":6}},"\u00d3":{"d":"246,-126v0,78,-42,130,-117,130v-75,0,-111,-54,-111,-132v-1,-81,41,-140,118,-140v76,0,110,60,110,142xm58,-145v2,73,17,120,74,120v56,0,72,-41,73,-103v1,-54,-28,-111,-75,-111v-46,0,-73,45,-72,94xm136,-281v-12,1,-17,-11,-17,-19r48,-50v15,0,26,13,26,28","w":263,"k":{"}":4,"]":4,"Z":3,"X":6,"W":3,"V":5,"T":2,"J":5,".":3,",":3,")":7,"Y":8,"\u00dd":8,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"B":5,"D":5,"E":5,"F":5,"H":5,"I":5,"K":5,"L":5,"M":5,"N":5,"P":5,"R":5,"\u00c8":5,"\u00c9":5,"\u00ca":5,"\u00cb":5,"\u00cc":5,"\u00cd":5,"\u00ce":5,"\u00cf":5,"\u00d0":5,"\u00d1":5,"\u00de":5,"A":6,"\u00c0":6,"\u00c1":6,"\u00c2":6,"\u00c3":6,"\u00c4":6,"\u00c5":6}},"\u00d4":{"d":"246,-126v0,78,-42,130,-117,130v-75,0,-111,-54,-111,-132v-1,-81,41,-140,118,-140v76,0,110,60,110,142xm58,-145v2,73,17,120,74,120v56,0,72,-41,73,-103v1,-54,-28,-111,-75,-111v-46,0,-73,45,-72,94xm133,-303v-17,4,-36,25,-53,16v-4,-4,-5,-8,-5,-13v22,-11,40,-44,71,-32r45,32v-5,33,-41,3,-58,-3","w":263,"k":{"}":4,"]":4,"Z":3,"X":6,"W":3,"V":5,"T":2,"J":5,".":3,",":3,")":7,"Y":8,"\u00dd":8,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"B":5,"D":5,"E":5,"F":5,"H":5,"I":5,"K":5,"L":5,"M":5,"N":5,"P":5,"R":5,"\u00c8":5,"\u00c9":5,"\u00ca":5,"\u00cb":5,"\u00cc":5,"\u00cd":5,"\u00ce":5,"\u00cf":5,"\u00d0":5,"\u00d1":5,"\u00de":5,"A":6,"\u00c0":6,"\u00c1":6,"\u00c2":6,"\u00c3":6,"\u00c4":6,"\u00c5":6}},"\u00d5":{"d":"160,-282v-31,0,-64,-42,-86,-4v-10,0,-16,-9,-17,-16v12,-26,51,-49,77,-22v7,4,15,13,25,13v20,1,22,-32,41,-19v19,21,-16,48,-40,48xm246,-126v0,78,-42,130,-117,130v-75,0,-111,-54,-111,-132v-1,-81,41,-140,118,-140v76,0,110,60,110,142xm58,-145v2,73,17,120,74,120v56,0,72,-41,73,-103v1,-54,-28,-111,-75,-111v-46,0,-73,45,-72,94","w":263,"k":{"}":4,"]":4,"Z":3,"X":6,"W":3,"V":5,"T":2,"J":5,".":3,",":3,")":7,"Y":8,"\u00dd":8,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"B":5,"D":5,"E":5,"F":5,"H":5,"I":5,"K":5,"L":5,"M":5,"N":5,"P":5,"R":5,"\u00c8":5,"\u00c9":5,"\u00ca":5,"\u00cb":5,"\u00cc":5,"\u00cd":5,"\u00ce":5,"\u00cf":5,"\u00d0":5,"\u00d1":5,"\u00de":5,"A":6,"\u00c0":6,"\u00c1":6,"\u00c2":6,"\u00c3":6,"\u00c4":6,"\u00c5":6}},"\u00d6":{"d":"246,-126v0,78,-42,130,-117,130v-75,0,-111,-54,-111,-132v-1,-81,41,-140,118,-140v76,0,110,60,110,142xm58,-145v2,73,17,120,74,120v56,0,72,-41,73,-103v1,-54,-28,-111,-75,-111v-46,0,-73,45,-72,94xm94,-285v-17,1,-26,-9,-26,-24v0,-13,7,-24,23,-24v16,0,24,11,25,24v1,12,-10,24,-22,24xm195,-309v1,14,-9,23,-24,24v-14,1,-24,-9,-24,-24v0,-13,8,-24,24,-24v13,0,24,10,24,24","w":263,"k":{"}":4,"]":4,"Z":3,"X":6,"W":3,"V":5,"T":2,"J":5,".":3,",":3,")":7,"Y":8,"\u00dd":8,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"B":5,"D":5,"E":5,"F":5,"H":5,"I":5,"K":5,"L":5,"M":5,"N":5,"P":5,"R":5,"\u00c8":5,"\u00c9":5,"\u00ca":5,"\u00cb":5,"\u00cc":5,"\u00cd":5,"\u00ce":5,"\u00cf":5,"\u00d0":5,"\u00d1":5,"\u00de":5,"A":6,"\u00c0":6,"\u00c1":6,"\u00c2":6,"\u00c3":6,"\u00c4":6,"\u00c5":6}},"\u00d7":{"d":"16,-176v0,-13,6,-20,19,-20r65,62r66,-64v12,1,18,6,18,18r-65,65r67,63v0,11,-7,20,-19,20r-67,-65r-66,66v-10,1,-19,-12,-19,-19r66,-65","w":200},"\u00d8":{"d":"226,-265v10,-5,24,-7,30,0r-212,272v-13,5,-26,9,-33,0xm248,-126v0,78,-42,130,-117,130v-75,0,-111,-54,-111,-132v0,-81,41,-140,118,-140v76,0,110,60,110,142xm60,-145v2,73,17,120,74,120v56,0,72,-41,73,-103v1,-54,-28,-111,-75,-111v-46,0,-73,45,-72,94","w":267,"k":{"}":1,"b":-12,"]":4,"Z":3,"X":6,"W":3,"V":5,"T":2,"J":5,".":3,",":3,")":7,"Y":8,"\u00dd":8,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"B":5,"D":5,"E":5,"F":5,"H":5,"I":5,"K":5,"L":5,"M":5,"N":5,"P":5,"R":5,"\u00c8":5,"\u00c9":5,"\u00ca":5,"\u00cb":5,"\u00cc":5,"\u00cd":5,"\u00ce":5,"\u00cf":5,"\u00d0":5,"\u00d1":5,"\u00de":5,"A":6,"\u00c0":6,"\u00c1":6,"\u00c2":6,"\u00c3":6,"\u00c4":6,"\u00c5":6}},"\u00d9":{"d":"258,-265v6,1,8,26,-1,25r-30,0r0,142v0,67,-30,102,-91,102v-122,0,-82,-140,-93,-244v-16,-2,-37,8,-36,-14v0,-7,2,-11,5,-11r100,0v3,0,5,5,5,13v2,21,-20,9,-35,12v7,82,-28,217,59,215v86,-1,49,-131,57,-212v-6,-11,-38,10,-35,-17v0,-7,2,-11,5,-11r90,0xm79,-322v-1,-17,8,-27,26,-28r48,50v0,11,-8,19,-17,19","w":271,"k":{"\u00fe":-17,"\u00ef":-10,"\u00c6":11,"z":2,"w":2,"v":2,"t":2,"s":3,"g":6,"b":-15,"S":2,"G":4,"@":4,";":6,":":6,"\/":7,".":8,",":8,"C":4,"O":4,"Q":4,"\u00c7":4,"\u00d2":4,"\u00d3":4,"\u00d4":4,"\u00d5":4,"\u00d6":4,"\u00d8":4,"y":2,"\u00fd":2,"\u00ff":2,"-":5,"\u2013":5,"\u2014":5,"\u00ab":5,"A":12,"\u00c0":12,"\u00c1":12,"\u00c2":12,"\u00c3":12,"\u00c4":12,"\u00c5":12,"a":3,"\u00e0":3,"\u00e1":3,"\u00e2":3,"\u00e3":3,"\u00e4":3,"\u00e5":3,"\u00e6":3,"h":-4,"k":-4,"l":-4,"c":4,"e":4,"o":4,"\u00e7":4,"\u00e8":4,"\u00e9":4,"\u00ea":4,"\u00eb":4,"\u00f2":4,"\u00f3":4,"\u00f4":4,"\u00f5":4,"\u00f6":4,"\u00f8":4,"d":4,"q":4,"\u00bb":6,"u":2,"\u00f9":2,"\u00fa":2,"\u00fb":2,"\u00fc":2}},"\u00da":{"d":"258,-265v6,1,8,26,-1,25r-30,0r0,142v0,67,-30,102,-91,102v-122,0,-82,-140,-93,-244v-16,-2,-37,8,-36,-14v0,-7,2,-11,5,-11r100,0v3,0,5,5,5,13v2,21,-20,9,-35,12v7,82,-28,217,59,215v86,-1,49,-131,57,-212v-6,-11,-38,10,-35,-17v0,-7,2,-11,5,-11r90,0xm151,-281v-12,1,-17,-11,-18,-19r48,-50v15,0,27,12,26,28","w":271,"k":{"\u00fe":-17,"\u00ef":-10,"\u00c6":11,"z":2,"w":2,"v":2,"t":2,"s":3,"g":6,"b":-15,"S":2,"G":4,"@":4,";":6,":":6,"\/":7,".":8,",":8,"C":4,"O":4,"Q":4,"\u00c7":4,"\u00d2":4,"\u00d3":4,"\u00d4":4,"\u00d5":4,"\u00d6":4,"\u00d8":4,"y":2,"\u00fd":2,"\u00ff":2,"-":5,"\u2013":5,"\u2014":5,"\u00ab":5,"A":12,"\u00c0":12,"\u00c1":12,"\u00c2":12,"\u00c3":12,"\u00c4":12,"\u00c5":12,"a":3,"\u00e0":3,"\u00e1":3,"\u00e2":3,"\u00e3":3,"\u00e4":3,"\u00e5":3,"\u00e6":3,"h":-4,"k":-4,"l":-4,"c":4,"e":4,"o":4,"\u00e7":4,"\u00e8":4,"\u00e9":4,"\u00ea":4,"\u00eb":4,"\u00f2":4,"\u00f3":4,"\u00f4":4,"\u00f5":4,"\u00f6":4,"\u00f8":4,"d":4,"q":4,"\u00bb":6,"u":2,"\u00f9":2,"\u00fa":2,"\u00fb":2,"\u00fc":2}},"\u00db":{"d":"258,-265v6,1,8,26,-1,25r-30,0r0,142v0,67,-30,102,-91,102v-122,0,-82,-140,-93,-244v-16,-2,-37,8,-36,-14v0,-7,2,-11,5,-11r100,0v3,0,5,5,5,13v2,21,-20,9,-35,12v7,82,-28,217,59,215v86,-1,49,-131,57,-212v-6,-11,-38,10,-35,-17v0,-7,2,-11,5,-11r90,0xm141,-303v-17,4,-35,26,-53,16v-4,-4,-5,-8,-5,-13v22,-11,40,-44,71,-32r45,32v-5,33,-41,3,-58,-3","w":271,"k":{"\u00fe":-17,"\u00ef":-10,"\u00c6":11,"z":2,"w":2,"v":2,"t":2,"s":3,"g":6,"b":-15,"S":2,"G":4,"@":4,";":6,":":6,"\/":7,".":8,",":8,"C":4,"O":4,"Q":4,"\u00c7":4,"\u00d2":4,"\u00d3":4,"\u00d4":4,"\u00d5":4,"\u00d6":4,"\u00d8":4,"y":2,"\u00fd":2,"\u00ff":2,"-":5,"\u2013":5,"\u2014":5,"\u00ab":5,"A":12,"\u00c0":12,"\u00c1":12,"\u00c2":12,"\u00c3":12,"\u00c4":12,"\u00c5":12,"a":3,"\u00e0":3,"\u00e1":3,"\u00e2":3,"\u00e3":3,"\u00e4":3,"\u00e5":3,"\u00e6":3,"h":-4,"k":-4,"l":-4,"c":4,"e":4,"o":4,"\u00e7":4,"\u00e8":4,"\u00e9":4,"\u00ea":4,"\u00eb":4,"\u00f2":4,"\u00f3":4,"\u00f4":4,"\u00f5":4,"\u00f6":4,"\u00f8":4,"d":4,"q":4,"\u00bb":6,"u":2,"\u00f9":2,"\u00fa":2,"\u00fb":2,"\u00fc":2}},"\u00dc":{"d":"258,-265v6,1,8,26,-1,25r-30,0r0,142v0,67,-30,102,-91,102v-122,0,-82,-140,-93,-244v-16,-2,-37,8,-36,-14v0,-7,2,-11,5,-11r100,0v3,0,5,5,5,13v2,21,-20,9,-35,12v7,82,-28,217,59,215v86,-1,49,-131,57,-212v-6,-11,-38,10,-35,-17v0,-7,2,-11,5,-11r90,0xm104,-285v-17,1,-26,-10,-26,-24v0,-14,7,-24,24,-24v16,0,23,11,24,24v1,12,-10,24,-22,24xm206,-309v0,14,-9,23,-24,24v-14,1,-24,-9,-24,-24v0,-14,8,-25,24,-24v13,0,24,10,24,24","w":271,"k":{"\u00fe":-17,"\u00ef":-10,"\u00c6":11,"z":2,"w":2,"v":2,"t":2,"s":3,"g":6,"b":-15,"S":2,"G":4,"@":4,";":6,":":6,"\/":7,".":8,",":8,"C":4,"O":4,"Q":4,"\u00c7":4,"\u00d2":4,"\u00d3":4,"\u00d4":4,"\u00d5":4,"\u00d6":4,"\u00d8":4,"y":2,"\u00fd":2,"\u00ff":2,"-":5,"\u2013":5,"\u2014":5,"\u00ab":5,"A":12,"\u00c0":12,"\u00c1":12,"\u00c2":12,"\u00c3":12,"\u00c4":12,"\u00c5":12,"a":3,"\u00e0":3,"\u00e1":3,"\u00e2":3,"\u00e3":3,"\u00e4":3,"\u00e5":3,"\u00e6":3,"h":-4,"k":-4,"l":-4,"c":4,"e":4,"o":4,"\u00e7":4,"\u00e8":4,"\u00e9":4,"\u00ea":4,"\u00eb":4,"\u00f2":4,"\u00f3":4,"\u00f4":4,"\u00f5":4,"\u00f6":4,"\u00f8":4,"d":4,"q":4,"\u00bb":6,"u":2,"\u00f9":2,"\u00fa":2,"\u00fb":2,"\u00fc":2}},"\u00dd":{"d":"176,-25v7,1,5,27,-3,25r-126,0v-7,-1,-6,-25,3,-25v15,0,46,5,46,-7r0,-66r-77,-142v-11,-2,-26,7,-24,-10v-1,-9,2,-14,6,-15r87,0v7,1,5,27,-3,25v-14,1,-21,2,-17,10r50,101r55,-111v-13,-3,-33,8,-32,-10v0,-9,3,-13,7,-15r76,0v7,3,8,25,-6,25v-8,0,-13,3,-16,8r-69,134r0,73r43,0xm127,-281v-12,1,-17,-11,-18,-19r48,-50v16,0,27,12,27,28","w":225,"k":{"\u00fe":-28,"\u00ef":-21,"\u00ee":-9,"\u00ec":-11,"\u00e3":7,"\u00c6":8,"}":-9,"z":2,"w":7,"v":7,"t":3,"s":7,"p":5,"g":15,"b":-27,"]":-7,"\\":-2,"S":3,"G":11,"@":5,";":5,":":5,"7":-10,"4":5,".":3,",":3,"*":-4,"\"":-2,"C":10,"O":10,"Q":10,"\u00c7":10,"\u00d2":10,"\u00d3":10,"\u00d4":10,"\u00d5":10,"\u00d6":10,"\u00d8":10,"y":8,"\u00fd":8,"\u00ff":8,"-":11,"\u2013":11,"\u2014":11,"\u00ab":11,"A":12,"\u00c0":12,"\u00c1":12,"\u00c2":12,"\u00c3":12,"\u00c4":12,"\u00c5":12,"a":7,"\u00e0":7,"\u00e1":7,"\u00e2":7,"\u00e4":7,"\u00e5":7,"\u00e6":7,"h":-16,"k":-16,"l":-16,"c":14,"e":14,"o":14,"\u00e7":14,"\u00e8":14,"\u00e9":14,"\u00ea":14,"\u00eb":14,"\u00f2":14,"\u00f3":14,"\u00f4":14,"\u00f5":14,"\u00f6":14,"\u00f8":14,"d":13,"q":13,"\u00bb":6,"u":8,"\u00f9":8,"\u00fa":8,"\u00fb":8,"\u00fc":8,"m":3,"n":3,"r":3,"\u00f1":3}},"\u00de":{"d":"118,-25v7,1,5,27,-3,25r-93,0v-9,-6,-5,-33,16,-25v6,-1,12,-2,13,-7r-2,-208v-15,-2,-38,9,-36,-14v0,-7,2,-11,5,-11r104,0v3,0,4,5,4,13v2,21,-23,9,-38,12r0,32v65,-3,114,9,115,68v0,54,-38,81,-115,81r0,34r30,0xm88,-86v67,13,98,-54,52,-85v-11,-8,-29,-10,-52,-10r0,95","w":214,"k":{"\u00de":9,"\u00dd":14,"\u00dc":5,"\u00db":5,"\u00da":5,"\u00d9":5,"\u00d1":9,"\u00d0":9,"\u00cf":9,"\u00ce":9,"\u00cd":9,"\u00cc":9,"\u00cb":9,"\u00ca":9,"\u00c9":9,"\u00c8":9,"\u00c6":9,"\u00c5":12,"\u00c4":12,"\u00c3":12,"\u00c2":12,"\u00c1":12,"\u00c0":12,"}":5,"]":5,"Z":10,"Y":14,"X":15,"W":8,"V":10,"U":5,"T":12,"R":9,"P":9,"N":9,"M":9,"L":9,"K":9,"J":7,"I":9,"H":9,"F":9,"E":9,"D":9,"B":9,"A":12,"\/":4,".":16,",":16,"*":5,")":8,"'":5,"\"":5}},"\u00df":{"d":"104,-57v16,-1,28,15,23,32v42,14,53,-37,18,-51v-25,-10,-48,-21,-48,-53v0,-36,46,-54,46,-90v-1,-22,-13,-32,-34,-32v-34,0,-49,31,-49,62r0,174v-9,14,-29,28,-42,7v15,-48,8,-121,8,-182v0,-52,31,-88,82,-88v67,0,95,73,47,108v-21,16,-35,50,-2,63v26,10,48,25,48,58v0,33,-26,54,-59,53v-26,-1,-62,-8,-62,-36v0,-15,10,-24,24,-25","w":209,"k":{"\u201d":5,"\u201c":3,"\u2019":5,"\u2018":3,"\u2014":4,"\u2013":4,"\u00ff":12,"\u00fd":12,"\u00fc":3,"\u00fb":3,"\u00fa":3,"\u00f9":3,"\u00ae":5,"y":12,"w":11,"v":12,"u":3,"t":4,"p":4,"j":5,"g":2,"-":4,"*":4,"'":4,"\"":4}},"\u00e0":{"d":"119,-102v2,-47,-11,-54,-53,-53v8,17,-3,35,-22,35v-15,0,-23,-9,-24,-25v5,-29,38,-32,73,-34v76,-4,58,84,60,154v13,3,36,-9,34,11v5,24,-39,15,-56,16v-5,-2,-7,-6,-10,-14v-35,28,-110,20,-109,-34v1,-50,51,-61,107,-56xm48,-51v0,38,50,31,71,10r0,-34v-32,-1,-72,-3,-71,24xm37,-250v0,-17,9,-27,26,-28r48,50v1,12,-8,19,-17,19","k":{"\u00ae":5,"}":-7,"w":4,"v":4,"]":-6,"\\":9,"W":16,"V":18,"T":11,"7":6,"*":15,"\u2019":15,"\u201d":15,"y":4,"\u00fd":4,"\u00ff":4,"\"":26,"'":26,"Y":5,"\u00dd":5,"\u2018":13,"\u201c":13,"U":5,"\u00d9":5,"\u00da":5,"\u00db":5,"\u00dc":5}},"\u00e1":{"d":"119,-102v2,-47,-11,-54,-53,-53v8,17,-3,35,-22,35v-15,0,-23,-9,-24,-25v5,-29,38,-32,73,-34v76,-4,58,84,60,154v13,3,36,-9,34,11v5,24,-39,15,-56,16v-5,-2,-7,-6,-10,-14v-35,28,-110,20,-109,-34v1,-50,51,-61,107,-56xm48,-51v0,38,50,31,71,10r0,-34v-32,-1,-72,-3,-71,24xm92,-209v-12,1,-17,-11,-18,-19r48,-50v16,0,27,12,27,28","k":{"\u00ae":5,"}":-7,"w":4,"v":4,"]":-6,"\\":9,"W":16,"V":18,"T":11,"7":6,"*":15,"\u2019":15,"\u201d":15,"y":4,"\u00fd":4,"\u00ff":4,"\"":26,"'":26,"Y":5,"\u00dd":5,"\u2018":13,"\u201c":13,"U":5,"\u00d9":5,"\u00da":5,"\u00db":5,"\u00dc":5}},"\u00e2":{"d":"119,-102v2,-47,-11,-54,-53,-53v8,17,-3,35,-22,35v-15,0,-23,-9,-24,-25v5,-29,38,-32,73,-34v76,-4,58,84,60,154v13,3,36,-9,34,11v5,24,-39,15,-56,16v-5,-2,-7,-6,-10,-14v-35,28,-110,20,-109,-34v1,-50,51,-61,107,-56xm48,-51v0,38,50,31,71,10r0,-34v-32,-1,-72,-3,-71,24xm86,-232v-18,7,-52,37,-58,3v23,-10,44,-49,71,-31r45,31v-4,35,-41,2,-58,-3","k":{"\u00ae":5,"}":-7,"w":4,"v":4,"]":-6,"\\":9,"W":16,"V":18,"T":11,"7":6,"*":15,"\u2019":15,"\u201d":15,"y":4,"\u00fd":4,"\u00ff":4,"\"":26,"'":26,"Y":5,"\u00dd":5,"\u2018":13,"\u201c":13,"U":5,"\u00d9":5,"\u00da":5,"\u00db":5,"\u00dc":5}},"\u00e3":{"d":"119,-102v2,-47,-11,-54,-53,-53v8,17,-3,35,-22,35v-15,0,-23,-9,-24,-25v5,-29,38,-32,73,-34v76,-4,58,84,60,154v13,3,36,-9,34,11v5,24,-39,15,-56,16v-5,-2,-7,-6,-10,-14v-35,28,-110,20,-109,-34v1,-50,51,-61,107,-56xm48,-51v0,38,50,31,71,10r0,-34v-32,-1,-72,-3,-71,24xm153,-258v17,25,-23,55,-54,46v-22,-12,-55,-35,-72,-2v-11,0,-17,-9,-17,-16v11,-27,52,-50,77,-22v18,20,45,10,55,-10v4,0,8,2,11,4","k":{"\u00ae":5,"}":-7,"w":4,"v":4,"]":-6,"\\":9,"W":16,"V":18,"T":11,"7":6,"*":15,"'":26,"\"":26,"\u2019":15,"\u201d":15,"y":4,"\u00fd":4,"\u00ff":4,"Y":5,"\u00dd":5,"\u2018":13,"\u201c":13,"U":5,"\u00d9":5,"\u00da":5,"\u00db":5,"\u00dc":5}},"\u00e4":{"d":"119,-102v2,-47,-11,-54,-53,-53v8,17,-3,35,-22,35v-15,0,-23,-9,-24,-25v5,-29,38,-32,73,-34v76,-4,58,84,60,154v13,3,36,-9,34,11v5,24,-39,15,-56,16v-5,-2,-7,-6,-10,-14v-35,28,-110,20,-109,-34v1,-50,51,-61,107,-56xm48,-51v0,38,50,31,71,10r0,-34v-32,-1,-72,-3,-71,24xm46,-209v-17,1,-26,-10,-26,-24v0,-14,9,-24,24,-25v31,-1,30,49,2,49xm147,-233v0,14,-9,23,-24,24v-13,0,-23,-8,-23,-24v0,-14,8,-24,23,-25v14,-1,24,10,24,25","k":{"\u00ae":5,"}":-7,"w":4,"v":4,"]":-6,"\\":9,"W":16,"V":18,"T":11,"7":6,"*":15,"\u2019":15,"\u201d":15,"y":4,"\u00fd":4,"\u00ff":4,"\"":26,"'":26,"Y":5,"\u00dd":5,"\u2018":13,"\u201c":13,"U":5,"\u00d9":5,"\u00da":5,"\u00db":5,"\u00dc":5}},"\u00e5":{"d":"119,-102v2,-47,-11,-54,-53,-53v8,17,-3,35,-22,35v-15,0,-23,-9,-24,-25v5,-29,38,-32,73,-34v76,-4,58,84,60,154v13,3,36,-9,34,11v5,24,-39,15,-56,16v-5,-2,-7,-6,-10,-14v-35,28,-110,20,-109,-34v1,-50,51,-61,107,-56xm48,-51v0,38,50,31,71,10r0,-34v-32,-1,-72,-3,-71,24xm83,-197v-21,0,-38,-16,-38,-37v1,-23,16,-37,38,-38v22,-1,38,17,38,38v0,21,-17,38,-38,37xm84,-250v-18,0,-18,30,0,30v18,0,18,-30,0,-30","k":{"\u00ae":5,"}":-7,"w":4,"v":4,"]":-6,"\\":9,"W":16,"V":18,"T":11,"7":6,"*":15,"\u2019":15,"\u201d":15,"y":4,"\u00fd":4,"\u00ff":4,"\"":26,"'":26,"Y":5,"\u00dd":5,"\u2018":13,"\u201c":13,"U":5,"\u00d9":5,"\u00da":5,"\u00db":5,"\u00dc":5}},"\u00e6":{"d":"12,-46v0,-47,44,-64,99,-58v9,-36,-8,-57,-44,-49v6,17,-5,33,-22,33v-14,0,-25,-8,-24,-25v4,-46,101,-44,114,-10v19,-15,34,-25,66,-24v44,2,65,33,65,81v-9,36,-79,15,-119,20v-2,64,67,62,104,32v8,3,15,16,11,25v-36,31,-98,35,-129,1v-32,33,-121,36,-121,-26xm82,-78v-38,-5,-47,54,-9,54v24,1,33,-7,47,-17v-4,-10,-8,-22,-9,-37r-29,0xm230,-104v6,-47,-38,-60,-66,-36v-10,9,-16,21,-17,36r83,0","w":279,"k":{"x":3,"\\":8,"W":12,"V":13,"T":10,"J":3,"?":6,"7":9,"*":13,")":5,"\u2019":12,"\u201d":12,"\"":24,"'":24,"Y":8,"\u00dd":8,"\u2018":12,"\u201c":12,"U":3,"\u00d9":3,"\u00da":3,"\u00db":3,"\u00dc":3}},"\u00e7":{"d":"162,-148v5,34,-47,33,-48,6v0,-4,0,-9,1,-13v-45,-5,-62,24,-65,65v-5,73,63,78,104,44v8,3,17,16,11,24v-59,51,-151,24,-151,-68v0,-52,36,-89,87,-89v33,0,58,6,61,31xm63,58v32,4,56,-26,13,-27v-12,-8,0,-22,3,-34r28,0r-7,19v16,3,30,10,30,25v0,24,-22,36,-65,36v-8,1,-9,-20,-2,-19","w":176,"k":{"\u00f0":1,"g":2,"\\":5,"W":5,"V":8,"T":7,"?":5,"7":7,"*":9,"\u2019":8,"\u201d":8,"\"":19,"'":19,"Y":8,"\u00dd":8,"-":3,"\u2013":3,"\u2014":3,"\u2018":7,"\u201c":7,"U":2,"\u00d9":2,"\u00da":2,"\u00db":2,"\u00dc":2,"\u00ab":4,"c":1,"e":1,"o":1,"\u00e7":1,"\u00e8":1,"\u00e9":1,"\u00ea":1,"\u00eb":1,"\u00f2":1,"\u00f3":1,"\u00f4":1,"\u00f5":1,"\u00f6":1,"\u00f8":1}},"\u00e8":{"d":"92,4v-50,0,-78,-40,-78,-94v0,-55,35,-88,86,-89v46,0,70,31,69,79v-8,37,-79,14,-119,20v4,33,14,55,46,56v23,2,44,-17,57,-22v7,1,14,13,14,19v-14,25,-48,31,-75,31xm133,-106v6,-46,-38,-57,-66,-35v-10,9,-16,20,-17,35r83,0xm42,-250v0,-17,9,-27,26,-28r48,50v0,11,-8,19,-17,19","k":{"x":3,"\\":8,"W":12,"V":13,"T":10,"J":3,"?":6,"7":9,"*":13,")":5,"\u2019":12,"\u201d":12,"\"":24,"'":24,"Y":8,"\u00dd":8,"\u2018":12,"\u201c":12,"U":3,"\u00d9":3,"\u00da":3,"\u00db":3,"\u00dc":3}},"\u00e9":{"d":"92,4v-50,0,-78,-40,-78,-94v0,-55,35,-88,86,-89v46,0,70,31,69,79v-8,37,-79,14,-119,20v4,33,14,55,46,56v23,2,44,-17,57,-22v7,1,14,13,14,19v-14,25,-48,31,-75,31xm133,-106v6,-46,-38,-57,-66,-35v-10,9,-16,20,-17,35r83,0xm101,-209v-12,1,-17,-11,-18,-19r48,-50v16,0,27,12,27,28","k":{"x":3,"\\":8,"W":12,"V":13,"T":10,"J":3,"?":6,"7":9,"*":13,")":5,"\u2019":12,"\u201d":12,"\"":24,"'":24,"Y":8,"\u00dd":8,"\u2018":12,"\u201c":12,"U":3,"\u00d9":3,"\u00da":3,"\u00db":3,"\u00dc":3}},"\u00ea":{"d":"92,4v-50,0,-78,-40,-78,-94v0,-55,35,-88,86,-89v46,0,70,31,69,79v-8,37,-79,14,-119,20v4,33,14,55,46,56v23,2,44,-17,57,-22v7,1,14,13,14,19v-14,25,-48,31,-75,31xm133,-106v6,-46,-38,-57,-66,-35v-10,9,-16,20,-17,35r83,0xm96,-232v-17,5,-35,26,-53,17v-4,-4,-5,-9,-5,-14v23,-10,44,-49,71,-31r45,31v-4,35,-41,3,-58,-3","k":{"x":3,"\\":8,"W":12,"V":13,"T":10,"J":3,"?":6,"7":9,"*":13,")":5,"\u2019":12,"\u201d":12,"\"":24,"'":24,"Y":8,"\u00dd":8,"\u2018":12,"\u201c":12,"U":3,"\u00d9":3,"\u00da":3,"\u00db":3,"\u00dc":3}},"\u00eb":{"d":"92,4v-50,0,-78,-40,-78,-94v0,-55,35,-88,86,-89v46,0,70,31,69,79v-8,37,-79,14,-119,20v4,33,14,55,46,56v23,2,44,-17,57,-22v7,1,14,13,14,19v-14,25,-48,31,-75,31xm133,-106v6,-46,-38,-57,-66,-35v-10,9,-16,20,-17,35r83,0xm63,-209v-17,1,-27,-10,-27,-24v0,-14,9,-24,24,-25v31,-1,30,48,3,49xm164,-233v0,14,-9,23,-24,24v-14,0,-24,-9,-24,-24v0,-14,9,-24,24,-25v14,0,24,11,24,25","k":{"x":3,"\\":8,"W":12,"V":13,"T":10,"J":3,"?":6,"7":9,"*":13,")":5,"\u2019":12,"\u201d":12,"\"":24,"'":24,"Y":8,"\u00dd":8,"\u2018":12,"\u201c":12,"U":3,"\u00d9":3,"\u00da":3,"\u00db":3,"\u00dc":3}},"\u00ec":{"d":"4,-250v0,-17,9,-27,26,-28r48,50v1,12,-8,19,-17,19xm6,-158v-2,-30,39,-17,64,-21v8,-2,9,14,8,24r0,130v13,3,36,-9,34,11v1,9,-3,13,-7,14r-89,0v-8,-1,-6,-25,2,-25v17,0,24,1,26,-7r0,-117v-15,-3,-37,7,-38,-9","w":116,"k":{"\u00f0":2,"\u00ae":5,"w":4,"v":4,"t":2,"p":1,"j":2,"*":5,"\u2019":6,"\u201d":6,"y":4,"\u00fd":4,"\u00ff":4,"\"":5,"'":5,"-":6,"\u2013":6,"\u2014":6,"\u2018":6,"\u201c":6,"c":2,"e":2,"o":2,"\u00e7":2,"\u00e8":2,"\u00e9":2,"\u00ea":2,"\u00eb":2,"\u00f2":2,"\u00f3":2,"\u00f4":2,"\u00f5":2,"\u00f6":2,"\u00f8":2,"u":2,"\u00f9":2,"\u00fa":2,"\u00fb":2,"\u00fc":2}},"\u00ed":{"d":"63,-209v-12,1,-17,-11,-18,-19r48,-50v15,0,27,12,26,28xm6,-158v-2,-30,39,-17,64,-21v8,-2,9,14,8,24r0,130v13,3,36,-9,34,11v1,9,-3,13,-7,14r-89,0v-8,-1,-6,-25,2,-25v17,0,24,1,26,-7r0,-117v-15,-3,-37,7,-38,-9","w":116,"k":{"\u00f0":2,"\u00ae":5,"}":-8,"w":4,"v":4,"t":2,"p":1,"j":2,"]":-8,"*":-2,"\u2019":6,"\u201d":6,"y":4,"\u00fd":4,"\u00ff":4,"\"":5,"'":5,"-":6,"\u2013":6,"\u2014":6,"\u2018":6,"\u201c":6,"c":2,"e":2,"o":2,"\u00e7":2,"\u00e8":2,"\u00e9":2,"\u00ea":2,"\u00eb":2,"\u00f2":2,"\u00f3":2,"\u00f4":2,"\u00f5":2,"\u00f6":2,"\u00f8":2,"u":2,"\u00f9":2,"\u00fa":2,"\u00fb":2,"\u00fc":2}},"\u00ee":{"d":"6,-158v-2,-30,39,-17,64,-21v8,-2,9,14,8,24r0,130v13,3,36,-9,34,11v1,9,-3,13,-7,14r-89,0v-8,-1,-6,-25,2,-25v17,0,24,1,26,-7r0,-117v-15,-3,-37,7,-38,-9xm54,-232v-17,5,-35,26,-53,17v-4,-4,-5,-9,-5,-14v23,-10,44,-49,71,-31r45,31v-4,35,-41,3,-58,-3","w":116,"k":{"\u00f0":2,"\u00ae":5,"w":4,"v":4,"t":2,"p":1,"j":2,"'":5,"\"":5,"\u2019":6,"\u201d":6,"y":4,"\u00fd":4,"\u00ff":4,"-":6,"\u2013":6,"\u2014":6,"\u2018":6,"\u201c":6,"c":2,"e":2,"o":2,"\u00e7":2,"\u00e8":2,"\u00e9":2,"\u00ea":2,"\u00eb":2,"\u00f2":2,"\u00f3":2,"\u00f4":2,"\u00f5":2,"\u00f6":2,"\u00f8":2,"u":2,"\u00f9":2,"\u00fa":2,"\u00fb":2,"\u00fc":2}},"\u00ef":{"d":"19,-209v-17,1,-27,-10,-27,-24v0,-14,9,-24,24,-25v31,-1,30,48,3,49xm120,-233v0,14,-9,23,-24,24v-14,0,-24,-9,-24,-24v0,-14,9,-24,24,-25v14,0,24,11,24,25xm6,-158v-2,-30,39,-17,64,-21v8,-2,9,14,8,24r0,130v13,3,36,-9,34,11v1,9,-3,13,-7,14r-89,0v-8,-1,-6,-25,2,-25v17,0,24,1,26,-7r0,-117v-15,-3,-37,7,-38,-9","w":116,"k":{"\u00f0":2,"\u00ae":2,"w":4,"v":4,"t":2,"p":1,"j":2,"?":-7,"*":-2,"\u2019":6,"\u201d":6,"y":4,"\u00fd":4,"\u00ff":4,"\"":5,"'":5,"-":6,"\u2013":6,"\u2014":6,"\u2018":6,"\u201c":6,"c":2,"e":2,"o":2,"\u00e7":2,"\u00e8":2,"\u00e9":2,"\u00ea":2,"\u00eb":2,"\u00f2":2,"\u00f3":2,"\u00f4":2,"\u00f5":2,"\u00f6":2,"\u00f8":2,"u":2,"\u00f9":2,"\u00fa":2,"\u00fb":2,"\u00fc":2}},"\u00f0":{"d":"14,-90v0,-56,58,-106,113,-78v-7,-16,-19,-33,-38,-49r-35,29r-15,-18r31,-26v-12,-12,-33,-12,-39,-29v-1,-8,7,-17,13,-17v9,1,43,22,51,27r34,-27r15,17r-30,25v43,38,64,78,64,147v0,57,-33,92,-88,93v-49,0,-76,-43,-76,-94xm97,-24v33,0,44,-31,45,-65v0,-40,-16,-60,-48,-60v-27,1,-45,28,-44,59v1,40,11,66,47,66","w":195,"k":{"\u201d":7,"\u201c":8,"\u2019":7,"\u2018":8,"}":4,"x":2,"l":3,"k":3,"h":3,"f":2,"]":4,"\\":5,"?":5,".":4,",":5,"*":9,")":6,"'":8,"\"":8}},"\u00f1":{"d":"62,-180v15,1,12,6,13,22v44,-32,116,-32,116,46r0,87v13,2,32,-8,32,11v0,8,-3,12,-7,14r-80,0v-8,-1,-6,-27,3,-25v34,3,15,-37,18,-60v10,-72,-38,-77,-79,-41r0,101v13,3,36,-9,34,11v1,9,-3,13,-7,14r-89,0v-8,-1,-6,-25,2,-25v17,0,24,1,26,-7r0,-117v-16,-3,-40,9,-38,-14v1,-21,39,-13,56,-17xm87,-233v-20,-3,-24,28,-41,15v-4,-4,-6,-8,-6,-12v12,-26,51,-49,77,-22v7,4,15,13,25,13v20,1,22,-32,41,-19v16,22,-16,47,-40,48v-26,2,-35,-20,-56,-23","w":226,"k":{"\u00f0":1,"\u00ae":6,"w":7,"v":7,"t":3,"p":2,"j":3,"\\":11,"W":18,"V":20,"T":14,"J":4,"?":5,"7":8,"*":15,"\u2019":15,"\u201d":15,"y":7,"\u00fd":7,"\u00ff":7,"\"":27,"'":27,"Y":10,"\u00dd":10,"-":4,"\u2013":4,"\u2014":4,"\u2018":13,"\u201c":13,"U":7,"\u00d9":7,"\u00da":7,"\u00db":7,"\u00dc":7,"c":1,"e":1,"o":1,"\u00e7":1,"\u00e8":1,"\u00e9":1,"\u00ea":1,"\u00eb":1,"\u00f2":1,"\u00f3":1,"\u00f4":1,"\u00f5":1,"\u00f6":1,"\u00f8":1,"u":3,"\u00f9":3,"\u00fa":3,"\u00fb":3,"\u00fc":3}},"\u00f2":{"d":"178,-89v0,56,-32,93,-87,93v-53,0,-76,-40,-77,-94v-1,-53,35,-89,88,-89v47,0,77,41,76,90xm97,-152v-35,-1,-46,25,-47,61v-1,39,13,66,47,67v32,0,45,-31,45,-65v-1,-39,-11,-62,-45,-63xm43,-250v0,-17,9,-27,26,-28r48,50v1,12,-8,19,-17,19","w":192,"k":{"}":5,"x":8,"w":2,"v":2,"j":2,"f":2,"]":4,"\\":9,"W":16,"V":18,"T":21,"J":3,"?":7,"7":10,"1":5,"*":15,")":7,"\u2019":14,"\u201d":14,"y":2,"\u00fd":2,"\u00ff":2,"\"":26,"'":26,"Y":14,"\u00dd":14,"\u2018":14,"\u201c":14,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"h":2,"k":2,"l":2,"m":2,"n":2,"r":2,"\u00f1":2,"i":2,"\u00ec":2,"\u00ed":2,"\u00ee":2,"\u00ef":2}},"\u00f3":{"d":"178,-89v0,56,-32,93,-87,93v-53,0,-76,-40,-77,-94v-1,-53,35,-89,88,-89v47,0,77,41,76,90xm97,-152v-35,-1,-46,25,-47,61v-1,39,13,66,47,67v32,0,45,-31,45,-65v-1,-39,-11,-62,-45,-63xm102,-209v-12,1,-17,-11,-18,-19r48,-50v16,0,27,12,27,28","w":192,"k":{"}":5,"x":8,"w":2,"v":2,"j":2,"f":2,"]":4,"\\":9,"W":16,"V":18,"T":21,"J":3,"?":7,"7":10,"1":5,"*":15,")":7,"\u2019":14,"\u201d":14,"y":2,"\u00fd":2,"\u00ff":2,"\"":26,"'":26,"Y":14,"\u00dd":14,"\u2018":14,"\u201c":14,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"h":2,"k":2,"l":2,"m":2,"n":2,"r":2,"\u00f1":2,"i":2,"\u00ec":2,"\u00ed":2,"\u00ee":2,"\u00ef":2}},"\u00f4":{"d":"178,-89v0,56,-32,93,-87,93v-53,0,-76,-40,-77,-94v-1,-53,35,-89,88,-89v47,0,77,41,76,90xm97,-152v-35,-1,-46,25,-47,61v-1,39,13,66,47,67v32,0,45,-31,45,-65v-1,-39,-11,-62,-45,-63xm102,-232v-19,6,-53,37,-59,3v23,-10,45,-50,72,-31r45,31v-4,35,-41,3,-58,-3","w":192,"k":{"}":5,"x":8,"w":2,"v":2,"j":2,"f":2,"]":4,"\\":9,"W":16,"V":18,"T":21,"J":3,"?":7,"7":10,"1":5,"*":15,")":7,"\u2019":14,"\u201d":14,"y":2,"\u00fd":2,"\u00ff":2,"\"":26,"'":26,"Y":14,"\u00dd":14,"\u2018":14,"\u201c":14,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"h":2,"k":2,"l":2,"m":2,"n":2,"r":2,"\u00f1":2,"i":2,"\u00ec":2,"\u00ed":2,"\u00ee":2,"\u00ef":2}},"\u00f5":{"d":"168,-258v19,24,-23,57,-53,46v-21,-7,-49,-36,-68,-7v-7,12,-23,-3,-21,-11v13,-27,50,-49,77,-22v7,4,14,13,24,13v21,0,22,-32,41,-19xm178,-89v0,56,-32,93,-87,93v-53,0,-76,-40,-77,-94v-1,-53,35,-89,88,-89v47,0,77,41,76,90xm97,-152v-35,-1,-46,25,-47,61v-1,39,13,66,47,67v32,0,45,-31,45,-65v-1,-39,-11,-62,-45,-63","w":192,"k":{"}":5,"x":8,"w":2,"v":2,"j":2,"f":2,"]":4,"\\":9,"W":16,"V":18,"T":21,"J":3,"?":7,"7":10,"1":5,"*":9,")":7,"'":26,"\"":26,"\u2019":14,"\u201d":14,"y":2,"\u00fd":2,"\u00ff":2,"Y":14,"\u00dd":14,"\u2018":14,"\u201c":14,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"h":2,"k":2,"l":2,"m":2,"n":2,"r":2,"\u00f1":2,"i":2,"\u00ec":2,"\u00ed":2,"\u00ee":2,"\u00ef":2}},"\u00f6":{"d":"178,-89v0,56,-32,93,-87,93v-53,0,-76,-40,-77,-94v-1,-53,35,-89,88,-89v47,0,77,41,76,90xm97,-152v-35,-1,-46,25,-47,61v-1,39,13,66,47,67v32,0,45,-31,45,-65v-1,-39,-11,-62,-45,-63xm58,-209v-17,1,-26,-9,-26,-24v0,-14,8,-24,23,-25v32,-1,32,48,3,49xm159,-233v0,14,-9,23,-24,24v-14,0,-24,-9,-24,-24v0,-14,9,-24,24,-25v14,-1,24,10,24,25","w":192,"k":{"}":5,"x":8,"w":2,"v":2,"j":2,"f":2,"]":4,"\\":9,"W":16,"V":18,"T":21,"J":3,"?":7,"7":10,"1":5,"*":15,")":7,"\u2019":14,"\u201d":14,"y":2,"\u00fd":2,"\u00ff":2,"\"":26,"'":26,"Y":14,"\u00dd":14,"\u2018":14,"\u201c":14,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"h":2,"k":2,"l":2,"m":2,"n":2,"r":2,"\u00f1":2,"i":2,"\u00ec":2,"\u00ed":2,"\u00ee":2,"\u00ef":2}},"\u00f7":{"d":"117,-174v4,33,-46,34,-48,6v-4,-34,47,-34,48,-6xm93,-33v-14,0,-24,-10,-24,-24v0,-12,11,-24,22,-24v18,0,25,11,26,24v1,14,-9,24,-24,24xm20,-100v-8,0,-11,-27,0,-27r148,0v9,1,9,27,0,27r-148,0","w":187},"\u00f8":{"d":"33,-27v-41,-58,-10,-153,69,-153v14,0,27,4,38,11v5,-13,27,-27,43,-14r-24,31v44,58,10,156,-68,156v-15,0,-28,-4,-39,-12v-3,14,-29,28,-45,15xm69,-30v56,27,86,-36,70,-94xm123,-147v-54,-26,-84,32,-70,92","w":192,"k":{"\u201c":14,"\u2018":14,"}":5,"x":8,"w":2,"v":2,"j":2,"f":2,"]":4,"\\":9,"W":16,"V":18,"T":21,"J":3,"?":7,"7":10,"1":5,"*":15,")":7,"'":26,"\"":26,"\u2019":14,"\u201d":14,"y":2,"\u00fd":2,"\u00ff":2,"Y":14,"\u00dd":14,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"h":2,"k":2,"l":2,"m":2,"n":2,"r":2,"\u00f1":2,"i":2,"\u00ec":2,"\u00ed":2,"\u00ee":2,"\u00ef":2}},"\u00f9":{"d":"174,3v-22,0,-21,-4,-27,-20v-44,39,-112,23,-112,-42r0,-90v-14,-2,-33,8,-31,-13v0,-6,1,-9,3,-10v20,-5,38,-7,54,-7v7,-1,8,12,8,22v0,56,-19,155,59,122r17,-11r0,-103v-15,-2,-33,7,-32,-13v2,-20,34,-15,52,-17v16,-2,13,7,14,22r0,132v14,3,36,-9,34,12v2,21,-27,13,-39,16xm52,-250v-1,-17,8,-27,26,-28r48,50v0,11,-9,19,-18,19","w":216,"k":{"\u00f0":2,"\u00ae":5,"w":4,"v":4,"t":2,"p":1,"j":2,"\\":9,"W":18,"V":20,"T":14,"J":4,"?":5,"7":8,"*":12,"\u2019":9,"\u201d":9,"y":4,"\u00fd":4,"\u00ff":4,"\"":12,"'":12,"Y":7,"\u00dd":7,"-":5,"\u2013":5,"\u2014":5,"\u2018":10,"\u201c":10,"U":7,"\u00d9":7,"\u00da":7,"\u00db":7,"\u00dc":7,"c":2,"e":2,"o":2,"\u00e7":2,"\u00e8":2,"\u00e9":2,"\u00ea":2,"\u00eb":2,"\u00f2":2,"\u00f3":2,"\u00f4":2,"\u00f5":2,"\u00f6":2,"\u00f8":2,"u":2,"\u00f9":2,"\u00fa":2,"\u00fb":2,"\u00fc":2}},"\u00fa":{"d":"174,3v-22,0,-21,-4,-27,-20v-44,39,-112,23,-112,-42r0,-90v-14,-2,-33,8,-31,-13v0,-6,1,-9,3,-10v20,-5,38,-7,54,-7v7,-1,8,12,8,22v0,56,-19,155,59,122r17,-11r0,-103v-15,-2,-33,7,-32,-13v2,-20,34,-15,52,-17v16,-2,13,7,14,22r0,132v14,3,36,-9,34,12v2,21,-27,13,-39,16xm110,-209v-12,1,-17,-11,-17,-19r48,-50v15,0,26,13,26,28","w":216,"k":{"\u00f0":2,"\u00ae":5,"w":4,"v":4,"t":2,"p":1,"j":2,"\\":9,"W":18,"V":20,"T":14,"J":4,"?":5,"7":8,"*":12,"\u2019":9,"\u201d":9,"y":4,"\u00fd":4,"\u00ff":4,"\"":12,"'":12,"Y":7,"\u00dd":7,"-":5,"\u2013":5,"\u2014":5,"\u2018":10,"\u201c":10,"U":7,"\u00d9":7,"\u00da":7,"\u00db":7,"\u00dc":7,"c":2,"e":2,"o":2,"\u00e7":2,"\u00e8":2,"\u00e9":2,"\u00ea":2,"\u00eb":2,"\u00f2":2,"\u00f3":2,"\u00f4":2,"\u00f5":2,"\u00f6":2,"\u00f8":2,"u":2,"\u00f9":2,"\u00fa":2,"\u00fb":2,"\u00fc":2}},"\u00fb":{"d":"174,3v-22,0,-21,-4,-27,-20v-44,39,-112,23,-112,-42r0,-90v-14,-2,-33,8,-31,-13v0,-6,1,-9,3,-10v20,-5,38,-7,54,-7v7,-1,8,12,8,22v0,56,-19,155,59,122r17,-11r0,-103v-15,-2,-33,7,-32,-13v2,-20,34,-15,52,-17v16,-2,13,7,14,22r0,132v14,3,36,-9,34,12v2,21,-27,13,-39,16xm105,-232v-17,4,-35,27,-53,17v-4,-4,-5,-9,-5,-14v23,-10,44,-49,71,-31r45,31v-4,35,-41,3,-58,-3","w":216,"k":{"\u00f0":2,"\u00ae":5,"w":4,"v":4,"t":2,"p":1,"j":2,"\\":9,"W":18,"V":20,"T":14,"J":4,"?":5,"7":8,"*":12,"\u2019":9,"\u201d":9,"y":4,"\u00fd":4,"\u00ff":4,"\"":12,"'":12,"Y":7,"\u00dd":7,"-":5,"\u2013":5,"\u2014":5,"\u2018":10,"\u201c":10,"U":7,"\u00d9":7,"\u00da":7,"\u00db":7,"\u00dc":7,"c":2,"e":2,"o":2,"\u00e7":2,"\u00e8":2,"\u00e9":2,"\u00ea":2,"\u00eb":2,"\u00f2":2,"\u00f3":2,"\u00f4":2,"\u00f5":2,"\u00f6":2,"\u00f8":2,"u":2,"\u00f9":2,"\u00fa":2,"\u00fb":2,"\u00fc":2}},"\u00fc":{"d":"174,3v-22,0,-21,-4,-27,-20v-44,39,-112,23,-112,-42r0,-90v-14,-2,-33,8,-31,-13v0,-6,1,-9,3,-10v20,-5,38,-7,54,-7v7,-1,8,12,8,22v0,56,-19,155,59,122r17,-11r0,-103v-15,-2,-33,7,-32,-13v2,-20,34,-15,52,-17v16,-2,13,7,14,22r0,132v14,3,36,-9,34,12v2,21,-27,13,-39,16xm66,-209v-17,1,-26,-9,-26,-24v0,-14,8,-24,23,-25v32,-1,32,48,3,49xm167,-233v0,14,-9,23,-24,24v-13,0,-23,-8,-23,-24v0,-14,8,-24,23,-25v14,-1,24,10,24,25","w":216,"k":{"\u00f0":2,"\u00ae":5,"w":4,"v":4,"t":2,"p":1,"j":2,"\\":9,"W":18,"V":20,"T":14,"J":4,"?":5,"7":8,"*":12,"\u2019":9,"\u201d":9,"y":4,"\u00fd":4,"\u00ff":4,"\"":12,"'":12,"Y":7,"\u00dd":7,"-":5,"\u2013":5,"\u2014":5,"\u2018":10,"\u201c":10,"U":7,"\u00d9":7,"\u00da":7,"\u00db":7,"\u00dc":7,"c":2,"e":2,"o":2,"\u00e7":2,"\u00e8":2,"\u00e9":2,"\u00ea":2,"\u00eb":2,"\u00f2":2,"\u00f3":2,"\u00f4":2,"\u00f5":2,"\u00f6":2,"\u00f8":2,"u":2,"\u00f9":2,"\u00fa":2,"\u00fb":2,"\u00fc":2}},"\u00fd":{"d":"120,-151v-7,-1,-5,-26,2,-25r66,0v8,3,5,31,-10,25v-4,1,-6,3,-8,7r-75,190v-7,35,-83,46,-87,2v-1,-15,10,-25,22,-26v18,1,25,10,26,28v18,-7,21,-34,28,-51r-59,-150v-12,-1,-24,6,-24,-11v0,-8,3,-12,7,-14r76,0v9,2,5,26,-3,25v-10,0,-15,2,-15,7r36,105r41,-112r-23,0xm115,-209v-12,1,-17,-11,-17,-19r48,-50v15,0,27,12,26,28","w":193,"k":{"\u00f0":3,"g":2,"X":9,"W":3,"V":4,"T":29,"J":3,"?":10,"7":13,"1":9,"\/":5,".":11,",":11,"*":11,")":7,"\"":12,"'":12,"Y":7,"\u00dd":7,"-":3,"\u2013":3,"\u2014":3,"U":2,"\u00d9":2,"\u00da":2,"\u00db":2,"\u00dc":2,"\u00ab":5,"B":3,"D":3,"E":3,"F":3,"H":3,"I":3,"K":3,"L":3,"M":3,"N":3,"P":3,"R":3,"\u00c8":3,"\u00c9":3,"\u00ca":3,"\u00cb":3,"\u00cc":3,"\u00cd":3,"\u00ce":3,"\u00cf":3,"\u00d0":3,"\u00d1":3,"\u00de":3,"A":7,"\u00c0":7,"\u00c1":7,"\u00c2":7,"\u00c3":7,"\u00c4":7,"\u00c5":7,"h":4,"k":4,"l":4,"c":2,"e":2,"o":2,"\u00e7":2,"\u00e8":2,"\u00e9":2,"\u00ea":2,"\u00eb":2,"\u00f2":2,"\u00f3":2,"\u00f4":2,"\u00f5":2,"\u00f6":2,"\u00f8":2,"d":3,"q":3}},"\u00fe":{"d":"-13,-257v-5,-28,39,-18,64,-21v8,-1,9,14,8,24r0,89v61,-38,119,6,119,76v0,68,-61,111,-119,81r0,60v16,4,45,-10,44,11v1,8,-3,12,-7,14r-100,0v-7,-1,-5,-27,3,-25v17,-1,24,1,26,-7r0,-293v-15,-3,-36,7,-38,-9xm142,-88v6,-56,-52,-78,-83,-44r0,98v38,24,88,-2,83,-54","w":192,"k":{"}":5,"x":8,"w":2,"v":2,"j":2,"f":2,"]":4,"\\":9,"W":16,"V":18,"T":21,"J":3,"?":7,"7":10,"1":5,"*":15,")":7,"\u2019":14,"\u201d":14,"y":2,"\u00fd":2,"\u00ff":2,"\"":26,"'":26,"Y":14,"\u00dd":14,"\u2018":14,"\u201c":14,"U":4,"\u00d9":4,"\u00da":4,"\u00db":4,"\u00dc":4,"h":2,"k":2,"l":2,"m":2,"n":2,"r":2,"\u00f1":2,"i":2,"\u00ec":2,"\u00ed":2,"\u00ee":2,"\u00ef":2}},"\u00ff":{"d":"120,-151v-7,-1,-5,-26,2,-25r66,0v8,3,5,31,-10,25v-4,1,-6,3,-8,7r-75,190v-7,35,-83,46,-87,2v-1,-15,10,-25,22,-26v18,1,25,10,26,28v18,-7,21,-34,28,-51r-59,-150v-12,-1,-24,6,-24,-11v0,-8,3,-12,7,-14r76,0v9,2,5,26,-3,25v-10,0,-15,2,-15,7r36,105r41,-112r-23,0xm67,-209v-17,1,-27,-10,-27,-24v0,-14,9,-24,24,-25v15,0,24,10,24,25v0,13,-10,24,-21,24xm168,-233v0,14,-9,23,-24,24v-14,0,-24,-9,-24,-24v0,-14,9,-24,24,-25v14,0,24,11,24,25","w":193,"k":{"\u00f0":3,"}":5,"g":2,"]":5,"X":9,"W":3,"V":4,"T":29,"J":3,"?":10,"7":13,"1":9,"\/":5,".":11,",":11,"*":11,")":7,"\"":12,"'":12,"Y":7,"\u00dd":7,"-":3,"\u2013":3,"\u2014":3,"U":2,"\u00d9":2,"\u00da":2,"\u00db":2,"\u00dc":2,"\u00ab":5,"B":3,"D":3,"E":3,"F":3,"H":3,"I":3,"K":3,"L":3,"M":3,"N":3,"P":3,"R":3,"\u00c8":3,"\u00c9":3,"\u00ca":3,"\u00cb":3,"\u00cc":3,"\u00cd":3,"\u00ce":3,"\u00cf":3,"\u00d0":3,"\u00d1":3,"\u00de":3,"A":7,"\u00c0":7,"\u00c1":7,"\u00c2":7,"\u00c3":7,"\u00c4":7,"\u00c5":7,"h":4,"k":4,"l":4,"c":2,"e":2,"o":2,"\u00e7":2,"\u00e8":2,"\u00e9":2,"\u00ea":2,"\u00eb":2,"\u00f2":2,"\u00f3":2,"\u00f4":2,"\u00f5":2,"\u00f6":2,"\u00f8":2,"d":3,"q":3}},"\u2013":{"d":"27,-94v-10,-1,-9,-26,0,-27r140,0v10,0,9,27,0,27r-140,0","w":193,"k":{"x":4,"w":4,"v":5,"t":5,"j":5,"f":6,"Z":9,"X":7,"W":11,"V":12,"T":17,"S":5,"J":5,"7":9,"2":4,"1":8,"\u2019":15,"\u201d":15,"y":5,"\u00fd":5,"\u00ff":5,"\"":5,"'":5,"Y":12,"\u00dd":12,"U":5,"\u00d9":5,"\u00da":5,"\u00db":5,"\u00dc":5,"B":6,"D":6,"E":6,"F":6,"H":6,"I":6,"K":6,"L":6,"M":6,"N":6,"P":6,"R":6,"\u00c8":6,"\u00c9":6,"\u00ca":6,"\u00cb":6,"\u00cc":6,"\u00cd":6,"\u00ce":6,"\u00cf":6,"\u00d0":6,"\u00d1":6,"\u00de":6,"A":5,"\u00c0":5,"\u00c1":5,"\u00c2":5,"\u00c3":5,"\u00c4":5,"\u00c5":5,"h":6,"k":6,"l":6,"m":4,"n":4,"r":4,"\u00f1":4,"i":5,"\u00ec":5,"\u00ed":5,"\u00ee":5,"\u00ef":5}},"\u2014":{"d":"27,-94v-10,-1,-9,-26,0,-27r294,0v10,0,9,27,0,27r-294,0","w":347,"k":{"x":4,"w":4,"v":5,"t":5,"j":5,"f":6,"Z":9,"X":7,"W":11,"V":12,"T":17,"S":5,"J":5,"7":9,"2":4,"1":8,"\u2019":15,"\u201d":15,"y":5,"\u00fd":5,"\u00ff":5,"\"":5,"'":5,"Y":12,"\u00dd":12,"U":5,"\u00d9":5,"\u00da":5,"\u00db":5,"\u00dc":5,"B":6,"D":6,"E":6,"F":6,"H":6,"I":6,"K":6,"L":6,"M":6,"N":6,"P":6,"R":6,"\u00c8":6,"\u00c9":6,"\u00ca":6,"\u00cb":6,"\u00cc":6,"\u00cd":6,"\u00ce":6,"\u00cf":6,"\u00d0":6,"\u00d1":6,"\u00de":6,"A":5,"\u00c0":5,"\u00c1":5,"\u00c2":5,"\u00c3":5,"\u00c4":5,"\u00c5":5,"h":6,"k":6,"l":6,"m":4,"n":4,"r":4,"\u00f1":4,"i":5,"\u00ec":5,"\u00ed":5,"\u00ee":5,"\u00ef":5}},"\u2018":{"d":"40,-186v-17,0,-27,-10,-28,-25v0,-21,15,-43,46,-67v6,0,11,4,11,10v-12,14,-19,25,-19,34v23,10,13,49,-10,48","w":77,"k":{"\u00fe":-15,"\u00f0":5,"\u00e3":11,"\u00df":3,"\u00c6":13,"z":13,"x":7,"w":9,"v":9,"t":5,"s":10,"g":14,"f":6,"b":-14,"W":-9,"V":-4,".":47,",":47,"y":9,"\u00fd":9,"\u00ff":9,"Y":-7,"\u00dd":-7,"A":17,"\u00c0":17,"\u00c1":17,"\u00c2":17,"\u00c3":17,"\u00c4":17,"\u00c5":17,"a":11,"\u00e0":11,"\u00e1":11,"\u00e2":11,"\u00e4":11,"\u00e5":11,"\u00e6":11,"h":-4,"k":-4,"l":-4,"c":17,"e":17,"o":17,"\u00e7":17,"\u00e8":17,"\u00e9":17,"\u00ea":17,"\u00eb":17,"\u00f2":17,"\u00f3":17,"\u00f4":17,"\u00f5":17,"\u00f6":17,"\u00f8":17,"d":18,"q":18,"u":4,"\u00f9":4,"\u00fa":4,"\u00fb":4,"\u00fc":4,"m":4,"n":4,"r":4,"\u00f1":4}},"\u2019":{"d":"42,-278v17,0,29,10,29,24v0,21,-15,43,-46,67v-7,1,-11,-4,-11,-10v12,-14,19,-25,19,-34v-22,-9,-13,-48,9,-47","w":78,"k":{"\u00fe":-16,"\u00f5":20,"\u00f0":5,"\u00ef":-12,"\u00ee":-2,"\u00e4":14,"\u00df":4,"\u00c6":14,"z":12,"x":12,"w":9,"v":9,"t":7,"s":14,"p":8,"g":16,"f":7,"b":-14,"W":-13,"V":-12,"G":4,"@":11,"\/":13,".":52,",":52,"&":4,"C":4,"O":4,"Q":4,"\u00c7":4,"\u00d2":4,"\u00d3":4,"\u00d4":4,"\u00d5":4,"\u00d6":4,"\u00d8":4,"y":9,"\u00fd":9,"\u00ff":9,"Y":-14,"\u00dd":-14,"-":6,"\u2013":6,"\u2014":6,"\u00ab":30,"A":18,"\u00c0":18,"\u00c1":18,"\u00c2":18,"\u00c3":18,"\u00c4":18,"\u00c5":18,"a":14,"\u00e0":14,"\u00e1":14,"\u00e2":14,"\u00e3":14,"\u00e5":14,"\u00e6":14,"h":-5,"k":-5,"l":-5,"c":20,"e":20,"o":20,"\u00e7":20,"\u00e8":20,"\u00e9":20,"\u00ea":20,"\u00eb":20,"\u00f2":20,"\u00f3":20,"\u00f4":20,"\u00f6":20,"\u00f8":20,"d":18,"q":18,"\u00bb":18,"u":9,"\u00f9":9,"\u00fa":9,"\u00fb":9,"\u00fc":9,"m":8,"n":8,"r":8,"\u00f1":8}},"\u201c":{"d":"40,-186v-17,0,-27,-10,-28,-25v0,-21,15,-43,46,-67v6,0,11,4,11,10v-12,14,-19,25,-19,34v23,10,13,49,-10,48xm111,-186v-18,0,-29,-11,-29,-25v0,-21,15,-43,46,-67v6,0,11,4,11,10v-12,14,-19,25,-19,34v22,9,13,49,-9,48","w":148,"k":{"\u00fe":-15,"\u00f0":5,"\u00e3":11,"\u00df":3,"\u00c6":13,"z":13,"x":7,"w":9,"v":9,"t":5,"s":10,"g":14,"f":6,"b":-14,"W":-9,"V":-4,".":47,",":47,"y":9,"\u00fd":9,"\u00ff":9,"Y":-7,"\u00dd":-7,"A":17,"\u00c0":17,"\u00c1":17,"\u00c2":17,"\u00c3":17,"\u00c4":17,"\u00c5":17,"a":11,"\u00e0":11,"\u00e1":11,"\u00e2":11,"\u00e4":11,"\u00e5":11,"\u00e6":11,"h":-4,"k":-4,"l":-4,"c":17,"e":17,"o":17,"\u00e7":17,"\u00e8":17,"\u00e9":17,"\u00ea":17,"\u00eb":17,"\u00f2":17,"\u00f3":17,"\u00f4":17,"\u00f5":17,"\u00f6":17,"\u00f8":17,"d":18,"q":18,"u":4,"\u00f9":4,"\u00fa":4,"\u00fb":4,"\u00fc":4,"m":4,"n":4,"r":4,"\u00f1":4}},"\u201d":{"d":"113,-278v17,0,28,9,28,24v0,21,-15,43,-46,67v-7,1,-11,-4,-11,-10v12,-14,19,-25,19,-34v-23,-10,-13,-48,10,-47xm42,-278v17,0,29,10,29,24v0,21,-15,43,-46,67v-7,1,-11,-4,-11,-10v12,-14,19,-25,19,-34v-22,-9,-13,-48,9,-47","w":148,"k":{"\u00fe":-16,"\u00f5":20,"\u00f0":5,"\u00ef":-12,"\u00ee":-3,"\u00e4":14,"\u00df":4,"\u00c6":14,"z":12,"x":12,"w":9,"v":9,"t":7,"s":14,"p":8,"g":16,"f":7,"b":-14,"W":-13,"V":-12,"G":4,"@":11,"\/":13,".":52,",":52,"&":4,"C":4,"O":4,"Q":4,"\u00c7":4,"\u00d2":4,"\u00d3":4,"\u00d4":4,"\u00d5":4,"\u00d6":4,"\u00d8":4,"y":9,"\u00fd":9,"\u00ff":9,"Y":-14,"\u00dd":-14,"-":6,"\u2013":6,"\u2014":6,"\u00ab":30,"A":18,"\u00c0":18,"\u00c1":18,"\u00c2":18,"\u00c3":18,"\u00c4":18,"\u00c5":18,"a":14,"\u00e0":14,"\u00e1":14,"\u00e2":14,"\u00e3":14,"\u00e5":14,"\u00e6":14,"h":-5,"k":-5,"l":-5,"c":20,"e":20,"o":20,"\u00e7":20,"\u00e8":20,"\u00e9":20,"\u00ea":20,"\u00eb":20,"\u00f2":20,"\u00f3":20,"\u00f4":20,"\u00f6":20,"\u00f8":20,"d":18,"q":18,"\u00bb":18,"u":9,"\u00f9":9,"\u00fa":9,"\u00fb":9,"\u00fc":9,"m":8,"n":8,"r":8,"\u00f1":8}}}});
(function() {

}).call(this);
Cufon.replace('#menu a', { fontFamily: 'Copse', hover:true, color: '-linear-gradient(#fdfdfd, #dedede, #b4b4b4)' });
Cufon.replace('h2, .button, .list2 a, #sign_up a, h3', { fontFamily: 'Copse', hover:true });
Cufon.replace('h1', { fontFamily: 'Copse', hover:true });

/*
 * Copyright (c) 2009 Simo Kinnunen.
 * Licensed under the MIT license.
 *
 * @version 1.09i
 */

var Cufon=(function(){var m=function(){return m.replace.apply(null,arguments)};var x=m.DOM={ready:(function(){var C=false,E={loaded:1,complete:1};var B=[],D=function(){if(C){return}C=true;for(var F;F=B.shift();F()){}};if(document.addEventListener){document.addEventListener("DOMContentLoaded",D,false);window.addEventListener("pageshow",D,false)}if(!window.opera&&document.readyState){(function(){E[document.readyState]?D():setTimeout(arguments.callee,10)})()}if(document.readyState&&document.createStyleSheet){(function(){try{document.body.doScroll("left");D()}catch(F){setTimeout(arguments.callee,1)}})()}q(window,"load",D);return function(F){if(!arguments.length){D()}else{C?F():B.push(F)}}})(),root:function(){return document.documentElement||document.body}};var n=m.CSS={Size:function(C,B){this.value=parseFloat(C);this.unit=String(C).match(/[a-z%]*$/)[0]||"px";this.convert=function(D){return D/B*this.value};this.convertFrom=function(D){return D/this.value*B};this.toString=function(){return this.value+this.unit}},addClass:function(C,B){var D=C.className;C.className=D+(D&&" ")+B;return C},color:j(function(C){var B={};B.color=C.replace(/^rgba\((.*?),\s*([\d.]+)\)/,function(E,D,F){B.opacity=parseFloat(F);return"rgb("+D+")"});return B}),fontStretch:j(function(B){if(typeof B=="number"){return B}if(/%$/.test(B)){return parseFloat(B)/100}return{"ultra-condensed":0.5,"extra-condensed":0.625,condensed:0.75,"semi-condensed":0.875,"semi-expanded":1.125,expanded:1.25,"extra-expanded":1.5,"ultra-expanded":2}[B]||1}),getStyle:function(C){var B=document.defaultView;if(B&&B.getComputedStyle){return new a(B.getComputedStyle(C,null))}if(C.currentStyle){return new a(C.currentStyle)}return new a(C.style)},gradient:j(function(F){var G={id:F,type:F.match(/^-([a-z]+)-gradient\(/)[1],stops:[]},C=F.substr(F.indexOf("(")).match(/([\d.]+=)?(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)/ig);for(var E=0,B=C.length,D;E<B;++E){D=C[E].split("=",2).reverse();G.stops.push([D[1]||E/(B-1),D[0]])}return G}),quotedList:j(function(E){var D=[],C=/\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g,B;while(B=C.exec(E)){D.push(B[3]||B[1])}return D}),recognizesMedia:j(function(G){var E=document.createElement("style"),D,C,B;E.type="text/css";E.media=G;try{E.appendChild(document.createTextNode("/**/"))}catch(F){}C=g("head")[0];C.insertBefore(E,C.firstChild);D=(E.sheet||E.styleSheet);B=D&&!D.disabled;C.removeChild(E);return B}),removeClass:function(D,C){var B=RegExp("(?:^|\\s+)"+C+"(?=\\s|$)","g");D.className=D.className.replace(B,"");return D},supports:function(D,C){var B=document.createElement("span").style;if(B[D]===undefined){return false}B[D]=C;return B[D]===C},textAlign:function(E,D,B,C){if(D.get("textAlign")=="right"){if(B>0){E=" "+E}}else{if(B<C-1){E+=" "}}return E},textShadow:j(function(F){if(F=="none"){return null}var E=[],G={},B,C=0;var D=/(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;while(B=D.exec(F)){if(B[0]==","){E.push(G);G={};C=0}else{if(B[1]){G.color=B[1]}else{G[["offX","offY","blur"][C++]]=B[2]}}}E.push(G);return E}),textTransform:(function(){var B={uppercase:function(C){return C.toUpperCase()},lowercase:function(C){return C.toLowerCase()},capitalize:function(C){return C.replace(/\b./g,function(D){return D.toUpperCase()})}};return function(E,D){var C=B[D.get("textTransform")];return C?C(E):E}})(),whiteSpace:(function(){var D={inline:1,"inline-block":1,"run-in":1};var C=/^\s+/,B=/\s+$/;return function(H,F,G,E){if(E){if(E.nodeName.toLowerCase()=="br"){H=H.replace(C,"")}}if(D[F.get("display")]){return H}if(!G.previousSibling){H=H.replace(C,"")}if(!G.nextSibling){H=H.replace(B,"")}return H}})()};n.ready=(function(){var B=!n.recognizesMedia("all"),E=false;var D=[],H=function(){B=true;for(var K;K=D.shift();K()){}};var I=g("link"),J=g("style");function C(K){return K.disabled||G(K.sheet,K.media||"screen")}function G(M,P){if(!n.recognizesMedia(P||"all")){return true}if(!M||M.disabled){return false}try{var Q=M.cssRules,O;if(Q){search:for(var L=0,K=Q.length;O=Q[L],L<K;++L){switch(O.type){case 2:break;case 3:if(!G(O.styleSheet,O.media.mediaText)){return false}break;default:break search}}}}catch(N){}return true}function F(){if(document.createStyleSheet){return true}var L,K;for(K=0;L=I[K];++K){if(L.rel.toLowerCase()=="stylesheet"&&!C(L)){return false}}for(K=0;L=J[K];++K){if(!C(L)){return false}}return true}x.ready(function(){if(!E){E=n.getStyle(document.body).isUsable()}if(B||(E&&F())){H()}else{setTimeout(arguments.callee,10)}});return function(K){if(B){K()}else{D.push(K)}}})();function s(D){var C=this.face=D.face,B={"\u0020":1,"\u00a0":1,"\u3000":1};this.glyphs=D.glyphs;this.w=D.w;this.baseSize=parseInt(C["units-per-em"],10);this.family=C["font-family"].toLowerCase();this.weight=C["font-weight"];this.style=C["font-style"]||"normal";this.viewBox=(function(){var F=C.bbox.split(/\s+/);var E={minX:parseInt(F[0],10),minY:parseInt(F[1],10),maxX:parseInt(F[2],10),maxY:parseInt(F[3],10)};E.width=E.maxX-E.minX;E.height=E.maxY-E.minY;E.toString=function(){return[this.minX,this.minY,this.width,this.height].join(" ")};return E})();this.ascent=-parseInt(C.ascent,10);this.descent=-parseInt(C.descent,10);this.height=-this.ascent+this.descent;this.spacing=function(L,N,E){var O=this.glyphs,M,K,G,P=[],F=0,J=-1,I=-1,H;while(H=L[++J]){M=O[H]||this.missingGlyph;if(!M){continue}if(K){F-=G=K[H]||0;P[I]-=G}F+=P[++I]=~~(M.w||this.w)+N+(B[H]?E:0);K=M.k}P.total=F;return P}}function f(){var C={},B={oblique:"italic",italic:"oblique"};this.add=function(D){(C[D.style]||(C[D.style]={}))[D.weight]=D};this.get=function(H,I){var G=C[H]||C[B[H]]||C.normal||C.italic||C.oblique;if(!G){return null}I={normal:400,bold:700}[I]||parseInt(I,10);if(G[I]){return G[I]}var E={1:1,99:0}[I%100],K=[],F,D;if(E===undefined){E=I>400}if(I==500){I=400}for(var J in G){if(!k(G,J)){continue}J=parseInt(J,10);if(!F||J<F){F=J}if(!D||J>D){D=J}K.push(J)}if(I<F){I=F}if(I>D){I=D}K.sort(function(M,L){return(E?(M>=I&&L>=I)?M<L:M>L:(M<=I&&L<=I)?M>L:M<L)?-1:1});return G[K[0]]}}function r(){function D(F,G){if(F.contains){return F.contains(G)}return F.compareDocumentPosition(G)&16}function B(G){var F=G.relatedTarget;if(!F||D(this,F)){return}C(this,G.type=="mouseover")}function E(F){C(this,F.type=="mouseenter")}function C(F,G){setTimeout(function(){var H=d.get(F).options;m.replace(F,G?h(H,H.hover):H,true)},10)}this.attach=function(F){if(F.onmouseenter===undefined){q(F,"mouseover",B);q(F,"mouseout",B)}else{q(F,"mouseenter",E);q(F,"mouseleave",E)}}}function u(){var C=[],D={};function B(H){var E=[],G;for(var F=0;G=H[F];++F){E[F]=C[D[G]]}return E}this.add=function(F,E){D[F]=C.push(E)-1};this.repeat=function(){var E=arguments.length?B(arguments):C,F;for(var G=0;F=E[G++];){m.replace(F[0],F[1],true)}}}function A(){var D={},B=0;function C(E){return E.cufid||(E.cufid=++B)}this.get=function(E){var F=C(E);return D[F]||(D[F]={})}}function a(B){var D={},C={};this.extend=function(E){for(var F in E){if(k(E,F)){D[F]=E[F]}}return this};this.get=function(E){return D[E]!=undefined?D[E]:B[E]};this.getSize=function(F,E){return C[F]||(C[F]=new n.Size(this.get(F),E))};this.isUsable=function(){return !!B}}function q(C,B,D){if(C.addEventListener){C.addEventListener(B,D,false)}else{if(C.attachEvent){C.attachEvent("on"+B,function(){return D.call(C,window.event)})}}}function v(C,B){var D=d.get(C);if(D.options){return C}if(B.hover&&B.hoverables[C.nodeName.toLowerCase()]){b.attach(C)}D.options=B;return C}function j(B){var C={};return function(D){if(!k(C,D)){C[D]=B.apply(null,arguments)}return C[D]}}function c(F,E){var B=n.quotedList(E.get("fontFamily").toLowerCase()),D;for(var C=0;D=B[C];++C){if(i[D]){return i[D].get(E.get("fontStyle"),E.get("fontWeight"))}}return null}function g(B){return document.getElementsByTagName(B)}function k(C,B){return C.hasOwnProperty(B)}function h(){var C={},B,F;for(var E=0,D=arguments.length;B=arguments[E],E<D;++E){for(F in B){if(k(B,F)){C[F]=B[F]}}}return C}function o(E,M,C,N,F,D){var K=document.createDocumentFragment(),H;if(M===""){return K}var L=N.separate;var I=M.split(p[L]),B=(L=="words");if(B&&t){if(/^\s/.test(M)){I.unshift("")}if(/\s$/.test(M)){I.push("")}}for(var J=0,G=I.length;J<G;++J){H=z[N.engine](E,B?n.textAlign(I[J],C,J,G):I[J],C,N,F,D,J<G-1);if(H){K.appendChild(H)}}return K}function l(D,M){var C=D.nodeName.toLowerCase();if(M.ignore[C]){return}var E=!M.textless[C];var B=n.getStyle(v(D,M)).extend(M);var F=c(D,B),G,K,I,H,L,J;if(!F){return}for(G=D.firstChild;G;G=I){K=G.nodeType;I=G.nextSibling;if(E&&K==3){if(H){H.appendData(G.data);D.removeChild(G)}else{H=G}if(I){continue}}if(H){D.replaceChild(o(F,n.whiteSpace(H.data,B,H,J),B,M,G,D),H);H=null}if(K==1){if(G.firstChild){if(G.nodeName.toLowerCase()=="cufon"){z[M.engine](F,null,B,M,G,D)}else{arguments.callee(G,M)}}J=G}}}var t=" ".split(/\s+/).length==0;var d=new A();var b=new r();var y=new u();var e=false;var z={},i={},w={autoDetect:false,engine:null,forceHitArea:false,hover:false,hoverables:{a:true},ignore:{applet:1,canvas:1,col:1,colgroup:1,head:1,iframe:1,map:1,optgroup:1,option:1,script:1,select:1,style:1,textarea:1,title:1,pre:1},printable:true,selector:(window.Sizzle||(window.jQuery&&function(B){return jQuery(B)})||(window.dojo&&dojo.query)||(window.Ext&&Ext.query)||(window.YAHOO&&YAHOO.util&&YAHOO.util.Selector&&YAHOO.util.Selector.query)||(window.$$&&function(B){return $$(B)})||(window.$&&function(B){return $(B)})||(document.querySelectorAll&&function(B){return document.querySelectorAll(B)})||g),separate:"words",textless:{dl:1,html:1,ol:1,table:1,tbody:1,thead:1,tfoot:1,tr:1,ul:1},textShadow:"none"};var p={words:/\s/.test("\u00a0")?/[^\S\u00a0]+/:/\s+/,characters:"",none:/^/};m.now=function(){x.ready();return m};m.refresh=function(){y.repeat.apply(y,arguments);return m};m.registerEngine=function(C,B){if(!B){return m}z[C]=B;return m.set("engine",C)};m.registerFont=function(D){if(!D){return m}var B=new s(D),C=B.family;if(!i[C]){i[C]=new f()}i[C].add(B);return m.set("fontFamily",'"'+C+'"')};m.replace=function(D,C,B){C=h(w,C);if(!C.engine){return m}if(!e){n.addClass(x.root(),"cufon-active cufon-loading");n.ready(function(){n.addClass(n.removeClass(x.root(),"cufon-loading"),"cufon-ready")});e=true}if(C.hover){C.forceHitArea=true}if(C.autoDetect){delete C.fontFamily}if(typeof C.textShadow=="string"){C.textShadow=n.textShadow(C.textShadow)}if(typeof C.color=="string"&&/^-/.test(C.color)){C.textGradient=n.gradient(C.color)}else{delete C.textGradient}if(!B){y.add(D,arguments)}if(D.nodeType||typeof D=="string"){D=[D]}n.ready(function(){for(var F=0,E=D.length;F<E;++F){var G=D[F];if(typeof G=="string"){m.replace(C.selector(G),C,true)}else{l(G,C)}}});return m};m.set=function(B,C){w[B]=C;return m};return m})();Cufon.registerEngine("vml",(function(){var e=document.namespaces;if(!e){return}e.add("cvml","urn:schemas-microsoft-com:vml");e=null;var b=document.createElement("cvml:shape");b.style.behavior="url(#default#VML)";if(!b.coordsize){return}b=null;var h=(document.documentMode||0)<8;document.write(('<style type="text/css">cufoncanvas{text-indent:0;}@media screen{cvml\\:shape,cvml\\:rect,cvml\\:fill,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute;}cufoncanvas{position:absolute;text-align:left;}cufon{display:inline-block;position:relative;vertical-align:'+(h?"middle":"text-bottom")+";}cufon cufontext{position:absolute;left:-10000in;font-size:1px;}a cufon{cursor:pointer}}@media print{cufon cufoncanvas{display:none;}}</style>").replace(/;/g,"!important;"));function c(i,j){return a(i,/(?:em|ex|%)$|^[a-z-]+$/i.test(j)?"1em":j)}function a(l,m){if(m==="0"){return 0}if(/px$/i.test(m)){return parseFloat(m)}var k=l.style.left,j=l.runtimeStyle.left;l.runtimeStyle.left=l.currentStyle.left;l.style.left=m.replace("%","em");var i=l.style.pixelLeft;l.style.left=k;l.runtimeStyle.left=j;return i}function f(l,k,j,n){var i="computed"+n,m=k[i];if(isNaN(m)){m=k.get(n);k[i]=m=(m=="normal")?0:~~j.convertFrom(a(l,m))}return m}var g={};function d(p){var q=p.id;if(!g[q]){var n=p.stops,o=document.createElement("cvml:fill"),i=[];o.type="gradient";o.angle=180;o.focus="0";o.method="sigma";o.color=n[0][1];for(var m=1,l=n.length-1;m<l;++m){i.push(n[m][0]*100+"% "+n[m][1])}o.colors=i.join(",");o.color2=n[l][1];g[q]=o}return g[q]}return function(ac,G,Y,C,K,ad,W){var n=(G===null);if(n){G=K.alt}var I=ac.viewBox;var p=Y.computedFontSize||(Y.computedFontSize=new Cufon.CSS.Size(c(ad,Y.get("fontSize"))+"px",ac.baseSize));var y,q;if(n){y=K;q=K.firstChild}else{y=document.createElement("cufon");y.className="cufon cufon-vml";y.alt=G;q=document.createElement("cufoncanvas");y.appendChild(q);if(C.printable){var Z=document.createElement("cufontext");Z.appendChild(document.createTextNode(G));y.appendChild(Z)}if(!W){y.appendChild(document.createElement("cvml:shape"))}}var ai=y.style;var R=q.style;var l=p.convert(I.height),af=Math.ceil(l);var V=af/l;var P=V*Cufon.CSS.fontStretch(Y.get("fontStretch"));var U=I.minX,T=I.minY;R.height=af;R.top=Math.round(p.convert(T-ac.ascent));R.left=Math.round(p.convert(U));ai.height=p.convert(ac.height)+"px";var F=Y.get("color");var ag=Cufon.CSS.textTransform(G,Y).split("");var L=ac.spacing(ag,f(ad,Y,p,"letterSpacing"),f(ad,Y,p,"wordSpacing"));if(!L.length){return null}var k=L.total;var x=-U+k+(I.width-L[L.length-1]);var ah=p.convert(x*P),X=Math.round(ah);var O=x+","+I.height,m;var J="r"+O+"ns";var u=C.textGradient&&d(C.textGradient);var o=ac.glyphs,S=0;var H=C.textShadow;var ab=-1,aa=0,w;while(w=ag[++ab]){var D=o[ag[ab]]||ac.missingGlyph,v;if(!D){continue}if(n){v=q.childNodes[aa];while(v.firstChild){v.removeChild(v.firstChild)}}else{v=document.createElement("cvml:shape");q.appendChild(v)}v.stroked="f";v.coordsize=O;v.coordorigin=m=(U-S)+","+T;v.path=(D.d?"m"+D.d+"xe":"")+"m"+m+J;v.fillcolor=F;if(u){v.appendChild(u.cloneNode(false))}var ae=v.style;ae.width=X;ae.height=af;if(H){var s=H[0],r=H[1];var B=Cufon.CSS.color(s.color),z;var N=document.createElement("cvml:shadow");N.on="t";N.color=B.color;N.offset=s.offX+","+s.offY;if(r){z=Cufon.CSS.color(r.color);N.type="double";N.color2=z.color;N.offset2=r.offX+","+r.offY}N.opacity=B.opacity||(z&&z.opacity)||1;v.appendChild(N)}S+=L[aa++]}var M=v.nextSibling,t,A;if(C.forceHitArea){if(!M){M=document.createElement("cvml:rect");M.stroked="f";M.className="cufon-vml-cover";t=document.createElement("cvml:fill");t.opacity=0;M.appendChild(t);q.appendChild(M)}A=M.style;A.width=X;A.height=af}else{if(M){q.removeChild(M)}}ai.width=Math.max(Math.ceil(p.convert(k*P)),0);if(h){var Q=Y.computedYAdjust;if(Q===undefined){var E=Y.get("lineHeight");if(E=="normal"){E="1em"}else{if(!isNaN(E)){E+="em"}}Y.computedYAdjust=Q=0.5*(a(ad,E)-parseFloat(ai.height))}if(Q){ai.marginTop=Math.ceil(Q)+"px";ai.marginBottom=Q+"px"}}return y}})());Cufon.registerEngine("canvas",(function(){var b=document.createElement("canvas");if(!b||!b.getContext||!b.getContext.apply){return}b=null;var a=Cufon.CSS.supports("display","inline-block");var e=!a&&(document.compatMode=="BackCompat"||/frameset|transitional/i.test(document.doctype.publicId));var f=document.createElement("style");f.type="text/css";f.appendChild(document.createTextNode(("cufon{text-indent:0;}@media screen,projection{cufon{display:inline;display:inline-block;position:relative;vertical-align:middle;"+(e?"":"font-size:1px;line-height:1px;")+"}cufon cufontext{display:-moz-inline-box;display:inline-block;width:0;height:0;overflow:hidden;text-indent:-10000in;}"+(a?"cufon canvas{position:relative;}":"cufon canvas{position:absolute;}")+"}@media print{cufon{padding:0;}cufon canvas{display:none;}}").replace(/;/g,"!important;")));document.getElementsByTagName("head")[0].appendChild(f);function d(p,h){var n=0,m=0;var g=[],o=/([mrvxe])([^a-z]*)/g,k;generate:for(var j=0;k=o.exec(p);++j){var l=k[2].split(",");switch(k[1]){case"v":g[j]={m:"bezierCurveTo",a:[n+~~l[0],m+~~l[1],n+~~l[2],m+~~l[3],n+=~~l[4],m+=~~l[5]]};break;case"r":g[j]={m:"lineTo",a:[n+=~~l[0],m+=~~l[1]]};break;case"m":g[j]={m:"moveTo",a:[n=~~l[0],m=~~l[1]]};break;case"x":g[j]={m:"closePath"};break;case"e":break generate}h[g[j].m].apply(h,g[j].a)}return g}function c(m,k){for(var j=0,h=m.length;j<h;++j){var g=m[j];k[g.m].apply(k,g.a)}}return function(V,w,P,t,C,W){var k=(w===null);if(k){w=C.getAttribute("alt")}var A=V.viewBox;var m=P.getSize("fontSize",V.baseSize);var B=0,O=0,N=0,u=0;var z=t.textShadow,L=[];if(z){for(var U=z.length;U--;){var F=z[U];var K=m.convertFrom(parseFloat(F.offX));var I=m.convertFrom(parseFloat(F.offY));L[U]=[K,I];if(I<B){B=I}if(K>O){O=K}if(I>N){N=I}if(K<u){u=K}}}var Z=Cufon.CSS.textTransform(w,P).split("");var E=V.spacing(Z,~~m.convertFrom(parseFloat(P.get("letterSpacing"))||0),~~m.convertFrom(parseFloat(P.get("wordSpacing"))||0));if(!E.length){return null}var h=E.total;O+=A.width-E[E.length-1];u+=A.minX;var s,n;if(k){s=C;n=C.firstChild}else{s=document.createElement("cufon");s.className="cufon cufon-canvas";s.setAttribute("alt",w);n=document.createElement("canvas");s.appendChild(n);if(t.printable){var S=document.createElement("cufontext");S.appendChild(document.createTextNode(w));s.appendChild(S)}}var aa=s.style;var H=n.style;var j=m.convert(A.height);var Y=Math.ceil(j);var M=Y/j;var G=M*Cufon.CSS.fontStretch(P.get("fontStretch"));var J=h*G;var Q=Math.ceil(m.convert(J+O-u));var o=Math.ceil(m.convert(A.height-B+N));n.width=Q;n.height=o;H.width=Q+"px";H.height=o+"px";B+=A.minY;H.top=Math.round(m.convert(B-V.ascent))+"px";H.left=Math.round(m.convert(u))+"px";var r=Math.max(Math.ceil(m.convert(J)),0)+"px";if(a){aa.width=r;aa.height=m.convert(V.height)+"px"}else{aa.paddingLeft=r;aa.paddingBottom=(m.convert(V.height)-1)+"px"}var X=n.getContext("2d"),D=j/A.height;X.scale(D,D*M);X.translate(-u,-B);X.save();function T(){var x=V.glyphs,ab,l=-1,g=-1,y;X.scale(G,1);while(y=Z[++l]){var ab=x[Z[l]]||V.missingGlyph;if(!ab){continue}if(ab.d){X.beginPath();if(ab.code){c(ab.code,X)}else{ab.code=d("m"+ab.d,X)}X.fill()}X.translate(E[++g],0)}X.restore()}if(z){for(var U=z.length;U--;){var F=z[U];X.save();X.fillStyle=F.color;X.translate.apply(X,L[U]);T()}}var q=t.textGradient;if(q){var v=q.stops,p=X.createLinearGradient(0,A.minY,0,A.maxY);for(var U=0,R=v.length;U<R;++U){p.addColorStop.apply(p,v[U])}X.fillStyle=p}else{X.fillStyle=P.get("color")}T();return s}})());
(function() {

}).call(this);
(function() {

}).call(this);
// Create new HTML5 elements ===================================================
// -----------------------------------------------------------------------------
// This script should load before any others. We want the new elements to be
// parsed before pretty much anything happens.
// Plus, IE does not behave otherwise. The cost of being progressive...
// -----------------------------------------------------------------------------

document.createElement("article");
document.createElement("aside");
document.createElement("audio");
document.createElement("canvas");
document.createElement("command");
document.createElement("datalist");
document.createElement("details");
document.createElement("embed");
document.createElement("figcaption");
document.createElement("figure");
document.createElement("footer");
document.createElement("header");
document.createElement("hgroup");
document.createElement("keygen");
document.createElement("mark");
document.createElement("meter");
document.createElement("nav");
document.createElement("output");
document.createElement("progress");
document.createElement("rp");
document.createElement("rt");
document.createElement("ruby");
document.createElement("section");
document.createElement("source");
document.createElement("summary");
document.createElement("time");
document.createElement("video");
function preloadImages(imgs){
	
	var picArr = [];
	
		for (i = 0; i<imgs.length; i++){
			
				picArr[i]= new Image(100,100); 
				picArr[i].src=imgs[i]; 

			
			}
	
	}
;
/*!
 * jQuery JavaScript Library v1.4.2
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Sat Feb 13 22:33:48 2010 -0500
 */

(function(A,w){function ma(){if(!c.isReady){try{s.documentElement.doScroll("left")}catch(a){setTimeout(ma,1);return}c.ready()}}function Qa(a,b){b.src?c.ajax({url:b.src,async:false,dataType:"script"}):c.globalEval(b.text||b.textContent||b.innerHTML||"");b.parentNode&&b.parentNode.removeChild(b)}function X(a,b,d,f,e,j){var i=a.length;if(typeof b==="object"){for(var o in b)X(a,o,b[o],f,e,d);return a}if(d!==w){f=!j&&f&&c.isFunction(d);for(o=0;o<i;o++)e(a[o],b,f?d.call(a[o],o,e(a[o],b)):d,j);return a}return i?
e(a[0],b):w}function J(){return(new Date).getTime()}function Y(){return false}function Z(){return true}function na(a,b,d){d[0].type=a;return c.event.handle.apply(b,d)}function oa(a){var b,d=[],f=[],e=arguments,j,i,o,k,n,r;i=c.data(this,"events");if(!(a.liveFired===this||!i||!i.live||a.button&&a.type==="click")){a.liveFired=this;var u=i.live.slice(0);for(k=0;k<u.length;k++){i=u[k];i.origType.replace(O,"")===a.type?f.push(i.selector):u.splice(k--,1)}j=c(a.target).closest(f,a.currentTarget);n=0;for(r=
j.length;n<r;n++)for(k=0;k<u.length;k++){i=u[k];if(j[n].selector===i.selector){o=j[n].elem;f=null;if(i.preType==="mouseenter"||i.preType==="mouseleave")f=c(a.relatedTarget).closest(i.selector)[0];if(!f||f!==o)d.push({elem:o,handleObj:i})}}n=0;for(r=d.length;n<r;n++){j=d[n];a.currentTarget=j.elem;a.data=j.handleObj.data;a.handleObj=j.handleObj;if(j.handleObj.origHandler.apply(j.elem,e)===false){b=false;break}}return b}}function pa(a,b){return"live."+(a&&a!=="*"?a+".":"")+b.replace(/\./g,"`").replace(/ /g,
"&")}function qa(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function ra(a,b){var d=0;b.each(function(){if(this.nodeName===(a[d]&&a[d].nodeName)){var f=c.data(a[d++]),e=c.data(this,f);if(f=f&&f.events){delete e.handle;e.events={};for(var j in f)for(var i in f[j])c.event.add(this,j,f[j][i],f[j][i].data)}}})}function sa(a,b,d){var f,e,j;b=b&&b[0]?b[0].ownerDocument||b[0]:s;if(a.length===1&&typeof a[0]==="string"&&a[0].length<512&&b===s&&!ta.test(a[0])&&(c.support.checkClone||!ua.test(a[0]))){e=
true;if(j=c.fragments[a[0]])if(j!==1)f=j}if(!f){f=b.createDocumentFragment();c.clean(a,b,f,d)}if(e)c.fragments[a[0]]=j?f:1;return{fragment:f,cacheable:e}}function K(a,b){var d={};c.each(va.concat.apply([],va.slice(0,b)),function(){d[this]=a});return d}function wa(a){return"scrollTo"in a&&a.document?a:a.nodeType===9?a.defaultView||a.parentWindow:false}var c=function(a,b){return new c.fn.init(a,b)},Ra=A.jQuery,Sa=A.$,s=A.document,T,Ta=/^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/,Ua=/^.[^:#\[\.,]*$/,Va=/\S/,
Wa=/^(\s|\u00A0)+|(\s|\u00A0)+$/g,Xa=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,P=navigator.userAgent,xa=false,Q=[],L,$=Object.prototype.toString,aa=Object.prototype.hasOwnProperty,ba=Array.prototype.push,R=Array.prototype.slice,ya=Array.prototype.indexOf;c.fn=c.prototype={init:function(a,b){var d,f;if(!a)return this;if(a.nodeType){this.context=this[0]=a;this.length=1;return this}if(a==="body"&&!b){this.context=s;this[0]=s.body;this.selector="body";this.length=1;return this}if(typeof a==="string")if((d=Ta.exec(a))&&
(d[1]||!b))if(d[1]){f=b?b.ownerDocument||b:s;if(a=Xa.exec(a))if(c.isPlainObject(b)){a=[s.createElement(a[1])];c.fn.attr.call(a,b,true)}else a=[f.createElement(a[1])];else{a=sa([d[1]],[f]);a=(a.cacheable?a.fragment.cloneNode(true):a.fragment).childNodes}return c.merge(this,a)}else{if(b=s.getElementById(d[2])){if(b.id!==d[2])return T.find(a);this.length=1;this[0]=b}this.context=s;this.selector=a;return this}else if(!b&&/^\w+$/.test(a)){this.selector=a;this.context=s;a=s.getElementsByTagName(a);return c.merge(this,
a)}else return!b||b.jquery?(b||T).find(a):c(b).find(a);else if(c.isFunction(a))return T.ready(a);if(a.selector!==w){this.selector=a.selector;this.context=a.context}return c.makeArray(a,this)},selector:"",jquery:"1.4.2",length:0,size:function(){return this.length},toArray:function(){return R.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this.slice(a)[0]:this[a]},pushStack:function(a,b,d){var f=c();c.isArray(a)?ba.apply(f,a):c.merge(f,a);f.prevObject=this;f.context=this.context;if(b===
"find")f.selector=this.selector+(this.selector?" ":"")+d;else if(b)f.selector=this.selector+"."+b+"("+d+")";return f},each:function(a,b){return c.each(this,a,b)},ready:function(a){c.bindReady();if(c.isReady)a.call(s,c);else Q&&Q.push(a);return this},eq:function(a){return a===-1?this.slice(a):this.slice(a,+a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(R.apply(this,arguments),"slice",R.call(arguments).join(","))},map:function(a){return this.pushStack(c.map(this,
function(b,d){return a.call(b,d,b)}))},end:function(){return this.prevObject||c(null)},push:ba,sort:[].sort,splice:[].splice};c.fn.init.prototype=c.fn;c.extend=c.fn.extend=function(){var a=arguments[0]||{},b=1,d=arguments.length,f=false,e,j,i,o;if(typeof a==="boolean"){f=a;a=arguments[1]||{};b=2}if(typeof a!=="object"&&!c.isFunction(a))a={};if(d===b){a=this;--b}for(;b<d;b++)if((e=arguments[b])!=null)for(j in e){i=a[j];o=e[j];if(a!==o)if(f&&o&&(c.isPlainObject(o)||c.isArray(o))){i=i&&(c.isPlainObject(i)||
c.isArray(i))?i:c.isArray(o)?[]:{};a[j]=c.extend(f,i,o)}else if(o!==w)a[j]=o}return a};c.extend({noConflict:function(a){A.$=Sa;if(a)A.jQuery=Ra;return c},isReady:false,ready:function(){if(!c.isReady){if(!s.body)return setTimeout(c.ready,13);c.isReady=true;if(Q){for(var a,b=0;a=Q[b++];)a.call(s,c);Q=null}c.fn.triggerHandler&&c(s).triggerHandler("ready")}},bindReady:function(){if(!xa){xa=true;if(s.readyState==="complete")return c.ready();if(s.addEventListener){s.addEventListener("DOMContentLoaded",
L,false);A.addEventListener("load",c.ready,false)}else if(s.attachEvent){s.attachEvent("onreadystatechange",L);A.attachEvent("onload",c.ready);var a=false;try{a=A.frameElement==null}catch(b){}s.documentElement.doScroll&&a&&ma()}}},isFunction:function(a){return $.call(a)==="[object Function]"},isArray:function(a){return $.call(a)==="[object Array]"},isPlainObject:function(a){if(!a||$.call(a)!=="[object Object]"||a.nodeType||a.setInterval)return false;if(a.constructor&&!aa.call(a,"constructor")&&!aa.call(a.constructor.prototype,
"isPrototypeOf"))return false;var b;for(b in a);return b===w||aa.call(a,b)},isEmptyObject:function(a){for(var b in a)return false;return true},error:function(a){throw a;},parseJSON:function(a){if(typeof a!=="string"||!a)return null;a=c.trim(a);if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return A.JSON&&A.JSON.parse?A.JSON.parse(a):(new Function("return "+
a))();else c.error("Invalid JSON: "+a)},noop:function(){},globalEval:function(a){if(a&&Va.test(a)){var b=s.getElementsByTagName("head")[0]||s.documentElement,d=s.createElement("script");d.type="text/javascript";if(c.support.scriptEval)d.appendChild(s.createTextNode(a));else d.text=a;b.insertBefore(d,b.firstChild);b.removeChild(d)}},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,b,d){var f,e=0,j=a.length,i=j===w||c.isFunction(a);if(d)if(i)for(f in a){if(b.apply(a[f],
d)===false)break}else for(;e<j;){if(b.apply(a[e++],d)===false)break}else if(i)for(f in a){if(b.call(a[f],f,a[f])===false)break}else for(d=a[0];e<j&&b.call(d,e,d)!==false;d=a[++e]);return a},trim:function(a){return(a||"").replace(Wa,"")},makeArray:function(a,b){b=b||[];if(a!=null)a.length==null||typeof a==="string"||c.isFunction(a)||typeof a!=="function"&&a.setInterval?ba.call(b,a):c.merge(b,a);return b},inArray:function(a,b){if(b.indexOf)return b.indexOf(a);for(var d=0,f=b.length;d<f;d++)if(b[d]===
a)return d;return-1},merge:function(a,b){var d=a.length,f=0;if(typeof b.length==="number")for(var e=b.length;f<e;f++)a[d++]=b[f];else for(;b[f]!==w;)a[d++]=b[f++];a.length=d;return a},grep:function(a,b,d){for(var f=[],e=0,j=a.length;e<j;e++)!d!==!b(a[e],e)&&f.push(a[e]);return f},map:function(a,b,d){for(var f=[],e,j=0,i=a.length;j<i;j++){e=b(a[j],j,d);if(e!=null)f[f.length]=e}return f.concat.apply([],f)},guid:1,proxy:function(a,b,d){if(arguments.length===2)if(typeof b==="string"){d=a;a=d[b];b=w}else if(b&&
!c.isFunction(b)){d=b;b=w}if(!b&&a)b=function(){return a.apply(d||this,arguments)};if(a)b.guid=a.guid=a.guid||b.guid||c.guid++;return b},uaMatch:function(a){a=a.toLowerCase();a=/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version)?[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||!/compatible/.test(a)&&/(mozilla)(?:.*? rv:([\w.]+))?/.exec(a)||[];return{browser:a[1]||"",version:a[2]||"0"}},browser:{}});P=c.uaMatch(P);if(P.browser){c.browser[P.browser]=true;c.browser.version=P.version}if(c.browser.webkit)c.browser.safari=
true;if(ya)c.inArray=function(a,b){return ya.call(b,a)};T=c(s);if(s.addEventListener)L=function(){s.removeEventListener("DOMContentLoaded",L,false);c.ready()};else if(s.attachEvent)L=function(){if(s.readyState==="complete"){s.detachEvent("onreadystatechange",L);c.ready()}};(function(){c.support={};var a=s.documentElement,b=s.createElement("script"),d=s.createElement("div"),f="script"+J();d.style.display="none";d.innerHTML="   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
var e=d.getElementsByTagName("*"),j=d.getElementsByTagName("a")[0];if(!(!e||!e.length||!j)){c.support={leadingWhitespace:d.firstChild.nodeType===3,tbody:!d.getElementsByTagName("tbody").length,htmlSerialize:!!d.getElementsByTagName("link").length,style:/red/.test(j.getAttribute("style")),hrefNormalized:j.getAttribute("href")==="/a",opacity:/^0.55$/.test(j.style.opacity),cssFloat:!!j.style.cssFloat,checkOn:d.getElementsByTagName("input")[0].value==="on",optSelected:s.createElement("select").appendChild(s.createElement("option")).selected,
parentNode:d.removeChild(d.appendChild(s.createElement("div"))).parentNode===null,deleteExpando:true,checkClone:false,scriptEval:false,noCloneEvent:true,boxModel:null};b.type="text/javascript";try{b.appendChild(s.createTextNode("window."+f+"=1;"))}catch(i){}a.insertBefore(b,a.firstChild);if(A[f]){c.support.scriptEval=true;delete A[f]}try{delete b.test}catch(o){c.support.deleteExpando=false}a.removeChild(b);if(d.attachEvent&&d.fireEvent){d.attachEvent("onclick",function k(){c.support.noCloneEvent=
false;d.detachEvent("onclick",k)});d.cloneNode(true).fireEvent("onclick")}d=s.createElement("div");d.innerHTML="<input type='radio' name='radiotest' checked='checked'/>";a=s.createDocumentFragment();a.appendChild(d.firstChild);c.support.checkClone=a.cloneNode(true).cloneNode(true).lastChild.checked;c(function(){var k=s.createElement("div");k.style.width=k.style.paddingLeft="1px";s.body.appendChild(k);c.boxModel=c.support.boxModel=k.offsetWidth===2;s.body.removeChild(k).style.display="none"});a=function(k){var n=
s.createElement("div");k="on"+k;var r=k in n;if(!r){n.setAttribute(k,"return;");r=typeof n[k]==="function"}return r};c.support.submitBubbles=a("submit");c.support.changeBubbles=a("change");a=b=d=e=j=null}})();c.props={"for":"htmlFor","class":"className",readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing",rowspan:"rowSpan",colspan:"colSpan",tabindex:"tabIndex",usemap:"useMap",frameborder:"frameBorder"};var G="jQuery"+J(),Ya=0,za={};c.extend({cache:{},expando:G,noData:{embed:true,object:true,
applet:true},data:function(a,b,d){if(!(a.nodeName&&c.noData[a.nodeName.toLowerCase()])){a=a==A?za:a;var f=a[G],e=c.cache;if(!f&&typeof b==="string"&&d===w)return null;f||(f=++Ya);if(typeof b==="object"){a[G]=f;e[f]=c.extend(true,{},b)}else if(!e[f]){a[G]=f;e[f]={}}a=e[f];if(d!==w)a[b]=d;return typeof b==="string"?a[b]:a}},removeData:function(a,b){if(!(a.nodeName&&c.noData[a.nodeName.toLowerCase()])){a=a==A?za:a;var d=a[G],f=c.cache,e=f[d];if(b){if(e){delete e[b];c.isEmptyObject(e)&&c.removeData(a)}}else{if(c.support.deleteExpando)delete a[c.expando];
else a.removeAttribute&&a.removeAttribute(c.expando);delete f[d]}}}});c.fn.extend({data:function(a,b){if(typeof a==="undefined"&&this.length)return c.data(this[0]);else if(typeof a==="object")return this.each(function(){c.data(this,a)});var d=a.split(".");d[1]=d[1]?"."+d[1]:"";if(b===w){var f=this.triggerHandler("getData"+d[1]+"!",[d[0]]);if(f===w&&this.length)f=c.data(this[0],a);return f===w&&d[1]?this.data(d[0]):f}else return this.trigger("setData"+d[1]+"!",[d[0],b]).each(function(){c.data(this,
a,b)})},removeData:function(a){return this.each(function(){c.removeData(this,a)})}});c.extend({queue:function(a,b,d){if(a){b=(b||"fx")+"queue";var f=c.data(a,b);if(!d)return f||[];if(!f||c.isArray(d))f=c.data(a,b,c.makeArray(d));else f.push(d);return f}},dequeue:function(a,b){b=b||"fx";var d=c.queue(a,b),f=d.shift();if(f==="inprogress")f=d.shift();if(f){b==="fx"&&d.unshift("inprogress");f.call(a,function(){c.dequeue(a,b)})}}});c.fn.extend({queue:function(a,b){if(typeof a!=="string"){b=a;a="fx"}if(b===
w)return c.queue(this[0],a);return this.each(function(){var d=c.queue(this,a,b);a==="fx"&&d[0]!=="inprogress"&&c.dequeue(this,a)})},dequeue:function(a){return this.each(function(){c.dequeue(this,a)})},delay:function(a,b){a=c.fx?c.fx.speeds[a]||a:a;b=b||"fx";return this.queue(b,function(){var d=this;setTimeout(function(){c.dequeue(d,b)},a)})},clearQueue:function(a){return this.queue(a||"fx",[])}});var Aa=/[\n\t]/g,ca=/\s+/,Za=/\r/g,$a=/href|src|style/,ab=/(button|input)/i,bb=/(button|input|object|select|textarea)/i,
cb=/^(a|area)$/i,Ba=/radio|checkbox/;c.fn.extend({attr:function(a,b){return X(this,a,b,true,c.attr)},removeAttr:function(a){return this.each(function(){c.attr(this,a,"");this.nodeType===1&&this.removeAttribute(a)})},addClass:function(a){if(c.isFunction(a))return this.each(function(n){var r=c(this);r.addClass(a.call(this,n,r.attr("class")))});if(a&&typeof a==="string")for(var b=(a||"").split(ca),d=0,f=this.length;d<f;d++){var e=this[d];if(e.nodeType===1)if(e.className){for(var j=" "+e.className+" ",
i=e.className,o=0,k=b.length;o<k;o++)if(j.indexOf(" "+b[o]+" ")<0)i+=" "+b[o];e.className=c.trim(i)}else e.className=a}return this},removeClass:function(a){if(c.isFunction(a))return this.each(function(k){var n=c(this);n.removeClass(a.call(this,k,n.attr("class")))});if(a&&typeof a==="string"||a===w)for(var b=(a||"").split(ca),d=0,f=this.length;d<f;d++){var e=this[d];if(e.nodeType===1&&e.className)if(a){for(var j=(" "+e.className+" ").replace(Aa," "),i=0,o=b.length;i<o;i++)j=j.replace(" "+b[i]+" ",
" ");e.className=c.trim(j)}else e.className=""}return this},toggleClass:function(a,b){var d=typeof a,f=typeof b==="boolean";if(c.isFunction(a))return this.each(function(e){var j=c(this);j.toggleClass(a.call(this,e,j.attr("class"),b),b)});return this.each(function(){if(d==="string")for(var e,j=0,i=c(this),o=b,k=a.split(ca);e=k[j++];){o=f?o:!i.hasClass(e);i[o?"addClass":"removeClass"](e)}else if(d==="undefined"||d==="boolean"){this.className&&c.data(this,"__className__",this.className);this.className=
this.className||a===false?"":c.data(this,"__className__")||""}})},hasClass:function(a){a=" "+a+" ";for(var b=0,d=this.length;b<d;b++)if((" "+this[b].className+" ").replace(Aa," ").indexOf(a)>-1)return true;return false},val:function(a){if(a===w){var b=this[0];if(b){if(c.nodeName(b,"option"))return(b.attributes.value||{}).specified?b.value:b.text;if(c.nodeName(b,"select")){var d=b.selectedIndex,f=[],e=b.options;b=b.type==="select-one";if(d<0)return null;var j=b?d:0;for(d=b?d+1:e.length;j<d;j++){var i=
e[j];if(i.selected){a=c(i).val();if(b)return a;f.push(a)}}return f}if(Ba.test(b.type)&&!c.support.checkOn)return b.getAttribute("value")===null?"on":b.value;return(b.value||"").replace(Za,"")}return w}var o=c.isFunction(a);return this.each(function(k){var n=c(this),r=a;if(this.nodeType===1){if(o)r=a.call(this,k,n.val());if(typeof r==="number")r+="";if(c.isArray(r)&&Ba.test(this.type))this.checked=c.inArray(n.val(),r)>=0;else if(c.nodeName(this,"select")){var u=c.makeArray(r);c("option",this).each(function(){this.selected=
c.inArray(c(this).val(),u)>=0});if(!u.length)this.selectedIndex=-1}else this.value=r}})}});c.extend({attrFn:{val:true,css:true,html:true,text:true,data:true,width:true,height:true,offset:true},attr:function(a,b,d,f){if(!a||a.nodeType===3||a.nodeType===8)return w;if(f&&b in c.attrFn)return c(a)[b](d);f=a.nodeType!==1||!c.isXMLDoc(a);var e=d!==w;b=f&&c.props[b]||b;if(a.nodeType===1){var j=$a.test(b);if(b in a&&f&&!j){if(e){b==="type"&&ab.test(a.nodeName)&&a.parentNode&&c.error("type property can't be changed");
a[b]=d}if(c.nodeName(a,"form")&&a.getAttributeNode(b))return a.getAttributeNode(b).nodeValue;if(b==="tabIndex")return(b=a.getAttributeNode("tabIndex"))&&b.specified?b.value:bb.test(a.nodeName)||cb.test(a.nodeName)&&a.href?0:w;return a[b]}if(!c.support.style&&f&&b==="style"){if(e)a.style.cssText=""+d;return a.style.cssText}e&&a.setAttribute(b,""+d);a=!c.support.hrefNormalized&&f&&j?a.getAttribute(b,2):a.getAttribute(b);return a===null?w:a}return c.style(a,b,d)}});var O=/\.(.*)$/,db=function(a){return a.replace(/[^\w\s\.\|`]/g,
function(b){return"\\"+b})};c.event={add:function(a,b,d,f){if(!(a.nodeType===3||a.nodeType===8)){if(a.setInterval&&a!==A&&!a.frameElement)a=A;var e,j;if(d.handler){e=d;d=e.handler}if(!d.guid)d.guid=c.guid++;if(j=c.data(a)){var i=j.events=j.events||{},o=j.handle;if(!o)j.handle=o=function(){return typeof c!=="undefined"&&!c.event.triggered?c.event.handle.apply(o.elem,arguments):w};o.elem=a;b=b.split(" ");for(var k,n=0,r;k=b[n++];){j=e?c.extend({},e):{handler:d,data:f};if(k.indexOf(".")>-1){r=k.split(".");
k=r.shift();j.namespace=r.slice(0).sort().join(".")}else{r=[];j.namespace=""}j.type=k;j.guid=d.guid;var u=i[k],z=c.event.special[k]||{};if(!u){u=i[k]=[];if(!z.setup||z.setup.call(a,f,r,o)===false)if(a.addEventListener)a.addEventListener(k,o,false);else a.attachEvent&&a.attachEvent("on"+k,o)}if(z.add){z.add.call(a,j);if(!j.handler.guid)j.handler.guid=d.guid}u.push(j);c.event.global[k]=true}a=null}}},global:{},remove:function(a,b,d,f){if(!(a.nodeType===3||a.nodeType===8)){var e,j=0,i,o,k,n,r,u,z=c.data(a),
C=z&&z.events;if(z&&C){if(b&&b.type){d=b.handler;b=b.type}if(!b||typeof b==="string"&&b.charAt(0)==="."){b=b||"";for(e in C)c.event.remove(a,e+b)}else{for(b=b.split(" ");e=b[j++];){n=e;i=e.indexOf(".")<0;o=[];if(!i){o=e.split(".");e=o.shift();k=new RegExp("(^|\\.)"+c.map(o.slice(0).sort(),db).join("\\.(?:.*\\.)?")+"(\\.|$)")}if(r=C[e])if(d){n=c.event.special[e]||{};for(B=f||0;B<r.length;B++){u=r[B];if(d.guid===u.guid){if(i||k.test(u.namespace)){f==null&&r.splice(B--,1);n.remove&&n.remove.call(a,u)}if(f!=
null)break}}if(r.length===0||f!=null&&r.length===1){if(!n.teardown||n.teardown.call(a,o)===false)Ca(a,e,z.handle);delete C[e]}}else for(var B=0;B<r.length;B++){u=r[B];if(i||k.test(u.namespace)){c.event.remove(a,n,u.handler,B);r.splice(B--,1)}}}if(c.isEmptyObject(C)){if(b=z.handle)b.elem=null;delete z.events;delete z.handle;c.isEmptyObject(z)&&c.removeData(a)}}}}},trigger:function(a,b,d,f){var e=a.type||a;if(!f){a=typeof a==="object"?a[G]?a:c.extend(c.Event(e),a):c.Event(e);if(e.indexOf("!")>=0){a.type=
e=e.slice(0,-1);a.exclusive=true}if(!d){a.stopPropagation();c.event.global[e]&&c.each(c.cache,function(){this.events&&this.events[e]&&c.event.trigger(a,b,this.handle.elem)})}if(!d||d.nodeType===3||d.nodeType===8)return w;a.result=w;a.target=d;b=c.makeArray(b);b.unshift(a)}a.currentTarget=d;(f=c.data(d,"handle"))&&f.apply(d,b);f=d.parentNode||d.ownerDocument;try{if(!(d&&d.nodeName&&c.noData[d.nodeName.toLowerCase()]))if(d["on"+e]&&d["on"+e].apply(d,b)===false)a.result=false}catch(j){}if(!a.isPropagationStopped()&&
f)c.event.trigger(a,b,f,true);else if(!a.isDefaultPrevented()){f=a.target;var i,o=c.nodeName(f,"a")&&e==="click",k=c.event.special[e]||{};if((!k._default||k._default.call(d,a)===false)&&!o&&!(f&&f.nodeName&&c.noData[f.nodeName.toLowerCase()])){try{if(f[e]){if(i=f["on"+e])f["on"+e]=null;c.event.triggered=true;f[e]()}}catch(n){}if(i)f["on"+e]=i;c.event.triggered=false}}},handle:function(a){var b,d,f,e;a=arguments[0]=c.event.fix(a||A.event);a.currentTarget=this;b=a.type.indexOf(".")<0&&!a.exclusive;
if(!b){d=a.type.split(".");a.type=d.shift();f=new RegExp("(^|\\.)"+d.slice(0).sort().join("\\.(?:.*\\.)?")+"(\\.|$)")}e=c.data(this,"events");d=e[a.type];if(e&&d){d=d.slice(0);e=0;for(var j=d.length;e<j;e++){var i=d[e];if(b||f.test(i.namespace)){a.handler=i.handler;a.data=i.data;a.handleObj=i;i=i.handler.apply(this,arguments);if(i!==w){a.result=i;if(i===false){a.preventDefault();a.stopPropagation()}}if(a.isImmediatePropagationStopped())break}}}return a.result},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
fix:function(a){if(a[G])return a;var b=a;a=c.Event(b);for(var d=this.props.length,f;d;){f=this.props[--d];a[f]=b[f]}if(!a.target)a.target=a.srcElement||s;if(a.target.nodeType===3)a.target=a.target.parentNode;if(!a.relatedTarget&&a.fromElement)a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement;if(a.pageX==null&&a.clientX!=null){b=s.documentElement;d=s.body;a.pageX=a.clientX+(b&&b.scrollLeft||d&&d.scrollLeft||0)-(b&&b.clientLeft||d&&d.clientLeft||0);a.pageY=a.clientY+(b&&b.scrollTop||
d&&d.scrollTop||0)-(b&&b.clientTop||d&&d.clientTop||0)}if(!a.which&&(a.charCode||a.charCode===0?a.charCode:a.keyCode))a.which=a.charCode||a.keyCode;if(!a.metaKey&&a.ctrlKey)a.metaKey=a.ctrlKey;if(!a.which&&a.button!==w)a.which=a.button&1?1:a.button&2?3:a.button&4?2:0;return a},guid:1E8,proxy:c.proxy,special:{ready:{setup:c.bindReady,teardown:c.noop},live:{add:function(a){c.event.add(this,a.origType,c.extend({},a,{handler:oa}))},remove:function(a){var b=true,d=a.origType.replace(O,"");c.each(c.data(this,
"events").live||[],function(){if(d===this.origType.replace(O,""))return b=false});b&&c.event.remove(this,a.origType,oa)}},beforeunload:{setup:function(a,b,d){if(this.setInterval)this.onbeforeunload=d;return false},teardown:function(a,b){if(this.onbeforeunload===b)this.onbeforeunload=null}}}};var Ca=s.removeEventListener?function(a,b,d){a.removeEventListener(b,d,false)}:function(a,b,d){a.detachEvent("on"+b,d)};c.Event=function(a){if(!this.preventDefault)return new c.Event(a);if(a&&a.type){this.originalEvent=
a;this.type=a.type}else this.type=a;this.timeStamp=J();this[G]=true};c.Event.prototype={preventDefault:function(){this.isDefaultPrevented=Z;var a=this.originalEvent;if(a){a.preventDefault&&a.preventDefault();a.returnValue=false}},stopPropagation:function(){this.isPropagationStopped=Z;var a=this.originalEvent;if(a){a.stopPropagation&&a.stopPropagation();a.cancelBubble=true}},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=Z;this.stopPropagation()},isDefaultPrevented:Y,isPropagationStopped:Y,
isImmediatePropagationStopped:Y};var Da=function(a){var b=a.relatedTarget;try{for(;b&&b!==this;)b=b.parentNode;if(b!==this){a.type=a.data;c.event.handle.apply(this,arguments)}}catch(d){}},Ea=function(a){a.type=a.data;c.event.handle.apply(this,arguments)};c.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){c.event.special[a]={setup:function(d){c.event.add(this,b,d&&d.selector?Ea:Da,a)},teardown:function(d){c.event.remove(this,b,d&&d.selector?Ea:Da)}}});if(!c.support.submitBubbles)c.event.special.submit=
{setup:function(){if(this.nodeName.toLowerCase()!=="form"){c.event.add(this,"click.specialSubmit",function(a){var b=a.target,d=b.type;if((d==="submit"||d==="image")&&c(b).closest("form").length)return na("submit",this,arguments)});c.event.add(this,"keypress.specialSubmit",function(a){var b=a.target,d=b.type;if((d==="text"||d==="password")&&c(b).closest("form").length&&a.keyCode===13)return na("submit",this,arguments)})}else return false},teardown:function(){c.event.remove(this,".specialSubmit")}};
if(!c.support.changeBubbles){var da=/textarea|input|select/i,ea,Fa=function(a){var b=a.type,d=a.value;if(b==="radio"||b==="checkbox")d=a.checked;else if(b==="select-multiple")d=a.selectedIndex>-1?c.map(a.options,function(f){return f.selected}).join("-"):"";else if(a.nodeName.toLowerCase()==="select")d=a.selectedIndex;return d},fa=function(a,b){var d=a.target,f,e;if(!(!da.test(d.nodeName)||d.readOnly)){f=c.data(d,"_change_data");e=Fa(d);if(a.type!=="focusout"||d.type!=="radio")c.data(d,"_change_data",
e);if(!(f===w||e===f))if(f!=null||e){a.type="change";return c.event.trigger(a,b,d)}}};c.event.special.change={filters:{focusout:fa,click:function(a){var b=a.target,d=b.type;if(d==="radio"||d==="checkbox"||b.nodeName.toLowerCase()==="select")return fa.call(this,a)},keydown:function(a){var b=a.target,d=b.type;if(a.keyCode===13&&b.nodeName.toLowerCase()!=="textarea"||a.keyCode===32&&(d==="checkbox"||d==="radio")||d==="select-multiple")return fa.call(this,a)},beforeactivate:function(a){a=a.target;c.data(a,
"_change_data",Fa(a))}},setup:function(){if(this.type==="file")return false;for(var a in ea)c.event.add(this,a+".specialChange",ea[a]);return da.test(this.nodeName)},teardown:function(){c.event.remove(this,".specialChange");return da.test(this.nodeName)}};ea=c.event.special.change.filters}s.addEventListener&&c.each({focus:"focusin",blur:"focusout"},function(a,b){function d(f){f=c.event.fix(f);f.type=b;return c.event.handle.call(this,f)}c.event.special[b]={setup:function(){this.addEventListener(a,
d,true)},teardown:function(){this.removeEventListener(a,d,true)}}});c.each(["bind","one"],function(a,b){c.fn[b]=function(d,f,e){if(typeof d==="object"){for(var j in d)this[b](j,f,d[j],e);return this}if(c.isFunction(f)){e=f;f=w}var i=b==="one"?c.proxy(e,function(k){c(this).unbind(k,i);return e.apply(this,arguments)}):e;if(d==="unload"&&b!=="one")this.one(d,f,e);else{j=0;for(var o=this.length;j<o;j++)c.event.add(this[j],d,i,f)}return this}});c.fn.extend({unbind:function(a,b){if(typeof a==="object"&&
!a.preventDefault)for(var d in a)this.unbind(d,a[d]);else{d=0;for(var f=this.length;d<f;d++)c.event.remove(this[d],a,b)}return this},delegate:function(a,b,d,f){return this.live(b,d,f,a)},undelegate:function(a,b,d){return arguments.length===0?this.unbind("live"):this.die(b,null,d,a)},trigger:function(a,b){return this.each(function(){c.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0]){a=c.Event(a);a.preventDefault();a.stopPropagation();c.event.trigger(a,b,this[0]);return a.result}},
toggle:function(a){for(var b=arguments,d=1;d<b.length;)c.proxy(a,b[d++]);return this.click(c.proxy(a,function(f){var e=(c.data(this,"lastToggle"+a.guid)||0)%d;c.data(this,"lastToggle"+a.guid,e+1);f.preventDefault();return b[e].apply(this,arguments)||false}))},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var Ga={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};c.each(["live","die"],function(a,b){c.fn[b]=function(d,f,e,j){var i,o=0,k,n,r=j||this.selector,
u=j?this:c(this.context);if(c.isFunction(f)){e=f;f=w}for(d=(d||"").split(" ");(i=d[o++])!=null;){j=O.exec(i);k="";if(j){k=j[0];i=i.replace(O,"")}if(i==="hover")d.push("mouseenter"+k,"mouseleave"+k);else{n=i;if(i==="focus"||i==="blur"){d.push(Ga[i]+k);i+=k}else i=(Ga[i]||i)+k;b==="live"?u.each(function(){c.event.add(this,pa(i,r),{data:f,selector:r,handler:e,origType:i,origHandler:e,preType:n})}):u.unbind(pa(i,r),e)}}return this}});c.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),
function(a,b){c.fn[b]=function(d){return d?this.bind(b,d):this.trigger(b)};if(c.attrFn)c.attrFn[b]=true});A.attachEvent&&!A.addEventListener&&A.attachEvent("onunload",function(){for(var a in c.cache)if(c.cache[a].handle)try{c.event.remove(c.cache[a].handle.elem)}catch(b){}});(function(){function a(g){for(var h="",l,m=0;g[m];m++){l=g[m];if(l.nodeType===3||l.nodeType===4)h+=l.nodeValue;else if(l.nodeType!==8)h+=a(l.childNodes)}return h}function b(g,h,l,m,q,p){q=0;for(var v=m.length;q<v;q++){var t=m[q];
if(t){t=t[g];for(var y=false;t;){if(t.sizcache===l){y=m[t.sizset];break}if(t.nodeType===1&&!p){t.sizcache=l;t.sizset=q}if(t.nodeName.toLowerCase()===h){y=t;break}t=t[g]}m[q]=y}}}function d(g,h,l,m,q,p){q=0;for(var v=m.length;q<v;q++){var t=m[q];if(t){t=t[g];for(var y=false;t;){if(t.sizcache===l){y=m[t.sizset];break}if(t.nodeType===1){if(!p){t.sizcache=l;t.sizset=q}if(typeof h!=="string"){if(t===h){y=true;break}}else if(k.filter(h,[t]).length>0){y=t;break}}t=t[g]}m[q]=y}}}var f=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
e=0,j=Object.prototype.toString,i=false,o=true;[0,0].sort(function(){o=false;return 0});var k=function(g,h,l,m){l=l||[];var q=h=h||s;if(h.nodeType!==1&&h.nodeType!==9)return[];if(!g||typeof g!=="string")return l;for(var p=[],v,t,y,S,H=true,M=x(h),I=g;(f.exec(""),v=f.exec(I))!==null;){I=v[3];p.push(v[1]);if(v[2]){S=v[3];break}}if(p.length>1&&r.exec(g))if(p.length===2&&n.relative[p[0]])t=ga(p[0]+p[1],h);else for(t=n.relative[p[0]]?[h]:k(p.shift(),h);p.length;){g=p.shift();if(n.relative[g])g+=p.shift();
t=ga(g,t)}else{if(!m&&p.length>1&&h.nodeType===9&&!M&&n.match.ID.test(p[0])&&!n.match.ID.test(p[p.length-1])){v=k.find(p.shift(),h,M);h=v.expr?k.filter(v.expr,v.set)[0]:v.set[0]}if(h){v=m?{expr:p.pop(),set:z(m)}:k.find(p.pop(),p.length===1&&(p[0]==="~"||p[0]==="+")&&h.parentNode?h.parentNode:h,M);t=v.expr?k.filter(v.expr,v.set):v.set;if(p.length>0)y=z(t);else H=false;for(;p.length;){var D=p.pop();v=D;if(n.relative[D])v=p.pop();else D="";if(v==null)v=h;n.relative[D](y,v,M)}}else y=[]}y||(y=t);y||k.error(D||
g);if(j.call(y)==="[object Array]")if(H)if(h&&h.nodeType===1)for(g=0;y[g]!=null;g++){if(y[g]&&(y[g]===true||y[g].nodeType===1&&E(h,y[g])))l.push(t[g])}else for(g=0;y[g]!=null;g++)y[g]&&y[g].nodeType===1&&l.push(t[g]);else l.push.apply(l,y);else z(y,l);if(S){k(S,q,l,m);k.uniqueSort(l)}return l};k.uniqueSort=function(g){if(B){i=o;g.sort(B);if(i)for(var h=1;h<g.length;h++)g[h]===g[h-1]&&g.splice(h--,1)}return g};k.matches=function(g,h){return k(g,null,null,h)};k.find=function(g,h,l){var m,q;if(!g)return[];
for(var p=0,v=n.order.length;p<v;p++){var t=n.order[p];if(q=n.leftMatch[t].exec(g)){var y=q[1];q.splice(1,1);if(y.substr(y.length-1)!=="\\"){q[1]=(q[1]||"").replace(/\\/g,"");m=n.find[t](q,h,l);if(m!=null){g=g.replace(n.match[t],"");break}}}}m||(m=h.getElementsByTagName("*"));return{set:m,expr:g}};k.filter=function(g,h,l,m){for(var q=g,p=[],v=h,t,y,S=h&&h[0]&&x(h[0]);g&&h.length;){for(var H in n.filter)if((t=n.leftMatch[H].exec(g))!=null&&t[2]){var M=n.filter[H],I,D;D=t[1];y=false;t.splice(1,1);if(D.substr(D.length-
1)!=="\\"){if(v===p)p=[];if(n.preFilter[H])if(t=n.preFilter[H](t,v,l,p,m,S)){if(t===true)continue}else y=I=true;if(t)for(var U=0;(D=v[U])!=null;U++)if(D){I=M(D,t,U,v);var Ha=m^!!I;if(l&&I!=null)if(Ha)y=true;else v[U]=false;else if(Ha){p.push(D);y=true}}if(I!==w){l||(v=p);g=g.replace(n.match[H],"");if(!y)return[];break}}}if(g===q)if(y==null)k.error(g);else break;q=g}return v};k.error=function(g){throw"Syntax error, unrecognized expression: "+g;};var n=k.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
CLASS:/\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(g){return g.getAttribute("href")}},
relative:{"+":function(g,h){var l=typeof h==="string",m=l&&!/\W/.test(h);l=l&&!m;if(m)h=h.toLowerCase();m=0;for(var q=g.length,p;m<q;m++)if(p=g[m]){for(;(p=p.previousSibling)&&p.nodeType!==1;);g[m]=l||p&&p.nodeName.toLowerCase()===h?p||false:p===h}l&&k.filter(h,g,true)},">":function(g,h){var l=typeof h==="string";if(l&&!/\W/.test(h)){h=h.toLowerCase();for(var m=0,q=g.length;m<q;m++){var p=g[m];if(p){l=p.parentNode;g[m]=l.nodeName.toLowerCase()===h?l:false}}}else{m=0;for(q=g.length;m<q;m++)if(p=g[m])g[m]=
l?p.parentNode:p.parentNode===h;l&&k.filter(h,g,true)}},"":function(g,h,l){var m=e++,q=d;if(typeof h==="string"&&!/\W/.test(h)){var p=h=h.toLowerCase();q=b}q("parentNode",h,m,g,p,l)},"~":function(g,h,l){var m=e++,q=d;if(typeof h==="string"&&!/\W/.test(h)){var p=h=h.toLowerCase();q=b}q("previousSibling",h,m,g,p,l)}},find:{ID:function(g,h,l){if(typeof h.getElementById!=="undefined"&&!l)return(g=h.getElementById(g[1]))?[g]:[]},NAME:function(g,h){if(typeof h.getElementsByName!=="undefined"){var l=[];
h=h.getElementsByName(g[1]);for(var m=0,q=h.length;m<q;m++)h[m].getAttribute("name")===g[1]&&l.push(h[m]);return l.length===0?null:l}},TAG:function(g,h){return h.getElementsByTagName(g[1])}},preFilter:{CLASS:function(g,h,l,m,q,p){g=" "+g[1].replace(/\\/g,"")+" ";if(p)return g;p=0;for(var v;(v=h[p])!=null;p++)if(v)if(q^(v.className&&(" "+v.className+" ").replace(/[\t\n]/g," ").indexOf(g)>=0))l||m.push(v);else if(l)h[p]=false;return false},ID:function(g){return g[1].replace(/\\/g,"")},TAG:function(g){return g[1].toLowerCase()},
CHILD:function(g){if(g[1]==="nth"){var h=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(g[2]==="even"&&"2n"||g[2]==="odd"&&"2n+1"||!/\D/.test(g[2])&&"0n+"+g[2]||g[2]);g[2]=h[1]+(h[2]||1)-0;g[3]=h[3]-0}g[0]=e++;return g},ATTR:function(g,h,l,m,q,p){h=g[1].replace(/\\/g,"");if(!p&&n.attrMap[h])g[1]=n.attrMap[h];if(g[2]==="~=")g[4]=" "+g[4]+" ";return g},PSEUDO:function(g,h,l,m,q){if(g[1]==="not")if((f.exec(g[3])||"").length>1||/^\w/.test(g[3]))g[3]=k(g[3],null,null,h);else{g=k.filter(g[3],h,l,true^q);l||m.push.apply(m,
g);return false}else if(n.match.POS.test(g[0])||n.match.CHILD.test(g[0]))return true;return g},POS:function(g){g.unshift(true);return g}},filters:{enabled:function(g){return g.disabled===false&&g.type!=="hidden"},disabled:function(g){return g.disabled===true},checked:function(g){return g.checked===true},selected:function(g){return g.selected===true},parent:function(g){return!!g.firstChild},empty:function(g){return!g.firstChild},has:function(g,h,l){return!!k(l[3],g).length},header:function(g){return/h\d/i.test(g.nodeName)},
text:function(g){return"text"===g.type},radio:function(g){return"radio"===g.type},checkbox:function(g){return"checkbox"===g.type},file:function(g){return"file"===g.type},password:function(g){return"password"===g.type},submit:function(g){return"submit"===g.type},image:function(g){return"image"===g.type},reset:function(g){return"reset"===g.type},button:function(g){return"button"===g.type||g.nodeName.toLowerCase()==="button"},input:function(g){return/input|select|textarea|button/i.test(g.nodeName)}},
setFilters:{first:function(g,h){return h===0},last:function(g,h,l,m){return h===m.length-1},even:function(g,h){return h%2===0},odd:function(g,h){return h%2===1},lt:function(g,h,l){return h<l[3]-0},gt:function(g,h,l){return h>l[3]-0},nth:function(g,h,l){return l[3]-0===h},eq:function(g,h,l){return l[3]-0===h}},filter:{PSEUDO:function(g,h,l,m){var q=h[1],p=n.filters[q];if(p)return p(g,l,h,m);else if(q==="contains")return(g.textContent||g.innerText||a([g])||"").indexOf(h[3])>=0;else if(q==="not"){h=
h[3];l=0;for(m=h.length;l<m;l++)if(h[l]===g)return false;return true}else k.error("Syntax error, unrecognized expression: "+q)},CHILD:function(g,h){var l=h[1],m=g;switch(l){case "only":case "first":for(;m=m.previousSibling;)if(m.nodeType===1)return false;if(l==="first")return true;m=g;case "last":for(;m=m.nextSibling;)if(m.nodeType===1)return false;return true;case "nth":l=h[2];var q=h[3];if(l===1&&q===0)return true;h=h[0];var p=g.parentNode;if(p&&(p.sizcache!==h||!g.nodeIndex)){var v=0;for(m=p.firstChild;m;m=
m.nextSibling)if(m.nodeType===1)m.nodeIndex=++v;p.sizcache=h}g=g.nodeIndex-q;return l===0?g===0:g%l===0&&g/l>=0}},ID:function(g,h){return g.nodeType===1&&g.getAttribute("id")===h},TAG:function(g,h){return h==="*"&&g.nodeType===1||g.nodeName.toLowerCase()===h},CLASS:function(g,h){return(" "+(g.className||g.getAttribute("class"))+" ").indexOf(h)>-1},ATTR:function(g,h){var l=h[1];g=n.attrHandle[l]?n.attrHandle[l](g):g[l]!=null?g[l]:g.getAttribute(l);l=g+"";var m=h[2];h=h[4];return g==null?m==="!=":m===
"="?l===h:m==="*="?l.indexOf(h)>=0:m==="~="?(" "+l+" ").indexOf(h)>=0:!h?l&&g!==false:m==="!="?l!==h:m==="^="?l.indexOf(h)===0:m==="$="?l.substr(l.length-h.length)===h:m==="|="?l===h||l.substr(0,h.length+1)===h+"-":false},POS:function(g,h,l,m){var q=n.setFilters[h[2]];if(q)return q(g,l,h,m)}}},r=n.match.POS;for(var u in n.match){n.match[u]=new RegExp(n.match[u].source+/(?![^\[]*\])(?![^\(]*\))/.source);n.leftMatch[u]=new RegExp(/(^(?:.|\r|\n)*?)/.source+n.match[u].source.replace(/\\(\d+)/g,function(g,
h){return"\\"+(h-0+1)}))}var z=function(g,h){g=Array.prototype.slice.call(g,0);if(h){h.push.apply(h,g);return h}return g};try{Array.prototype.slice.call(s.documentElement.childNodes,0)}catch(C){z=function(g,h){h=h||[];if(j.call(g)==="[object Array]")Array.prototype.push.apply(h,g);else if(typeof g.length==="number")for(var l=0,m=g.length;l<m;l++)h.push(g[l]);else for(l=0;g[l];l++)h.push(g[l]);return h}}var B;if(s.documentElement.compareDocumentPosition)B=function(g,h){if(!g.compareDocumentPosition||
!h.compareDocumentPosition){if(g==h)i=true;return g.compareDocumentPosition?-1:1}g=g.compareDocumentPosition(h)&4?-1:g===h?0:1;if(g===0)i=true;return g};else if("sourceIndex"in s.documentElement)B=function(g,h){if(!g.sourceIndex||!h.sourceIndex){if(g==h)i=true;return g.sourceIndex?-1:1}g=g.sourceIndex-h.sourceIndex;if(g===0)i=true;return g};else if(s.createRange)B=function(g,h){if(!g.ownerDocument||!h.ownerDocument){if(g==h)i=true;return g.ownerDocument?-1:1}var l=g.ownerDocument.createRange(),m=
h.ownerDocument.createRange();l.setStart(g,0);l.setEnd(g,0);m.setStart(h,0);m.setEnd(h,0);g=l.compareBoundaryPoints(Range.START_TO_END,m);if(g===0)i=true;return g};(function(){var g=s.createElement("div"),h="script"+(new Date).getTime();g.innerHTML="<a name='"+h+"'/>";var l=s.documentElement;l.insertBefore(g,l.firstChild);if(s.getElementById(h)){n.find.ID=function(m,q,p){if(typeof q.getElementById!=="undefined"&&!p)return(q=q.getElementById(m[1]))?q.id===m[1]||typeof q.getAttributeNode!=="undefined"&&
q.getAttributeNode("id").nodeValue===m[1]?[q]:w:[]};n.filter.ID=function(m,q){var p=typeof m.getAttributeNode!=="undefined"&&m.getAttributeNode("id");return m.nodeType===1&&p&&p.nodeValue===q}}l.removeChild(g);l=g=null})();(function(){var g=s.createElement("div");g.appendChild(s.createComment(""));if(g.getElementsByTagName("*").length>0)n.find.TAG=function(h,l){l=l.getElementsByTagName(h[1]);if(h[1]==="*"){h=[];for(var m=0;l[m];m++)l[m].nodeType===1&&h.push(l[m]);l=h}return l};g.innerHTML="<a href='#'></a>";
if(g.firstChild&&typeof g.firstChild.getAttribute!=="undefined"&&g.firstChild.getAttribute("href")!=="#")n.attrHandle.href=function(h){return h.getAttribute("href",2)};g=null})();s.querySelectorAll&&function(){var g=k,h=s.createElement("div");h.innerHTML="<p class='TEST'></p>";if(!(h.querySelectorAll&&h.querySelectorAll(".TEST").length===0)){k=function(m,q,p,v){q=q||s;if(!v&&q.nodeType===9&&!x(q))try{return z(q.querySelectorAll(m),p)}catch(t){}return g(m,q,p,v)};for(var l in g)k[l]=g[l];h=null}}();
(function(){var g=s.createElement("div");g.innerHTML="<div class='test e'></div><div class='test'></div>";if(!(!g.getElementsByClassName||g.getElementsByClassName("e").length===0)){g.lastChild.className="e";if(g.getElementsByClassName("e").length!==1){n.order.splice(1,0,"CLASS");n.find.CLASS=function(h,l,m){if(typeof l.getElementsByClassName!=="undefined"&&!m)return l.getElementsByClassName(h[1])};g=null}}})();var E=s.compareDocumentPosition?function(g,h){return!!(g.compareDocumentPosition(h)&16)}:
function(g,h){return g!==h&&(g.contains?g.contains(h):true)},x=function(g){return(g=(g?g.ownerDocument||g:0).documentElement)?g.nodeName!=="HTML":false},ga=function(g,h){var l=[],m="",q;for(h=h.nodeType?[h]:h;q=n.match.PSEUDO.exec(g);){m+=q[0];g=g.replace(n.match.PSEUDO,"")}g=n.relative[g]?g+"*":g;q=0;for(var p=h.length;q<p;q++)k(g,h[q],l);return k.filter(m,l)};c.find=k;c.expr=k.selectors;c.expr[":"]=c.expr.filters;c.unique=k.uniqueSort;c.text=a;c.isXMLDoc=x;c.contains=E})();var eb=/Until$/,fb=/^(?:parents|prevUntil|prevAll)/,
gb=/,/;R=Array.prototype.slice;var Ia=function(a,b,d){if(c.isFunction(b))return c.grep(a,function(e,j){return!!b.call(e,j,e)===d});else if(b.nodeType)return c.grep(a,function(e){return e===b===d});else if(typeof b==="string"){var f=c.grep(a,function(e){return e.nodeType===1});if(Ua.test(b))return c.filter(b,f,!d);else b=c.filter(b,f)}return c.grep(a,function(e){return c.inArray(e,b)>=0===d})};c.fn.extend({find:function(a){for(var b=this.pushStack("","find",a),d=0,f=0,e=this.length;f<e;f++){d=b.length;
c.find(a,this[f],b);if(f>0)for(var j=d;j<b.length;j++)for(var i=0;i<d;i++)if(b[i]===b[j]){b.splice(j--,1);break}}return b},has:function(a){var b=c(a);return this.filter(function(){for(var d=0,f=b.length;d<f;d++)if(c.contains(this,b[d]))return true})},not:function(a){return this.pushStack(Ia(this,a,false),"not",a)},filter:function(a){return this.pushStack(Ia(this,a,true),"filter",a)},is:function(a){return!!a&&c.filter(a,this).length>0},closest:function(a,b){if(c.isArray(a)){var d=[],f=this[0],e,j=
{},i;if(f&&a.length){e=0;for(var o=a.length;e<o;e++){i=a[e];j[i]||(j[i]=c.expr.match.POS.test(i)?c(i,b||this.context):i)}for(;f&&f.ownerDocument&&f!==b;){for(i in j){e=j[i];if(e.jquery?e.index(f)>-1:c(f).is(e)){d.push({selector:i,elem:f});delete j[i]}}f=f.parentNode}}return d}var k=c.expr.match.POS.test(a)?c(a,b||this.context):null;return this.map(function(n,r){for(;r&&r.ownerDocument&&r!==b;){if(k?k.index(r)>-1:c(r).is(a))return r;r=r.parentNode}return null})},index:function(a){if(!a||typeof a===
"string")return c.inArray(this[0],a?c(a):this.parent().children());return c.inArray(a.jquery?a[0]:a,this)},add:function(a,b){a=typeof a==="string"?c(a,b||this.context):c.makeArray(a);b=c.merge(this.get(),a);return this.pushStack(qa(a[0])||qa(b[0])?b:c.unique(b))},andSelf:function(){return this.add(this.prevObject)}});c.each({parent:function(a){return(a=a.parentNode)&&a.nodeType!==11?a:null},parents:function(a){return c.dir(a,"parentNode")},parentsUntil:function(a,b,d){return c.dir(a,"parentNode",
d)},next:function(a){return c.nth(a,2,"nextSibling")},prev:function(a){return c.nth(a,2,"previousSibling")},nextAll:function(a){return c.dir(a,"nextSibling")},prevAll:function(a){return c.dir(a,"previousSibling")},nextUntil:function(a,b,d){return c.dir(a,"nextSibling",d)},prevUntil:function(a,b,d){return c.dir(a,"previousSibling",d)},siblings:function(a){return c.sibling(a.parentNode.firstChild,a)},children:function(a){return c.sibling(a.firstChild)},contents:function(a){return c.nodeName(a,"iframe")?
a.contentDocument||a.contentWindow.document:c.makeArray(a.childNodes)}},function(a,b){c.fn[a]=function(d,f){var e=c.map(this,b,d);eb.test(a)||(f=d);if(f&&typeof f==="string")e=c.filter(f,e);e=this.length>1?c.unique(e):e;if((this.length>1||gb.test(f))&&fb.test(a))e=e.reverse();return this.pushStack(e,a,R.call(arguments).join(","))}});c.extend({filter:function(a,b,d){if(d)a=":not("+a+")";return c.find.matches(a,b)},dir:function(a,b,d){var f=[];for(a=a[b];a&&a.nodeType!==9&&(d===w||a.nodeType!==1||!c(a).is(d));){a.nodeType===
1&&f.push(a);a=a[b]}return f},nth:function(a,b,d){b=b||1;for(var f=0;a;a=a[d])if(a.nodeType===1&&++f===b)break;return a},sibling:function(a,b){for(var d=[];a;a=a.nextSibling)a.nodeType===1&&a!==b&&d.push(a);return d}});var Ja=/ jQuery\d+="(?:\d+|null)"/g,V=/^\s+/,Ka=/(<([\w:]+)[^>]*?)\/>/g,hb=/^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i,La=/<([\w:]+)/,ib=/<tbody/i,jb=/<|&#?\w+;/,ta=/<script|<object|<embed|<option|<style/i,ua=/checked\s*(?:[^=]|=\s*.checked.)/i,Ma=function(a,b,d){return hb.test(d)?
a:b+"></"+d+">"},F={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};F.optgroup=F.option;F.tbody=F.tfoot=F.colgroup=F.caption=F.thead;F.th=F.td;if(!c.support.htmlSerialize)F._default=[1,"div<div>","</div>"];c.fn.extend({text:function(a){if(c.isFunction(a))return this.each(function(b){var d=
c(this);d.text(a.call(this,b,d.text()))});if(typeof a!=="object"&&a!==w)return this.empty().append((this[0]&&this[0].ownerDocument||s).createTextNode(a));return c.text(this)},wrapAll:function(a){if(c.isFunction(a))return this.each(function(d){c(this).wrapAll(a.call(this,d))});if(this[0]){var b=c(a,this[0].ownerDocument).eq(0).clone(true);this[0].parentNode&&b.insertBefore(this[0]);b.map(function(){for(var d=this;d.firstChild&&d.firstChild.nodeType===1;)d=d.firstChild;return d}).append(this)}return this},
wrapInner:function(a){if(c.isFunction(a))return this.each(function(b){c(this).wrapInner(a.call(this,b))});return this.each(function(){var b=c(this),d=b.contents();d.length?d.wrapAll(a):b.append(a)})},wrap:function(a){return this.each(function(){c(this).wrapAll(a)})},unwrap:function(){return this.parent().each(function(){c.nodeName(this,"body")||c(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,true,function(a){this.nodeType===1&&this.appendChild(a)})},
prepend:function(){return this.domManip(arguments,true,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,false,function(b){this.parentNode.insertBefore(b,this)});else if(arguments.length){var a=c(arguments[0]);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,false,function(b){this.parentNode.insertBefore(b,
this.nextSibling)});else if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,c(arguments[0]).toArray());return a}},remove:function(a,b){for(var d=0,f;(f=this[d])!=null;d++)if(!a||c.filter(a,[f]).length){if(!b&&f.nodeType===1){c.cleanData(f.getElementsByTagName("*"));c.cleanData([f])}f.parentNode&&f.parentNode.removeChild(f)}return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++)for(b.nodeType===1&&c.cleanData(b.getElementsByTagName("*"));b.firstChild;)b.removeChild(b.firstChild);
return this},clone:function(a){var b=this.map(function(){if(!c.support.noCloneEvent&&!c.isXMLDoc(this)){var d=this.outerHTML,f=this.ownerDocument;if(!d){d=f.createElement("div");d.appendChild(this.cloneNode(true));d=d.innerHTML}return c.clean([d.replace(Ja,"").replace(/=([^="'>\s]+\/)>/g,'="$1">').replace(V,"")],f)[0]}else return this.cloneNode(true)});if(a===true){ra(this,b);ra(this.find("*"),b.find("*"))}return b},html:function(a){if(a===w)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(Ja,
""):null;else if(typeof a==="string"&&!ta.test(a)&&(c.support.leadingWhitespace||!V.test(a))&&!F[(La.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Ka,Ma);try{for(var b=0,d=this.length;b<d;b++)if(this[b].nodeType===1){c.cleanData(this[b].getElementsByTagName("*"));this[b].innerHTML=a}}catch(f){this.empty().append(a)}}else c.isFunction(a)?this.each(function(e){var j=c(this),i=j.html();j.empty().append(function(){return a.call(this,e,i)})}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&
this[0].parentNode){if(c.isFunction(a))return this.each(function(b){var d=c(this),f=d.html();d.replaceWith(a.call(this,b,f))});if(typeof a!=="string")a=c(a).detach();return this.each(function(){var b=this.nextSibling,d=this.parentNode;c(this).remove();b?c(b).before(a):c(d).append(a)})}else return this.pushStack(c(c.isFunction(a)?a():a),"replaceWith",a)},detach:function(a){return this.remove(a,true)},domManip:function(a,b,d){function f(u){return c.nodeName(u,"table")?u.getElementsByTagName("tbody")[0]||
u.appendChild(u.ownerDocument.createElement("tbody")):u}var e,j,i=a[0],o=[],k;if(!c.support.checkClone&&arguments.length===3&&typeof i==="string"&&ua.test(i))return this.each(function(){c(this).domManip(a,b,d,true)});if(c.isFunction(i))return this.each(function(u){var z=c(this);a[0]=i.call(this,u,b?z.html():w);z.domManip(a,b,d)});if(this[0]){e=i&&i.parentNode;e=c.support.parentNode&&e&&e.nodeType===11&&e.childNodes.length===this.length?{fragment:e}:sa(a,this,o);k=e.fragment;if(j=k.childNodes.length===
1?(k=k.firstChild):k.firstChild){b=b&&c.nodeName(j,"tr");for(var n=0,r=this.length;n<r;n++)d.call(b?f(this[n],j):this[n],n>0||e.cacheable||this.length>1?k.cloneNode(true):k)}o.length&&c.each(o,Qa)}return this}});c.fragments={};c.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){c.fn[a]=function(d){var f=[];d=c(d);var e=this.length===1&&this[0].parentNode;if(e&&e.nodeType===11&&e.childNodes.length===1&&d.length===1){d[b](this[0]);
return this}else{e=0;for(var j=d.length;e<j;e++){var i=(e>0?this.clone(true):this).get();c.fn[b].apply(c(d[e]),i);f=f.concat(i)}return this.pushStack(f,a,d.selector)}}});c.extend({clean:function(a,b,d,f){b=b||s;if(typeof b.createElement==="undefined")b=b.ownerDocument||b[0]&&b[0].ownerDocument||s;for(var e=[],j=0,i;(i=a[j])!=null;j++){if(typeof i==="number")i+="";if(i){if(typeof i==="string"&&!jb.test(i))i=b.createTextNode(i);else if(typeof i==="string"){i=i.replace(Ka,Ma);var o=(La.exec(i)||["",
""])[1].toLowerCase(),k=F[o]||F._default,n=k[0],r=b.createElement("div");for(r.innerHTML=k[1]+i+k[2];n--;)r=r.lastChild;if(!c.support.tbody){n=ib.test(i);o=o==="table"&&!n?r.firstChild&&r.firstChild.childNodes:k[1]==="<table>"&&!n?r.childNodes:[];for(k=o.length-1;k>=0;--k)c.nodeName(o[k],"tbody")&&!o[k].childNodes.length&&o[k].parentNode.removeChild(o[k])}!c.support.leadingWhitespace&&V.test(i)&&r.insertBefore(b.createTextNode(V.exec(i)[0]),r.firstChild);i=r.childNodes}if(i.nodeType)e.push(i);else e=
c.merge(e,i)}}if(d)for(j=0;e[j];j++)if(f&&c.nodeName(e[j],"script")&&(!e[j].type||e[j].type.toLowerCase()==="text/javascript"))f.push(e[j].parentNode?e[j].parentNode.removeChild(e[j]):e[j]);else{e[j].nodeType===1&&e.splice.apply(e,[j+1,0].concat(c.makeArray(e[j].getElementsByTagName("script"))));d.appendChild(e[j])}return e},cleanData:function(a){for(var b,d,f=c.cache,e=c.event.special,j=c.support.deleteExpando,i=0,o;(o=a[i])!=null;i++)if(d=o[c.expando]){b=f[d];if(b.events)for(var k in b.events)e[k]?
c.event.remove(o,k):Ca(o,k,b.handle);if(j)delete o[c.expando];else o.removeAttribute&&o.removeAttribute(c.expando);delete f[d]}}});var kb=/z-?index|font-?weight|opacity|zoom|line-?height/i,Na=/alpha\([^)]*\)/,Oa=/opacity=([^)]*)/,ha=/float/i,ia=/-([a-z])/ig,lb=/([A-Z])/g,mb=/^-?\d+(?:px)?$/i,nb=/^-?\d/,ob={position:"absolute",visibility:"hidden",display:"block"},pb=["Left","Right"],qb=["Top","Bottom"],rb=s.defaultView&&s.defaultView.getComputedStyle,Pa=c.support.cssFloat?"cssFloat":"styleFloat",ja=
function(a,b){return b.toUpperCase()};c.fn.css=function(a,b){return X(this,a,b,true,function(d,f,e){if(e===w)return c.curCSS(d,f);if(typeof e==="number"&&!kb.test(f))e+="px";c.style(d,f,e)})};c.extend({style:function(a,b,d){if(!a||a.nodeType===3||a.nodeType===8)return w;if((b==="width"||b==="height")&&parseFloat(d)<0)d=w;var f=a.style||a,e=d!==w;if(!c.support.opacity&&b==="opacity"){if(e){f.zoom=1;b=parseInt(d,10)+""==="NaN"?"":"alpha(opacity="+d*100+")";a=f.filter||c.curCSS(a,"filter")||"";f.filter=
Na.test(a)?a.replace(Na,b):b}return f.filter&&f.filter.indexOf("opacity=")>=0?parseFloat(Oa.exec(f.filter)[1])/100+"":""}if(ha.test(b))b=Pa;b=b.replace(ia,ja);if(e)f[b]=d;return f[b]},css:function(a,b,d,f){if(b==="width"||b==="height"){var e,j=b==="width"?pb:qb;function i(){e=b==="width"?a.offsetWidth:a.offsetHeight;f!=="border"&&c.each(j,function(){f||(e-=parseFloat(c.curCSS(a,"padding"+this,true))||0);if(f==="margin")e+=parseFloat(c.curCSS(a,"margin"+this,true))||0;else e-=parseFloat(c.curCSS(a,
"border"+this+"Width",true))||0})}a.offsetWidth!==0?i():c.swap(a,ob,i);return Math.max(0,Math.round(e))}return c.curCSS(a,b,d)},curCSS:function(a,b,d){var f,e=a.style;if(!c.support.opacity&&b==="opacity"&&a.currentStyle){f=Oa.test(a.currentStyle.filter||"")?parseFloat(RegExp.$1)/100+"":"";return f===""?"1":f}if(ha.test(b))b=Pa;if(!d&&e&&e[b])f=e[b];else if(rb){if(ha.test(b))b="float";b=b.replace(lb,"-$1").toLowerCase();e=a.ownerDocument.defaultView;if(!e)return null;if(a=e.getComputedStyle(a,null))f=
a.getPropertyValue(b);if(b==="opacity"&&f==="")f="1"}else if(a.currentStyle){d=b.replace(ia,ja);f=a.currentStyle[b]||a.currentStyle[d];if(!mb.test(f)&&nb.test(f)){b=e.left;var j=a.runtimeStyle.left;a.runtimeStyle.left=a.currentStyle.left;e.left=d==="fontSize"?"1em":f||0;f=e.pixelLeft+"px";e.left=b;a.runtimeStyle.left=j}}return f},swap:function(a,b,d){var f={};for(var e in b){f[e]=a.style[e];a.style[e]=b[e]}d.call(a);for(e in b)a.style[e]=f[e]}});if(c.expr&&c.expr.filters){c.expr.filters.hidden=function(a){var b=
a.offsetWidth,d=a.offsetHeight,f=a.nodeName.toLowerCase()==="tr";return b===0&&d===0&&!f?true:b>0&&d>0&&!f?false:c.curCSS(a,"display")==="none"};c.expr.filters.visible=function(a){return!c.expr.filters.hidden(a)}}var sb=J(),tb=/<script(.|\s)*?\/script>/gi,ub=/select|textarea/i,vb=/color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i,N=/=\?(&|$)/,ka=/\?/,wb=/(\?|&)_=.*?(&|$)/,xb=/^(\w+:)?\/\/([^\/?#]+)/,yb=/%20/g,zb=c.fn.load;c.fn.extend({load:function(a,b,d){if(typeof a!==
"string")return zb.call(this,a);else if(!this.length)return this;var f=a.indexOf(" ");if(f>=0){var e=a.slice(f,a.length);a=a.slice(0,f)}f="GET";if(b)if(c.isFunction(b)){d=b;b=null}else if(typeof b==="object"){b=c.param(b,c.ajaxSettings.traditional);f="POST"}var j=this;c.ajax({url:a,type:f,dataType:"html",data:b,complete:function(i,o){if(o==="success"||o==="notmodified")j.html(e?c("<div />").append(i.responseText.replace(tb,"")).find(e):i.responseText);d&&j.each(d,[i.responseText,o,i])}});return this},
serialize:function(){return c.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?c.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||ub.test(this.nodeName)||vb.test(this.type))}).map(function(a,b){a=c(this).val();return a==null?null:c.isArray(a)?c.map(a,function(d){return{name:b.name,value:d}}):{name:b.name,value:a}}).get()}});c.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),
function(a,b){c.fn[b]=function(d){return this.bind(b,d)}});c.extend({get:function(a,b,d,f){if(c.isFunction(b)){f=f||d;d=b;b=null}return c.ajax({type:"GET",url:a,data:b,success:d,dataType:f})},getScript:function(a,b){return c.get(a,null,b,"script")},getJSON:function(a,b,d){return c.get(a,b,d,"json")},post:function(a,b,d,f){if(c.isFunction(b)){f=f||d;d=b;b={}}return c.ajax({type:"POST",url:a,data:b,success:d,dataType:f})},ajaxSetup:function(a){c.extend(c.ajaxSettings,a)},ajaxSettings:{url:location.href,
global:true,type:"GET",contentType:"application/x-www-form-urlencoded",processData:true,async:true,xhr:A.XMLHttpRequest&&(A.location.protocol!=="file:"||!A.ActiveXObject)?function(){return new A.XMLHttpRequest}:function(){try{return new A.ActiveXObject("Microsoft.XMLHTTP")}catch(a){}},accepts:{xml:"application/xml, text/xml",html:"text/html",script:"text/javascript, application/javascript",json:"application/json, text/javascript",text:"text/plain",_default:"*/*"}},lastModified:{},etag:{},ajax:function(a){function b(){e.success&&
e.success.call(k,o,i,x);e.global&&f("ajaxSuccess",[x,e])}function d(){e.complete&&e.complete.call(k,x,i);e.global&&f("ajaxComplete",[x,e]);e.global&&!--c.active&&c.event.trigger("ajaxStop")}function f(q,p){(e.context?c(e.context):c.event).trigger(q,p)}var e=c.extend(true,{},c.ajaxSettings,a),j,i,o,k=a&&a.context||e,n=e.type.toUpperCase();if(e.data&&e.processData&&typeof e.data!=="string")e.data=c.param(e.data,e.traditional);if(e.dataType==="jsonp"){if(n==="GET")N.test(e.url)||(e.url+=(ka.test(e.url)?
"&":"?")+(e.jsonp||"callback")+"=?");else if(!e.data||!N.test(e.data))e.data=(e.data?e.data+"&":"")+(e.jsonp||"callback")+"=?";e.dataType="json"}if(e.dataType==="json"&&(e.data&&N.test(e.data)||N.test(e.url))){j=e.jsonpCallback||"jsonp"+sb++;if(e.data)e.data=(e.data+"").replace(N,"="+j+"$1");e.url=e.url.replace(N,"="+j+"$1");e.dataType="script";A[j]=A[j]||function(q){o=q;b();d();A[j]=w;try{delete A[j]}catch(p){}z&&z.removeChild(C)}}if(e.dataType==="script"&&e.cache===null)e.cache=false;if(e.cache===
false&&n==="GET"){var r=J(),u=e.url.replace(wb,"$1_="+r+"$2");e.url=u+(u===e.url?(ka.test(e.url)?"&":"?")+"_="+r:"")}if(e.data&&n==="GET")e.url+=(ka.test(e.url)?"&":"?")+e.data;e.global&&!c.active++&&c.event.trigger("ajaxStart");r=(r=xb.exec(e.url))&&(r[1]&&r[1]!==location.protocol||r[2]!==location.host);if(e.dataType==="script"&&n==="GET"&&r){var z=s.getElementsByTagName("head")[0]||s.documentElement,C=s.createElement("script");C.src=e.url;if(e.scriptCharset)C.charset=e.scriptCharset;if(!j){var B=
false;C.onload=C.onreadystatechange=function(){if(!B&&(!this.readyState||this.readyState==="loaded"||this.readyState==="complete")){B=true;b();d();C.onload=C.onreadystatechange=null;z&&C.parentNode&&z.removeChild(C)}}}z.insertBefore(C,z.firstChild);return w}var E=false,x=e.xhr();if(x){e.username?x.open(n,e.url,e.async,e.username,e.password):x.open(n,e.url,e.async);try{if(e.data||a&&a.contentType)x.setRequestHeader("Content-Type",e.contentType);if(e.ifModified){c.lastModified[e.url]&&x.setRequestHeader("If-Modified-Since",
c.lastModified[e.url]);c.etag[e.url]&&x.setRequestHeader("If-None-Match",c.etag[e.url])}r||x.setRequestHeader("X-Requested-With","XMLHttpRequest");x.setRequestHeader("Accept",e.dataType&&e.accepts[e.dataType]?e.accepts[e.dataType]+", */*":e.accepts._default)}catch(ga){}if(e.beforeSend&&e.beforeSend.call(k,x,e)===false){e.global&&!--c.active&&c.event.trigger("ajaxStop");x.abort();return false}e.global&&f("ajaxSend",[x,e]);var g=x.onreadystatechange=function(q){if(!x||x.readyState===0||q==="abort"){E||
d();E=true;if(x)x.onreadystatechange=c.noop}else if(!E&&x&&(x.readyState===4||q==="timeout")){E=true;x.onreadystatechange=c.noop;i=q==="timeout"?"timeout":!c.httpSuccess(x)?"error":e.ifModified&&c.httpNotModified(x,e.url)?"notmodified":"success";var p;if(i==="success")try{o=c.httpData(x,e.dataType,e)}catch(v){i="parsererror";p=v}if(i==="success"||i==="notmodified")j||b();else c.handleError(e,x,i,p);d();q==="timeout"&&x.abort();if(e.async)x=null}};try{var h=x.abort;x.abort=function(){x&&h.call(x);
g("abort")}}catch(l){}e.async&&e.timeout>0&&setTimeout(function(){x&&!E&&g("timeout")},e.timeout);try{x.send(n==="POST"||n==="PUT"||n==="DELETE"?e.data:null)}catch(m){c.handleError(e,x,null,m);d()}e.async||g();return x}},handleError:function(a,b,d,f){if(a.error)a.error.call(a.context||a,b,d,f);if(a.global)(a.context?c(a.context):c.event).trigger("ajaxError",[b,a,f])},active:0,httpSuccess:function(a){try{return!a.status&&location.protocol==="file:"||a.status>=200&&a.status<300||a.status===304||a.status===
1223||a.status===0}catch(b){}return false},httpNotModified:function(a,b){var d=a.getResponseHeader("Last-Modified"),f=a.getResponseHeader("Etag");if(d)c.lastModified[b]=d;if(f)c.etag[b]=f;return a.status===304||a.status===0},httpData:function(a,b,d){var f=a.getResponseHeader("content-type")||"",e=b==="xml"||!b&&f.indexOf("xml")>=0;a=e?a.responseXML:a.responseText;e&&a.documentElement.nodeName==="parsererror"&&c.error("parsererror");if(d&&d.dataFilter)a=d.dataFilter(a,b);if(typeof a==="string")if(b===
"json"||!b&&f.indexOf("json")>=0)a=c.parseJSON(a);else if(b==="script"||!b&&f.indexOf("javascript")>=0)c.globalEval(a);return a},param:function(a,b){function d(i,o){if(c.isArray(o))c.each(o,function(k,n){b||/\[\]$/.test(i)?f(i,n):d(i+"["+(typeof n==="object"||c.isArray(n)?k:"")+"]",n)});else!b&&o!=null&&typeof o==="object"?c.each(o,function(k,n){d(i+"["+k+"]",n)}):f(i,o)}function f(i,o){o=c.isFunction(o)?o():o;e[e.length]=encodeURIComponent(i)+"="+encodeURIComponent(o)}var e=[];if(b===w)b=c.ajaxSettings.traditional;
if(c.isArray(a)||a.jquery)c.each(a,function(){f(this.name,this.value)});else for(var j in a)d(j,a[j]);return e.join("&").replace(yb,"+")}});var la={},Ab=/toggle|show|hide/,Bb=/^([+-]=)?([\d+-.]+)(.*)$/,W,va=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]];c.fn.extend({show:function(a,b){if(a||a===0)return this.animate(K("show",3),a,b);else{a=0;for(b=this.length;a<b;a++){var d=c.data(this[a],"olddisplay");
this[a].style.display=d||"";if(c.css(this[a],"display")==="none"){d=this[a].nodeName;var f;if(la[d])f=la[d];else{var e=c("<"+d+" />").appendTo("body");f=e.css("display");if(f==="none")f="block";e.remove();la[d]=f}c.data(this[a],"olddisplay",f)}}a=0;for(b=this.length;a<b;a++)this[a].style.display=c.data(this[a],"olddisplay")||"";return this}},hide:function(a,b){if(a||a===0)return this.animate(K("hide",3),a,b);else{a=0;for(b=this.length;a<b;a++){var d=c.data(this[a],"olddisplay");!d&&d!=="none"&&c.data(this[a],
"olddisplay",c.css(this[a],"display"))}a=0;for(b=this.length;a<b;a++)this[a].style.display="none";return this}},_toggle:c.fn.toggle,toggle:function(a,b){var d=typeof a==="boolean";if(c.isFunction(a)&&c.isFunction(b))this._toggle.apply(this,arguments);else a==null||d?this.each(function(){var f=d?a:c(this).is(":hidden");c(this)[f?"show":"hide"]()}):this.animate(K("toggle",3),a,b);return this},fadeTo:function(a,b,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,d)},
animate:function(a,b,d,f){var e=c.speed(b,d,f);if(c.isEmptyObject(a))return this.each(e.complete);return this[e.queue===false?"each":"queue"](function(){var j=c.extend({},e),i,o=this.nodeType===1&&c(this).is(":hidden"),k=this;for(i in a){var n=i.replace(ia,ja);if(i!==n){a[n]=a[i];delete a[i];i=n}if(a[i]==="hide"&&o||a[i]==="show"&&!o)return j.complete.call(this);if((i==="height"||i==="width")&&this.style){j.display=c.css(this,"display");j.overflow=this.style.overflow}if(c.isArray(a[i])){(j.specialEasing=
j.specialEasing||{})[i]=a[i][1];a[i]=a[i][0]}}if(j.overflow!=null)this.style.overflow="hidden";j.curAnim=c.extend({},a);c.each(a,function(r,u){var z=new c.fx(k,j,r);if(Ab.test(u))z[u==="toggle"?o?"show":"hide":u](a);else{var C=Bb.exec(u),B=z.cur(true)||0;if(C){u=parseFloat(C[2]);var E=C[3]||"px";if(E!=="px"){k.style[r]=(u||1)+E;B=(u||1)/z.cur(true)*B;k.style[r]=B+E}if(C[1])u=(C[1]==="-="?-1:1)*u+B;z.custom(B,u,E)}else z.custom(B,u,"")}});return true})},stop:function(a,b){var d=c.timers;a&&this.queue([]);
this.each(function(){for(var f=d.length-1;f>=0;f--)if(d[f].elem===this){b&&d[f](true);d.splice(f,1)}});b||this.dequeue();return this}});c.each({slideDown:K("show",1),slideUp:K("hide",1),slideToggle:K("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"}},function(a,b){c.fn[a]=function(d,f){return this.animate(b,d,f)}});c.extend({speed:function(a,b,d){var f=a&&typeof a==="object"?a:{complete:d||!d&&b||c.isFunction(a)&&a,duration:a,easing:d&&b||b&&!c.isFunction(b)&&b};f.duration=c.fx.off?0:typeof f.duration===
"number"?f.duration:c.fx.speeds[f.duration]||c.fx.speeds._default;f.old=f.complete;f.complete=function(){f.queue!==false&&c(this).dequeue();c.isFunction(f.old)&&f.old.call(this)};return f},easing:{linear:function(a,b,d,f){return d+f*a},swing:function(a,b,d,f){return(-Math.cos(a*Math.PI)/2+0.5)*f+d}},timers:[],fx:function(a,b,d){this.options=b;this.elem=a;this.prop=d;if(!b.orig)b.orig={}}});c.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this);(c.fx.step[this.prop]||
c.fx.step._default)(this);if((this.prop==="height"||this.prop==="width")&&this.elem.style)this.elem.style.display="block"},cur:function(a){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];return(a=parseFloat(c.css(this.elem,this.prop,a)))&&a>-10000?a:parseFloat(c.curCSS(this.elem,this.prop))||0},custom:function(a,b,d){function f(j){return e.step(j)}this.startTime=J();this.start=a;this.end=b;this.unit=d||this.unit||"px";this.now=this.start;
this.pos=this.state=0;var e=this;f.elem=this.elem;if(f()&&c.timers.push(f)&&!W)W=setInterval(c.fx.tick,13)},show:function(){this.options.orig[this.prop]=c.style(this.elem,this.prop);this.options.show=true;this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur());c(this.elem).show()},hide:function(){this.options.orig[this.prop]=c.style(this.elem,this.prop);this.options.hide=true;this.custom(this.cur(),0)},step:function(a){var b=J(),d=true;if(a||b>=this.options.duration+this.startTime){this.now=
this.end;this.pos=this.state=1;this.update();this.options.curAnim[this.prop]=true;for(var f in this.options.curAnim)if(this.options.curAnim[f]!==true)d=false;if(d){if(this.options.display!=null){this.elem.style.overflow=this.options.overflow;a=c.data(this.elem,"olddisplay");this.elem.style.display=a?a:this.options.display;if(c.css(this.elem,"display")==="none")this.elem.style.display="block"}this.options.hide&&c(this.elem).hide();if(this.options.hide||this.options.show)for(var e in this.options.curAnim)c.style(this.elem,
e,this.options.orig[e]);this.options.complete.call(this.elem)}return false}else{e=b-this.startTime;this.state=e/this.options.duration;a=this.options.easing||(c.easing.swing?"swing":"linear");this.pos=c.easing[this.options.specialEasing&&this.options.specialEasing[this.prop]||a](this.state,e,0,1,this.options.duration);this.now=this.start+(this.end-this.start)*this.pos;this.update()}return true}};c.extend(c.fx,{tick:function(){for(var a=c.timers,b=0;b<a.length;b++)a[b]()||a.splice(b--,1);a.length||
c.fx.stop()},stop:function(){clearInterval(W);W=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){c.style(a.elem,"opacity",a.now)},_default:function(a){if(a.elem.style&&a.elem.style[a.prop]!=null)a.elem.style[a.prop]=(a.prop==="width"||a.prop==="height"?Math.max(0,a.now):a.now)+a.unit;else a.elem[a.prop]=a.now}}});if(c.expr&&c.expr.filters)c.expr.filters.animated=function(a){return c.grep(c.timers,function(b){return a===b.elem}).length};c.fn.offset="getBoundingClientRect"in s.documentElement?
function(a){var b=this[0];if(a)return this.each(function(e){c.offset.setOffset(this,a,e)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return c.offset.bodyOffset(b);var d=b.getBoundingClientRect(),f=b.ownerDocument;b=f.body;f=f.documentElement;return{top:d.top+(self.pageYOffset||c.support.boxModel&&f.scrollTop||b.scrollTop)-(f.clientTop||b.clientTop||0),left:d.left+(self.pageXOffset||c.support.boxModel&&f.scrollLeft||b.scrollLeft)-(f.clientLeft||b.clientLeft||0)}}:function(a){var b=
this[0];if(a)return this.each(function(r){c.offset.setOffset(this,a,r)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return c.offset.bodyOffset(b);c.offset.initialize();var d=b.offsetParent,f=b,e=b.ownerDocument,j,i=e.documentElement,o=e.body;f=(e=e.defaultView)?e.getComputedStyle(b,null):b.currentStyle;for(var k=b.offsetTop,n=b.offsetLeft;(b=b.parentNode)&&b!==o&&b!==i;){if(c.offset.supportsFixedPosition&&f.position==="fixed")break;j=e?e.getComputedStyle(b,null):b.currentStyle;
k-=b.scrollTop;n-=b.scrollLeft;if(b===d){k+=b.offsetTop;n+=b.offsetLeft;if(c.offset.doesNotAddBorder&&!(c.offset.doesAddBorderForTableAndCells&&/^t(able|d|h)$/i.test(b.nodeName))){k+=parseFloat(j.borderTopWidth)||0;n+=parseFloat(j.borderLeftWidth)||0}f=d;d=b.offsetParent}if(c.offset.subtractsBorderForOverflowNotVisible&&j.overflow!=="visible"){k+=parseFloat(j.borderTopWidth)||0;n+=parseFloat(j.borderLeftWidth)||0}f=j}if(f.position==="relative"||f.position==="static"){k+=o.offsetTop;n+=o.offsetLeft}if(c.offset.supportsFixedPosition&&
f.position==="fixed"){k+=Math.max(i.scrollTop,o.scrollTop);n+=Math.max(i.scrollLeft,o.scrollLeft)}return{top:k,left:n}};c.offset={initialize:function(){var a=s.body,b=s.createElement("div"),d,f,e,j=parseFloat(c.curCSS(a,"marginTop",true))||0;c.extend(b.style,{position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"});b.innerHTML="<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
a.insertBefore(b,a.firstChild);d=b.firstChild;f=d.firstChild;e=d.nextSibling.firstChild.firstChild;this.doesNotAddBorder=f.offsetTop!==5;this.doesAddBorderForTableAndCells=e.offsetTop===5;f.style.position="fixed";f.style.top="20px";this.supportsFixedPosition=f.offsetTop===20||f.offsetTop===15;f.style.position=f.style.top="";d.style.overflow="hidden";d.style.position="relative";this.subtractsBorderForOverflowNotVisible=f.offsetTop===-5;this.doesNotIncludeMarginInBodyOffset=a.offsetTop!==j;a.removeChild(b);
c.offset.initialize=c.noop},bodyOffset:function(a){var b=a.offsetTop,d=a.offsetLeft;c.offset.initialize();if(c.offset.doesNotIncludeMarginInBodyOffset){b+=parseFloat(c.curCSS(a,"marginTop",true))||0;d+=parseFloat(c.curCSS(a,"marginLeft",true))||0}return{top:b,left:d}},setOffset:function(a,b,d){if(/static/.test(c.curCSS(a,"position")))a.style.position="relative";var f=c(a),e=f.offset(),j=parseInt(c.curCSS(a,"top",true),10)||0,i=parseInt(c.curCSS(a,"left",true),10)||0;if(c.isFunction(b))b=b.call(a,
d,e);d={top:b.top-e.top+j,left:b.left-e.left+i};"using"in b?b.using.call(a,d):f.css(d)}};c.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),d=this.offset(),f=/^body|html$/i.test(b[0].nodeName)?{top:0,left:0}:b.offset();d.top-=parseFloat(c.curCSS(a,"marginTop",true))||0;d.left-=parseFloat(c.curCSS(a,"marginLeft",true))||0;f.top+=parseFloat(c.curCSS(b[0],"borderTopWidth",true))||0;f.left+=parseFloat(c.curCSS(b[0],"borderLeftWidth",true))||0;return{top:d.top-
f.top,left:d.left-f.left}},offsetParent:function(){return this.map(function(){for(var a=this.offsetParent||s.body;a&&!/^body|html$/i.test(a.nodeName)&&c.css(a,"position")==="static";)a=a.offsetParent;return a})}});c.each(["Left","Top"],function(a,b){var d="scroll"+b;c.fn[d]=function(f){var e=this[0],j;if(!e)return null;if(f!==w)return this.each(function(){if(j=wa(this))j.scrollTo(!a?f:c(j).scrollLeft(),a?f:c(j).scrollTop());else this[d]=f});else return(j=wa(e))?"pageXOffset"in j?j[a?"pageYOffset":
"pageXOffset"]:c.support.boxModel&&j.document.documentElement[d]||j.document.body[d]:e[d]}});c.each(["Height","Width"],function(a,b){var d=b.toLowerCase();c.fn["inner"+b]=function(){return this[0]?c.css(this[0],d,false,"padding"):null};c.fn["outer"+b]=function(f){return this[0]?c.css(this[0],d,false,f?"margin":"border"):null};c.fn[d]=function(f){var e=this[0];if(!e)return f==null?null:this;if(c.isFunction(f))return this.each(function(j){var i=c(this);i[d](f.call(this,j,i[d]()))});return"scrollTo"in
e&&e.document?e.document.compatMode==="CSS1Compat"&&e.document.documentElement["client"+b]||e.document.body["client"+b]:e.nodeType===9?Math.max(e.documentElement["client"+b],e.body["scroll"+b],e.documentElement["scroll"+b],e.body["offset"+b],e.documentElement["offset"+b]):f===w?c.css(e,d):this.css(d,typeof f==="string"?f:f+"px")}});A.jQuery=A.$=c})(window);
/*
 * jQuery Nivo Slider v2.4
 * http://nivo.dev7studios.com
 *
 * Copyright 2011, Gilbert Pellegrom
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */


(function(a){var A=function(s,v){var f=a.extend({},a.fn.nivoSlider.defaults,v),g={currentSlide:0,currentImage:"",totalSlides:0,randAnim:"",running:false,paused:false,stop:false},e=a(s);e.data("nivo:vars",g);e.css("position","relative");e.addClass("nivoSlider");var j=e.children();j.each(function(){var b=a(this),h="";if(!b.is("img")){if(b.is("a")){b.addClass("nivo-imageLink");h=b}b=b.find("img:first")}var c=b.width();if(c==0)c=b.attr("width");var o=b.height();if(o==0)o=b.attr("height");c>e.width()&&
e.width(c);o>e.height()&&e.height(o);h!=""&&h.css("display","none");b.css("display","none");g.totalSlides++});if(f.startSlide>0){if(f.startSlide>=g.totalSlides)f.startSlide=g.totalSlides-1;g.currentSlide=f.startSlide}g.currentImage=a(j[g.currentSlide]).is("img")?a(j[g.currentSlide]):a(j[g.currentSlide]).find("img:first");a(j[g.currentSlide]).is("a")&&a(j[g.currentSlide]).css("display","block");e.css("background",'url("'+g.currentImage.attr("src")+'") no-repeat');for(var k=0;k<f.slices;k++){var p=
Math.round(e.width()/f.slices);k==f.slices-1?e.append(a('<div class="nivo-slice"></div>').css({left:p*k+"px",width:e.width()-p*k+"px"})):e.append(a('<div class="nivo-slice"></div>').css({left:p*k+"px",width:p+"px"}))}e.append(a('<div class="nivo-caption"><p></p></div>').css({display:"none",opacity:f.captionOpacity}));if(g.currentImage.attr("title")!=""){k=g.currentImage.attr("title");if(k.substr(0,1)=="#")k=a(k).html();a(".nivo-caption p",e).html(k);a(".nivo-caption",e).fadeIn(f.animSpeed)}var l=
0;if(!f.manualAdvance&&j.length>1)l=setInterval(function(){r(e,j,f,false)},f.pauseTime);if(f.directionNav){e.append('<div class="nivo-directionNav"><a class="nivo-prevNav">Prev</a><a class="nivo-nextNav">Next</a></div>');if(f.directionNavHide){a(".nivo-directionNav",e).hide();e.hover(function(){a(".nivo-directionNav",e).show()},function(){a(".nivo-directionNav",e).hide()})}a("a.nivo-prevNav",e).live("click",function(){if(g.running)return false;clearInterval(l);l="";g.currentSlide-=2;r(e,j,f,"prev")});
a("a.nivo-nextNav",e).live("click",function(){if(g.running)return false;clearInterval(l);l="";r(e,j,f,"next")})}if(f.controlNav){p=a('<div class="nivo-controlNav"></div>');e.append(p);for(k=0;k<j.length;k++)if(f.controlNavThumbs){var t=j.eq(k);t.is("img")||(t=t.find("img:first"));f.controlNavThumbsFromRel?p.append('<a class="nivo-control" rel="'+k+'"><img src="'+t.attr("rel")+'" alt="" /></a>'):p.append('<a class="nivo-control" rel="'+k+'"><img src="'+t.attr("src").replace(f.controlNavThumbsSearch,
f.controlNavThumbsReplace)+'" alt="" /></a>')}else p.append('<a class="nivo-control" rel="'+k+'">'+(k+1)+"</a>");a(".nivo-controlNav a:eq("+g.currentSlide+")",e).addClass("active");a(".nivo-controlNav a",e).live("click",function(){if(g.running)return false;if(a(this).hasClass("active"))return false;clearInterval(l);l="";e.css("background",'url("'+g.currentImage.attr("src")+'") no-repeat');g.currentSlide=a(this).attr("rel")-1;r(e,j,f,"control")})}f.keyboardNav&&a(window).keypress(function(b){if(b.keyCode==
"37"){if(g.running)return false;clearInterval(l);l="";g.currentSlide-=2;r(e,j,f,"prev")}if(b.keyCode=="39"){if(g.running)return false;clearInterval(l);l="";r(e,j,f,"next")}});f.pauseOnHover&&e.hover(function(){g.paused=true;clearInterval(l);l=""},function(){g.paused=false;if(l==""&&!f.manualAdvance)l=setInterval(function(){r(e,j,f,false)},f.pauseTime)});e.bind("nivo:animFinished",function(){g.running=false;a(j).each(function(){a(this).is("a")&&a(this).css("display","none")});a(j[g.currentSlide]).is("a")&&
a(j[g.currentSlide]).css("display","block");if(l==""&&!g.paused&&!f.manualAdvance)l=setInterval(function(){r(e,j,f,false)},f.pauseTime);f.afterChange.call(this)});var w=function(b,h){var c=0;a(".nivo-slice",b).each(function(){var o=a(this),d=Math.round(b.width()/h.slices);c==h.slices-1?o.css("width",b.width()-d*c+"px"):o.css("width",d+"px");c++})},r=function(b,h,c,o){var d=b.data("nivo:vars");d&&d.currentSlide==d.totalSlides-1&&c.lastSlide.call(this);if((!d||d.stop)&&!o)return false;c.beforeChange.call(this);
if(o){o=="prev"&&b.css("background",'url("'+d.currentImage.attr("src")+'") no-repeat');o=="next"&&b.css("background",'url("'+d.currentImage.attr("src")+'") no-repeat')}else b.css("background",'url("'+d.currentImage.attr("src")+'") no-repeat');d.currentSlide++;if(d.currentSlide==d.totalSlides){d.currentSlide=0;c.slideshowEnd.call(this)}if(d.currentSlide<0)d.currentSlide=d.totalSlides-1;d.currentImage=a(h[d.currentSlide]).is("img")?a(h[d.currentSlide]):a(h[d.currentSlide]).find("img:first");if(c.controlNav){a(".nivo-controlNav a",
b).removeClass("active");a(".nivo-controlNav a:eq("+d.currentSlide+")",b).addClass("active")}if(d.currentImage.attr("title")!=""){var u=d.currentImage.attr("title");if(u.substr(0,1)=="#")u=a(u).html();a(".nivo-caption",b).css("display")=="block"?a(".nivo-caption p",b).fadeOut(c.animSpeed,function(){a(this).html(u);a(this).fadeIn(c.animSpeed)}):a(".nivo-caption p",b).html(u);a(".nivo-caption",b).fadeIn(c.animSpeed)}else a(".nivo-caption",b).fadeOut(c.animSpeed);var m=0;a(".nivo-slice",b).each(function(){var i=
Math.round(b.width()/c.slices);a(this).css({height:"0px",opacity:"0",background:'url("'+d.currentImage.attr("src")+'") no-repeat -'+(i+m*i-i)+"px 0%"});m++});if(c.effect=="random"){h=["sliceDownRight","sliceDownLeft","sliceUpRight","sliceUpLeft","sliceUpDown","sliceUpDownLeft","fold","fade","slideInRight","slideInLeft"];d.randAnim=h[Math.floor(Math.random()*(h.length+1))];if(d.randAnim==undefined)d.randAnim="fade"}if(c.effect.indexOf(",")!=-1){h=c.effect.split(",");d.randAnim=h[Math.floor(Math.random()*
h.length)];if(d.randAnim==undefined)d.randAnim="fade"}d.running=true;if(c.effect=="sliceDown"||c.effect=="sliceDownRight"||d.randAnim=="sliceDownRight"||c.effect=="sliceDownLeft"||d.randAnim=="sliceDownLeft"){var n=0;m=0;w(b,c);h=a(".nivo-slice",b);if(c.effect=="sliceDownLeft"||d.randAnim=="sliceDownLeft")h=a(".nivo-slice",b)._reverse();h.each(function(){var i=a(this);i.css({top:"0px"});m==c.slices-1?setTimeout(function(){i.animate({height:"100%",opacity:"1.0"},c.animSpeed,"",function(){b.trigger("nivo:animFinished")})},
100+n):setTimeout(function(){i.animate({height:"100%",opacity:"1.0"},c.animSpeed)},100+n);n+=50;m++})}else if(c.effect=="sliceUp"||c.effect=="sliceUpRight"||d.randAnim=="sliceUpRight"||c.effect=="sliceUpLeft"||d.randAnim=="sliceUpLeft"){m=n=0;w(b,c);h=a(".nivo-slice",b);if(c.effect=="sliceUpLeft"||d.randAnim=="sliceUpLeft")h=a(".nivo-slice",b)._reverse();h.each(function(){var i=a(this);i.css({bottom:"0px"});m==c.slices-1?setTimeout(function(){i.animate({height:"100%",opacity:"1.0"},c.animSpeed,"",
function(){b.trigger("nivo:animFinished")})},100+n):setTimeout(function(){i.animate({height:"100%",opacity:"1.0"},c.animSpeed)},100+n);n+=50;m++})}else if(c.effect=="sliceUpDown"||c.effect=="sliceUpDownRight"||d.randAnim=="sliceUpDown"||c.effect=="sliceUpDownLeft"||d.randAnim=="sliceUpDownLeft"){var x=m=n=0;w(b,c);h=a(".nivo-slice",b);if(c.effect=="sliceUpDownLeft"||d.randAnim=="sliceUpDownLeft")h=a(".nivo-slice",b)._reverse();h.each(function(){var i=a(this);if(m==0){i.css("top","0px");m++}else{i.css("bottom",
"0px");m=0}x==c.slices-1?setTimeout(function(){i.animate({height:"100%",opacity:"1.0"},c.animSpeed,"",function(){b.trigger("nivo:animFinished")})},100+n):setTimeout(function(){i.animate({height:"100%",opacity:"1.0"},c.animSpeed)},100+n);n+=50;x++})}else if(c.effect=="fold"||d.randAnim=="fold"){m=n=0;w(b,c);a(".nivo-slice",b).each(function(){var i=a(this),y=i.width();i.css({top:"0px",height:"100%",width:"0px"});m==c.slices-1?setTimeout(function(){i.animate({width:y,opacity:"1.0"},c.animSpeed,"",function(){b.trigger("nivo:animFinished")})},
100+n):setTimeout(function(){i.animate({width:y,opacity:"1.0"},c.animSpeed)},100+n);n+=50;m++})}else if(c.effect=="fade"||d.randAnim=="fade"){var q=a(".nivo-slice:first",b);q.css({height:"100%",width:b.width()+"px"});q.animate({opacity:"1.0"},c.animSpeed*2,"",function(){b.trigger("nivo:animFinished")})}else if(c.effect=="slideInRight"||d.randAnim=="slideInRight"){q=a(".nivo-slice:first",b);q.css({height:"100%",width:"0px",opacity:"1"});q.animate({width:b.width()+"px"},c.animSpeed*2,"",function(){b.trigger("nivo:animFinished")})}else if(c.effect==
"slideInLeft"||d.randAnim=="slideInLeft"){q=a(".nivo-slice:first",b);q.css({height:"100%",width:"0px",opacity:"1",left:"",right:"0px"});q.animate({width:b.width()+"px"},c.animSpeed*2,"",function(){q.css({left:"0px",right:""});b.trigger("nivo:animFinished")})}},z=function(b){this.console&&typeof console.log!="undefined"&&console.log(b)};this.stop=function(){if(!a(s).data("nivo:vars").stop){a(s).data("nivo:vars").stop=true;z("Stop Slider")}};this.start=function(){if(a(s).data("nivo:vars").stop){a(s).data("nivo:vars").stop=
false;z("Start Slider")}};f.afterLoad.call(this)};a.fn.nivoSlider=function(s){return this.each(function(){var v=a(this);if(!v.data("nivoslider")){var f=new A(this,s);v.data("nivoslider",f)}})};a.fn.nivoSlider.defaults={effect:"random",slices:15,animSpeed:500,pauseTime:3E3,startSlide:0,directionNav:true,directionNavHide:true,controlNav:true,controlNavThumbs:false,controlNavThumbsFromRel:false,controlNavThumbsSearch:".jpg",controlNavThumbsReplace:"_thumb.jpg",keyboardNav:true,pauseOnHover:true,manualAdvance:false,
captionOpacity:0.8,beforeChange:function(){},afterChange:function(){},slideshowEnd:function(){},lastSlide:function(){},afterLoad:function(){}};a.fn._reverse=[].reverse})(jQuery);
(function() {

}).call(this);
(function() {

}).call(this);
// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
;
