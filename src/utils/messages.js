const generateMsg = (username, text) => {
    return {
        text,
        username,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMsg
}