import { v } from "convex/values";
import { getAllOrThrow } from "convex-helpers/server/relationships"
import { query } from "../_generated/server";

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("unauthorized")
    }

    if (args.favorites) {
      const favoritedBoards = await ctx.db.query("userFavorites").withIndex("by_user_org", (q) => q.eq("userId", identity.subject).eq("orgId", args.orgId)).order("desc").collect();
      const ids = favoritedBoards.map((b) => b.boardId);
      const boards = await getAllOrThrow(ctx.db, ids);

      return boards.map((board: any) => ({
        ...board,
        isFavorite: true
      }))
    }

    const title = args.search as string;

    let boards: any[] = [];


    if (title?.length > 0) {
      //if search push data by search query
      boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) =>
          q
            .search("title", title)
            .eq("orgId", args.orgId)
        )
        .collect()
    } else {
      boards = await ctx.db.query("boards").withIndex("by_org", (q) => q.eq("orgId", args.orgId)).order("desc").collect();
    }
    const boardWithFavoriteCollection = boards.map((b) => {
      return ctx.db.query("userFavorites").withIndex("by_user_board", (q) => q.eq("userId", identity.subject).eq("boardId", b._id)).unique().then((favorite) => {
        return {
          ...b,
          isFavorite: !!favorite
        }
      })
    })

    const boardsWithFavoriteBoolean = Promise.all(boardWithFavoriteCollection)
    return boardsWithFavoriteBoolean;
  }

})

