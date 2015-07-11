var express = require('express');
var kernel = require("../kernel");

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res)
{
    res.send("Font provide server.");
});

router.post('/', function(req, res)
{
    if (req.body.url!=undefined && req.body.font!=undefined)
    {
        if (req.body.encoding==undefined)
            req.body.encoding="utf8";
        kernel.exec(req.body.url,req.body.font,req.body.encoding,function(result)
        {
            if (result===false)
                res.send("");
            else
                res.send(result);
        });
    }
    else
        res.send("");
});
router.get('/jspadding.js', function(req,res)
{
    if (req.query.url!=undefined && req.query.font!=undefined)
    {
        if (req.query.encoding==undefined)
            req.query.encoding="utf8";
        req.query.url=decodeURI(req.query.url);
        kernel.exec(req.query.url,req.query.font,req.query.encoding,function(result)
        {
            if (result===false)
                res.send("console.error('<From FontGen> Fail to generate font.');");
            else
            {
                var retTem="jspGenTem";
                if (req.query.addcss!=undefined)
                    retTem="jspTem";
                res.render(retTem,
                {
                    fontname:   req.query.font,
                    fonturl:    result
                });
            }
        });
    }
    else
        res.send("console.error('<From FontGen> More arguments expected.');");
});

module.exports = router;
