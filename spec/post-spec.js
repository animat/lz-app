describe('Audio blog posts', function() {
  var loginEmailField = element(by.model("loginData.email"));
  var loginPassField = element(by.model("loginData.password"));
  var loginBtn = element(by.buttonText("Login"));
  
  var classPageBtn = element(by.xpath("//span[contains(@class, 'tab-title') and text() = 'Class page']/.."));
  var accountBtn = element(by.xpath("//span[contains(@class, 'tab-title') and text() = 'Account']/.."))
  
  function login(email, pass) {
    loginEmailField.sendKeys(email);
    loginPassField.sendKeys(pass);
    loginBtn.click();
  }
  function logout() {
    accountBtn.click();
    var btn = element(by.partialButtonText("Sign out"));
    if (btn.isPresent()) {
      btn.click();
    }
  }
  
  //var sampleData = require("./sample-data.json");
  
  beforeEach(function() {
    /*
    // TODO: Mocked data is not currently working.
    browser.addMockModule('linguazone.MockServices', function(sampleData) {
      angular.module('linguazone.MockServices', ['ngMockE2E'])
      .run(function($httpBackend) {
        $httpBackend.whenGET(new RegExp('templates\/.*')).passThrough();

        $httpBackend.whenPOST("http://localhost:3000/api/v2/auth/sign_in").respond(function() {
          //return [200, sampleData.signInResponse];
          var request = new XMLHttpRequest();
          request.open("GET", "./spec/sample-data.json", false);
          request.send(null);
          console.log("See me?! ",request);
          return [request.status, request.response, {}];
        })

        $httpBackend.whenGET("http://localhost:3000/api/v2/courses/*").respond(function() {
          return [200, sampleData.courseShowResponse];
        });

        $httpBackend.whenGET("http://localhost:3000/api/v2/students/*").respond(function() {
          return [200, sampleData.studentShowResponse];
        })
      });
    });*/
    browser.get('/#/app/login');
  });
  afterEach(function() {
    logout();
  });
  
  describe("test two", function() {
    it('should view the first post', function() {
      login("s1@example.com", "tester");
      classPageBtn.click();
      element(by.xpath("//ion-item[@ng-repeat='ap in available_posts']/a")).click();
      expect(element(by.binding("post.title")).getText()).toEqual("Record yourself");
    });
  });
  describe("test one", function() {
    it("should fill in the user's name", function() {
      login("s2@example.com", "tester");
      classPageBtn.click();
      element(by.xpath("//ion-item[@ng-repeat='ap in available_posts']/a")).click();
      expect(element(by.binding("user.info.display_name")).getText()).toEqual("Your name: Peter Dissinger");
    });
  });
});