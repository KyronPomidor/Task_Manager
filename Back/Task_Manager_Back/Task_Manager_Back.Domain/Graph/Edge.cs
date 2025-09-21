using System;

namespace Task_Manager_Back.Domain.Graph;
// Connects two nodes in a graph
// this should not be stored in database and should be constructed based on relationships between entities in service layer
public class Edge
{
    public Guid FromNodeId { get; private set; }
    public Guid ToNodeId { get; private set; }
    public string RelationshipType { get; private set; }

    public Edge(Guid fromNodeId, Guid toNodeId, string relationshipType)
    {
        FromNodeId = fromNodeId;
        ToNodeId = toNodeId;
        RelationshipType = relationshipType ?? throw new ArgumentNullException(nameof(relationshipType));
    }
}
