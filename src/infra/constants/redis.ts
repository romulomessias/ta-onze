const suffix =
    process.env.NODE_ENV !== "production" ? `-${process.env.NODE_ENV}` : "";

export const tokenKey = "playOnze" + suffix;
export const refreshTokenKey = "replayOnze" + suffix;
export const currentSprintKey = "currentSprint" + suffix;
