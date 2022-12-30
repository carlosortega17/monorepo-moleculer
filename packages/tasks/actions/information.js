module.exports = {
  rest: 'GET /information',
  async handler(ctx) {
    ctx.meta.$statusCode = 200;
    return {
      name: 'status',
      message: 'Ok',
    };
  },
};
