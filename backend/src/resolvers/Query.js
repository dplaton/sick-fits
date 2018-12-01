const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');
/**
 * The queries from the schema.graphql file have to be "implemented" here
 */
const Query = {
    // we can "forward" the query to the db instead of passing it through Yoga
    items: forwardTo('db'),

    // async items(parent, args, context, info) {
    //    const items = await context.db.query.items()
    //    return items;
    // }

    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),

    me:(parent, args, context, info) => {
        const userId = context.request.userId;
        if (!userId) {
            return null;
        }

        return context.db.query.user(
            {
                where: { id: userId }
            },
            info
        );
    },

     users: async (parent, args, context,info) => {
        //2. Check if the user is logged in
        if (!context.request.userId) {
            //throw Error('You must be logged in');
        }
        //2. check if the users has the permissions to query the users
        hasPermission(context.request.user, ['ADMIN','PERMISSIONSUPDATE']);

        return context.db.query.users({},info);
    }
};

module.exports = Query;
