// fileCounter.js
const fs = require('fs');
const path = require('path');

function countFilesInProjects() {
    const directoryPath = path.join(__dirname, '../Projects');
    
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject("Error reading the directory");
            } else {
                const numberOfFiles = files.length;
                resolve(numberOfFiles);
            }
        });
    });
}

countFilesInProjects()
    .then(count => console.log(`Number of files in Projects: ${count}`))
    .catch(error => console.error(error));