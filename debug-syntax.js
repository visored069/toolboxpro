var fs = require('fs');
var code = fs.readFileSync('components.js', 'utf8');

// Try Node's acorn parser for better error messages
var lines = code.split('\n');

// Check character by character for anything weird
for (var i = 0; i < code.length; i++) {
    var c = code.charCodeAt(i);
    if (c > 127) {
        console.log('Non-ASCII at pos', i, 'charCode:', c, 'hex:', c.toString(16), 'context:', JSON.stringify(code.substring(Math.max(0,i-20), i+20)));
    }
}

// Try compiling and see if we get a better error
var vm = require('vm');
var Script = vm.Script;
try {
    var s = new Script(code, {filename: 'components.js'});
    console.log('Script compiled OK');
} catch(e) {
    console.log('Script error:', e.message);
    // Try to find the column number
    if (e.stack) {
        console.log('Stack:', e.stack.split('\n').slice(0, 5).join('\n'));
    }
}
