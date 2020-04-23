const services = require("../services");

module.exports = {
    handleRootRequest: async (req, res) => {
        try {
            let pdfData = await services.readJobDescription();
            let html = services.fetchHtml();
            html = html.replace("{PDFDATA}", pdfData.pdfData)
            html = html.replace("{JSON}", JSON.stringify(pdfData.jsonDescription))
            return res.send(html);
        } catch (err) {
            console.error(err);
            return res.status(500).send("Something went wrong");
        }
    },

    saveJobDescription: async (req, res) => {
        try {
            let save = req.body.save || undefined;
            let jobDescription = req.body.jobDescription || undefined;
            if(save && jobDescription) {
                jobDescription = JSON.parse(jobDescription);
                await services.saveJobDescription(jobDescription);
                return res.status(201).send("saved");
            } else {
                return res.status(201).send("saved");
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send("Something went wrong");
        }
    },
};
