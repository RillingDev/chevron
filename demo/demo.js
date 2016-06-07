"use strict";

chevron.module("Window", ["window"]);

chevron.module("Demo", ["Math", "toMarkdown", "Window"], (Math, markdown, window) => {
    console.log(markdown);
});

//console.log(chevron);
