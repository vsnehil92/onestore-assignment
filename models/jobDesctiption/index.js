var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const personSpecification = {
    qualifications: {
        essential: [{ type: String }],
        desirable: [{ type: String }],
    },
    skills: [{ type: String }],
    aptitudes: [{ type: String }],
};

var jobDescription = new Schema({
    companyName: { type: String, required: true },
    designation: { type: String, required: true },
    jobDescription: [{ type: String, required: true }],
    extraDetails: [{ type: String }],
    personSpecification: personSpecification,
    createdAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("jobdescriptions", jobDescription);
