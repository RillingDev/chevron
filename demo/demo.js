"use strict";

(function (chevron) {
    chevron.module("myCustomModule", ["window", "document"]);
    chevron.module("Demo", ["Math", "toMarkdown", "myCustomModule"], myCallBack);

    function myCallBack(dep) {
        console.log(this);
    }

    console.log("###############");
    console.log(chevron);

})(chevron);
