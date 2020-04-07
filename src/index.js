
const fs = require('fs');

const i18nPath = "./i18n/";
var files = fs.readdirSync(i18nPath);

console.log("comparing", files)


// Read contents and parse JSON
const filesWithKeys = files.map(f => ({
    name: f,
    content: JSON.parse(fs.readFileSync(i18nPath + f, 'utf8'))
}));

// Gather all the keys used in all files in one array
const allKeys = filesWithKeys.map(f => Object.keys(flattenObject(f.content))).flat();
// Find the missing keys by file
const missingKeysByFile = filesWithKeys.map(f => {

    const myKeys = flattenObject(f.content);
    return ({
        name: f.name,
        missingKeys: allKeys.filter(k => {
            return !(k in myKeys)
        })
    })

}).filter(f => f.missingKeys.length > 0);


// Print the result
missingKeysByFile.forEach(f => {
    console.log(`File "${f.name}" is missing keys `);
    console.log(f.missingKeys);

});

function flattenObject(ob) {
    var toReturn = {};

    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) == 'object' && ob[i] !== null) {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }

    return toReturn;
    // return Object.keys(toReturn);
}
