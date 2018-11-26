const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * This module contains the "mutations" for our database
 */
const Mutations = {
    // the database API returns a promise, so all functions should be async
    async createItem(parent, args, context, info) {
        const item = await context.db.mutation.createItem(
            {
                data: {
                    ...args
                }
            },
            info
        );

        return item;
    },

    updateItem(parent, args, context, info) {
        const updates = {
            ...args
        };
        delete updates.id;
        console.log(updates);
        return context.db.mutation.updateItem(
            {
                data: updates,
                where: {
                    id: args.id
                }
            },
            info
        );
    },

    async deleteItem(parent, args, context, info) {
        const where = {
            id: args.id
        };
        // 1. find the item we "hard-code" the 'info' as 'what to expect from this query'
        const item = await context.db.query.item(
            {
                where
            },
            `{id title}`
        );
        // 2. check permissions
        //TODO

        // 3. Delete
        return context.db.mutation.deleteItem(
            {
                where
            },
            info
        );
    },

    /**
     * User sign-up mutation
     * @param {*} parent
     * @param {Object} args The arguments
     * @param {*} context The context
     * @param {*} info What we expect from the query
     */
    async signUp(parent, args, context, info) {
        const email = args.email.toLowerCase();
        const password = await bcrypt.hash(args.password, 10);

        const user = await context.db.mutation.createUser(
            {
                data: {
                    ...args,
                    email,
                    password,
                    permissions: {
                        set: ['USER']
                    }
                }
            },
            info
        );

        // create JSON Web Token
        const token = jwt.sign(
            {
                user: user.id
            },
            process.env.APP_SECRET
        );

        // set it as a cookie on the response
        context.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 // one year
        });

        return user;
    },

    
    async signIn(parent, {email, password}, context, info) {
        //1. Check that there's an user with that e-mail
        const user = await context.db.query.user({where : {email}});
        if (!user) {
            throw new Error(`No user with email ${email}`);
        }

        //2. Check that the password is valid
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Invalid credentials!');
        }

        //3. Generate a JWT 
        const token = jwt.sign({user: user.id}, process.env.APP_SECRET);

        //4. Set the token in the cookie
        context.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 // one year 
        })
        //5. Return the user
        return user

    },

    signOut(parent, args, context, info) {
        context.response.clearCookie('token');
        return { message: 'Buh-bye!' };
    }
};

module.exports = Mutations;
