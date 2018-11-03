/**
 * This module contains the "mutations" for our database
 */
const Mutations = {
    
    // the database API returns a promise, so all functions should be async
    async createItem(parent, args, context, info) {
        const item = await context.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);

        return item;
    }
};

module.exports = Mutations;
