const http = require('http');
const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, 'website', 'public', 'api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

function fetchJson(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

(async () => {
  try {
    const optionsData = await fetchJson('/api/options');
    fs.writeFileSync(path.join(apiDir, 'options'), optionsData, 'utf8');
    fs.writeFileSync(path.join(apiDir, 'options.json'), optionsData, 'utf8');

    const statusData = await fetchJson('/api/status');
    fs.writeFileSync(path.join(apiDir, 'status'), statusData, 'utf8');
    fs.writeFileSync(path.join(apiDir, 'status.json'), statusData, 'utf8');

    const imagesData = await fetchJson('/api/images');
    fs.writeFileSync(path.join(apiDir, 'images'), imagesData, 'utf8');
    fs.writeFileSync(path.join(apiDir, 'images.json'), imagesData, 'utf8');

    console.log('Successfully generated static API files in website/public/api!');
  } catch (err) {
    console.error('Failed to generate static API files:', err);
  }
})();
