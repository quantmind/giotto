    // load Css unless blocked
    if (root.giottostyle !== false) {
        var giottostyle = document.createElement("style");
        giottostyle.innerHTML = NS["src/text/giotto.min.css"];
        document.getElementsByTagName("head")[0].appendChild(giottostyle);
    }
