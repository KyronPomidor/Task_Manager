using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Graph;

// Okay, so a Node represents an entity in the graph.
// need also the relationship between nodes, which is represented by Edges.
// How to store edges? As aggrigate inside Node? Or as separate entity?
public class Node
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public float PosX { get; private set; }
    public float PosY { get; private set; }
    public float Radius { get; private set; }
    // TODO: need also Color property.

    // Could reference Task, ShopItem, or Transaction
    public object EntityRef { get; private set; }

    public Node(Guid userId, float posX, float posY, float radius, object entityRef)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        PosX = posX;
        PosY = posY;
        Radius = radius;
        EntityRef = entityRef ?? throw new ArgumentNullException(nameof(entityRef));
    }

    public void Move(float x, float y)
    {
        PosX = x;
        PosY = y;
    }

    public void Resize(float radius)
    {
        if (radius <= 0)
        {
            throw new ArgumentException("Radius must be greater than zero.");
        }
        Radius = radius;
    }
}


public class NodeWithColor : Node
{
    public string Color { get; private set; } // Store color as a hex string, e.g., "#FF5733"

    public NodeWithColor(Guid userId, float posX, float posY, float radius, object entityRef, string color)
        : base(userId, posX, posY, radius, entityRef)
    {
        Color = color ?? throw new ArgumentNullException(nameof(color));
    }

    public void ChangeColor(string newColor)
    {
        Color = newColor ?? throw new ArgumentNullException(nameof(newColor));
    }
}
