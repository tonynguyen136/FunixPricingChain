const main = artifacts.require("Main");
const session = artifacts.require("Session");
let mainInstance;
let sessionInstance;
let mainContractAddress;
const zero_address = "0x0000000000000000000000000000000000000000";

contract("Main Contract", function(accounts){
    let txParams;
    before(async function(){
        mainInstance = await main.deployed();
        mainContractAddress = mainInstance.address; // address of maincontract
        txParams = { from: accounts[0]};
    });

    /**
     * ===========================================================
     * Test case #0: Contract Development!!!! - Main & Session Contract
     * ===========================================================
     */
    describe("Contract deployment", function(){
        // Main contract deployment
        it("Main contract deployment", function(){
            assert(mainInstance !== undefined, "Contract should be defined!");
        });
        // Admin can deploy a session contract
        it("Admin can deploy a Session contract", async function(){
            sessionInstance = await session.new(
                mainContractAddress,
                "Red Hat",
                "This hat for summer to protect our head!",
                "ipfs://example",
                txParams
            );
            assert(sessionInstance !== undefined, "Session contract should be deployed by admin!");
        });
        
    });

    /**
     * ===========================================================
     * Test case #1: enter paticipant Informaiton - Main Contract
     * ===========================================================
     */
    describe("Enter paticipant Informaiton", function(){
        // Enter participant 0, 1,2,3,4 to the dapp
        it("Enter participants", function(){
            return mainInstance.enterParticipant("Admin", "admin@gmail.com",{from: accounts[0]})
            .then(function(){
                return mainInstance.enterParticipant("Nguyen Van A", "A@gmail.com",{from: accounts[1]})
                .then(function(){
                    return mainInstance.enterParticipant("Nguyen Van B", "B@gmail.com",{from: accounts[2]})
                    .then(function(){
                        return mainInstance.enterParticipant("Nguyen Van C", "C@gmail.com",{from: accounts[3]})
                        .then(function(){
                            return mainInstance.enterParticipant("Nguyen Van D", "D@gmail.com",{from: accounts[4]})
                        });
                    });
                });
            });
        }); // close it
        // Negative-test: Should not allow Account exists!
        it("Should not allow account exists!", function(){
            return mainInstance.enterParticipant("A Nguyen", "A@gmail.com",{from: accounts[1]})
            .then(function(){
                throw("Failed to enter information again!");
            }).catch(function(err){
                if(err == "Failed to enter information again!"){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });
        // Negative-test: Should not allow enterParticipant without input
        it("Should not allow entered without input", function(){
            return mainInstance.enterParticipant({from: accounts[1]})
            .then(function(){
                throw("Failed to enter information without input");
            }).catch(function(err){
                if(err == "Failed to enter information without input"){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });


    });// close describe

     /**
     * ===========================================================
     * Test case #2: Update Participant By Admin - Main Contract
     * ===========================================================
     */
    describe("Update participant Information by admin", function(){
        // Admin can update all participant information again if needed
        it("Admin can update all participant information again", function(){
            return mainInstance.updateParticipantByAdmin(
                accounts[1],
                "Le Van A",
                "A@gmail.com",
                0,
                0,
                {from: accounts[0]}
            ).then(function(){
                return mainInstance.participantDetails(accounts[1])
                .then(function(result){
                    assert.equal(result.name,"Le Van A","Should be a correct name!");
                });
            });
        });
        // Negative Test:  Should not allow non-admin can update all
        it("Should not allow non-admin can update all", function(){
            return mainInstance.updateParticipantByAdmin(
                accounts[1],
                "Le Van A",
                "A@gmail.com",
                0,
                0,
                {from: accounts[1]}
            ).then(function(){
                throw("Failed to update all information from non-admin");
            }).catch(function(err){
                if(err == "Failed to update all information from non-admin"){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });
        // Negative Test: Can not update accounts who not exists!
        it("Admin can not update accounts who not exists", function(){
            return mainInstance.updateParticipantByAdmin(
                accounts[8],
                "Le Van 8",
                "A8@gmail.com",
                0,
                0,
                {from: accounts[0]}
            ).then(function(){
                throw("Failed to update information for non-participant");
            }).catch(function(err){
                if(err == "Failed to update information for non-participant"){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });

    });// close describe

     /**
     * ===========================================================
     * Test case #3: Update Participant By User - Main Contract
     * ===========================================================
     */
     describe("Update Information by User", function(){
        // User updates their name and email
        it("User can update their information", function(){
            return mainInstance.updateParticipantByUser(
                "Nguyen Van A",
                "A@gmail.com",
                {from: accounts[1]}
            ).then(function(){
                return mainInstance.participantDetails(accounts[1])
                .then(function(result){
                    assert.equal(result.name,"Nguyen Van A","Should be a correct name!");
                });
            });
        });
        // Negative-Test: Non-Participant can not update information
        it("Should not allow to update information from Non-participant", function(){
            return mainInstance.updateParticipantByUser(
                "Le Van 8",
                "A8@gmail.com",
                {from: accounts[8]}
            ).then(function(){
                throw("Failed to update information from non-participant");
            }).catch(function(err){
                if(err == "Failed to update information from non-participant"){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });

     }); // close describe

       /**
     * ===========================================================
     * Test case #4: Update product infor  - Session Contract
     * ===========================================================
     */
    // describe("Update product Information by Admin", function(){
    //     // Admin can update product information
    //     // This action is only avaible in CREATED state
    //     it("Admin can update product information", function(){
    //         return sessionInstance.state().then(function(state){
    //             assert.equal(state, session.State.CREATED, "Should be in CREATED state");
    //         }).then(function(){
    //             return sessionInstance.updateProductInfo(
    //                 "Red Hat 1",
    //                 "This hat for summer to protect our head!",
    //                 "ipfs://example1",   
    //                 {from:accounts[0]}
    //             ).then(function(){
    //                 return sessionInstance.getProductInfo().then(function(result){
    //                     //console.log(result);
    //                     assert.equal(result[0], "Red Hat 1", "productName should be correct");
    //                     assert.equal(result[1], "This hat for summer to protect our head!", "productDescription should be correct!");
    //                     //console.log(result[2]);
    //                 });
    //             });
    //         });
    //     }); // close it
        // // Non-admin can not update product information
        // it("Non-admin can not update product information", function(){
        //     return sessionInstance.updateProductInfo(
        //         "Red Hat 1",
        //         "This hat for summer to protect our head!",
        //         "ipfs://example1",   
        //         {from:accounts[1]}
        //     ).then(function(){
        //         throw("Fail to update product information by non-admin");
        //     }).catch(function(err){
        //         if(err == "Fail to update product information by non-admin" ){
        //             assert(false);
        //         }else{
        //             assert(true);
        //         }
        //     });
        // });
        
    //}); // close describe


     /**
     * ===========================================================
     * Test case #5: Register from session contract - Session Contract
     * ===========================================================
     */
    describe("Register", function(){
        // Admin can register participants who are legal for pricing products
        it("Admin can register participants!", function(){
            // Admin registers participant 1
            return sessionInstance.register(accounts[1], {from: accounts[0]})
            .then(function(){
                // Admin registers participant 2
                return sessionInstance.register(accounts[2], {from: accounts[0]});
            }).then(function(){
                // Admin registers participant 3
                return sessionInstance.register(accounts[3], {from: accounts[0]});
            }).then(function(){
                // Admin registers participant 4
                return sessionInstance.register(accounts[4], {from: accounts[0]});
            }).then(function(result){
                // check status of the function implemented
                assert.equal(result.receipt.status, true);
            });
        });
        // Register is only available in CREATED state
        it("Register is only available in CREATED state", function(){
            return sessionInstance.state().then(function(state){
                assert.equal(state, session.State.CREATED, "Should be CREATED state");
            });
        });

         // Negative-Test: Non-Admin can not register participants
         it("Non-Admin can not register participants", function(){
            return sessionInstance.register(accounts[9], {from: accounts[1]})
            .then(function(){
                throw("Failed to register participants by non-admin");
            }).catch(function(err){
                if(err === "Failed to register participants by non-admin"){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });
        // Negative-Test: Participants already joined can not register again
        it("Participants already joined can not register again", function(){
            return sessionInstance.register(accounts[1],{from: accounts[0]})
            .then(function(){
                throw("Failed to register for address who has joined!");
            }).catch(function(err){
                if(err == "Failed to register for address who has joined!"){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });
        // Negative-Test: Should not allow to register with no input
        it("Should not allow to register with no input", function(){
            return sessionInstance.register({from: accounts[0]})
            .then(function(){
                throw("Failed to register participants without input!");
            }).catch(function(err){
                if(err == "Failed to register participants without input!"){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });
        // Negative-Test: Should not allow to register with address 0
        it("Should not allow to register with address 0", function(){
            return sessionInstance.register(zero_address,{from: accounts[0]})
            .then(function(){
                throw("Failed to register participants with address 0!");
            }).catch(function(err){
                if(err == "Failed to register participants with address 0!"){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });
    });// close describe

     /**
     * ===========================================================
     * Test case #6: Start a pricing session - Session Contract
     * ===========================================================
     */
    describe("Start a Pricing Session", function(){
        
        // Admin can start a pricing session and the state is changed to "STARTED"

        it("Admin can start a pricing session", function(){
            return sessionInstance.state().then(function(state){
                assert.equal(state, session.State.CREATED, "Should be in CREATED state");
            }).then(function(){
                return sessionInstance.startPricingSession({from: accounts[0]})
                .then(function(){
                return sessionInstance.state().then(function(state){
                    assert.equal(state, session.State.STARTED, "The state shoud be changed to STARTED");
                });
              });
            });


        });

        // Negative-Test: Non-Admin can not start a pricing session 
        it("Non-Admin can not start a pricing session", function(){
            return sessionInstance.startPricingSession({from:accounts[1]})
            .then(function(){
                throw("Failed to start a pricing session from non-Admin");
            }).catch(function(err){
                if(err == "Failed to start a pricing session from non-Admin" ){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });

    });// close describe

     /**
     * ===========================================================
     * Test case #7: Price a product - Session Contract
     * ===========================================================
     */
    describe("Price a product", function(){
        // This action is only available in STARTED state
        // All participants who has registered can price a product
        it("Participants can price a product", function(){
            return sessionInstance.state().then(function(state){
                assert.equal(state, session.State.STARTED, "Should be in STARTED State!");
            }).then(function(){
                return sessionInstance.priceProduct(1000, {from:accounts[1]});
            }).then(function(){
                return sessionInstance.priceProduct(2000,{from: accounts[2]});
            }).then(function(){
                return sessionInstance.priceProduct(3000, {from: accounts[3]});
            });
        });
        // Allow any participant can price a product many times if session not ended
        it("Allow any participnat can price many times", function(){
            return sessionInstance.priceProduct(1500, {from: accounts[1]})
            .then(function(result){
                assert.equal(result.receipt.status, true);
            });
        });

        // Negative Test: Should Not allow an account who has not been registered
        it("Should not allow an account who has not been registered", function(){
            return sessionInstance.priceProduct(1000, {from: accounts[8]})
            .then(function(){
                throw("Fail to price a product from an account who has not been registered!");
            }).catch(function(err){
                if(err == "Fail to price a product from an account who has not been registered!" ){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });
        // Negative Test: Should bot allow admin to price a product
        it("Should not allow admin to price a product", function(){
            return sessionInstance.priceProduct(1000, {from: accounts[0]})
            .then(function(){
                throw("Fail to price a product by admin");
            }).catch(function(err){
                if(err == "Fail to price a product by admin"){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });
        // Negative Test: Should not allow no input for pricing a product
           it("Should not allow no input for pricing a product", function(){
            return sessionInstance.priceProduct({from: accounts[0]})
            .then(function(){
                throw("Failed to price a product with no input!");
            }).catch(function(err){
                if(err == "Failed to price a product with no input!"){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });

    });// close describe

    /**
     * ===========================================================
     * Test case #8: Close a pricing session - Session Contract
     * ===========================================================
     */

    describe("Close a pricing Session", function(){
        // Admin can close a pricing session, this action is only availabe in STARTED State
        it("Close a pricing Session", function(){
            return sessionInstance.state().then(function(state){
                assert.equal(state, session.State.STARTED, "Should be in Started State");
            }).then(function(){
                return sessionInstance.closePricingSession({from: accounts[0]})
                .then(function(){
                    return sessionInstance.state().then(function(state1){
                        // After close a pricing session the state is changed to Closing State
                        assert.equal(state1, session.State.CLOSING, "Should be in Closing State");
                    });
                });
            });
        });

         // Negative Test: Non-Admin can not close a pricing session
         it("Non-admin can not close a pricing session", function(){
            return sessionInstance.closePricingSession({from: accounts[1]})
            .then(function(){
                throw("Fail to close a pricing session by non-admin");
            }).catch(function(err){
                if(err == "Fail to close a pricing session by non-admin"){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });

    });// close describe

     /**
     * ===========================================================
     * Test case #9: calculate a proposed price - Session Contract
     * ===========================================================
     */
    describe("Calculate a proposed price", function(){
        // Only admin can calculate a proposed price after closing a session
        // This action is only available in CLOSING state
        it("Only admin can calculate a proposed price", function(){
            return sessionInstance.state().then(function(state){
                //console.log(state);
                assert.equal(state, session.State.CLOSING, "Should be in CLOSING state");
            }).then(function(){
                return sessionInstance.calculateProposedPrice({from: accounts[0]})
                .then(function(){
                    return sessionInstance.proposedPrice().then(function(result){
                        //console.log(result);
                        // Check the proposed price from function calculated vs manual
                        assert.equal(result, 2166 , "Should be equal by manual calculation")
                    });
                });
            });

        });
        // Negative-Test: Non-Admin can not calculate the proposed price
        it("Non-Admin can not calculate the proposed price", function(){
            return sessionInstance.calculateProposedPrice({from:accounts[1]})
            .then(function(){
                throw("Fail to calculate a proposed price by non-admin");
            }).catch(function(err){
                if(err == "Fail to calculate a proposed price by non-admin"){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });

    });// close describe

    /**
     * ===========================================================
     * Test case #10: Set final Price and calculate deviation of participants - Session Contract
     * ===========================================================
     */

    describe("Set final price & calculate deviation", function(){
        // Admin can calculate a deviation of each participant. 
        it("Calculate deviaition by admin", function(){
            // This action is only available in CLOSED state
            return sessionInstance.state().then(function(state){
                assert.equal(state, session.State.CLOSED, "Should be in CLOSED state!");
            }).then(function(){
                return sessionInstance.calculateDeviation(2166,{from: accounts[0]})
                .then(function(){
                    return sessionInstance.getSessionParticipant(0)
                    .then(function(result){
                        // console.log(result);
                        // console.log("=============================");
                        // console.log(result.newDeviation);
                        // check deviation from participant 0
                        assert.equal(result[0], accounts[1], "participantAddress should be equal accounts 1");
                        assert.equal(result[1], 1500, "participantPrice should be equal to 1500");
                        assert.equal(result[2], 30, "newDeviation should be equal to 30");
                    }).then(function(){
                        return mainInstance.getAParticipant(accounts[1])
                        .then(function(result){
                            //console.log(result);
                            // check updated deviation of participant from main contract
                            assert.equal(result[4], 15, "deviation should be equal to 15");
                        });
                    });
                });       
            });
        });
        // Negative-test: Non-admin can not calculate deviation
        it("Non-admin can not calculate deviation", function(){
            return sessionInstance.calculateDeviation(2166,{from: accounts[1]})
            .then(function(){
                throw("Failed to calculate deviation from non-admin");
            }).catch(function(err){
                if(err == "Failed to calculate deviation from non-admin"){
                    assert(false);
                }else{
                    assert(true);
                }

            });
        });
        
    }); // close describe

  
}); // close contract