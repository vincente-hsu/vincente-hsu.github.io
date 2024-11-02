const fs = require('fs');
const path = require('path');

// Path to the projects JSON file
const projectsPath = path.join(__dirname, 'projects.json');

// Output directory for generated HTML files
const outputDir = path.join(__dirname, 'generated-pages');

// Remove all files in the output directory if it exists, then recreate it
if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir);

// Read projects.json and parse its content
fs.readFile(projectsPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading projects.json:', err);
        return;
    }

    const projects = JSON.parse(data).projects;

    projects.forEach(project => {
        const htmlContent = generateHTML(project);
        const outputPath = path.join(outputDir, `${project.title}.html`);

        fs.writeFile(outputPath, htmlContent, (err) => {
            if (err) {
                console.error(`Error writing file ${project.title}.html:`, err);
            } else {
                console.log(`Generated ${project.title}.html`);
            }
        });
    });
});

// Function to generate HTML content for a project
function generateHTML(project) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title}</title>
    <link href='https://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="../main-style.css">
</head>
<body>
    <h1 class="nav-parent-element">
        <div><h1 class="navAlign" style="white-space: nowrap; margin-top: -10px;">Vincent Hsu</h1></div>
        <div class="parent-element">
            <button id="projectsButton" class="navAlign" style="margin-right: 10px;">Projects</button>
            <button id="aboutButton" class="navAlign" style="margin-right: 3px;">About</button>
        </div>
    </h1>
    <hr style="margin-top: -10px; margin-bottom: -2px;">
    <h1>${project.title}</h1>
    <hr>

    <p>${project.description}</p>

    <ul id="photosList"></ul>

    <hr style="margin-top: 30px;">

    <a href="../index.html">
        <button class="vButton" style="text-align: center; margin-bottom: 20px;">Back To Projects</button>
    </a>

    <script>
        // Navigation button functionality
        document.getElementById("projectsButton").onclick = () => window.location.href = \`../index.html\`;
        document.getElementById("aboutButton").onclick = () => window.location.href = \`../about.html\`;

        // Fetch projects.json once and use the data for both lists
        fetch('../projects.json')
            .then(response => response.json())
            .then(data => {
                const projects = data.projects;

                // Display image with src and description text for the specific project
                const photosList = document.getElementById("photosList");
                const specificProject = projects.find(p => p.title === "${project.title}");
                if (specificProject && specificProject.photos) {
                    specificProject.photos.forEach(photoObj => {
                        const [photo, description] = Object.entries(photoObj)[0]; // Get photo filename and description

                        const listItem = document.createElement("li");

                        // Create the wrapper and image elements
                        const wrapper = document.createElement("div");
                        wrapper.className = 'image-wrapper';

                        const image = document.createElement("img");
                        image.src = \`../images/\${photo}\`;
                        image.alt = \`Image of \${photo}\`;
                        
                        // Append the image to the wrapper, then wrapper to list item
                        wrapper.appendChild(image);
                        listItem.appendChild(wrapper);

                        // Create the description paragraph
                        const descriptionParagraph = document.createElement("p");
                        descriptionParagraph.textContent = description;

                        // Append description and list item to the photos list
                        listItem.appendChild(descriptionParagraph);
                        photosList.appendChild(listItem);
                    });
                }
            })
            .catch(error => {
                console.error("Error loading projects.json:", error);
            });
    </script>
</body>
</html>
    `;
}