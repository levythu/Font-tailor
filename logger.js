var fs = require('fs');

exports.restoreMetadata=function()
{
    try
    {
        var cont=fs.readFileSync("./metadata/metadata.json", {encoding:'utf8'});
        exports.metadata=JSON.parse(cont);
    }
    catch (e)
    {
        exports.metadata={};
    }
}
exports.saveMetadata=function()
{
    var data=JSON.stringify(exports.metadata);
    fs.writeFileSync("./metadata/metadata.json", data, {encoding:'utf8'});
}
