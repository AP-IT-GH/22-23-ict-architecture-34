<<<<<<< HEAD
const files = [{
    id: 1,
    mimetype: 'image/png',
    size: 12345,
    filename: 'test.png'
}];
=======

// example file:
// {
//     id: 1,
//     mimetype: 'image/png',
//     size: 12345,
//     filename: 'test.png'
// }
const files = [];
>>>>>>> c6e7b5bd23956af42ce152dd0bca866125d7dda2

async function createUpload(mimetype, size, filename) {
    // get highest id from files array
    const id = files.reduce((max, file) => Math.max(max, file.id), 0) + 1;
    const file = { id, mimetype, size, filename };
    files.push(file);
    return file;
}

async function getUploads() {
    return files;
}

async function getUpload(id) {
    return files.find(file => file.id === id);
}

async function deleteUpload(id) {
<<<<<<< HEAD
    const index = files.findIndex(file => file.id === id);
=======
    const index = files.findIndex(file => file.id === +id);
>>>>>>> c6e7b5bd23956af42ce152dd0bca866125d7dda2
    if (index !== -1) {
        files.splice(index, 1);
    }
}

module.exports = {
    createUpload,
    getUploads,
    getUpload,
    deleteUpload,
};