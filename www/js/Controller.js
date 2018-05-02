var Controller = function() {

    var controller = {
        self: null,
        initialize: function() {
            self = this;
            new SQLiteStorageService().done(function(service) {
                self.storageService = service;
                self.bindEvents();
                self.renderSearchView();
            }).fail(function(error) {
                alert(error);
            });

        },

        bindEvents: function() {
        	$('.tab-button').on('click', this.onTabClick);

        },

        onTabClick: function(e) {
        	e.preventDefault();
            if ($(this).hasClass('active')) {
                return;
            }

            var tab = $(this).data('tab');
            if (tab === '#add-tab') {
                self.renderPostView();
            } else {
                self.renderSearchView();
            }
        },

        renderPostView: function() {
            $('.tab-button').removeClass('active');
            $('#post-tab-button').addClass('active');

            var $tab = $('#tab-content');
            $tab.empty();
            $("#tab-content").load("./views/post-project-view.html", function(data) {
                $('#tab-content').find('#post-project-form').on('submit', self.postProject);
            });
        },


        postProject: function(e) {

            e.preventDefault();
            var name = $('#project-name').val();
            var description = $('#project-description').val();
            var company = $('#company').val();
            var addLocation = $('#include-location').is(':checked');

            if (!name || !description || !company) {
                alert('Please fill in all fields');
                return;
            } else {
                var result = self.storageService.addProject(
                    name, company, description, addLocation);

                result.done(function() {
                    alert('Project successfully added');
                    self.renderSearchView();
                }).fail(function(error) {
                    alert(error);
                });
            }
        },


        renderSearchView: function() {
            $('.tab-button').removeClass('active');
            $('#search-tab-button').addClass('active');

            var $tab = $('#tab-content');
            $tab.empty();

            var $projectTemplate = null;
            $("#tab-content").load("./views/search-project-view.html", function(data) {
                $('#addressSearch').on('click', function() {
                    alert('Not implemented');
                });

                $projectTemplate = $('.project').remove();

                var projects = self.storageService.getProjects().done(function(projects) {

                    for(var idx in projects) {
                        var $div = $projectTemplate.clone();
                        var project = projects[idx];

                        $div.find('.project-name').text(project.name);
                        $div.find('.project-company').text(project.company);
                        $div.find('.project-description').text(project.description);

                        if (project.location) {
                            var url =
                                '<a target="_blank" href="https://www.google.com.au/maps/preview/@' +
                                project.location.latitude + ',' + project.location.longitude + ',10z">Click to open map</a>';

                            $div.find('.project-location').html(url);
                        } else {
                            $div.find('.project-location').text("Not specified");
                        }

                        $tab.append($div);
                    }
                }).fail(function(error) {
                    alert(error);
                });
            });
        }
    }
    controller.initialize();
    return controller;
}
