"use strict";

(function (chevron) {
    chevron.module("Window", ["window"]);
    chevron.module("Demo", ["Math", "toMarkdown", "Window"], myCallBack);

    function myCallBack(Math, markdown, window) {
        console.log(this, markdown);
    }

    //console.log(chevron);

})(chevron);
