(function() {


    describe("Application", function () {
        it("creates a global namespace called Lizard", function() {
            expect(Lizard).to.be.an("object");
        });
    });

    describe("Lizard.models", function() {
        it("creates a global namespace Lizard.models", function() {
            expect(Lizard.models).to.be.an("object");
        });
    });


    describe("Lizard.models.Filter", function() {
        it("creates a global variable of the function Lizard.models.Filter", function() {
            expect(Lizard.models.Filter).to.be.a("function");
        });
    });

    describe("Lizard.models.Location", function() {
        it("creates a global variable of the function Lizard.models.Location", function() {
            expect(Lizard.models.Location).to.be.a("function");
        });
    });

    describe("Lizard.models.Parameter", function() {
        it("creates a global variable of the function Lizard.models.Parameter", function() {
            expect(Lizard.models.Parameter).to.be.a("function");
        });
    });


    describe("Lizard.Graphs", function() {
        it("creates a global namespace called Lizard.Graphs", function() {
            expect(Lizard.Graphs).to.be.an("object");
        });
    });


    describe("Lizard.Graphs.Router", function() {
        it("creates a global variable of the function Lizard.Graphs.Router", function() {
            expect(Lizard.Graphs.Router).to.be.a("function");
        });
    });


    describe("Lizard.Map", function() {
        it("creates a global namespace called Lizard.Map", function() {
            expect(Lizard.Map).to.be.an("object");
        });
    });

    describe("Lizard.Map.Router", function() {
        it("creates a global variable of the function Lizard.Map.Router", function() {
            expect(Lizard.Map.Router).to.be.a("function");
        });
    });



    // describe('Lizard.collections.Parameter - This works only for me (gijs) while testing Mocha!', function(){
    //   describe('count number of parameter models', function(){
    //     it('should be 322', function(done){
    //       var p = new Lizard.collections.Parameter();
    //       var l;
    //       p.fetch({
    //         success: function() {
    //             l = p.models.length;
    //             expect(l).to.be(322);
    //             done();
    //         }
    //       });
    //     });
    //   });
    // });









})();
