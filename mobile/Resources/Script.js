var pages = [];
var pageMap = {};
var prevLink = null;
var nextLink = null;
var lastShownPageId = null;

function setup () {
    var style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "Resources/Style.css");
    document.getElementsByTagName("head")[0].appendChild(style);
    
    var content = document.getElementById("content");
    var children = content.childNodes;
    
    for (var i = 0; i < children.length; i ++) {
        var child = children[i];
        if (child.className != "Page") continue;
        
        var titleElement = child.firstChild.firstChild;
        var image = document.getElementById(child.id + "_image");
        
        var w = parseInt(image.getAttribute("width"), 10);
        image.style.marginLeft = "-" + (w / 2) + "px";
        var h = parseInt(image.getAttribute("height"), 10);
        image.style.marginTop = "-" + (h / 2) + "px";
        
        var page = {
            id: child.id,
            element: child,
            index: pages.length,
            title: titleElement.textContent ? titleElement.textContent : titleElement.innerText
        };
        
        pages.push(page);
        pageMap[page.id] = page;
    }
    
    prevLink = document.getElementById("prevLink");
    nextLink = document.getElementById("nextLink");
};

function showPage(id) {
    var page = pageMap[id];
    if (!page) return;
    
    for (var i = 0; i < pages.length; i ++) {
        pages[i].element.className = "Page";
    }
    
    page.element.className = "Page TargetPage";
    
    setupLinkForPage(prevLink, page.index > 0 ? pages[page.index - 1] : null);
    setupLinkForPage(nextLink, page.index < pages.length - 1 ? pages[page.index + 1] : null);
    
    lastShownPageId = id;
};
function setupLinkForPage(link, page) {
    if (page) {
        var a = link.getElementsByTagName("a")[0];
        a.innerHTML = "";
        a.appendChild(document.createTextNode(page.title));
        a.href = "#" + page.id;
        
        link.style.visibility = "visible";
    } else {
        link.style.visibility = "hidden";
    }
    //alert(link.outerHTML);
};
function checkUrl() {
    try {
        if (window.location.href.match(/#(.*)$/)) {
            var id = RegExp.$1;
            if (lastShownPageId != id) {
                showPage(id);
            }
        } else {
            if (pages.length > 0) {
                var firstPage = pages[0];
                showPage(firstPage.id);
                window.location.href = "#" + firstPage.id;
            }
        }
    } finally {
        window.setTimeout(checkUrl, 200);
    }
}

window.onload = function () {
    setup();
    
    checkUrl();    
};
