var AjaxPromiseOnly = require('./ajax-promise-only');

var AjaxPromise = {

  getUrl: function (url) {
    var iUrl = url.indexOf('?');
    var sUrl = '';
    if(iUrl != -1) {
      sUrl = url + '&sessionId=' + sessionStorage.sessionId + '&requestId='+ localStorage.requestId;
    } else {
      sUrl = url + '?sessionId=' + sessionStorage.sessionId + '&requestId='+ localStorage.requestId;
    }
    return sUrl;
  },

  get: function (url, data) {
    url = this.getUrl(url);
    return AjaxPromiseOnly.get(url, data);
  },

  post: function (url, data) {
    url = this.getUrl(url);
    return AjaxPromiseOnly.post(url, data);
  },

  put: function (url, data) {
    url = this.getUrl(url);
    return AjaxPromiseOnly.put(url, data);
  },

  patch: function (url, data) {
    url = this.getUrl(url);
    return AjaxPromiseOnly.patch(url, data);
  },

  delete: function (url, data) {
    url = this.getUrl(url);
    return AjaxPromiseOnly.delete(url, data);
  }

};

module.exports = AjaxPromise;
