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
        const updates = { ...args };
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
    }
};

module.exports = Mutations;
