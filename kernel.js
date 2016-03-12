var Fontmin = require('fontmin');
var rename = require('gulp-rename');
var http = require('http');
var crypto = require('crypto');
var fs = require('fs');

var lock=require("./lock");
var logger=require("./logger");
var wl=require("./metadata/whitelist");
var setting=require("./metadata/settings");
var request=require("request");

var filelist={};

function generateFont(oriFontName, desFontName, textSet, callback)
{
    var fontmin = new Fontmin()
        .use(Fontmin.glyph(
            {
                text: textSet,
                hinting: false
            }))
        .src(setting.srcFontPath+oriFontName+".ttf")
        .dest(setting.desFontPath)
        .use(rename(desFontName+".ttf"));
    fontmin.run(function(err, files)
    {
        if (err)
        {
            callback(false);
        }
        callback(true);
    });
}
function checkValidity(str)
{
    str=str.toLowerCase();
    for (var i=0;i<wl.length;i++)
    {
        if (wl[i].exec(str)!=null)
            return true;
    }
    return false;
}
function httpGet(url,encoding,callback)
{
    var opt=
    {
        url: url,
        followRedirect: false,
        encoding: encoding,
        strictSSL: false
    };
    request(opt, function(error, response, body)
    {
            if (error)
            {
                //console.log("GET fail ", url);
                callback(false);
                return;
            }
            var status=response.statusCode;
            status=""+status;

            //console.log("GET succ ", url);
            callback(body)

    });
}
function calculateHASH(srcstr)
{
    var sha1Hasher = crypto.createHash('sha1');
    sha1Hasher.update(srcstr);
    return sha1Hasher.digest('hex');
}
function checkFileExist(filen)
{
    try
    {
        fs.statSync(filen);
        return true;
    }
    catch(e)
    {
        return false;
    }
}

function mainFunc(href,fontname,encoding,callback)
{
    var res=href;
    if (fontname.search(/(\.|\\|\/)/)>=0)   //for safety
    {
        callback(false);
        return;
    }
    if (!checkValidity(res))
    {
        callback(false);
        return;
    }

    var metadata=logger.metadata;
    lock.acquire(res,function()
    {
        var t=(new Date()).getTime();
        if (metadata[res]==undefined || t>metadata[res].timestamp+setting.expireTime) //need update
        {
            httpGet(res,encoding,function(data)
            {
                if (data===false)
                {
                    callback(false);
                    lock.release(res);
                    return;
                }
                var hashedCode=calculateHASH(data);
                lock.acquire(hashedCode,function()
                {
                    var aftFunc=function(iscreate)
                    {
                        metadata[res]=
                        {
                            timestamp:  (new Date()).getTime(),
                            value:      "http://"+setting.hostname+"/"+setting.relOutputPath+hashedCode+".ttf"
                        };
                        if (iscreate)
                            console.log("<"+(new Date()).toUTCString()+">\tcreate cache:\t"+res+"->"+hashedCode);
                        logger.saveMetadata();
                        lock.release(hashedCode);
                        lock.release(res);
                        callback(metadata[res].value);
                        return;
                    };
                    if (filelist[hashedCode]==undefined)
                    {
                        if (checkFileExist(setting.desFontPath+hashedCode+".ttf"))
                        {
                            filelist[hashedCode]=true;
                            aftFunc();
                            return;
                        }
                        else
                        {
                            generateFont(fontname,hashedCode,data,function(result)
                            {
                                if (result===false)
                                {
                                    callback(false);
                                    lock.release(hashedCode);
                                    lock.release(res);
                                    return;
                                }
                                filelist[hashedCode]=true;
                                aftFunc(true);
                                return;
                            });
                        }
                    }
                    else
                    {
                        aftFunc();
                        return;
                    }
                });
            });
        }
        else
        {
            callback(metadata[res].value);
            lock.release(res);
            return;
        }
    });
}
exports.exec=mainFunc;
exports.check=checkValidity;

/*
logger.restoreMetadata();
mainFunc("http://static.levys.ink/games/warofworms/?asd","stsong","utf8",function(res)
{
    process.exit(0);
});
*/
