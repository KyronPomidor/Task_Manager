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

    const bg = task.completed ? "#ececec" : "white";
    const isChild = parentTasks.length > 0;
    const isParent = hasChildren;

    return (
        <motion.div style={{ position: "relative" }}>
            <Card
                className={`task-card ${task.completed ? "task-card-done" : ""}`}
                style={{
                    background: bg,
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
                        }}
                    >
                        <Button
                            type="text"
                            style={{
                                position: "absolute",
                                top: 17,
                                left: 8,
                                padding: 0,
                                background: task.completed ? "#6BCB77" : "#fff",
                                border: "2px solid #ccc",
                                borderRadius: "50%",
                                width: 24,
                                height: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                zIndex: 10,
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleComplete(task.id);
                            }}
                            onMouseEnter={(e) => {
                                if (!task.completed) {
                                    e.currentTarget.style.backgroundColor = "#d4d4d4ff";
                                    e.currentTarget
                                        .querySelector("span")
                                        ?.style.setProperty("display", "flex", "important");
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!task.completed) {
                                    e.currentTarget.style.backgroundColor = "#fff";
                                    e.currentTarget
                                        .querySelector("span")
                                        ?.style.setProperty("display", "none", "important");
                                }
                            }}
                        >
                            <span
                                style={{
                                    color: "#000000ff",
                                    display: task.completed ? "flex" : "none",
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
                                        ? `${task.title.substring(0, 10)}...`
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
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                style={{
                                    fontSize: "0.75rem",
                                    color: "#60a5fa",
                                    marginTop: "2px",
                                    textAlign: "center",
                                    width: "100%",
                                    position: "relative",
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
                    />
                }
            >
                <div
                    className="desc"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        minHeight: "50px",
                        width: "97%",
                    }}
                >
                    {task.description
                        ? task.description.length > 100
                            ? `${task.description.substring(0, 100)}...`
                            : task.description
                        : "No description"}
                </div>

                {isChild && (
                    <div
                        className="dependency-indicators"
                        style={{
                            position: "absolute",
                            bottom: 8,
                            left: 8,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            zIndex: 10,
                        }}
                    >
                        <img src={dependency} style={{ width: 16, height: 16 }}></img>
                        {parentTasks.map((parentTask, idx) => (
                            <Tooltip
                                key={idx}
                                title={parentTask ? parentTask.title : "Unknown Parent"}
                            >
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        background: childIndicatorColors[idx],
                                        border: "2px solid #fff",
                                        boxShadow: "0 0 0 1px #ccc",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleChildIndicatorClick(parentTask.id)}
                                />
                            </Tooltip>
                        ))}
                    </div>
                )}

                {isParent && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 12,
                            right: 16,
                            zIndex: 1003,
                        }}
                    >
                        <Button
                            type="text"
                            style={{
                                padding: 0,
                                background: "#fff",
                                border: "1px solid #e0e0e0",
                                borderRadius: "50%",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                                minWidth: 24,
                                minHeight: 24,
                                width: 24,
                                height: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandedParentId(
                                    expandedParentId === task.id ? null : task.id
                                );
                            }}
                        >
                            <img
                                src={mainArrow}
                                alt="Show children"
                                style={{
                                    width: 16,
                                    height: 16,
                                    filter:
                                        expandedParentId === task.id
                                            ? "brightness(1.2)"
                                            : "brightness(0.8)",
                                    transition: "filter 0.2s",
                                    pointerEvents: "none",
                                }}
                            />
                        </Button>
                    </div>
                )}
            </Card>

            <AnimatePresence>
                {expandedParentId === task.id && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100vw",
                                height: "100vh",
                                background: "#1a2233",
                                zIndex: 1000,
                                pointerEvents: "auto",
                            }}
                            onClick={() => setExpandedParentId(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{
                                position: "absolute",
                                left: 0,
                                top: "100%",
                                width: "100%",
                                background: "rgba(255,255,255,0.0)",
                                zIndex: 1002,
                                padding: "24px 0",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                                borderRadius: "0 0 12px 12px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 24,
                                    width: "100%",
                                    maxWidth: 340,
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {getChildren(task.id).map((child) => {
                                    const childParents = getParents(child.id);
                                    return (
                                        <Card
                                            key={child.id}
                                            className={`task-card ${child.completed ? "task-card-done" : ""
                                                }`}
                                            style={{
                                                width: 320,
                                                background: "#fff",
                                                color: "#222e3a",
                                                borderLeft:
                                                    childParents.length > 0
                                                        ? `5px solid ${childParents[childParents.length - 1].color ||
                                                        getDeterministicColor(
                                                            childParents[childParents.length - 1].id
                                                        )
                                                        }`
                                                        : "5px solid #fff",
                                                boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                                                position: "relative",
                                                margin: "0 auto",
                                                cursor: "pointer",
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCardClick(child);
                                            }}
                                            title={
                                                <div
                                                    style={{ textAlign: "center", color: "#222e3a" }}
                                                >
                                                    <span
                                                        className={`title ${child.completed ? "done" : ""
                                                            }`}
                                                    >
                                                        {child.title.length > 20
                                                            ? `${child.title.substring(0, 20)}...`
                                                            : child.title}
                                                    </span>
                                                    <Tag
                                                        style={
                                                            typeof priorityColor(child.priority) === "object"
                                                                ? priorityColor(child.priority)
                                                                : {}
                                                        }
                                                        color={
                                                            typeof priorityColor(child.priority) === "string"
                                                                ? priorityColor(child.priority)
                                                                : undefined
                                                        }
                                                    >
                                                        {child.priority}
                                                    </Tag>
                                                    {child.deadline && (
                                                        <div
                                                            style={{
                                                                fontSize: "0.85rem",
                                                                color: "#60a5fa",
                                                                marginTop: 2,
                                                            }}
                                                        >
                                                            {child.deadline}
                                                            {child.deadlineTime ? ` ${child.deadlineTime}` : ""}
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        >
                                            <div
                                                className="desc"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    textAlign: "center",
                                                    minHeight: "50px",
                                                    width: "100%",
                                                }}
                                            >
                                                {child.description || "No description"}
                                            </div>
                                            {childParents.length > 0 && (
                                                <div
                                                    className="dependency-indicators"
                                                    style={{
                                                        position: "absolute",
                                                        bottom: 8,
                                                        left: 8,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                        zIndex: 10,
                                                    }}
                                                >
                                                    {childParents.map((parentTask, idx) => (
                                                        <Tooltip
                                                            key={idx}
                                                            title={
                                                                parentTask
                                                                    ? parentTask.title
                                                                    : "Unknown Parent"
                                                            }
                                                        >
                                                            <span
                                                                style={{
                                                                    display: "inline-block",
                                                                    width: 16,
                                                                    height: 16,
                                                                    borderRadius: "50%",
                                                                    background:
                                                                        parentTask.color ||
                                                                        getDeterministicColor(parentTask.id),
                                                                    border: "2px solid #fff",
                                                                    boxShadow: "0 0 0 1px #ccc",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() =>
                                                                    handleChildIndicatorClick(parentTask.id)
                                                                }
                                                            />
                                                        </Tooltip>
                                                    ))}
                                                </div>
                                            )}
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