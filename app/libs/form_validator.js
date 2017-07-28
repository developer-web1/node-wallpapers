/**
 * Custom node module for form validator.
 * 
 * @author WenZhe.
 */
var validator = require('validator'),
        functions = require('./functions');

var formValidator = new FormValidator();
module.exports = formValidator;

function FormValidator() {
  var errors = [];
  var fields = {};

  var validatorMessages = {
    required: "The {0} is required.",
    remote: "Please fix {0}.",
    email: "The {0} isn't valid address.",
    url: "The {0} isn't valid URL.",
    date: "The {0} isn't valid date.",
    dateISO: "The {0} isn't valid date ( ISO ).",
    number: "The {0} isn't valid number.",
    digits: "The {0} must be the only digits.",
    creditcard: "The {0} isn't valid credit card number.",
    equalTo: "The {0} must be the same value as the {1}.",
    maxlength: "The {0} must be entered no more than {1} characters.",
    minlength: "The {0} must be entered at least {1} characters.",
    rangelength: "The {0} must be entered a value between {1} and {2} characters long.",
    range: "The {0} must be entered a value between {1} and {2}.",
    max: "The {0} must be entered a value less than or equal to {1}.",
    min: "The {0} must be entered a value greater than or equal to {1}."
  }

  return {
    validate: function (formBody, options) {
      errors = [];
      fields = {};
      options.forEach(function (option) {
        var field = option.field;
        var label = option.label;
        var rules = option.rules;
        var value = formBody[field] ? formBody[field] : '';

        fields[field] = label;

        rules.forEach(function (rule) {
          var temp = rule.split("[");
          var params = [];
          if (temp.length > 1) {
            rule = temp[0];
            params = temp[1].substr(0, temp[1].length - 1).split(",");
          }

          switch (rule) {
            case 'require':
              if (validator.isEmpty(value)) {
                errors.push(functions.formatString(validatorMessages.required, label));
              }
              break;
            case 'email':
              if (!validator.isEmail(value)) {
                errors.push(functions.formatString(validatorMessages.email, label));
              }
              break;
            case 'minlength':
              if (!validator.isLength(value, {min: params[0]})) {
                errors.push(functions.formatString(validatorMessages.minlength, label, params[0]));
              }
              break;
            case 'equalTo':
              var target_value = formBody[params[0]] ? formBody[params[0]] : '';
              if (value !== target_value) {
                var target_label = fields[params[0]] ? fields[params[0]] : params[0];
                errors.push(functions.formatString(validatorMessages.equalTo, label, target_label));
              }
              break;
          }
        });
      });
      return errors.length === 0 ? true : false;
    },
    show_errors: function (output) {
      if (output === 'html') {
        return errors.join("<br/>")
      } else if (output === 'text') {
        return errors.join("\n");
      } else {
        return errors;
      }
    }
  };
}