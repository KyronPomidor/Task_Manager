using Task_Manager_Back.Domain.Common;

namespace Task_Manager_Back.Domain.Graph
    {
        public class Node
        {
            public Guid Id { get; private set; }
            public Guid UserId { get; private set; }
            public float PosX { get; private set; }
            public float PosY { get; private set; }
            public float Radius { get; private set; }

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

                Radius = ValidationHelper.ValidateNonNegative<float>(radius, nameof(radius));
            }
        }
    }
