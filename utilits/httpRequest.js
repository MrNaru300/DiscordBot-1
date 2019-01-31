const fs = require("fs");
const http = require("https");

module.exports = async (url, file, enconding, configs) => {
	return data = new Promise((resolve, reject) => {
		if (!enconding)
			enconding = "utf8"
		let options = configs || url
		
		http.get(options, res => {
			
			res.setEncoding(enconding);
			let data = "";

			res.on("data", chunk => {
				data += chunk;
			})

			res.on("end", () => {
				if (file) {
					fs.writeFile(file, data, enconding, err => {
						if (err) {
							console.log(err);
							reject("File error:\n " + err);
						} else {
							resolve(data);
						}
					});
				} else {
					resolve(data);
				}

			});

			res.on("error", err => {
				reject(err);
			})
		});
	});
}