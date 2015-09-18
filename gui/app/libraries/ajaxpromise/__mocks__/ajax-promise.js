
var AjaxPromiseMock = jest.genMockFromModule('../ajax-promise.js');
var ContentData = require.requireActual('../../../../__tests__/mock/mock-data-for-content');
var ClassData = require.requireActual('../../../../__tests__/mock/mock-data-for-class');
var StatusData = require.requireActual('../../../../__tests__/mock/mock-data-for-status');
var TypeData = require.requireActual('../../../../__tests__/mock/mock-data-for-type');
var TagsData = require.requireActual('../../../../__tests__/mock/mock-data-for-tags');
var ContentUpdateData = require.requireActual('../../../../__tests__/mock/mock-data-for-update-content');
var ContentSearchDataOne = require.requireActual('../../../../__tests__/mock/mock-data-for-searched-content');
var ContentSearchDataZero =  $.extend(true, {}, ContentSearchDataOne);
ContentSearchDataZero.response = [];

function get(url, data){
  var dataToReturn = {};
  console.log(url);

  if(url.indexOf('content/get') != -1 && url.indexOf('valueToSearch=Vernel') != -1){
    dataToReturn = ContentSearchDataOne;
  }if(url.indexOf('content/get') != -1 && url.indexOf('valueToSearch=zeroValueSearch') != -1){
    dataToReturn = ContentSearchDataZero;
  }else if(url.indexOf('content/get') != -1){
    dataToReturn = ContentData;
  }

  switch(url){
   /* case "content/get?size=20&from=0":
    case "content/get/":
      dataToReturn = ContentData;
      break;*/

    case "app/screens/homescreen/screens/contentscreen/tack/mock/mock-data-for-type.json":
      dataToReturn = TypeData;
      break;

    case "app/screens/homescreen/screens/contentscreen/tack/mock/mock-data-for-class.json":
      dataToReturn = ClassData;
      break;

    case "app/screens/homescreen/screens/contentscreen/tack/mock/mock-data-for-status.json":
      dataToReturn = StatusData;
      break;

    case "app/screens/homescreen/tack/mock-data-for-tags.json":
      dataToReturn = TagsData;
      break;
  }

  return {
    then: function(a, b){
      a(dataToReturn);
      return {
        catch:  function(){
        }
      }
    }
  };
}

function post(url, data){
  var dataToReturn = {};
  switch(url){
     case "content/save":
      dataToReturn = ContentUpdateData;
      break;

    case "content/remove":
      dataToReturn = {
        "response": {"ids": data.ids},
        "status": "SUCCESS",
        "additionalInfo": null
      };
      break;
  }

  return {
    then: function(a, b){
      a.call(data, dataToReturn);
      return {
        catch:  function(){
        }
      }
    }
  };
}

AjaxPromiseMock.get.mockImplementation(get);
AjaxPromiseMock.post.mockImplementation(post);

module.exports = AjaxPromiseMock;
