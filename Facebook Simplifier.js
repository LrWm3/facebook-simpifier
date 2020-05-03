// ==UserScript==
// @name         Facebook Simplifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simplify the facebook news-feed.
// @author       deer
// @match        https://*.facebook.com/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  window.setInterval(function () {
    var articles = document.querySelectorAll('article');
    var sel = "";
    var sel2 = "";
    if (articles.length != 0) {
      sel = 'article';
      sel2 = 'div>span';
    } else {
      sel = '[data-testid=fbfeed_story]';
      sel2 = 'span';
    }
    var stories = document.querySelectorAll(sel);
    [...stories].forEach(function (story) {
      var spans = story.querySelectorAll(sel2);
      var spantexts = {};
      [...spans].forEach(function (span) {
        if (spantexts[span.className]) {
          spantexts[span.className] += span.innerText;
        } else {
          spantexts[span.className] = span.innerText;
        }
      });
      for (var key in spantexts) {
        if (spantexts[key].startsWith("Sponsored")) {
          story.remove();
        }
      }
    });
    stories.forEach(storyContainer => {

      if (!storyContainer.hasAttribute('collapseEnabled')) {

        var storyFull = storyContainer.firstChild

        try {
          var collapseBlockOriginalNode = storyContainer.querySelector('div[class~="userContentWrapper"]').querySelector('a[title][data-hovercard-prefer-more-content-show]')

          if (collapseBlockOriginalNode === null) {
            collapseBlockOriginalNode = storyContainer.querySelector('div[class~="userContentWrapper"]').querySelector('a[data-hovercard-prefer-more-content-show]');
          }
          if (collapseBlockOriginalNode === null) {
            collapseBlockOriginalNode = storyContainer.querySelector('div[class~="userContentWrapper"]').querySelector('a[title]');
          }
          var collapseBlockOriginal = collapseBlockOriginalNode.parentNode.parentNode;

          var collapseBlock = collapseBlockOriginal.cloneNode(true)

          storyContainer.insertBefore(collapseBlock, storyContainer.firstChild)

          collapseBlock.style.backgroundColor = "#ffffff"
          collapseBlock.style.padding = "12px"
          collapseBlock.style.borderRadius = "3px"
          collapseBlock.style.border = "1px solid #dddfe2"

          storyFull.style.display = "none"

          collapseBlock.onclick = () => storyFull.style.display = (storyFull.style.display === "none") ? "" : "none"

          storyContainer.setAttribute('collapseEnabled', 'true');
        } catch (e) {
          console.warn("Failed to process story");
          console.warn(storyContainer)
          console.warn(e)
          // storyContainer.setAttribute('collapseEnabled', 'failed');

        }
      }
    });
  }, 150);

})();
