const multer = require('multer');
const fs = require('fs');
const path = require('path');

const postDB = {
    posts: require('../model/posts.json'),
    setPosts: function(data) {
        this.posts = data
    }
}


const createPost = async(req, res) => {
    const {text, tags, content} = req.body
    const file = req.file;
    const allowedFiles = ['.txt', '.html', '.css', '.js']


    if(!text || !tags){
        res.json({"Message" : "Please fill in all fields"})
    }

    try{
        
        fs.readFile(file.path, (error, data) => {
            if (error) {
              return res.send(error);
        }
        if (allowedFiles.indexOf(path.extname(file.originalname)) === -1) {
            return res.send('Only text files are allowed to be uploaded');
        }
            fs.writeFile(`public/uploads/${file.originalname}`, data, function(err) {
                if (err) {
                    return res.send(err);
                }
            });
        })

        const uploadedFilePath = `/uploads/${file.originalname}`


        const newPost = {
            "title" : text,
            "tags": [tags],
            "content" : content,
            "file": uploadedFilePath
        }

        postDB.setPosts([...postDB.posts, newPost])
        await fs.promises.writeFile(path.join(__dirname, '..', 'model', 'posts.json'), JSON.stringify(postDB.posts))
        res.redirect('/')
    }
    catch(err){
        if(err) {
            throw err
        }
    }
}

module.exports = createPost;