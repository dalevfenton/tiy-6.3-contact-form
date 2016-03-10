var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var handlebars = require('handlebars');

//==============================================================================
//                        Templates
//==============================================================================
var formTem = require('../templates/formtemplate.handlebars');
var contactsTem = require('../templates/contactlist.handlebars');
var contactTem = require('../templates/contact.handlebars');
var searchTem = require('../templates/search.handlebars');
//==============================================================================
//                        Models
//==============================================================================

var ContactModel = Backbone.Model.extend({
  idAttribute: '_id'
});


var ContactCollection = Backbone.Collection.extend({
  model: ContactModel,
  url: 'http://tiny-lasagna-server.herokuapp.com/collections/pizzaContacts'
});

// ==============================================================================
//                        Views
// ==============================================================================
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
    this.$el.html(formTem({}));
    return this;
  },
  formSubmission: function(event){
    event.preventDefault();
    var contactData = this.$el.serializeArray().reduce(function(acum, i) {
      acum[i.name] = i.value;
      return acum;
    }, {});
    this.collection.create(contactData);
    this.render();
  }
});

var ContactListItemView = Backbone.View.extend({
  tagName: "div",
  className: "table table-striped table-hover contact-table",
  template: contactsTem,
  events: {
    // "add this.collection": "render",
    // "destroy this.collection": "render"
  },
  initialize: function() {
    this.listenTo(this.collection, 'add', this.renderChild );
  },
  renderChild: function(contact){
    var newChildView = new ContactView({ model: contact});
    this.$el.find('.list-holder').append( newChildView.render().el );
  },
  render: function() {
    this.$el.html( this.template( {} ) );
    return this;
  }
});

var ContactView = Backbone.View.extend({
  tagName: "div",
  className: "contact-holder",
  template: contactTem,
  events: {
    "click .delete-contact": "delete-contact",
    "click .edit-contact": "edit-contact",
    "click .cancel-edit": "close-edit",
    "click .submit-contact-edit": "submit-edit",
    "submit": "do-edit-contact"
  },
  "close-edit": function(event){
    event.preventDefault();
    this.render();
  },
  "do-edit-contact": function(event){
    event.preventDefault();
    var contactData = $(event.target).serializeArray();
    var update = {};
    $.each(contactData, function(index, prop){
      update[ prop.name ] = prop.value;
    });
    this.model.save( update );
    this.render();
  },
  "submit-edit": function(event){
    this.$el.find(".contact-edit").trigger('submit');
  },
  "delete-contact": function(){
    this.model.destroy();
    this.remove();
  },
  "edit-contact": function(){
    var atts = _.clone(this.model.attributes);
    delete atts._id;
    atts.edit = 'true';
    this.$el.html( this.template( atts ));
  },
  hide: function(){
    console.log('inside hide function');
  },
  render: function( ){
    var atts = _.clone(this.model.attributes);
    delete atts._id;
    atts.filler = 'true';
    this.$el.html( this.template( atts ) );
    return this;
  }
});

var SearchView = Backbone.View.extend({
    tagName: "form",
    id: "contacts-search",
    className: "navbar-form navbar-center",
    role: "search",
    events: {
      "keyup input": "filter"
    },
    filter: function(event){
      var searchTerm = event.currentTarget.value;
      var models = this.collection.filter( function(contact){
        var atts = contact.omit( '_id');
        var valid = false;
        // console.log(contact);
        $.each(atts, function(prop, obj, index){
          if(obj.indexOf(searchTerm) > -1){
            valid = true;
          }
        });
        return valid;
      });
      console.log(models);
      console.log(this.collection);
      var model = this.collection.get(models[0]);
      console.log(model);
      // model.hide();

      //this is an instance of a model object, why can't we call a method on it?
      // model.hide();
    },
    initialize: function(){
      this.render();
    } ,
    render: function(){
      this.$el.html( searchTem( { } ));
      return this;
    }
});



//==============================================================================
//                       Execution
//==============================================================================

//instantiate a new collection
var contacts = new ContactCollection();

//insert Main Input Form Into Page
var formView = new ContactFormView( { collection: contacts });
$('.contact-form-container').html(formView.render().el);

//insert Contact List Holder
var contactView = new ContactListItemView( { collection: contacts });
$('.contact-table-container').html(contactView.render().el);

//insert Search / Filter Bar
var searchView = new SearchView( { collection: contacts });
$('.contact-list-container').prepend( searchView.render().el );

//fetch contacts from tiny-lasagna-server
contacts.fetch().done(function(){
});
