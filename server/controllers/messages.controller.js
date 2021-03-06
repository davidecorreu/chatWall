const models = require('../models');
const swearFilter = require('../utils/swearFilter');
const Message = models.Message;
const Channel = models.Channel;

module.exports.create = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();

  if (!ctx.request.body.message) throw new Error('Message not found');
  if (!ctx.request.body.channel) throw new Error('Channel not defined');

  const checkChannel = await Channel.findOne({where: {name: ctx.request.body.channel}});
  if (!checkChannel) throw new Error('Channel not found');

  // const filteredMessage = await swearFilter(ctx.request.body.message);
  const filteredMessage = ctx.request.body.message;

  const message = {
    message: filteredMessage,
    channel: ctx.request.body.channel,
    creator: ctx.user.username,
  };

  const dbResponse = await Message.create(message);
  delayedDeleteMessage(dbResponse.id);
  ctx.body = dbResponse;
};

module.exports.getAll = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();

  const query = ctx.query;
  if (!ctx.query.channel) throw new Error('Channel not specified');
  const checkChannel = await Channel.findOne({where: {name: ctx.query.channel}});
  if (!checkChannel) throw new Error('Channel not found');

  const messages = await Message.findAll({where: {channel: ctx.query.channel},
    order: [['updatedAt', 'DESC']] });
  ctx.body = {
    channel: ctx.query.channel,
    messages
  };
};

const delayedDeleteMessage = (id) => {
  setTimeout(() => {
    Message.destroy({ where: {id} });
  },15*1000);
};
