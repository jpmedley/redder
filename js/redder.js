var navEl = document.querySelector('.mdl-navigation');
var entriesEl = document.querySelector('.page-content');

function fetchSubreddit(url) {
  if (url) {
    fetch('https://www.reddit.com/r/' + url + '.json').then(function(response) {
      return response.json();
    }).then(function(json) {
      var links = '';
      for (var i = 0; i < json.data.children.length; i++) {
        links += '<li class="mdl-list__item mdl-list__item--three-line">' +
          '<span class="mdl-list__item-primary-content">' +
          '<i class="material-icons mdl-list__item-avatar">person</i>' +
          '<span><a href="' + json.data.children[i].data.url + '">' +
          json.data.children[i].data.title + '</a></span>' + 
          '<span class="mdl-list__item-sub-title"><br/>' + 
          json.data.children[i].data.author + ' &mdash; ' +
          json.data.children[i].data.num_comments + ' comments</span>' +
          '</span></li>'
      }
      entriesEl.innerHTML = '<ul class="demo-list-three mdl-list">' + links + '</ul>';
    });
  }
}

function fetchNavigation() {
  var subredditsByTopicUrl = 'https://www.reddit.com/api/subreddits_by_topic.json?query=javascript';
  fetch(subredditsByTopicUrl).then(function(response) {
    return response.json();
  }).then(function(json) {
    for (var k = 0; k < json.length; k++) {
      var linkEl = document.createElement('a');

      var classAtt = document.createAttribute('class');
      classAtt.value = "mdl-navigation__link";
      linkEl.setAttributeNode(classAtt);

      var hrefAtt = document.createAttribute('href');
      hrefAtt.value = '#' + json[k].name;
      linkEl.setAttributeNode(hrefAtt);

      var linkText = document.createTextNode(json[k].name);
      linkEl.appendChild(linkText);

      //var link = '<a class="mdl-navigation__link" href="' + json[k].name + '">' + json[k].name + '</a>'
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
}