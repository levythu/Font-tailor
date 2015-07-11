#Font tailor
##General Intro
A nodejs-based server used to provide RESTful API to get tailored font src from one particular websites. (That is, if the website has only three characters(asd), the tailored font will be as tiny as to hold only these three, thus reducing the data transfered for fontface)

Characters:

- RESTful API: post url, fontname and encoding as parameters, get the url of .ttf file.
- Two-phase caching: PHASE#1, cache the .ttf file based on url, updating it over expiring time; PHASE#2, caching based on SHA1 of content.
- Garbage cleaning: scripts provided to automatically removing files that are no more needed by any cache.
- Whitelist: regular-expression whitelist, only websites in them could be used to tailor fonts, thus saving storage and cpu.

Further plans:
- Multiple process to accelerate response.
- Automatic css/js for frontend.
- Other relevant utilities

##RestAPI
- POST
    - URL: server_root/
    - Arguments:
        - font: fontname(.ttf suffix excluded), should be contained in the server's font directory.
        - url: the url of website used for tailor.
        - [encoding]: encoding of the website, default is utf8.
    - Returns:
        - Correct: the url of tailored ttf file.
        - Wrong: empty string.

- GET(used for cross-domain fetch)
    - URL: server_root/jspadding.js?queries
    - Queries:
        - font: same as above.
        - url: same as above.
        - [encoding]: same as above.
        - [addcss]: if specified, will get one js designed to add one @fontface css to the DOM; if not, one js containing the font-url will be returned. To modify the returned js, change views/*.ejs

##How to deploy
- Download the source code by git.
- `$ npm install` to install all the dependencies. (For some components like express, root privilege may be needed.)
- Modify /metadata/settings.js to specified settings.
- Modify /metadata/whitelist.js to add whitelist entry using regexp.
- Copy the source font to srcFontPath
- `$ npm start`
