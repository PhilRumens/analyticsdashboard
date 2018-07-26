/* This one gets which pages are being hit right now */
(function(root){
  "use strict"
  if (typeof root.matrix == "undefined") { root.matrix = {}; }

  var landing = {
    terms: [],
    el: false,

    endpoint: function(){
      return "/realtime?"
        + "ids=ga:"+matrix.settings.profileId+"&"
        + "metrics=rt:pageViews&"
        + "dimensions=ga:pageTitle,ga:pagePath,rt:source,rt:minutesAgo,rt:deviceCategory,rt:browser,rt:city&"
        + "sort=rt:minutesAgo&"
        + "max-results=10000";
    },
    safeTerm: function(term){
      // Nothing that looks like an email address
      if(term.indexOf('@') > -1){
        return false;
      }
      // Nothing that is just a numeber
      if(term.match(/^[0-9\s]+$/)){
        return false;
      }
      // Nothing that is like a SSN
      if(term.match(/^[0-9]{3}\s+?[0-9]{2}\s+?[0-9]{4}$/)){
        return false;
      }
      // No 503 requests
      if(term === "Sorry, we are experiencing technical difficulties (503 error)"){
        return false;
      }
      return true;
    },
    addTerm: function (term, count, url, source, deviceCategory, browser, city) {
      var i;
      for(i=0;i<count;i++) {
        landing.terms.push({
          term: term,
          total: count,
          url: url,
          source: source,
          has_url: !!url,
          has_source: !!source && (source != "(not set)"),
          deviceCategory: deviceCategory,
          browser: browser,
          city: city,
        });
      }
    },
    parseData: function(data) {
       var i, _i, term, url, source, minutesAgo, deviceCategory, browser, city,
      termColumn = 0, urlColumn = 1, sourceColumn = 2,
      minutesAgoColumn = 3, deviceCategoryColumn = 4, countColumn = 7, browserColumn = 5, cityColumn = 6, maxMinutes = 2;
      for(i=0,_i=data.rows.length; i<_i; i++){
        term = data.rows[i][termColumn];
        url = data.rows[i][urlColumn];
        source = data.rows[i][sourceColumn];
        deviceCategory = data.rows[i][deviceCategoryColumn].toLowerCase();
        browser = data.rows[i][browserColumn];
        city = data.rows[i][cityColumn];
        minutesAgo = root.parseInt(data.rows[i][minutesAgoColumn]);
        if(minutesAgo < maxMinutes) {
          if(term !== 'Search' && landing.safeTerm(term)){
              landing.addTerm(term, root.parseInt(data.rows[i][countColumn], 10), url, source, deviceCategory, browser, city);
          }
        }else {
          break;
        }
      }
    },
    parseResponse: function(error, data){
      if(error) { return -1; }
      if(data.hasOwnProperty('rows')) {
        landing.terms = [];
        landing.parseData(data);
        landing.refreshResults();
      }else {
        return -1;
      }
    },
    refreshResults: function() {
      landing.showOneByOne(landing.terms);
    },
    showOneByOne: function(data) {
      var i, dataLength = data.length;
      for(i=0;i<dataLength;i++) {
        var term = data[i];
        var timeOut = 60/dataLength*i*1000;
        setTimeout((function(term) {
          return function() {
            landing.showTerm(term);
          };
        })(term), timeOut);
      }
    },
    showTerm: function(term) {
      templateHelper.prependTemplate(landing.el, "landing-pages-items", {pages: [term ]});
    },
    init: function(){
      var source;
      landing.el = document.getElementById('search');
      landing.reload();
      window.setInterval(landing.reload, 60e3);
    },
    reload: function(){
      xhr.json(landing.endpoint(), landing.parseResponse);
    }
  };

  root.matrix.landing = landing;
}).call(this, this);
