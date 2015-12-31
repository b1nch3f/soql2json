function convert(soqlQuery, callback) {
  
  //the Query object
  var children = [];

  var result = {};
  
  var theStringObj = [];
  
  //split(,);
  
  var elemList = soqlQuery.split(',');
  
  //elemListAfter trimming
  var elemListAfterTrim = [];
  
  for(var ind1 = 0; ind1 < elemList.length; ind1++) {
    elemListAfterTrim.push(elemList[ind1].trim());
  }

  var elemListAfterTrimAndSpacing = [];
  
  for(var ind2 = 0; ind2 < elemListAfterTrim.length; ind2++) {
    
    var helperArray = elemListAfterTrim[ind2].split(' ');
    
    for(var ind3 = 0; ind3 < helperArray.length; ind3++) {
      theStringObj.push(helperArray[ind3]);
    }
  }
  
  //track indices of elements having '(' & ')'
  
  var lElems = [];
  var rElems = [];
  
  for(var ind4 = 0; ind4 < theStringObj.length; ind4++) {
    if(theStringObj[ind4].indexOf('(') != -1) {
      lElems.push(ind4);
    } else if(theStringObj[ind4].indexOf(')') != -1) {
      rElems.push(ind4);
    }
  }
  
  //fetch children
  for(var ind5 = 0; ind5 < lElems.length; ind5++) {
    
    var kid = theStringObj.slice(lElems[ind5], 1+rElems[ind5]);
    
    var cQObj = atomicQueryToObj(kid);
    
    children.push(cQObj);
    
    for(var ind6 = 0; ind6 < kid.length; ind6++) {
      var elemIndex = theStringObj.indexOf(kid[ind6]);
      
      //delete the item in theStringObj
      delete theStringObj[elemIndex];
    }
    
  }
  
  var finalStringObj = [];
  
  for(var ind7 = 0; ind7 < theStringObj.length; ind7++) {
    if(theStringObj[ind7] !== undefined)
      finalStringObj.push(theStringObj[ind7]);
  }
  
  var pQObj = atomicQueryToObj(finalStringObj);
  
  //theQueryObject.unshift(pQObj);

  result.fields = pQObj.fields;
  result.name = pQObj.name;
  result.children = children;
  
  callback(result);
}

function atomicQueryToObj(kid) {    
    
    //create children query
    var childQueryObj = {};
    
    var childQueryFields = kid.slice(1, kid.length-1);
    var childQueryTable = kid[kid.length-1].split(')')[0];
    
    //temporarily set fields in lowerCase
    var childQueryFieldsLower = [];
    
    for(var indd1 = 0; indd1 < childQueryFields.length; indd1++) {
      childQueryFieldsLower.push(childQueryFields[indd1].toLowerCase());
    }
    
    //skip from clause
    var fromIndex = childQueryFieldsLower.indexOf("from");
    childQueryFields = childQueryFields.slice(0, fromIndex);
    
    //set children query
    childQueryObj.fields = childQueryFields;
    childQueryObj.name = childQueryTable;
    
    return childQueryObj;  
}

module.exports.convert = convert;