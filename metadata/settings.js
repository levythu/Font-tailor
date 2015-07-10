module.exports=
{
    // desFontPath is the path to store generated fonts. Make sure it is a public folder which can be accessed directly by url.
    desFontPath: 'public/res/',

    // srcFontPath is the path holding source font files. Only .ttf is supported.
    srcFontPath: 'fonts/',

    // expiring time for a url-font cache to remain. In milliseconds.
    expireTime: 1000*60*60*24,

    // hostname showing to others.
    hostname: '192.168.1.97',

    // path-on-server of desFontPath
    relOutputPath: 'res/'
}
