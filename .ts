const phoneChannel = await ConversationChannel.where({
  name: "Phone"
})
  .merge({
    conversations: Conversation.where({ customerAppId: props.up.id })
  })
  .includes([
    {
      conversations: "customerAppConversationAssignments"
    }
  ])
  .select({
    conversationChannels: "conversations",
    conversations: "recipient",
    customerAppConversationAssignments: ["label", "isPrimary"]
  })
  .per(1)
  .all()
