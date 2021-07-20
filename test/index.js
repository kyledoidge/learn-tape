const test = require('tape') // assign the tape library to the variable "test"
const sinon = require("sinon")
const fs = require("fs")
const path = require("path")
const { default: axios } = require('axios')

/**
 * Explanations:
 * 
 * Fake:
 * An object with actual working functions / implementations that mimic the behaviour of the original object but
 * ends up with a result often using a shortcut. E.g. instead of actually accessing a database, a hashmap is used.
 * Can but should NOT wrap an existing function (it's it own complete implementation)
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
  constructor({name, age, gender, country} = {}) {
    this.name = name
    this.age = age
    this.gender = gender
    this.country = country
  }
}


/**
 * This is the object we will be faking / mocking / stubbing in various ways
 * (This would usually be defined in a different file in your production
 * code, however it is here in this example for simplicity)
 * The actual function we are testing is: isPersonGrandpa() which tests if the person is an old male
 */
class API {
  constructor() {
    this.person = new Person()
  }
  
  async getPerson() {
    console.log("Getting person, please wait...")
    const personInfo = (await axios.get("https://randomuser.me/api/")).data.results[0]
    this.person.name = `${personInfo.name.first} ${personInfo.name.last}`
    this.person.age = personInfo.dob.age
    this.person.gender = personInfo.gender
    this.person.country = personInfo.location.country
    return this.person
  }
}


function isPersonGrandpa({name, age, gender, country}){
  return age >= 50 && gender === "male"
}

/** In tape their are no test groups. These groups are defined by the file I guess */


class FakeAPI {
  constructor() {
    this.person = new Person()
    this.personArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../assets/fake_data.json")))
  }
  
  // Nothign async going on, but used to mimic non fake API
  async getPerson() {
    console.log("FAKE: Getting person, please wait...")
    const randomIndex = Math.floor(Math.random() * this.personArray.length)
    const personInfo = this.personArray[randomIndex].results[0]
    this.person.name = `${personInfo.name.first} ${personInfo.name.last}`
    this.person.age = personInfo.dob.age
    this.person.gender = personInfo.gender
    this.person.country = personInfo.location.country
    return this.person
  }
}

// FAKE //
test("FAKE: should be classified as a grandpa when over 50 and male, and not when under 50 and female", async t => {
  /** We are going to fake the API. Instead of accessing a database from the API,
   *  we are going to create an array containing predefined data and choose one at random
   * */
  
  const api = new FakeAPI()
  // We have to declare to sinon that this is a fake if we want to record the information
  //(tbh we could use a spy here but fake is conceptually more correct)
  sinon.replace(api, "getPerson", sinon.fake(api.getPerson)) // Replace getPerson with itself wrapped in a fake (so we can register calls)
  const person = await api.getPerson()
  console.log(person)
  const isGrandpa = isPersonGrandpa(person)
  if (isGrandpa) {
    t.assert(person.age >= 50, "Grandpas must be 50 or over")
    t.assert(person.gender === "male", "Grandpas must be male")
  } else {
    t.assert(person.age < 50 || person.gender !== "male", "Non-Grandpas must be either under 50 or not male")
  }
})