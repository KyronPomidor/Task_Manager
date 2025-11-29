// src/components/TaskCard.jsx
import React from "react";
import { Card, Tag, Button, Tooltip } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { getDeterministicColor } from "../../utils/colorUtils";
import { TaskActions } from "./taskActions";
import mainArrow from "./main_arrow.png";
import dependency from "./dependencies.png";

function priorityColor(p) {
    if (p === "Medium") return { backgroundColor: "#e6f4ff", borderColor: "#2563eb" };
    return p === "Low" ? "default" : "red";
}

export function TaskCard({
    task,
    allTasks,
    dragListeners,
    menuOpenId,
    setMenuOpenId,
    expandedParentId,
    setExpandedParentId,
    toggleComplete,
    startEdit,
    setBudgetTask,
    setTempBudgetItems,
    setBudgetOpen,
    handleCardClick,
    handleChildIndicatorClick,
    getParents,
    getChildren,
    colors, // ← your new unified colors object
}) {
    const hasChildren =
        task.childrenIds &&
        task.childrenIds.length > 0 &&
        allTasks.some((t) => task.childrenIds.includes(t.id) && !t.completed);

    const parentBorderColor = hasChildren
        ? task.color || getDeterministicColor(task.id)
        : "#fff";

    const parentTasks = getParents(task.id);
    const childIndicatorColors = parentTasks.map(
        (parent) => parent.color || getDeterministicColor(parent.id)
    );

    const isChild = parentTasks.length > 0;
    const isParent = hasChildren;

    return (
        <motion.div style={{ position: "relative" }}>
            <Card
                className={`task-card ${task.completed ? "task-card-done" : ""}`}
                style={{
                    background: colors.card,
                    color: colors.text,
                    borderLeft: `10px solid ${parentBorderColor}`,
                    minHeight: 180,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    zIndex: expandedParentId === task.id ? 1002 : 1,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                title={
                    <motion.div
                        className="card-title"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            alignItems: "center",
                            overflow: "hidden",
                            color: colors.text,
                        }}
                    >
                        {/* FIXED CHECKBOX */}
                        <Button
                            type="text"
                            className="task-checkbox"
                            style={{
                                position: "absolute",
                                top: 17,
                                left: 8,
                                padding: 0,
                                background: task.completed ? "#6BCB77" : colors.card,
                                border: `2px solid ${colors.border}`,
                                borderRadius: "50%",
                                width: 24,
                                height: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                zIndex: 10,
                                transition: "all 0.2s ease",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleComplete(task.id);
                            }}
                        >
                            <span
                                className="checkmark"
                                style={{
                                    color: task.completed ? "white" : colors.text,
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    opacity: task.completed ? 1 : 0,
                                    transition: "opacity 0.2s ease",
                                }}
                            >
                                ✓
                            </span>
                        </Button>

                        <motion.div
                            animate={{ x: menuOpenId === task.id ? -100 : 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginLeft: 40,
                            }}
                        >
                            <span
                                {...dragListeners}
                                style={{
                                    cursor: "grab",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <span className={`title ${task.completed ? "done" : ""}`}>
                                    {task.title.length > 40
                                        ? `${task.title.substring(0, 37)}...`
                                        : task.title}
                                </span>
                                <Tag
                                    style={
                                        typeof priorityColor(task.priority) === "object"
                                            ? priorityColor(task.priority)
                                            : {}
                                    }
                                    color={
                                        typeof priorityColor(task.priority) === "string"
                                            ? priorityColor(task.priority)
                                            : undefined
                                    }
                                >
                                    {task.priority}
                                </Tag>
                            </span>
                        </motion.div>

                        {task.deadline && (
                            <motion.div
                                animate={{ x: menuOpenId === task.id ? -60 : 0 }}
                                style={{
                                    fontSize: "0.75rem",
                                    color: "#60a5fa",
                                    marginTop: "4px",
                                }}
                            >
                                {task.deadline}
                            </motion.div>
                        )}
                    </motion.div>
                }
                hoverable
                extra={
                    <TaskActions
                        task={task}
                        toggleComplete={toggleComplete}
                        startEdit={startEdit}
                        setBudgetTask={setBudgetTask}
                        setTempBudgetItems={setTempBudgetItems}
                        setBudgetOpen={setBudgetOpen}
                        menuOpenId={menuOpenId}
                        setMenuOpenId={setMenuOpenId}
                        colors={colors}
                    />
                }
            >
                <div
                    className="desc"
                    style={{
                        color: colors.text,
                        opacity: 0.8,
                        textAlign: "center",
                        minHeight: 50,
                    }}
                >
                    {task.description
                        ? task.description.length > 100
                            ? `${task.description.substring(0, 100)}...`
                            : task.description
                        : <em>No description</em>}
                </div>

                {/* Dependency indicators */}
                {isChild && (
                    <div className="dependency-indicators" style={{ bottom: 8, left: 8 }}>
                        <img src={dependency} alt="dependency" style={{ width: 16, height: 16 }} />
                        {parentTasks.map((parentTask, idx) => (
                            <Tooltip key={idx} title={parentTask?.title || "Parent"}>
                                <span
                                    style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        background: childIndicatorColors[idx],
                                        border: "2px solid #fff",
                                        boxShadow: "0 0 0 1px #333",
                                        display: "inline-block",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleChildIndicatorClick(parentTask.id)}
                                />
                            </Tooltip>
                        ))}
                    </div>
                )}

                
                
                {/* Expand children button */}
                {isParent && (
                    <div style={{ position: "absolute", bottom: 12, right: 16, zIndex: 1003 }}>
                        <Button
                            type="text"
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandedParentId(expandedParentId === task.id ? null : task.id);
                            }}
                            style={{
                                padding: 0,
                                width: 28,
                                height: 28,
                                background: colors.card,
                                borderRadius: "50%",
                            }}
                        >
                            <img
                                src={mainArrow}
                                alt="expand children"
                                style={{
                                    width: 16,
                                    height: 16,
                                    filter: expandedParentId === task.id ? "brightness(1.4)" : "brightness(0.9)",
                                    transform: expandedParentId === task.id ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "all 0.2s",
                                }}
                            />
                        </Button>
                    </div>
                )}
            </Card>
                
            {/* Expanded children overlay */}
            <AnimatePresence>
                {expandedParentId === task.id && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: "fixed",
                                inset: 0,
                                background: colors.bg,
                                zIndex: 1000,
                            }}
                            onClick={() => setExpandedParentId(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                width: "100%",
                                zIndex: 1002,
                                padding: "24px 0",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 20,
                                    maxWidth: 340,
                                    margin: "0 auto",
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {getChildren(task.id).map((child) => {
                                    const childParents = getParents(child.id);
                                    return (
                                        <Card
                                            key={child.id}
                                            style={{
                                                width: "100%",
                                                background: colors.card,
                                                color: colors.text,
                                                borderLeft: `5px solid ${
                                                    childParents.length > 0
                                                        ? childParents[childParents.length - 1].color ||
                                                          getDeterministicColor(childParents[childParents.length - 1].id)
                                                        : "transparent"
                                                }`,
                                                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                                            }}
                                            onClick={() => handleCardClick(child)}
                                        >
                                            <div style={{ textAlign: "center", padding: "8px 0" }}>
                                                <strong>{child.title}</strong>
                                                <Tag style={{ marginLeft: 8 }}>{child.priority}</Tag>
                                                {child.deadline && (
                                                    <div style={{ fontSize: "0.8rem", color: "#60a5fa", marginTop: 4 }}>
                                                        {child.deadline}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ color: colors.text, opacity: 0.8, textAlign: "center" }}>
                                                {child.description || "No description"}
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}