MemoryStorageService = function () {
	var service = {};
	var projects = [
        { name: 'PHP Integrations Project', company: 'PHPStorm', description: 'Integrate our php application with eBay'},
        { name: 'Java Junior Developer', company: 'Apache', description: 'Java junior developer for web app maintenance'},
        { name: 'JavaScript Virtual DOM Expert', company: 'Google', description: 'JS expert to help us optimize our web app\'s performance' }
    ];

    service.getProjects = function() {
    	return projects.slice(0);
    }

    service.addProject = function(name, company, description, addLocation) {
    	var location = {};
    	var project = {
    		name: name,
    		company: company,
    		description: description
    	};

    	if (addLocation) {
    		navigator.geolocation.getCurrentPosition(
			    function(position) {
			        location.latitude = position.coords.latitude;
			        location.longitude = position.coords.longitude;
			    },
			    function() {
			    	alert('We couldn\'t fetch your current location');
			    }
			);
			project.loc = location;
    	}
    	projects.push(project);
    }

	return service;
}