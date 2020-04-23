const fs = require("fs");
const { PdfReader } = require("pdfreader");
const JobDescriptionModel = require("../models").jobDescription;

const setValue = (propertyPath, obj, text) => {
    let properties =
        typeof propertyPath === "string"
            ? propertyPath.split(".")
            : propertyPath;

    if (properties.length > 1) {
        if (
            !obj.hasOwnProperty(properties[0]) ||
            typeof obj[properties[0]] !== "object"
        )
            obj[properties[0]] = {};
        return setValue(properties.slice(1), obj[properties[0]], text);
    } else {
        if (text) {
            let lastElement = obj[properties[0]].pop();
            lastElement = lastElement + text;
            obj[properties[0]].push(lastElement);
        } else {
            obj[properties[0]].push("");
        }
        return true;
    }
};

const getIfTextExists = (text, key) => {
    if (text.toLowerCase().indexOf(key) !== -1) {
        return true;
    } else {
        return false;
    }
};

const updateInitialkey = (jsonDescription, item, initialKey, pdfData) => {
    if (getIfTextExists(item.text, "onestore india")) {
        jsonDescription[initialKey] = item.text;
    } else if (getIfTextExists(item.text, "project manager")) {
        initialKey = "designation";
        jsonDescription[initialKey] = item.text;
    } else if (getIfTextExists(item.text, "job description")) {
        initialKey = "jobDescription";
        jsonDescription[initialKey] = [];
    } else if (getIfTextExists(item.text, "essential")) {
        initialKey = "personSpecification.qualifications.essential";
    } else if (getIfTextExists(item.text, "desirable")) {
        initialKey = "personSpecification.qualifications.desirable";
    } else if (getIfTextExists(item.text, "skills")) {
        initialKey = "personSpecification.skills";
    } else if (getIfTextExists(item.text, "aptitudes")) {
        initialKey = "personSpecification.aptitudes";
    } else if (item.text === "●" || item.text === "•") {
        if (initialKey.indexOf(".") !== -1) {
            setValue(initialKey, jsonDescription, false);
        } else {
            jsonDescription[initialKey].push("");
        }
    } else {
        if (
            !getIfTextExists(item.text, "person specification") &&
            !getIfTextExists(item.text, "knowledge & qualifications")
        ) {
            initialKey = "extraDetails";
            jsonDescription[initialKey].push(item.text);
        }
    }
    return initialKey;
};

module.exports = {
    readJobDescription: () => {
        let pdfData = "",
            yCoordinate = -1,
            jsonDescription = {
                personSpecification: {
                    qualifications: { essential: [], desirable: [] },
                    skills: [],
                    aptitudes: [],
                },
                extraDetails: [],
            },
            initialKey = "companyName";
        return new Promise((resolve, reject) => {
            fs.readFile(
                `${__dirname}/../staticData/projectManagerJobDescriptionTemplate.pdf`,
                (err, jobDescription) => {
                    if (err) {
                        return reject(err);
                    } else {
                        new PdfReader().parseBuffer(
                            jobDescription,
                            (err, item) => {
                                if (err) {
                                    return reject(err);
                                } else if (!item) {
                                    return resolve({
                                        pdfData,
                                        jsonDescription,
                                    });
                                } else if (item.text) {
                                    if (yCoordinate !== item.y) {
                                        pdfData = pdfData + "\n";
                                        for (let i = 0; i < item.x; i++) {
                                            pdfData = pdfData + " ";
                                        }
                                        pdfData = pdfData + item.text;
                                        yCoordinate = item.y;
                                        initialKey = updateInitialkey(
                                            jsonDescription,
                                            item,
                                            initialKey
                                        );
                                    } else {
                                        pdfData = pdfData + item.text;
                                        if (initialKey.indexOf(".") !== -1) {
                                            setValue(
                                                initialKey,
                                                jsonDescription,
                                                item.text
                                            );
                                        } else if (
                                            initialKey === "jobDescription" ||
                                            initialKey === "extraDetails"
                                        ) {
                                            let lastElement = jsonDescription[
                                                initialKey
                                            ].pop();
                                            lastElement =
                                                lastElement + item.text;
                                            jsonDescription[initialKey].push(
                                                lastElement
                                            );
                                        } else {
                                            jsonDescription[initialKey] =
                                                jsonDescription[initialKey] +
                                                item.text;
                                        }
                                    }
                                }
                            }
                        );
                    }
                }
            );
        });
    },

    fetchHtml: () => {
        return fs.readFileSync("./staticData/index.html").toString("utf8");
    },

    saveJobDescription: (jobDescription) => {
        return JobDescriptionModel.create(jobDescription);
    },
};
