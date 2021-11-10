const mongoose = require('mongoose');
const Apply = require('./apply');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_400/h_340')
});

const opts = { toJSON: { virtuals: true } };

const JobSchema = new Schema({
    title: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    company: String,
    description: String,
    location: String,
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    applications: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Apply'
        }
    ]
}, opts);

JobSchema.virtual('properties').get(function () {
    return {
        id: this._id,
        title: this.title,
        description: this.description
    }
});

JobSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Apply.deleteMany({
            _id: {
                $in: doc.applications
            }
        })
    }
});

module.exports = mongoose.model('Job', JobSchema);
