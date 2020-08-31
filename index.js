/* ------------------------------------------------------------ definition --- ;

    with this module, we intend to combine the functionality of pino and debug
    into a single module by modifying the debug.log method to use pino.log
    behind the scenes. while doing so we also implement an additional feature to
    assign a caller string to the log message.

    - end of definition */

/* ---------------------------------------------------------- dependencies -- */

const stackTrace = require( "stack-trace" );
/* call stack analyzer for v8 */

const path = require( "path" );
const util = require( "util" );
/* node.js standard libraries for path analysis and string formatting */

const createPino = require( "pino" );
/* original pino logger */

const createDebug = require( "debug" );
/* original debug logger */

/* ------------------------------------------------------- export function -- */

module.exports = ( { namespace = "default", pinoLevel = "trace" } = {} ) => {
    const pino = createPino( { level: pinoLevel } );
    const debug = createDebug( namespace );

    let caller = "";
    try {
        caller = path.join(
            ...stackTrace.get()[1].getFileName().split( /[\\/]/ ).splice( -2 )
        );
        /* we are only interested in the last two bits of the stackpath and we
        use internal path.join to make the caller path platform compatible. */
    } catch ( e ) {
        pino.error( {
            msg: e,
            ns: namespace,
            caller: caller,
        } );
    }
    /* using v8 stack parsing, try to locate the calling parent to our debug
    function. normally, the [0] would be the caller but I suppose because of the
    way we are importing within express, the actual caller is at [1]. */

    debug.log = ( s, ...args ) => {
        s = s.split( " " ).slice( 1 ).join( " " );
        pino.debug( {
            msg: util.format( s, ...args ),
            ns: namespace,
            caller: caller,
        } );
    };
    /* override debug.log method with pino and remove "namespace" which  debug
    prefixes to the original message by default. use util.format to join and
    stringify all parameters and then suffix the source. */

    debug.info = ( s ) => {
        pino.info( { msg: s, caller: caller } );
    };

    debug.disable = createDebug.disable;
    debug.enable = createDebug.enable;
    /* assign createDebug methods onto the debug object so we can access enable
    and disable methods */

    debug.pino = pino;
    /* pass in pino as is just in case, might do something else here later */

    return debug;
};

