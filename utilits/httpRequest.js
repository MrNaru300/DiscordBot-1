const fs = require("fs");
const http = require("https");

module.exports = async (url, file, enconding = "utf8", configs) => {

	let options = configs || url
	
	let data = await new Promise ((res, rej) => {
		http.get(options, response => {
			response.setEncoding(enconding);
			let data = "";
			response.on("data", chunk => {
				data += chunk;
			})
			response.on("end", () => {
				if (file) {
					fs.writeFile(file, data, enconding, err => {
						if (err) {
							console.log(err);
							rej("File error:\n " + err);
						} else {
							res(data);
						}
					});
				} else {
					res(data);
				}
			});
			response.on("error", err => {
				rej(err);
			})
		})
	});
	return data;
}