SQLiteStorageService = function () {
    var service = {};
    var db = window.sqlitePlugin ?
        window.sqlitePlugin.openDatabase({name: "demo.toptal", location: "default"}) :
        window.openDatabase("demo.toptal", "1.0", "DB para FactAV", 5000000);

    service.initialize = function() {

        var deferred = $.Deferred();
        db.transaction(function(tx) {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS projects ' +
                '(id integer primary key, name text, company text, description text, latitude real, longitude real)'
            ,[], function(tx, res) {
                tx.executeSql('DELETE FROM projects', [], function(tx, res) {
                    deferred.resolve(service);
                }, function(tx, res) {
                    deferred.reject('Error initializing database');
                });
            }, function(tx, res) {
                deferred.reject('Error initializing database');
            });
        });
        return deferred.promise();
    }

    service.getProjects = function() {
    	var deferred = $.Deferred();

        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM projects', [], function(tx, res) {

                var projects = [];
                console.log(res.rows.length);
                for(var i = 0; i < res.rows.length; i++) {
                    var project = { name: res.rows.item(i).name, company: res.rows.item(i).company, description: res.rows.item(i).description };
                    if (res.rows.item(i).latitude && res.rows.item(i).longitude) {
                        project.location = {
                            latitude: res.rows.item(i).latitude,
                            longitude: res.rows.item(i).longitude
                        }
                    }
                    projects.push(project);
                }
                deferred.resolve(projects);

            }, function(e) {
                deferred.reject(e);
            });
        });
        return deferred.promise();
    }

    service.addProject = function(name, company, description, addLocation) {
        var deferred = $.Deferred();
        console.log(db);
        if (addLocation) {
            navigator.geolocation.getCurrentPosition (
                function(position) {
                    var lat = position.coords.latitude;
                    var lon = position.coords.longitude;

                    db.transaction(
                    	function(tx) {
                            tx.executeSql('INSERT INTO projects (name, company, description, latitude, longitude) VALUES (?,?,?,?,?)',
                                [name, company, description, lat, lon],
                                function(tx, res)
                            {
                                console.log('success');
                                deferred.resolve();
                            }, function(e)
                            {
                                console.log('failure');
                                deferred.reject('Error posting a new project');
                            });
                        },
                        function() {
                            deferred.reject('Error during save process. ');
                        }
                    );
                },
                function() {
                    deferred.reject(
                            'We could not fetch your current location. ' +
                            'Please try again or post a project without adding a location');
                },
                {maximumAge: 60000, timeout: 5000, enableHighAccuracy: true}
            );
        } else {
            db.transaction(function(tx) {
                tx.executeSql('INSERT INTO projects (name, company, description) VALUES (?,?,?)', [name, company, description], function(tx, res) {
                    deferred.resolve();
                }, function(e) {
                    deferred.reject(e);
                });
            });
        }
        return deferred.promise();
    }

    return service.initialize();
}
