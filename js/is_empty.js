// https://stackoverflow.com/questions/4994201/is-objectect-empty
// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

exports.isEmpty = function(object) {

  // null and undefined are "empty"
  if (object == null){
    return true;
  }

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (object.length > 0){
    return false;
  }
  if (object.length === 0){
    return true;
  }

  // If it isn't an objectect at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof object !== "object"){
    return true;
  }

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in object) {
      if (hasOwnProperty.call(object, key)){
        return false;
      }
  }

  return true;
};
