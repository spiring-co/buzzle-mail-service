const Mustache = require("mustache");

var template = "<div> <b> {{name}}</b>{{title}}</div>";

var data = {
  name: "joh jaob",
  title: "cEO",
};

Mustache.render(template, data);
