const test = require('tape') // assign the tape library to the variable "test"
const sinon = require("sinon");
const { default: axios } = require('axios');

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


class Person {
  constructor({name, age, gender, country}) {
    this.name = name
    this.age = age
    this.gender = gender
    this.country = country
  }
}


/**
 * This is the object we will be testing in various ways
 * (This would usually be defined in a different file in your production
 * code, however it is here in this example for simplicity)
 */
class API {
  constructor() {
    this.person = new Person()
  }
  
  async getPerson() {
    console.log("Getting person, please wait...")
    const personInfo = await axios.get("https://randomuser.me/api/").data.results[0]
    this.person.name = `${personInfo.name.first} ${personInfo.name.last}`
    this.person.age = personInfo.age
    this.person.gender = personInfo.gender
    this.person.country = personInfo.location.country
  }
}


/** In tape their are no test groups. These groups are defined by the file I guess */
