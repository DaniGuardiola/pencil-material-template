/*
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
*/

(function() {
    "use strict";

    var data;

    var currentPage;

    if (typeof String.prototype.endsWith != "function") {
        String.prototype.endsWith = function(str) {
            return this.substring(this.length - str.length, this.length) === str;
        };
    }

    function renderDOM() {
        var toolbar = document.createElement("div");
        toolbar.id = "toolbar";

        var toolbarIcon = document.createElement("div");
        toolbarIcon.id = "toolbar-icon";
        toolbarIcon.classList.add("material-icon");

        var title = document.createElement("span");
        title.id = "title";
        title.classList.add("font-title");
        title.textContent = data.title;

        var pageTitle = document.createElement("span");
        pageTitle.id = "page-title";
        pageTitle.classList.add("font-title");
        pageTitle.textContent = " - ";

        var space = document.createElement("div");
        space.classList.add("flex-space");

        var prevIcon = document.createElement("div");
        prevIcon.id = "prev-icon";
        prevIcon.classList.add("material-icon-button");
        prevIcon.addEventListener("click", prevClick);

        var nextIcon = document.createElement("div");
        nextIcon.id = "next-icon";
        nextIcon.classList.add("material-icon-button");
        nextIcon.addEventListener("click", nextClick);

        toolbar.appendChild(toolbarIcon);
        toolbar.appendChild(title);
        toolbar.appendChild(pageTitle);
        toolbar.appendChild(space);
        toolbar.appendChild(prevIcon);
        toolbar.appendChild(nextIcon);

        insertBeforePage(toolbar);

        var panel = document.createElement("div");
        panel.id = "material-panel";

        var imageContainer = document.createElement("div");
        imageContainer.id = "image-container";

        var image = document.createElement("img");
        image.id = "image";
        image.setAttribute("hidefocus", "true");

        imageContainer.appendChild(image);

        var notes = document.createElement("div");
        notes.id = "notes";

        panel.appendChild(imageContainer);
        panel.appendChild(notes);

        insertBeforePage(panel);
    }

    function insertBeforePage(element) {
        document.body.insertBefore(element, document.getElementById("page"));
    }

    function addStyle() {
        var style = document.createElement("link");
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("href", "Resources/Style.css");
        document.getElementsByTagName("head")[0].appendChild(style);
    }

    function getData() {
        var i, p;

        // Get page
        var page = document.getElementById("page");

        // Get title
        var title = page.querySelector("#documentTitle span").textContent;
        if (title.endsWith(".ep")) {
            title = title.slice(0, -3);
        }

        // Get all pages
        var pagesElements = page.querySelectorAll(".Page");
        var pages = [];
        for (i = 0; i < pagesElements.length; i++) {
            p = pagesElements[i];
            pages.push({
                id: p.id,
                title: p.querySelector(".Texts .Title").textContent,
                note: p.querySelector(".Texts .Note") && p.querySelector(".Texts .Note").nextElementSibling ? p.querySelector(".Texts .Note").nextElementSibling.innerHTML : "",
                src: p.querySelector(".Image img").src,
                map: p.querySelector(".Image map") ? p.querySelector(".Image map").getAttribute("name") : "",
                index: i
            });

        }

        // Return data
        return {
            title: title,
            pages: pages
        };
    }

    function updateTitle() {
        document.title = data.title + " - Pencil";
    }

    function setPageTitle(title, index) {
        document.getElementById("page-title").textContent = "[" + (index + 1) + "/" + data.pages.length + "] " + title;
    }

    function checkHash() {
        var hash = window.location.hash.substr(1);
        var page = findPageById(hash);
        if (page) {
            setPageTitle(page.title, page.index);
            currentPage = page;
            updateNavigators();
            loadPage(page);
        } else {
            goToPage(data.pages[0].id);
        }
    }

    function loadPage(page) {
        var image = document.getElementById("image");
        image.src = page.src;
        image.setAttribute("usemap", "#" + page.map);

        var notes = document.getElementById("notes");
        notes.innerHTML = page.note || "<span style=\"color: #9E9E9E;\">There are no notes :)</span>";
    }

    function goToPage(id) {
        var page = findPageById(id);
        if (page) {
            window.location.hash = id;
        }
    }

    function getPreviousPage() {
        if (data.pages[currentPage.index - 1]) {
            return data.pages[currentPage.index - 1];
        }
        return false;
    }

    function getNextPage() {
        if (data.pages[currentPage.index + 1]) {
            return data.pages[currentPage.index + 1];
        }
        return false;
    }

    function updateNavigators() {
        var prev = document.getElementById("prev-icon");
        var next = document.getElementById("next-icon");

        if (getPreviousPage()) {
            prev.classList.add("on");
        } else {
            prev.classList.remove("on");
        }

        if (getNextPage()) {
            next.classList.add("on");
        } else {
            next.classList.remove("on");
        }
    }

    function prevClick() {
        goToPage(getPreviousPage().id);
    }

    function nextClick() {
        goToPage(getNextPage().id);
    }

    function findPageById(id) {
        for (var i = 0; i < data.pages.length; i++) {
            if (data.pages[i].id === id) {
                return data.pages[i];
            }
        }
        return false;
    }

    function setupHashChange() {
        window.addEventListener("hashchange", checkHash);
    }

    function setupKeyActions() {
        window.addEventListener("keydown", keyDownListener);
    }

    function keyDownListener(event) {
        var key = event.keyCode || event.which;
        if (key === 37) {
            if (getPreviousPage()) {
                goToPage(getPreviousPage().id);
            }
            return;
        }
        if (key === 39) {
            if (getNextPage()) {
                goToPage(getNextPage().id);
            }
            return;
        }
    }

    function moveMaps() {
        var mapsElement = document.createElement("div");
        mapsElement.id = "maps-element";
        var maps = document.getElementById("page").querySelectorAll("map");
        for (var i = 0; i < maps.length; i++) {
            mapsElement.appendChild(maps[i]);
        }
        document.body.appendChild(mapsElement);
    }

    function start() {
        addStyle();
        data = getData();
        moveMaps();
        document.getElementById("page").parentNode.removeChild(document.getElementById("page"));
        renderDOM();
        updateTitle();
        checkHash();
        document.body.scrollTop = 0;
        setupHashChange();
        setupKeyActions();
        document.body.classList.add("ready");
    }

    window.addEventListener("load", start);
})();
