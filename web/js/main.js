Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

function viewModel() {
    var self = this;
    this.services = ko.observableArray('');
    this.categories = ko.observableArray('');
    this.filter = ko.observable('');
    this.search = ko.observable('');
    this.search_abstract = ko.observable(false);
    this.noSearch = ko.computed(function () {

    });

    this.filteredServices = ko.computed(function () {
        var search = this.search().toLowerCase();
        var filter = this.filter()[0];
        var search_abstract = this.search_abstract();
        if (!search) {
            if (filter == 'Category Filter') {
                return this.services();

            } else {

                return ko.utils.arrayFilter(this.services(), function (service) {
                    return service.category().includes(filter);
                });
            }
        } else {

            return ko.utils.arrayFilter(this.services(), function (service) {
                return service.name().toLowerCase().includes(search) ||
                    service.category().join('|').toLowerCase().includes(search) || 
                    (search_abstract && service.abstract().toLowerCase().includes(search));
            });
        }
    }, this);
}

$.getJSON('services.json', function (data) {
    $('#last_updated').text(data['last_updated']);
    services = data['services'];
    services.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
    categories = data['categories']
    categories.sort(function (a, b) {
        return a.localeCompare(b);
    })
    categories.insert(0, 'Category Filter');
    vm = new viewModel();
    ko.applyBindings(vm);
    ko.mapping.fromJS(categories, {}, vm.categories);
    ko.mapping.fromJS(services, {}, vm.services);
})

$('#clear').click(function () {
    vm.search('');
});