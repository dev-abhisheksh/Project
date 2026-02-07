export const isUserBanned = (user)=>{
    if(!user || !user.banExpiresAt) return false;

    return new Date(user.banExpiresAt) > new Date();
}