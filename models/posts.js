const db = require('./../db_connection');

//static betyder att man inte kör på instans av klassen, har vi en funktion utan static måste det vara en instans av klassen
class Post {

    constructor({id, title, content, slug }) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.content = content;
    }

    static async  getBySlug(slug) {

        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM posts WHERE slug='${slug}'`, function (error, results, fields) {
                if (error) {
                    reject(error)
                }else{
                    if(results.length > 0){
                        resolve(results)
                    }else{
                        reject(new Error('None found'))
                    }
                }
            });
        })
    }

    static async getAll() {
        return new Promise ((resolve, reject) => {
        db.query('SELECT * FROM posts', function (error, results, fields) {
            
            if (error){
                 reject(error);
            }else{
                if(results.length > 0){
                console.log(results)
                resolve(results);
            }else{
                reject(new Error('None found'));
            }
            }

        });
    })
    }

    //skapar en create-metod på vår klass Post
    async create(){
        console.log('Post model create');
        console.log(this.title);
        console.log(this.content);
        const sql = `INSERT INTO posts (user_id, slug, title, content) VALUES (?, ?, ?, ?) `;
        const values = [1, this.slug, this.title, this.content];

        var self = this;
        const result = await db.query(sql, values, 
        function (error, results, fields) {
            if (error) throw error;
            console.log(results.insertId);
            self.id = results.insertId;
        })
    }
}

module.exports = Post;