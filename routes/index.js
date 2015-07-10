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

module.exports = router;
