const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

const { makeANiceEmail, transport } = require('../mail');
const { hasPermission } = require('../utils');

/**
 * This module contains the "mutations" for our database
 */

const generateJwt = userId => {
    return jwt.sign(
        {
            user: userId
        },
        process.env.APP_SECRET
    );
};

const Mutations = {
    // the database API returns a promise, so all functions should be async
    async createItem(parent, args, context, info) {
        if (!context.request.userId) {
            throw new Error('You must be logged in to do that!');
        }
        const item = await context.db.mutation.createItem(
            {
                data: {
                    user: {
                        // this is how we 'connect' to a related entity (in this case - the user)
                        connect: {
                            id: context.request.userId
                        }
                    },
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
            `{id title user { id }}`
        );
        // 2. check permissions or if it's owner
        const ownsItem = item.user.id === context.request.user.id;
        const hasPermission = context.request.user.permissions.some(permission =>
            ['ADMIN', 'ITEMDELETE'].includes(permission)
        );

        if (!ownsItem && !hasPermission) {
            throw new Error('You are not allowed!');
        }

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

        // set it as a cookie on the updatedUser
        context.updatedUser.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 // one year
        });

        return user;
    },

    async signIn(parent, { email, password }, context, info) {
        //1. Check that there's an user with that e-mail
        const user = await context.db.query.user({ where: { email } });
        if (!user) {
            throw new Error(`No user with email ${email}`);
        }

        //2. Check that the password is valid
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Invalid credentials!');
        }

        //3. Generate a JWT
        const token = jwt.sign({ user: user.id }, process.env.APP_SECRET);

        //4. Set the token in the cookie
        context.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 // one year
        });
        //5. Return the user
        return user;
    },

    signOut(parent, args, context, info) {
        context.response.clearCookie('token');
        return { message: 'Buh-bye!' };
    },

    async requestReset(parent, { email }, context, info) {
        //1. Check if this is a real user
        const user = await context.db.query.user({ where: { email } });
        if (!user) {
            throw new Error(`No user with email ${email}`);
        }
        //2. Set the reset token and reset exp token
        const promisified = promisify(randomBytes);
        const resetToken = (await promisified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000;

        const updatedUser = await context.db.mutation.updateUser({
            where: { email: user.email },
            data: { resetToken: resetToken, resetTokenExpiry: resetTokenExpiry }
        });

        //3. Send an e-mail with the reset token
        const res = await transport.sendMail({
            from: 'admin@sickfits.com',
            to: user.email,
            subject: 'Your password reset token',
            html: makeANiceEmail(`Your password has been reset\n\n
                            Follow  <a href="${
                                process.env.FRONTEND_URL
                            }/reset?resetToken=${resetToken}">this link</a> to set a new password`)
        });

        return { message: `Generated ${resetToken}` };
    },

    async resetPassword(parent, args, context, info) {
        //1. Check if the passwords match
        if (args.password !== args.confirmPassword) {
            throw new Error("Passwords don't match");
        }

        //2. Check if this is a legit reset token
        // this returns an array of users and we just grab the first element
        const [user] = await context.db.query.users({
            where: {
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now() - 3600000
            }
        });
        if (!user) {
            throw new Error("Can't reset this user's password");
        }
        //4. Hash the new password
        const password = await bcrypt.hash(args.password, 10);
        //5. Set the new password and reset token related fields

        const updatedUser = await context.db.mutation.updateUser({
            where: { email: user.email },
            data: { resetToken: null, resetTokenExpiry: null, password: password }
        });
        //6. Generate JWT
        const token = generateJwt(user.id);

        //7. Set JWT cookie
        context.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 // one year
        });
        //8. Return user
        return updatedUser;
    },

    async updatePermissions(parent, args, context, info) {
        //1. Check if the user is logged in
        console.log(info);
        if (!context.request.userId) {
            throw new Exception('You must be logged in to perform this operation');
        }

        //2. Query the current user
        const currentUser = await context.db.query.user(
            {
                where: {
                    id: context.request.userId
                }
            },
            info
        );
        console.log(currentUser);
        //3. Check if they have permissions
        if (hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE'])) {
            throw Error(`User ${user.name} doesn't have the permission to update permissions`);
        }
        //4. Update the permissions
        const updatedPermissions = await context.db.mutation.updateUser(
            {
                data: {
                    permissions: { set: args.permissions }
                },
                where: {
                    id: args.userId
                }
            },
            info
        );

        return updatedPermissions;
    },

    async addToCart(parent, args, context, info) {
        // 1. Check if they're logged in
        const { userId } = context.request;
        if (!userId) {
            throw new Error('You have to be logge in to perform this operation!');
        }
        // 2. Query the user's cart
        const [existingCartItem] = await context.db.query.cartItems({
            where: {
                user: { id: userId },
                item: { id: args.id }
            }
        });

        // 3. Check if the item is in the cart and increment if it is.
        if (existingCartItem) {
            return context.db.mutation.updateCartItem(
                {
                    where: { id: existingCartItem.id },
                    data: { quantity: existingCartItem.quantity + 1 }
                },
                info
            );
        }
        // 4. Create a fresh cart item if the item is not in the cart

        return context.db.mutation.createCartItem({
            data: {
                quantity: 1,
                user: {
                    connect: { id: userId }
                },
                item: {
                    connect: { id: args.id }
                }
            },
            info
        });
    }
};

module.exports = Mutations;
