import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { TaskDetailsModal } from "../modals/taskDetailsModal";

// импорт SVG иконок
import lowMarker from "./low-marker.svg";
import mediumMarker from "./medium-marker.svg";
import highMarker from "./high-marker.svg";

// Фикс дефолтного маркера
const DefaultIcon = L.icon({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
L.Marker.prototype.options.icon = DefaultIcon;

// Кастомные иконки для приоритетов
const markerIcons = {
    Low: L.icon({
        iconUrl: lowMarker,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    }),
    Medium: L.icon({
        iconUrl: mediumMarker,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    }),
    High: L.icon({
        iconUrl: highMarker,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    }),
};

export default function MapPage({ tasks, categories, isDark = false }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const getParents = (taskId) =>
        tasks.filter((t) => (t.childrenIds || []).includes(taskId));

    const defaultCenter = [47.0105, 28.8638];

    const tasksWithCoords = tasks.filter(
        (t) => t.latitude != null &&
            t.longitude != null &&
            !isNaN(t.latitude) &&
            !isNaN(t.longitude) &&
            !t.completed
    );

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .marker-cluster-small div,
            .marker-cluster-medium div,
            .marker-cluster-large div {
                background-color: #3b82f6 !important;
                font-size: 20px !important;
                font-weight: bold !important;
                width: 50px !important;
                height: 50px !important;
                line-height: 50px !important;
            }
            
            .marker-cluster-small,
            .marker-cluster-medium,
            .marker-cluster-large {
                background-color: rgba(59, 130, 246, 0.3) !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer
                center={
                    tasksWithCoords.length > 0
                        ? [tasksWithCoords[0].latitude, tasksWithCoords[0].longitude]
                        : defaultCenter
                }
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MarkerClusterGroup chunkedLoading>
                    {tasksWithCoords.map((task) => (
                        <Marker
                            key={task.id}
                            position={[task.latitude, task.longitude]}
                            icon={markerIcons[task.priority] || markerIcons.Low}
                            eventHandlers={{
                                click: () => {
                                    setSelectedTask(task);
                                    setIsDetailsOpen(true);
                                },
                            }}
                        >
                            <Popup>
                                <b>{task.title}</b><br />
                                {task.location || "No address"}<br />
                                Priority: {task.priority}
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>

            {/* modal */}
            <TaskDetailsModal
                visible={isDetailsOpen}
                task={selectedTask}
                categories={categories}
                allTasks={tasks}
                getParents={getParents}
                onClose={() => setIsDetailsOpen(false)}
                onEdit={() => setIsDetailsOpen(false)}
                isDark={isDark}
            />
        </div>

    );
}
