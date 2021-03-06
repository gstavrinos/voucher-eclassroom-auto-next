// ==UserScript==
// @name         Voucher eclassroom auto-next
// @namespace    https://github.com/gstavrinos
// @version      0.2
// @description  Stop clicking next every 10 seconds!
// @author       George Stavrinos
// @match        https://voucher.eclassroom.gr/mod/scorm/player*
// @grant        none
// ==/UserScript==

( function () {
    'use strict';
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            [].filter.call(mutation.addedNodes, function (node) {
                return node.nodeName == 'IFRAME';
            }).forEach(function (node) {
                node.addEventListener('load', function (e) {
                    listenToSCORM();
                    observer.disconnect();
                });
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

function listenToSCORM() {
    var clicked = false;
    var slide = "";

    var ob = new MutationObserver(function(mutations) {
        // Listening the current slide
        if(document.getElementById("scorm_object").contentWindow.document.body.querySelectorAll(".cs-listitem.listitem.cs-viewed.cs-selected").length > 0){
            var curr_slide = document.getElementById("scorm_object").contentWindow.document.body.querySelectorAll(".cs-listitem.listitem.cs-viewed.cs-selected")[0].innerText;
            if (curr_slide != slide) {
                slide = curr_slide;
            }
        }
        // Listening the proggress bar
        if(document.getElementById("scorm_object").contentWindow.document.body.querySelectorAll(".cs-fill.progress-bar-fill").length > 0 && curr_slide != "Αξιολόγηση"){
            var valuenow = document.getElementById("scorm_object").contentWindow.document.getElementsByClassName("progress-bar-fill")[0].getAttribute("aria-valuenow");
            var valuemax = document.getElementById("scorm_object").contentWindow.document.getElementsByClassName("progress-bar-fill")[0].getAttribute("aria-valuemax");
            var style = document.getElementById("scorm_object").contentWindow.document.getElementsByClassName("progress-bar-fill")[0].getAttribute("style");
            console.log(style);
            if (((valuemax != null && valuenow == valuemax) || style != null && style.includes("100%")) && !clicked) {
//                 document.getElementById("scorm_object").contentWindow.document.body.querySelectorAll("#next")[0].click();
                var btns = document.getElementById("scorm_object").contentWindow.document.getElementsByClassName("btn")
                for (var i = 0; i < btns.length; i++) {
                    console.log(btns[i].innerText);
                    if (btns[i].innerText.includes("ΕΠΟΜ")) {
                        btns[i].click();
                        break;
                    }
                }
                clicked = true;
                setTimeout(function() {
                    clicked = false
                }, 1500);
            }
        }
        mutations.forEach(function(mutation) {
        });
    });

    ob.observe(document.getElementById("scorm_object").contentWindow.document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
        attributeOldValue: true,
        characterDataOldValue: true
    });
}

