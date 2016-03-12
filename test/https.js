var request=require("request")

var opt=
{
    url: "https://academic.levy.at",
    followRedirect: false,
    encoding: "utf8"
};
request(opt, function(error, response, body)
{
        if (error)
        {
            console.log("GET fail ", error);
            return;
        }
        callback(body)

});
