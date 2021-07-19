const test = require('tape') // assign the tape library to the variable "test"
const sinon = require("sinon")

/**
 * Explanations:
 * 
 * Fake:
 * An object with actual working functions / implementations that mimic the behaviour of the original object but
 * ends up with a result often using a shortcut. E.g. instead of actually accessing a database, a hashmap is used.
 * Cannot wrap an existing function (it's it own complete implementation)
 * 
 * Spy:
 * An object which registers the calls it receives.  It can wrap an existing function, but cant
 * change its functionality.
 * 
 * Stub:
 * Spy + it can change existing behaviour / hold predefined answers
 * 
 * Mock:
 * Stub + it pre-programs the expectations e.g.
 * var mk = sinon.mock(jQuery)
 * mk.expects("ajax").atLeast(2).atMost(5); 
 * 
 */


function sum (a, b) {
  return a + b
}

test('sum should return the addition of two numbers', function (t) {
    sinon.replace()
    
  t.equal(3, sum(1, 2)) // make this test pass by completing the add function!
  t.end()
});