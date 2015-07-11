// ensure that the server is killed.

var logger=require("./logger");
var kernel=require("./kernel");
var setting=require("./metadata/settings");

var fs=require("fs");

logger.restoreMetadata();
var metadata=logger.metadata;
var arcmap={};
for (var item in metadata)
{
    if (!kernel.check(item))
    {
        delete metadata[item];
        console.log("<"+(new Date()).toUTCString()+">\tremove metadata:\t"+item);
    }
    else
    {
        var t=/[^//][a-zA-Z0-9]*\.ttf$/.exec(metadata[item].value);
        if (t!=null)
            arcmap[t[0].replace(/\.ttf$/,"")]=true;
    }
}
logger.saveMetadata();

var filelist=fs.readdirSync(setting.desFontPath);
for (var i=0;i<filelist.length;i++)
{
    var tmp=filelist[i].replace(/\.ttf$/,"");
    if (arcmap[tmp]==undefined)
    {
        fs.unlinkSync(setting.desFontPath+filelist[i]);
        console.log("<"+(new Date()).toUTCString()+">\tremove file:\t"+setting.desFontPath+filelist[i]);
    }
}
console.log("Autoclear accomplished at "+(new Date()).toUTCString());
// now, it could be relaunched.
