const response = await RootModel
  // The first filter
  .where({
    name: "Example",
    date: "July 1"
    // Use an array if more than one attribute value should pass the filter.
    id: ["1", "2", "3", "4"]
    // If RootModel is polymorphic you can filter by names of related models
    rootModelableType: ["RelativeOne", "RelativeTwo"]
  })
  // Merges are for filtering and sorting nested queries. Do not add include() or select() methods.
  .merge({
    // Filter the nested conversations records by ID
    // With this nested filter, rootModels with an id of 1, 2, 3 or 4 will be fetched, but only
    // rootModels with id 1 and 2 will have secondModels attached.
    secondModels: SecondModel.where({ rootModelId: ["1", "2"] })
  })
  // Included models are always pluralized
  // Models can be nested in a JSON-like hierarchy as far as a chain of relationships extends
  // Provide an array to include several related models
  .includes([
    // Use a string for a related model without any further nesting
    "unnestedModel",
    // If RootModel is polymorphic, include a related record by using the name of the polymorphic 
    // relationship ("[PolyModelName]able" by convention) rather than than the related model's name.
    // In this case, the polymorphic-related model is rootModelable.
    "rootModelable"
    // Use an object for including nested relationships. The keys & values represent a chain of relationships,
    // each of which will be included in a nested JSON structure.
    // This query would return rootModels including their secondModels, each of which include their 
    // thirdModels, each of which includes their fourthModels.
    // Model traversal is: RootModel => SecondModel => ThirdModel => FourthModel => FifthModel
    { 
      secondModels: {
        thirdModels: {
          fourthModels: "fifthModels"
        }
      }
    }
  ])
  // Select the attributes you want returned from each model. This is the "Graph" part of Graphiti.
  // All included models, regardless of their nested depth (above), are placed as top-level properties.
  // All attributes not explicitly selected are excluded from the query result (with the exception of id).
  // All model names MUST be pluralized regardless of their specific relationship (hasMany, hasOne, belongsTo, etc.)
  // The id 
  .select({
    // The root-level Model goes here as well - not just the associations
    // Here, the RootModels will only be returned with their attached secondModels
    rootModels: "secondModels",
    // Use an array to select multiple attributes.
    thirdModels: ["isHappy", "isYoung"],
    fourthModels: "someProp",
    fifthModels: "otherProp"
    // The unmentioned secondModels will be returned with all attributes
  })
  // Return 25 records per page
  .per(25)
  // Start with page 1. Using .page(2) would return the next batch of 25.
  .page(1)
  .all()

// Structure of each RootModel returned the response.data array

response.data = [{
  id: 1,
  secondModels: [
    {
      id: 42,
      name: "Uncle Bob",
      message: "I have all my attributes",
      randomBoolean: false,
      thirdModels: [{
        id: 31,
        isHappy: true,
        isYoung: true,
        fourthModels: [
          {
            id: 4,
            someProp: "idk",
            fifthModels: [
              { id: 12, otherProp: "I feel smushed" },
              { id: 3, otherProp: "me too" }
            ]
          },
          {
            id: 4,
            someProp: "idk",
            fifthModels: [
              { id: 12, otherProp: "What's up?" },
              { id: 3, otherProp: "Not much." }
            ]
          },
        ]
      }],
    },
  ]
}, /* ... more root models */ ]


