const phoneChannel = await ConversationChannel
  // The first filter
  .where({
    name: "Phone"
  })
  // Merges are for filtering and sorting nested queries. Do not add include() or select() methods.
  .merge({
    // Filter the nested conversations records by ID
    conversations: Conversation.where({ customerAppId: props.up.id })
  })
  // Included models are always pluralized
  // Models can be nested in a JSON-like hierarchy as far as a chain of relationships extends
  // Provide an array to include several related models
  .includes([
    // Use a string for a related model without any further nesting
    "user",
    // Use an object for including nested relationships. Each key and value represents another nested
    // association to include in the query. 
    // This query would return Conversations including their Assignments, each of which include their 
    // Assignees, each of which includes their Credentials.
    // Model traversal is: Conversation => Assignments => Assignees => Credentials
    { 
      conversations: {
        assignments: {
          assignees: "credentials"
        }
      }
    }
  ])
  // Select the attributes you want returned from each model. This is the "Graph" part of Graphiti.
  // All included models, regardless of their nested depth (above), are placed as top-level keys in
  // the object passed to the select() method. 
  // When you use select(), all attributes not explicitly selected are excluded from the query result.
  .select({
    // The root-level Model goes here as well - not just the associations
    conversationChannels: "conversations",
    conversations: "recipient",
    // Use an array to select multiple attributes.
    customerAppConversationAssignments: ["label", "isPrimary"]
  })
  // Return 25 records per page
  .per(25)
  // Start with page 1. Using .page(2) would return the next batch of 25.
  .page(1)
  .all()
