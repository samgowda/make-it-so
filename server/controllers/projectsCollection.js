var db = require('../db/db.config');
var Project = require('../models/projectModel');

var Projects = new db.Collection();

Projects.model = Project;

module.exports = Projects;

