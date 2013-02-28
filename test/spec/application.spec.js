(function() {


    describe("Application", function () {
        it("creates a global namespace called Lizard", function() {
            expect(Lizard).to.be.an("object");
        });
    });

    describe("Lizard.Models", function() {
        it("creates a global namespace Lizard.Models", function() {
            expect(Lizard.Models).to.be.an("object");
        });
    });


    describe("Lizard.Models.Filter", function() {
        it("creates a global variable of the function Lizard.Models.Filter", function() {
            expect(Lizard.Models.Filter).to.be.a("function");
        });
    });

    describe("Lizard.Models.Location", function() {
        it("creates a global variable of the function Lizard.Models.Location", function() {
            expect(Lizard.Models.Location).to.be.a("function");
        });
    });

    describe("Lizard.Models.Parameter", function() {
        it("creates a global variable of the function Lizard.Models.Parameter", function() {
            expect(Lizard.Models.Parameter).to.be.a("function");
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

    describe("Lizard.Map.LeafletView", function() {
        it("creates a Lizard.Map.LeafletView", function() {
            expect(Lizard.Map.LeafletView).to.be.a("function");
        });
    });

    describe("Lizard.Map.Leaflet", function() {
        it("creates an instance of LeafletView", function() {
            expect(Lizard.Map.LeafletView).to.be.an("object");
        });
    });

    describe("filtercollectionview", function() {
        it("checks if filtercollectionview is instantiated", function() {
            expect(filtercollectionview instanceof Lizard.Views.FilterCollection).to.be(true);
        });
    });
    
    describe("locationCollection", function() {
        it("checks if locationCollection is instantiated", function() {
            expect(locationCollection instanceof Lizard.Collections.Location).to.be(true);
        });
        describe('#models', function(){
            it("should show models to be an instance of Lizard.Models.Location", function(){
                for (var i in locationCollection.models){
                expect(locationCollection.models[i] instanceof Lizard.Models.Location).to.be(true);
                }
            });
            describe('#point_geometry', function(){
                it("should show point_geometry to be an Array", function(){
                for (var i in locationCollection.models){
                    var model = locationCollection.models[i]
                expect(model.attributes.point_geometry instanceof Array).to.be(true);
                }
                });
                    describe('#point_geometry.length', function(){
                        it("should be an Array of length 2", function(){
                            for (var i in locationCollection.models){
                                var model = locationCollection.models[i]
                            expect(model.attributes.point_geometry.length === 2).to.be(true);
                            }
                        
                    });
                });
            });
        });
    });

    describe("filterCollection", function() {
        it("checks if filterCollection is instantiated", function() {
            expect(filterCollection instanceof Lizard.Collections.Filter).to.be(true);
        });
        describe('#models', function(){
            it("should show models to be an instance of Lizard.Models.Filter", function(){
                for (var i in filterCollection.models){
                expect(filterCollection.models[i] instanceof Lizard.Models.Filter).to.be(true);
                }
            });
        });
    });
    
    describe("workspaceCollection", function() {
        it("checks if workspaceCollection is instantiated", function() {
            expect(filterCollection instanceof Lizard.Collections.Workspace).to.be(true);
        });
        describe('#models', function(){
            it("should show models to be an instance of Lizard.Models.Workspace", function(){
                for (var i in workspaceCollection.models){
                expect(workspaceCollection.models[i] instanceof Lizard.Models.Workspace).to.be(true);
                }
            });
        });
    });
    
    describe("timeseriesCollection", function() {
        it("checks if timeseriesCollection is instantiated", function() {
            expect(timeseriesCollection instanceof Lizard.Collections.Timeseries).to.be(true);
        });
        describe('#models', function(){
            it("should show models to be an instance of Lizard.Models.Timeseries", function(){
                for (var i in timeseriesCollection.models){
                expect(timeseriesCollection.models[i] instanceof Lizard.Models.Timeseries).to.be(true);
                }
            });
            describe("#events", function(){
            it("checks if a timeserie model has events", function() {
                for (var i in timeseriesCollection.models){
                    var model = timeseriesCollection.models[i];
                    var events = model.attributes.events;
                  expect(events === String).to.be(true);
                }
              });
            });
        });
    });

})();


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
