module.exports = {
  async up(db) {
    try {
      await db
        .collection('TokenWhiteList')
        .createIndex({ expiredAt: 1 }, { expireAfterSeconds: 0 });
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },

  async down(db) {
    try {
      await db.collection('TokenWhiteList').dropIndex('expiredAt_1');
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },
};
