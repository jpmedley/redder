var navEl = document.querySelector('.mdl-navigation');
var entriesEl = document.querySelector('.page-content');

function createFullElement(elementName, attributeData) {
  var newElement = document.createElement(elementName);
  for (attr in attributeData) {
    var newAttribute = document.createAttribute(attr)
    newAttribute.value = attributeData[attr]
    newElement.setAttributeNode(newAttribute);
  }

  return newElement;
}

function fetchSubreddit(url) {
  if (url) {
    fetch('https://www.reddit.com/r/' + url + '.json').then(function(response) {
      return response.json();
    }).then(function(json) {
      var articleList = createFullElement('ul', {
        'class': 'demo-list-three mdl-list'
      });

      for (var i = 0; i < json.data.children.length; i++) {
        //Make the enclosing list item.
        var articleItem = createFullElement('li', {
          'class': 'mdl-list__item mdl-list__item--three-line'
        });

        //Make the primary content span.
        var primarySpan = createFullElement('span', {
          'class': 'mdl-list__item-primary-content'
        });

        //Make the article link.
        var anImage = createFullElement('i', {
          'class': 'material-icons mdl-list__item-avatar'
        });

        var someText = document.createTextNode('person');
        anImage.appendChild(someText);
        primarySpan.appendChild(anImage);

        var linkSpan = document.createElement('span');

        //ToDo: Add indicator for whether article will load here or in a new tab.
        var contentLink = createFullElement('a', {
          'href': json.data.children[i].data.url
        })
        contentLink.addEventListener('click', function(e) {
          e.preventDefault();
          if (e.target.href.indexOf('www.reddit.com') > -1) {
            var jsonUrl = e.target.href.slice(0, -1) + '.json';
            var req = new Request(jsonUrl, {mode: 'cors'});
            fetch(req).then(function(res) {
              res.text().then(function(text) {
                //ToDo: Render returned json in UI.
                //console.log(text);
              })
            })
          } else {
            window.open(e.target.href, '_blank');
          }
        });

        var linkText = document.createTextNode(json.data.children[i].data.title);
        contentLink.appendChild(linkText);
        linkSpan.appendChild(contentLink);
        primarySpan.appendChild(linkSpan);

        //Make the subtitle line.
        var subtitleSpan = createFullElement('span', {
          'class': 'mdl-list__item-sub-title'
        })
        var aBreak = document.createElement('br');
        subtitleSpan.appendChild(aBreak);

        var subtitleText = document.createTextNode(json.data.children[i].data.author + ' — ' + json.data.children[i].data.num_comments + ' comments');
        subtitleSpan.appendChild(subtitleText);
        primarySpan.appendChild(subtitleSpan);
        articleItem.appendChild(primarySpan);
        articleList.appendChild(articleItem);
      };
      if (entriesEl.hasChildNodes) {
        entriesEl.removeChild(entriesEl.firstChild);
      }
      entriesEl.appendChild(articleList);
    });
  }
}

function fetchNavigation() {
  var subredditsByTopicUrl = 'https://www.reddit.com/api/subreddits_by_topic.json?query=javascript';
  fetch(subredditsByTopicUrl).then(function(response) {
    return response.json();
  }).then(function(json) {
    for (var k = 0; k < json.length; k++) {
      var linkEl = createFullElement('a', {
        'class': 'mdl-navigation__link',
        'href': '#' + json[k].name
      });

      var linkText = document.createTextNode(json[k].name);
      linkEl.appendChild(linkText);
      var linkNode = navEl.appendChild(linkEl);

      linkNode.addEventListener('click', function(e) {
        fetchSubreddit(e.target.firstChild.nodeValue);
      });
    }
  }).catch(function(ex) {
    console.log('Parsing failed: ', ex);
  });
}

window.onload = function() {
  fetchNavigation();
  var anchorLocation = window.location.href.indexOf('#');
  if (anchorLocation != -1) {
    fetchSubreddit(window.location.href.slice(anchorLocation + 1));
  }
}