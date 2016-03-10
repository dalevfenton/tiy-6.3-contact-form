var $ = require('jquery');
var Backbone = require('backbone');
var handlebars = require('handlebars');
var dummyinfo = [
  { "first-name": "Dale", "last-name": "Fenton", "email":"test@test.com", "phone": "867-5309", "twitter": "@soso", "linked-in":"hire me" },
  { "first-name": "Grayson", "last-name": "Hicks", "email":"test@test.com", "phone": "867-5309", "twitter": "@soso", "linked-in":"hire me"}
];

//==============================================================================
//                        Templates
//==============================================================================
var formTem = require('../templates/formtemplate.handlebars');
var contactsTem = require('../templates/contactlist.handlebars');

//==============================================================================
//                        Models
//==============================================================================

var ContactModel = Backbone.Model.extend({
  initialize: function(){
    // this.name = (config.name || '' );
    console.log("model made");
  }
});


var ContactCollection = Backbone.Collection.extend({
  model: ContactModel,
   }
);


//==============================================================================
//                        Views
//==============================================================================

var ContactListItemView = Backbone.View.extend({
  el: '.contact-table-container',
  tagName: "table",
  className: "table table-striped table-hover contact-table",
  events: {
    "add this.collection": "render",
    "click .delete": "clear"
    // "click .contact-list-items": "open",
    // "click .contact-list-items.edit": "openEditDialog",
    // "click .contact-list-items.delete": "destroy"
  },
  initialize: function() {
    this.render();
  },
  render: function() {
    $(this.el).html(contactsTem( this.collection.toJSON()));
    this.listenTo(this.collection, 'add', this.render);
    this.delegateEvents();
  },
  clear: function(event) {
    event.preventDefault();
    console.log('event', event);
    console.log(this);
    console.log('delete');
		}
});

var ContactFormView = Backbone.View.extend({
  tagName: "form",
  className: "contact-form form-horizontal",
  events: {
    "submit": "formSubmission"
  },
  initialize: function() {
    this.render();
  },
  render: function() {
    $('.contact-form-container').html(this.$el.html(formTem({})));
  },
  formSubmission: function(event){
    event.preventDefault();
    var contactData = this.$el.serializeArray().reduce(function(acum, i) {
      acum[i.name] = i.value;
      return acum;
    }, {});
    console.log(contactData);
    this.collection.add(contactData);
    console.log(this.collection);
  }
});
var contacts = new ContactCollection();
var formView = new ContactFormView( { collection: contacts });
var contactView = new ContactListItemView( { collection: contacts });
