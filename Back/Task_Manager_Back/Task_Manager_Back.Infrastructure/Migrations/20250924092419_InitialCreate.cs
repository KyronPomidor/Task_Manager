using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Task_Manager_Back.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DatabaseRelationTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatabaseRelationTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DatabaseRelationTypes_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DatabaseTaskCustomCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Order = table.Column<int>(type: "int", nullable: false),
                    ParentCategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatabaseTaskCustomCategories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskCustomCategories_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskCustomCategories_DatabaseTaskCustomCategories_ParentCategoryId",
                        column: x => x.ParentCategoryId,
                        principalTable: "DatabaseTaskCustomCategories",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DatabaseTaskLabels",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatabaseTaskLabels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskLabels_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DatabaseTaskPriorities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Level = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatabaseTaskPriorities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskPriorities_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DatabaseTaskStatuses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Tittle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatabaseTaskStatuses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskStatuses_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DatabaseTaskEntities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsCompleted = table.Column<bool>(type: "bit", nullable: false),
                    IsFailed = table.Column<bool>(type: "bit", nullable: false),
                    PriorityId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    StatusId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DatabaseCustomCategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Deadline = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FailedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PositionOrder = table.Column<int>(type: "int", nullable: false),
                    DatabaseTaskPriorityId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DatabaseTaskStatusId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatabaseTaskEntities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskEntities_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskEntities_DatabaseTaskCustomCategories_DatabaseCustomCategoryId",
                        column: x => x.DatabaseCustomCategoryId,
                        principalTable: "DatabaseTaskCustomCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskEntities_DatabaseTaskPriorities_DatabaseTaskPriorityId",
                        column: x => x.DatabaseTaskPriorityId,
                        principalTable: "DatabaseTaskPriorities",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DatabaseTaskEntities_DatabaseTaskPriorities_PriorityId",
                        column: x => x.PriorityId,
                        principalTable: "DatabaseTaskPriorities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskEntities_DatabaseTaskStatuses_DatabaseTaskStatusId",
                        column: x => x.DatabaseTaskStatusId,
                        principalTable: "DatabaseTaskStatuses",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DatabaseTaskEntities_DatabaseTaskStatuses_StatusId",
                        column: x => x.StatusId,
                        principalTable: "DatabaseTaskStatuses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DatabaseTaskAttachments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Size = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatabaseTaskAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskAttachments_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskAttachments_DatabaseTaskEntities_TaskId",
                        column: x => x.TaskId,
                        principalTable: "DatabaseTaskEntities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DatabaseTaskCustomRelations",
                columns: table => new
                {
                    FromTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ToTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RelationTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatabaseTaskCustomRelations", x => new { x.FromTaskId, x.ToTaskId, x.RelationTypeId });
                    table.ForeignKey(
                        name: "FK_DatabaseTaskCustomRelations_DatabaseRelationTypes_RelationTypeId",
                        column: x => x.RelationTypeId,
                        principalTable: "DatabaseRelationTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskCustomRelations_DatabaseTaskEntities_FromTaskId",
                        column: x => x.FromTaskId,
                        principalTable: "DatabaseTaskEntities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskCustomRelations_DatabaseTaskEntities_ToTaskId",
                        column: x => x.ToTaskId,
                        principalTable: "DatabaseTaskEntities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DatabaseTaskDependencyRelations",
                columns: table => new
                {
                    FromTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ToTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatabaseTaskDependencyRelations", x => new { x.FromTaskId, x.ToTaskId });
                    table.ForeignKey(
                        name: "FK_DatabaseTaskDependencyRelations_DatabaseTaskEntities_FromTaskId",
                        column: x => x.FromTaskId,
                        principalTable: "DatabaseTaskEntities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskDependencyRelations_DatabaseTaskEntities_ToTaskId",
                        column: x => x.ToTaskId,
                        principalTable: "DatabaseTaskEntities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DatabaseTaskEntityDatabaseTaskLabel",
                columns: table => new
                {
                    LabelsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TasksId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatabaseTaskEntityDatabaseTaskLabel", x => new { x.LabelsId, x.TasksId });
                    table.ForeignKey(
                        name: "FK_DatabaseTaskEntityDatabaseTaskLabel_DatabaseTaskEntities_TasksId",
                        column: x => x.TasksId,
                        principalTable: "DatabaseTaskEntities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskEntityDatabaseTaskLabel_DatabaseTaskLabels_LabelsId",
                        column: x => x.LabelsId,
                        principalTable: "DatabaseTaskLabels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DatabaseTaskReminders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReminderAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsSent = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatabaseTaskReminders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DatabaseTaskReminders_DatabaseTaskEntities_TaskId",
                        column: x => x.TaskId,
                        principalTable: "DatabaseTaskEntities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseRelationTypes_UserId",
                table: "DatabaseRelationTypes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskAttachments_TaskId",
                table: "DatabaseTaskAttachments",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskAttachments_UserId",
                table: "DatabaseTaskAttachments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskCustomCategories_ParentCategoryId",
                table: "DatabaseTaskCustomCategories",
                column: "ParentCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskCustomCategories_UserId",
                table: "DatabaseTaskCustomCategories",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskCustomRelations_RelationTypeId",
                table: "DatabaseTaskCustomRelations",
                column: "RelationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskCustomRelations_ToTaskId",
                table: "DatabaseTaskCustomRelations",
                column: "ToTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskDependencyRelations_ToTaskId",
                table: "DatabaseTaskDependencyRelations",
                column: "ToTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskEntities_DatabaseCustomCategoryId",
                table: "DatabaseTaskEntities",
                column: "DatabaseCustomCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskEntities_DatabaseTaskPriorityId",
                table: "DatabaseTaskEntities",
                column: "DatabaseTaskPriorityId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskEntities_DatabaseTaskStatusId",
                table: "DatabaseTaskEntities",
                column: "DatabaseTaskStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskEntities_PriorityId",
                table: "DatabaseTaskEntities",
                column: "PriorityId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskEntities_StatusId",
                table: "DatabaseTaskEntities",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskEntities_UserId",
                table: "DatabaseTaskEntities",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskEntityDatabaseTaskLabel_TasksId",
                table: "DatabaseTaskEntityDatabaseTaskLabel",
                column: "TasksId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskLabels_UserId",
                table: "DatabaseTaskLabels",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskPriorities_UserId",
                table: "DatabaseTaskPriorities",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskReminders_TaskId",
                table: "DatabaseTaskReminders",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseTaskStatuses_UserId",
                table: "DatabaseTaskStatuses",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "DatabaseTaskAttachments");

            migrationBuilder.DropTable(
                name: "DatabaseTaskCustomRelations");

            migrationBuilder.DropTable(
                name: "DatabaseTaskDependencyRelations");

            migrationBuilder.DropTable(
                name: "DatabaseTaskEntityDatabaseTaskLabel");

            migrationBuilder.DropTable(
                name: "DatabaseTaskReminders");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "DatabaseRelationTypes");

            migrationBuilder.DropTable(
                name: "DatabaseTaskLabels");

            migrationBuilder.DropTable(
                name: "DatabaseTaskEntities");

            migrationBuilder.DropTable(
                name: "DatabaseTaskCustomCategories");

            migrationBuilder.DropTable(
                name: "DatabaseTaskPriorities");

            migrationBuilder.DropTable(
                name: "DatabaseTaskStatuses");

            migrationBuilder.DropTable(
                name: "AspNetUsers");
        }
    }
}
