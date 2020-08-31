# pinobug

we intend to combine the functionality of pino and debug into a single module by modifying the debug.log method to use pino.log behind the scenes. while doing so we also implement an additional feature to assign a caller string to the log message.

# use

```javascript
const pinobug = require( "../libs/pinobug.js" )( { namespace: "livereload" } );

pinobug( "this message will output nicely with pino" );
```

This will output to your console something like:

```json
{"level":20,"time":1598870104045,"pid":24990,"hostname":"DESKTOP-ETC","msg":"this message will output nicely with pino","ns":"livereload","caller":"routes/live.js"}
```

caller will be assigned from the v8 execution stack, so you may easily see where the entry was initiated from.

# other methods

```javascript
pinobug.disable();
// disable all debug namespaces

pinobug.enable( "livereload" );
// enable specific namespace
```
