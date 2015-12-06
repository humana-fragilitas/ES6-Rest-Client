module.exports = {
    
  "extends": "eslint:recommended",
    
  "ecmaFeatures": {
    "modules": true
  },
  
  "env": {
    "browser": true,
    "es6": true,
    "qunit": true
  },
  
  "rules": {
    "strict": 2,
    "no-underscore-dangle": 0,
    "quotes": [ 2, "single"],
    "arrow-body-style": [2, "always"],
    "arrow-parens": 2,
    "arrow-spacing": 2,
    "constructor-super": 2,
    "generator-star-spacing": 2,
    "no-arrow-condition": 2,
    "no-class-assign": 2,
    "no-const-assign": 2,
    "no-dupe-class-members": 2,
    "no-this-before-super": 2,
    "no-var": 2,
    "object-shorthand": 2,
    "prefer-arrow-callback": 2,
    "prefer-const": 2,
    "prefer-reflect": 2,
    "prefer-spread": 2,
    "prefer-template": 2,
    "require-yield": 2
  }
  
}