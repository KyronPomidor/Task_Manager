import React from "react";
import { Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

export function TaskActions({
    task,
    startEdit,
    setBudgetTask,
    setTempBudgetItems,
    setBudgetOpen,
    menuOpenId,
    setMenuOpenId,
}) {
    const open = menuOpenId === task.id;

    const buttonVariants = {
        hidden: { opacity: 0, x: 0, scale: 0.7 },
        visible: (i) => ({
            opacity: 1,
            x: -(i + 1) * 51,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25,
                delay: i * 0.05,
            },
        }),
        exit: { opacity: 0, x: 0, scale: 0.7, transition: { duration: 0.15 } },
    };

    const actions = [
        {
            label: "Edit",
            onClick: (e) => {
                e.stopPropagation();
                startEdit(task);
                setMenuOpenId(null);
            },
        },
        {
            label: "$",
            onClick: (e) => {
                e.stopPropagation();
                setBudgetTask(task);
                setTempBudgetItems([]);
                setBudgetOpen(true);
                setMenuOpenId(null);
            },
        },
    ];

    const toggleMenu = (e) => {
        e.stopPropagation();
        setMenuOpenId(open ? null : task.id);
    };

    return (
        <div
            style={{ position: "relative", display: "flex", alignItems: "center", minWidth: 32 }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
        >
            <Button
                icon={<MoreOutlined />}
                size="small"
                shape="circle"
                onClick={toggleMenu}
                style={{ zIndex: 2 }}
            />
            <AnimatePresence>
                {open &&
                    actions.map((action, i) => (
                        <motion.div
                            key={action.label}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={buttonVariants}
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                zIndex: 1,
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <Button size="small" onClick={action.onClick}>
                                {action.label}
                            </Button>
                        </motion.div>
                    ))}
            </AnimatePresence>
        </div>
    );
}