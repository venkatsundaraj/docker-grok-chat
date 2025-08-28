import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTodo = mutation({
  args: {
    text: v.string(),
  },
  handler: async function (ctx, args) {
    try {
      console.log(args);
      const value = await ctx.db.insert("todos", {
        text: args.text,
      });
      console.log(value);
    } catch (err) {
      console.log(err);
    }
  },
});

export const getTodos = query({
  handler: async (ctx) => {
    return await ctx.db.query("todos").collect();
  },
});
