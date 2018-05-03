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

  var loadAssets = function() {
    var e = document.getElementById('asset-list');
    while (e.firstChild) {
        e.removeChild(e.firstChild);
    }

    get('http://localhost:3000/api/ConstructionFund')
      .then(res => {
        if (res) {
          var assets = JSON.parse(res);
          assets.forEach(o => {
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
            textnode = document.createTextNode('Asset Id: ' + o.assetId);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Balance: ' + o.balance);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Owner: ' + o.owner);
            li.appendChild(textnode);
            ul.appendChild(li);

            node.appendChild(ul);

            e.appendChild(node);
          });
        }
      })
      .catch(console.error);
 
    get('http://localhost:3000/api/ConstructionWork')
      .then(res => {
        if (res) {
          var assets = JSON.parse(res);
          assets.forEach(o => {
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
            textnode = document.createTextNode('Asset Id: ' + o.assetId);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Construction Type: ' + o.type);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Status: ' + o.status);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Cost: ' + o.cost);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Builder: ' + o.builder);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Inspector: ' + o.inspector);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Finish Date:' + o.finishDateTime);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Inspect Date:' + o.inspectDateTime);
            li.appendChild(textnode);
            ul.appendChild(li);

            node.appendChild(ul);

            e.appendChild(node);
          });
        }
      })
      .catch(console.error);
      
    get('http://localhost:3000/api/RequestChangeOrder')
      .then(res => {
        if (res) {
          var assets = JSON.parse(res);
          assets.forEach(o => {
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
            textnode = document.createTextNode('Asset Id: ' + o.assetId);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Total: ' + o.total);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Budget Status: ' + o.budgetStatus);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Cost Status: ' + o.costStatus);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('From: ' + o.from);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('To: ' + o.to);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Created Date:' + o.createDateTime);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Submitted Date:' + o.submitDateTime);
            li.appendChild(textnode);
            ul.appendChild(li);

            node.appendChild(ul);

            e.appendChild(node);
          });
        }
      })
      .catch(console.error);

    get('http://localhost:3000/api/OwnerChangeOrder')
      .then(res => {
        if (res) {
          var assets = JSON.parse(res);
          assets.forEach(o => {
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
            textnode = document.createTextNode('Asset Id: ' + o.assetId);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Status:' + o.status);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Approved Amount: ' + o.approveAmount);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('From: ' + o.from);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('To: ' + o.to);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Approved Date:' + o.approveDateTime);
            li.appendChild(textnode);
            ul.appendChild(li);

            node.appendChild(ul);

            e.appendChild(node);
          });
        }
      })
      .catch(console.error);
 
    get('http://localhost:3000/api/BuildingMaterial')
      .then(res => {
        if (res) {
          var assets = JSON.parse(res);
          assets.forEach(o => {
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
            textnode = document.createTextNode('Asset Id: ' + o.assetId);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Category: ' + o.category);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Status: ' + o.status);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Price: ' + o.price);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Supplier: ' + o.supplier);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Inspector: ' + o.inspector);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Delivery Date:' + o.deliverDateTime);
            li.appendChild(textnode);
            ul.appendChild(li);

            li = document.createElement('li');
            textnode = document.createTextNode('Inspect Date:' + o.inspectDateTime);
            li.appendChild(textnode);
            ul.appendChild(li);

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
        var textnode = document.createTextNode(o.name);
        a.appendChild(textnode);            
        node.appendChild(a);

        var ul = document.createElement('ul');
        ul.style.display = "block";
        
        var li = document.createElement('li');
        textnode = document.createTextNode('Role: ' + role);
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

    get('http://localhost:3000/api/Owner')
      .then(res => {
        if (res) {
          updateMembers('Owner', JSON.parse(res));
        }
      })
      .catch(console.error);

    get('http://localhost:3000/api/Architect')
      .then(res => {
        if (res) {
          updateMembers('Architect', JSON.parse(res));
        }
      })
      .catch(console.error);

    get('http://localhost:3000/api/GeneralContractor')
      .then(res => {
        if (res) {
          updateMembers('General Contractor', JSON.parse(res));
        }
      })
      .catch(console.error);
    
    get('http://localhost:3000/api/SubContractor')
      .then(res => {
        if (res) {
          updateMembers('Subcontractor', JSON.parse(res));
        }
      })
      .catch(console.error);

    get('http://localhost:3000/api/Manufacturer')
      .then(res => {
        if (res) {
          updateMembers('Manufacturer', JSON.parse(res));
        }
      })
      .catch(console.error);
  }

window.addEventListener('load', function() {
    // test
    localStorage.removeItem('contract_bootstrap');
    if (!localStorage.getItem('contract_bootstrap')) {
      bootstrap();
      localStorage.setItem('contract_bootstrap', true);
    }

    loadAssets();
    loadMembers();
  });

  var assetBtn = document.getElementById('asset-load');
  assetBtn.onclick = function() {
    loadAssets();
  };

  var memberBtn = document.getElementById('member-load');
  memberBtn.onclick = function() {
    loadMembers();
  };

  var bootstrap = function() {
    // add participants
    var req = {
      "$class": "org.acme.construction.Owner",
      "participantId": "PO:1",
      "name": "Owen Owner",
      "balance": 0
    };
    post('http://localhost:3000/api/Owner', req);

    req = {
      "$class": "org.acme.construction.Architect",
      "participantId": "PA:1",
      "name": "Alex Architect",
      "balance": 0
    };
    post('http://localhost:3000/api/Architect', req);

    req = {
      "$class": "org.acme.construction.Manufacturer",
      "participantId": "MF:1",
      "name": "Mac Supply",
      "balance": 0
    };
    post('http://localhost:3000/api/Manufacturer', req);

    req = {
      "$class": "org.acme.construction.GeneralContractor",
      "participantId": "GC:1",
      "name": "Gene General",
      "balance": 0
    };
    post('http://localhost:3000/api/GeneralContractor', req);

    req = {
      "$class": "org.acme.construction.SubContractor",
      "participantId": "SC:1",
      "name": "Sup Connor",
      "balance": 0
    };
    post('http://localhost:3000/api/SubContractor', req);

    // add assets
    req = {
      "$class": "org.acme.construction.ConstructionFund",
      "assetId": "CF:1",
      "description": "Fund",
      "balance": 200000,
      "owner": "resource:org.acme.construction.Owner#PO:1"
    };
    post('http://localhost:3000/api/ConstructionFund', req);

    req = {
      "$class": "org.acme.construction.ConstructionWork",
      "assetId": "CW:1",
      "description": "Office Remodeling",
      "type": "RENOVATION",
      "status": "STARTED",
      "cost": 10000,
      "builder": "resource:org.acme.construction.SubContractor#SC:1",
      "inspector": "resource:org.acme.construction.GeneralContractor#GC:1",
      "finishDateTime": " ",
      "inspectDateTime": " "
    };
    post('http://localhost:3000/api/ConstructionWork', req);

    req = {
      "$class": "org.acme.construction.BuildingMaterial",
      "assetId": "BM:1",
      "description": "Steel Truss",
      "category": "STEEL_FRAMES",
      "status": "ORDERED",
      "price": 5000,
      "supplier": "resource:org.acme.construction.Manufacturer#MF:1",
      "inspector": "resource:org.acme.construction.GeneralContractor#GC:1",
      "deliverDateTime": " ",
      "inspectDateTime": " "
    };
    post('http://localhost:3000/api/BuildingMaterial', req);

    var date = new Date();
    var dateTime = date.toISOString();
    req = {
      "$class": "org.acme.construction.RequestChangeOrder",
      "assetId": "RCO:1",
      "description": "RCO - need more fund",
      "budgetStatus": "DRAFT",
      "costStatus": "DRAFT",
      "scopeOfWork": [],
      "createDateTime": dateTime,
      "submitDateTime": dateTime,
      "total": 100000,
      "from": "resource:org.acme.construction.GeneralContractor#GC:1",
      "to": "resource:org.acme.construction.Owner#PO:1"
    };
    post('http://localhost:3000/api/RequestChangeOrder', req);
  }

  var deliverMatBtn = document.getElementById('deliverMaterial');
  deliverMatBtn.onclick = function() {
    var req = {
      "$class": "org.acme.construction.DeliverMaterial",
      "material": document.getElementById('material').value
    };

    post('http://localhost:3000/api/DeliverMaterial', req);
  };

  var inspectMatBtn = document.getElementById('inspectMaterial');
  inspectMatBtn.onclick = function() {
    var req = {
      "$class": "org.acme.construction.InspectMaterial",
      "newStatus": document.getElementById('matStatus').value,
      "material": document.getElementById('material').value,
      "inspector": document.getElementById('inspector').value
    };

    post('http://localhost:3000/api/InspectMaterial', req);
  };

  var finishWorkBtn = document.getElementById('finishWork');
  finishWorkBtn.onclick = function() {
    var req = {
      "$class": "org.acme.construction.FinishWork",
      "work": document.getElementById('work').value
    };

    post('http://localhost:3000/api/FinishWork', req);
  };

  var inspectWorkBtn = document.getElementById('inspectWork');
  inspectWorkBtn.onclick = function() {
    var req = {
      "$class": "org.acme.construction.InspectWork",
      "newStatus": document.getElementById('workStatus').value,
      "work": document.getElementById('work').value,
      "inspector": document.getElementById('inspector').value
    };

    post('http://localhost:3000/api/InspectWork', req);
  };

  var processRCOBtn = document.getElementById('processRCO');
  processRCOBtn.onclick = function() {
    var req = {
      "$class": "org.acme.construction.ProcessRCO",
      "rco": document.getElementById('rco').value,
      "approveAmount": Number(document.getElementById('amount').value),
      "status": document.getElementById('coStatus').value,
      "approver": document.getElementById('approver').value
    };

    post('http://localhost:3000/api/ProcessRCO', req);
  };

  var reloadAssetBtn = document.getElementById('reloadAsset');
  reloadAssetBtn.onclick = function() {
    loadAssets();
  };
})();
