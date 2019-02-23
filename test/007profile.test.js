const expect = require("chai").expect;
const request = require("supertest");
const  app  = require("../server");

const validUserData = require('../test/test_common');

const validateProfileInput = require('../validation/profile');

const lognString = "Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";

validLoginData = {
    email:"test@hashcorp.com",
    password:"123456"
}

describe("007 Requirements for getting current User's Profile",()=>{
    before(done =>{
        if(global.JwtToken){
            done();
        } else{
            done(new Error("User did not login! JWT TOKEN not set. Aborting"));
        }
    });
    context("Getting user's profile is invalid if...", () => {
        it("Get request does not contain JWT bearer token", done => {
          request(app)
            .get("/api/profile")
            .set("Accept", "application/json")
            .expect(401)
            .end(err => {
              if (err) return done(err);
              done();
            });
        });
        it("JWT bearer token is invalid/Unauthorized access", done => {
          request(app)
            .get("/api/profile")
            .set(
              "Authorization",
              "bearer JGKHJVGFGjfjgfFHGFJVkjmghfut75567465edcfDYHFFD"
            )
            .set("Accept", "application/json")
            .expect(401)
            .end(err => {
              if (err) return done(err);
              done();
            });
        });
        // it("Get request does not contain JWT bearer token");
    });
});

describe("Profile validation",()=>{
    before(done =>{
        done();
    });
    context("User's profile validation",()=>{
        it("Handle is omitted", () => {
            returnData = validateProfileInput({ ...validUserData, handle: "" });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("handle");
            expect(returnData.errors.handle).to.equal(
              "Profile handle is required"
            );
          });
      
          it("status field is omitted", () => {
            returnData = validateProfileInput({ ...validUserData, status: "" });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("status");
            expect(returnData.errors.status).to.equal(
              "Status field is required"
            );
          });
      
          it("Skills field is omitted", () => {
            returnData = validateProfileInput({
              ...validUserData,
              skills: ""
            });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("skills");
            expect(returnData.errors.skills).to.equal(
              "Skills field is required"
            );
          });
          it("validate website links", () => {
            returnData = validateProfileInput({ ...validUserData, website: "test" });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("website");
            expect(returnData.errors.website).to.equal(
              "Not a valid URL"
            );
          });
      
          
    })
})
//Sad path
describe("User's profile validation",()=>{
    before(done=>{
        done();
    });
    context("User's profile is valid if",()=>{
        it("All validators successfull",()=>{
          let  returnData = validateProfileInput({
            handle:'shaikh',
            status:'developer',
            skills:'testing',
            website:'www.facebook.com',
            youtube:'www.youtube.com',
            twitter:'www.twitter.com',
            facebook:'www.facebook.com',
            linkedin:'www.linkedin.com',
            instagram:'www.instagram.com'
          });
      expect(returnData.isValid).to.be.true;
      expect(returnData.errors).to.be.an("object").that.is.empty;
        })
    })
})

describe('profile api end points',()=>{
    before(done=>{
        done();
    });
    context('checking profile of the user',()=>{
        it('if there is no profile for the user',(done)=>{
            request(app)
            .get("/api/profile/handle/:handle")
            .send({email:'test@test.com',password:'123456'})
            // .set("Authorization", global.JwtToken)
            .set("Accept","application/json")
            .expect(200)
            .expect(response=>{
                // expect(response.body.user).to.be.a('object')
                expect(response.body).to.equal('There is no profile for this user');
                // expect(response.body.status).to.equal(404);
            })
            .end(err=>{
                if(err) return done(err);
                done();
            })
        })
    })
})