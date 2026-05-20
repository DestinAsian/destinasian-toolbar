(function () {
  "use strict";

  var DEFAULT_LABEL = "Find out more";
  var DEFAULT_URL = "https://destinasian.com";
  var STYLE_ID = "da_toolbar_button_style";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var css =
      ".da_toolbar_button{" +
      "width:100%;" +
      "display:flex;" +
      "justify-content:center;" +
      "margin:24px 0;" +
      "}" +
      ".da_toolbar_button_wrapper{" +
      "display:inline-flex;" +
      "align-items:stretch;" +
      "gap:8px;" +
      "}" +
      ".da_toolbar_button_wrapper.da_toolbar_button_is_visible{" +
      "opacity:1;" +
      "visibility:visible;" +
      "}" +
      ".da_toolbar_button_cta{" +
      "display:inline-flex;" +
      "align-items:center;" +
      "justify-content:center;" +
      "min-height:44px;" +
      "background-color:#000000;" +
      "}" +
      ".da_toolbar_button_cta a{" +
      "display:inline-flex;" +
      "align-items:center;" +
      "justify-content:center;" +
      "min-height:44px;" +
      "padding:0 22px;" +
      "color:#ffffff;" +
      "font-size:14px;" +
      "font-weight:600;" +
      "line-height:1;" +
      "text-decoration:none;" +
      "white-space:nowrap;" +
      "}" +
      ".da_toolbar_button_cta a:hover," +
      ".da_toolbar_button_cta a:focus{" +
      "color:#ffffff;" +
      "text-decoration:none;" +
      "}" +
      ".da_toolbar_button_share{" +
      "width:44px;" +
      "min-width:44px;" +
      "min-height:44px;" +
      "display:inline-flex;" +
      "align-items:center;" +
      "justify-content:center;" +
      "border:0;" +
      "background-color:#000000;" +
      "color:#ffffff;" +
      "cursor:pointer;" +
      "padding:0;" +
      "}" +
      ".da_toolbar_button_share:hover," +
      ".da_toolbar_button_share:focus{" +
      "background-color:#222222;" +
      "}" +
      ".da_toolbar_button_share svg{" +
      "width:22px;" +
      "height:22px;" +
      "display:block;" +
      "}" +
      "@media(max-width:480px){" +
      ".da_toolbar_button{" +
      "justify-content:stretch;" +
      "}" +
      ".da_toolbar_button_wrapper{" +
      "width:100%;" +
      "}" +
      ".da_toolbar_button_cta{" +
      "flex:1 1 auto;" +
      "}" +
      ".da_toolbar_button_cta a{" +
      "width:100%;" +
      "}" +
      "}";

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));

    document.head.appendChild(style);
  }

  function cleanText(value, fallback) {
    if (!value || typeof value !== "string") return fallback;
    return value.trim() || fallback;
  }

  function cleanUrl(value, fallback) {
    var url = cleanText(value, fallback);

    if (url === "#") return "#";

    try {
      var parsedUrl = new URL(url, window.location.origin);

      if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
        return parsedUrl.href;
      }

      return fallback;
    } catch (error) {
      return fallback;
    }
  }

  function createShareIcon() {
    var svgNs = "http://www.w3.org/2000/svg";

    var svg = document.createElementNS(svgNs, "svg");
    svg.setAttribute("xmlns", svgNs);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "#ffffff");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    var path = document.createElementNS(svgNs, "path");
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("clip-rule", "evenodd");
    path.setAttribute(
      "d",
      "M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z",
    );

    svg.appendChild(path);

    return svg;
  }

  function fallbackCopy(button, pageUrl) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(pageUrl)
        .then(function () {
          button.setAttribute("aria-label", "Page URL copied");
          window.alert("Page URL copied");
        })
        .catch(function () {
          window.prompt("Copy this page URL:", pageUrl);
        });

      return;
    }

    window.prompt("Copy this page URL:", pageUrl);
  }

  function shareCurrentPage(button) {
    var pageUrl = window.location.href;
    var pageTitle = document.title || "DestinAsian";

    if (navigator.share) {
      navigator
        .share({
          title: pageTitle,
          url: pageUrl,
        })
        .catch(function (error) {
          if (error && error.name === "AbortError") return;
          fallbackCopy(button, pageUrl);
        });

      return;
    }

    fallbackCopy(button, pageUrl);
  }

  function renderComponent(root) {
    if (!root || root.getAttribute("data-initialized") === "true") return;

    var label = cleanText(
      root.getAttribute("data-button-label"),
      DEFAULT_LABEL,
    );
    var url = cleanUrl(root.getAttribute("data-button-url"), DEFAULT_URL);

    root.setAttribute("data-initialized", "true");

    var wrapper = document.createElement("div");
    wrapper.className =
      "da_toolbar_button_wrapper da_toolbar_button_is_visible";

    var ctaWrapper = document.createElement("div");
    ctaWrapper.className = "da_toolbar_button_cta";

    var ctaLink = document.createElement("a");
    ctaLink.href = url;
    ctaLink.target = "_blank";
    ctaLink.rel = "noopener noreferrer";
    ctaLink.textContent = label;

    var shareButton = document.createElement("button");
    shareButton.type = "button";
    shareButton.className = "da_toolbar_button_share";
    shareButton.setAttribute("aria-label", "Share this page");

    shareButton.appendChild(createShareIcon());

    shareButton.addEventListener("click", function () {
      shareCurrentPage(shareButton);
    });

    ctaWrapper.appendChild(ctaLink);
    wrapper.appendChild(ctaWrapper);
    wrapper.appendChild(shareButton);

    root.textContent = "";
    root.appendChild(wrapper);
  }

  function init() {
    injectStyles();

    var components = document.querySelectorAll(".da_toolbar_button");

    for (var i = 0; i < components.length; i += 1) {
      renderComponent(components[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
