var fs = require('fs');
var code = fs.readFileSync('components.js', 'utf8');

// Find the problematic pattern: e.key === '\')  (unterminated string)
// It should be: e.key === '\\' ) (string containing backslash)
// In the file, the bytes are: 27 5c 27 29 meaning ' \ ' )
// We need to change it to: 27 5c 5c 27 29 meaning ' \\ ' )

// Find all occurrences
var idx = 0;
while ((idx = code.indexOf("e.key === '", idx)) !== -1) {
    var snippet = code.substring(idx, idx + 30);
    console.log('Found at', idx, ':', JSON.stringify(snippet));
    idx++;
}

// Fix: replace the specific pattern where \') should be \\')
// Pattern: e.key === '\' followed by ) 
// The byte sequence in the file is: 27 5c 27 29 which is: ' \ ' )
// We want: 27 5c 5c 27 29 which is: ' \\ ' )

// Look for the exact byte pattern
var fixed = code;
var searchStr = "key === '\\')";
var replaceStr = "key === '\\\\')";
while (fixed.indexOf(searchStr) !== -1) {
    fixed = fixed.replace(searchStr, replaceStr);
    console.log('Fixed one occurrence');
}

// Also fix the em dash that was replaced with --
// (this was already done by sed, no action needed)

fs.writeFileSync('components.js', fixed, 'utf8');

// Verify
try {
    new Function(fixed);
    console.log('PARSE OK!');
} catch(e) {
    console.log('Still broken:', e.message);
    // Show the problematic area
    var stack = e.stack || '';
    console.log('Stack:', stack.split('\n').slice(0, 3).join('\n'));
}
