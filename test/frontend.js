// Add a title comment so that you know what's happening and when
casper.test.comment('DDSC - Homepage');
 
// Setup any variables you may need. In this case we need a search term
var search_term = "";
 
// Start casper running on a web page, in this case the awesome
// duckduckgo seach engine.
casper.start('http://localhost/103_ddsc_marionette/app/#graphs', function () {
 
    // Check the title is "DDSC"
    this.test.assertTitle('DDSC', 'Homepage has the correct title');
 
    // Check if elements are available
    this.test.assertExists('#sidebar', 'Sidebar div is available');
    this.test.assertExists('#searchbox', 'Searchbox input is available');
    this.test.assertExists('#demo', 'Demo div input is available');

    // Log out what we are doing
    // casper.test.info("Populating search box with term: " + search_term);
 
    // Populate the seach box with a query
    // this.fill('#search_form_homepage', {
    //     'q': search_term
    // }, true);
 
    // Log out what we are doing
    // casper.test.info("Testing search...");
 
});
 
// After the form has been submitted and results shown
// casper.then(function () {
 
//     // Test we got results back from our search query
//     this.test.assertEval(function () {
//         return __utils__.findAll('div.results_links_deep').length > 10;
//     }, 'Returned search results for query');
 
// });
 
// Run the whole test suite (all the above)
casper.run(function () {
 
    // Confirm this test is done
    this.test.done();
 
});