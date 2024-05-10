const rsa = require('../toolkit/rsa');
const caesar_cipher = require('../toolkit/caesar_cipher');
const variables = require("../variables");
const path = require("path");
const filesystem = require("../toolkit/filesystem");

const database_path = path.join(variables.database_path, "users.json");

const Message = require("./message"); 

class User 
{
    #private_key;
    #id; 
    constructor(username, password) 
    {
        this.#id = -1;
        this.username = username;
        this.password = password;
        const keys = rsa.generateKeyPair(); 
        this.public_key = keys[0]; 
        this.#private_key = keys[1];
    }
    save(CALLBACK)
    {
        User.findAll((users) => {
            const length = users.length; 
            if(this.#id == -1)
            {
                if(length > 0){
                    this.#id = users[length - 1].id + 1;
                } 
                else this.#id = 1;
                
                users.push({
                    id: this.#id,
                    username: this.username,
                    password:  this.password,
                    public_key: this.public_key,
                    private_key: this.private_key
                }); 
            }
            else 
            {
                for(let i = 0; i < length; i++)
                {
                    if(users[i].id == this.#id)
                    {
                        users[i].username = this.username;
                        users[i].password =  this.password;
                        users[i].public_key = this.public_key;
                        users[i].private_key = this.private_key;
                    }
                }
            }
            
            filesystem.writeToFile(database_path, users, CALLBACK);
        });
    }

    getPrivateKey()
    {
        return this.#private_key;
    }

    getId()
    {
        return this.#id;
    }

    static findAll(CALLBACK)
    {
        filesystem.readFromFile(database_path, (data) => 
        {
            return CALLBACK(data);
        }); 
    }
    static findById(id, CALLBACK)
    {
        User.findAll((users) => {
            const length = users.length;
            for(let i = 0; i < length; i++)
            {
                if(users[i].id == id)
                {
                    return CALLBACK(users[i]);
                }
            }; 
            CALLBACK(undefined);
        });
    }

    static findByUsername(username, CALLBACK)
    {
        User.findAll((users) => {
            const length = users.length;
            for(let i = 0; i < length; i++)
            {
                if(users[i].username == username)
                {
                    return CALLBACK(users[i]);
                }
            }; 
            CALLBACK(undefined);
        });
    }

    static findObjectById(id, CALLBACK)
    {
        User.findById(id, (user) => {
            if(user == undefined)
            {
                return CALLBACK(undefined);
            }
            const user_obj = new User(user.username, user.password); 
            user_obj.#id = user.id;
            user_obj.public_key = user.public_key;
            user_obj.#private_key = user.private_key;

            CALLBACK(user_obj);
        });
    }
}

module.exports = User;