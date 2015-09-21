/**
 * Created by DEV on 17-06-2015.
 */
var BluebirdPromise = require('bluebird');
var $ = require('jquery');

var AjaxPromiseOnly = {
  ajax: function (type, url, data) {
    return new BluebirdPromise(function (resolve, reject) {

      var successResponse = successCallback.bind(this, resolve);
      var failureResponse = failureCallback.bind(this, reject);
      var opts = {
        type: type,
        dataType: 'JSON',
        data: data,
        contentType: "application/json; charset=utf-8",
        beforeSend: function(){
          var loaderContainer = document.getElementById('loaderContainer');
          loaderContainer.classList.remove('loaderInVisible');
        },
        success: successResponse,
        error: failureResponse
      };
      return $.ajax(url, opts);
    });
  },
  get: function (url, data) {
    return this.ajax('GET', url, data);
  },
  post: function (url, data) {
    return this.ajax('POST', url, data);
  },
  put: function (url, data) {
    return this.ajax('PUT', url, data);
  },
  patch: function (url, data) {
    return this.ajax('PATCH', url, data);
  },
  delete: function (url, data) {
    return this.ajax('DELETE', url, data);
  }
};

var successCallback = function (oCallback, oResponse) {
  if(oCallback) {
    oCallback(oResponse);
  }
  var loaderContainer = document.getElementById('loaderContainer');
  loaderContainer.classList.add('loaderInVisible');
};

var failureCallback = function (oCallback, oResponse) {
  if(oCallback) {
    oCallback(oResponse.responseJSON);
  }
  var loaderContainer = document.getElementById('loaderContainer');
  loaderContainer.classList.add('loaderInVisible');
};

module.exports = AjaxPromiseOnly;
