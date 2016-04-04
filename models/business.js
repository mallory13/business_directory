// link to mongoose
var mongoose = require('mongoose');

// define the business schema
var businessSchema = new mongoose.Schema({
   created: {
       type: Date,
       default: Date.now
   },
    name: {
        type: String,
        default: '',
        trim: true,
        required: 'Business name cannot be blank'
    },
    contact: {
        type: String,
        default: '',
        required: 'Contact name cannot be blank'
    },
    phone: {
        type: String,
        default: '',
        trim: true,
        required: 'Phone number cannot be blank'
    },
    address: {
        type: String,
        default: '',
        trim: true,
        required: 'Address cannot be blank'
    },
    website: {
        type: String,
        default: '',
        trim: true
       
    },
    file: {
        type: File,
        default: ''   
    }
});

// make it public
module.exports = mongoose.model('Business', businessSchema);
