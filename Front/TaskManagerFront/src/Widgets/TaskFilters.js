import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FilterOutlined } from "@ant-design/icons";

export function TaskFilters({ filters, setFilters }) {
    const [open, setOpen] = useState(false);

    const toggleOpen = (e) => {
        e.stopPropagation();
        setOpen((prev) => !prev);
    };

    const filterVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: i * 0.1,
            },
        }),
        exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
    };

    const filterItems = [
        {
            label: "Priority",
            control: (
                <select
                    value={filters.priority}
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, priority: e.target.value }))
                    }
                    style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                    }}
                >
                    <option value="All">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            ),
        },
        {
            label: "Status",
            control: (
                <select
                    value={filters.status}
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, status: e.target.value }))
                    }
                    style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                    }}
                >
                    <option value="All">All</option>
                    <option value="Done">Done</option>
                    <option value="Undone">Undone</option>
                </select>
            ),
        },
        {
            label: "Deadline",
            control: (
                <input
                    type="date"
                    value={filters.deadline}
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, deadline: e.target.value }))
                    }
                    style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                    }}
                />
            ),
        },
    ];

    return (
        <div style={{ position: "relative", display: "flex", alignItems: "center"  }}>
            {/* Filter icon button */}
            <button
                onClick={toggleOpen}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "white",
                    cursor: "pointer",
                    marginLeft: "12px", // right from Add button
                    zIndex: 2,
                }}
            >
                <FilterOutlined />
            </button>

            {/* Animated filters row */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: "absolute",   // overlay, no layout shift
                            left: "60px",           // start to the right of button
                            top:  "-10%",
                            display: "flex",
                            gap: "20px",
                            background: "white",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            zIndex: 1,
                        }}
                    >
                        {filterItems.map((item, i) => (
                            <motion.div
                                key={item.label}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={filterVariants}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                }}
                            >
                                <span style={{ fontWeight: 600 }}>{item.label}:</span>
                                {item.control}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
