/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // custom JavaScript goes here
  var get = function(url, token) {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('GET', url);
      if (token) request.setRequestHeader('Authorization', 'Bearer ' + token);
      request.onload = function() {
        if (request.status === 200) {
          resolve(request.responseText);
        } else {
          reject(Error(request.statusText));
        }
      };
      request.onerror = function() {
        reject(Error("Network Error"));
      };
      request.send(null);
    });
  };

  var post = function(url, req, token) {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('POST', url, true);
      if (token) request.setRequestHeader('Authorization', 'Bearer ' + token);
      request.setRequestHeader('Content-Type', 'application/json');
      request.onload = function() {
        if (request.status === 200) {
          resolve(request.responseText);
        } else {
          reject(Error(request.statusText));
        }
      };
      request.onerror = function() {
        reject(Error("Network Error"));
      };
      request.send(JSON.stringify(req));
    });
  };

  var loadProjects = function() {
    var e = document.getElementById('project-list');
    while (e.firstChild) {
        e.removeChild(e.firstChild);
    }

    get('http://localhost:3000/api/ProjectListing')
      .then(res => {
        if (res) {
          var projects = JSON.parse(res);
          projects.forEach(o => {
            // <ul id="project-list">
            //   <li>
            //     <a>Project 1</a>
            //     <ul>
            //       <li>param 1</li>
            //       <li>param 2</li>
            //     </ul>
            //   </li>
            // </ul>
            var node = document.createElement('li');
            var a = document.createElement('a');
            var textnode = document.createTextNode(o.description);
            a.appendChild(textnode);            
            node.appendChild(a);
            a.onclick = function() {
              var childList = a.parentNode.getElementsByTagName('ul');
              for (var j = 0; j< childList.length;j++) {
                  var state = childList[j].style.display;
                  if (state == "none"){
                      childList[j].style.display = "block";
                  } else {
                      childList[j].style.display = "none";
                  }
              }
            };

            var ul = document.createElement('ul');
            ul.style.display = "none";
            
            var li = document.createElement('li');
            textnode = document.createTextNode('Listing Id: ' + o.listingId);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Project: ' + o.project);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Construction Type: ' + o.constructionType);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Building Use: ' + o.buildingUse);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Sector: ' + o.sector);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Status: ' + o.status);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Bidding State: ' + o.state);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Estimate Cost: USD$' + o.estimateCost);
            li.appendChild(textnode);
            ul.appendChild(li);

            var bids = o.proposals;
            if (bids) {
              bids.forEach((b, i) => {
                var li2 = document.createElement('li');
                textnode = document.createTextNode('Bid ' + (i+1) + ':');
                li2.appendChild(textnode);
                ul.appendChild(li2);
                li2.onclick = function() {
                  var childList = a.parentNode.getElementsByTagName('ul');
                  for (var j = 0; j< childList.length;j++) {
                      var state = childList[j].style.display;
                      if (state == "none"){
                          childList[j].style.display = "block";
                      } else {
                          childList[j].style.display = "none";
                      }
                  }
                };

                var ul2 = document.createElement('ul');
                ul2.style.display = "none";
                
                var li = document.createElement('li');
                textnode = document.createTextNode('Transaction Id: ' + b.transactionId);
                li.appendChild(textnode);
                ul2.appendChild(li);

                var li = document.createElement('li');
                textnode = document.createTextNode('Contractor: ' + b.contractor);
                li.appendChild(textnode);
                ul2.appendChild(li);

                var li = document.createElement('li');
                textnode = document.createTextNode('Bid Price: ' + b.bidPrice);
                li.appendChild(textnode);
                ul2.appendChild(li);

                var li = document.createElement('li');
                textnode = document.createTextNode('Timestamp: ' + b.timestamp);
                li.appendChild(textnode);
                ul2.appendChild(li);

                li2.appendChild(ul2);
              });
            }

            node.appendChild(ul);

            e.appendChild(node);
          });
        }
      })
      .catch(console.error);
  };

  var loadMembers = function() {
    var e = document.getElementById('member-list');
    while (e.firstChild) {
        e.removeChild(e.firstChild);
    }
    var updateMembers = function(role, res) {
      res.forEach(o => {
        var node = document.createElement('li');
        var a = document.createElement('a');
        var textnode = document.createTextNode(o.firstName + ' ' + o.lastName);
        a.appendChild(textnode);            
        node.appendChild(a);

        var ul = document.createElement('ul');
        ul.style.display = "block";
        
        var li = document.createElement('li');
        textnode = document.createTextNode('Role: ' + role);
        li.appendChild(textnode);
        ul.appendChild(li);

        li = document.createElement('li');
        textnode = document.createTextNode('Email: ' + o.email);
        li.appendChild(textnode);
        ul.appendChild(li);

        li = document.createElement('li');
        textnode = document.createTextNode('Balance: ' + o.balance);
        li.appendChild(textnode);
        ul.appendChild(li);

        node.appendChild(ul);

        e.appendChild(node);
      });
    }

    get('http://localhost:3000/api/Architect')
      .then(res => {
        if (res) {
          updateMembers('Architect', JSON.parse(res));
        }
      })
      .catch(console.error);

    get('http://localhost:3000/api/Contractor')
      .then(res => {
        if (res) {
          updateMembers('Contractor', JSON.parse(res));
        }
      })
      .catch(console.error);
  }

  window.addEventListener('load', function() {
    loadProjects();
    loadMembers();
  });

  var projectBtn = document.getElementById('project-load');
  projectBtn.onclick = function() {
    loadProjects();
  };

  var memberBtn = document.getElementById('member-load');
  memberBtn.onclick = function() {
    loadMembers();
  };

  var submitBtn = document.getElementById('submitBid');
  submitBtn.onclick = function() {
    var req = {
      "$class": "org.acme.project.bidding.Proposal",
      "bidPrice": Number(document.getElementById('bidPrice').value),
      "listing": document.getElementById('listing').value,
      "contractor": document.getElementById('contractor').value
    };

    post('http://localhost:3000/api/Proposal', req);
  };

  var closeBtn = document.getElementById('closeBid');
  closeBtn.onclick = function() {
    var req = {
      "$class": "org.acme.project.bidding.CloseBidding",
      "listing": document.getElementById('closelisting').value
    };

    post('http://localhost:3000/api/CloseBidding', req);
  };

})();
