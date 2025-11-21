import { Menu, Dropdown } from "antd";

export default function UserProfileMenu({ user, onLogout, isDarkMode }) {
  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={onLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const COLORS = (isDark) =>
    isDark
      ? { text: "#e5e5e5" }
      : { text: "#111827" };

  return (
    <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          padding: "4px 8px",
          borderRadius: 8,
          transition: "background 0.2s",
        }}
      >
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt="profile"
          style={{ width: 32, height: 32, borderRadius: "50%" }}
        />

        {user?.displayName && (
          <span
            style={{
              fontWeight: 500,
              color: COLORS(isDarkMode).text,
              transition: "color 0.25s ease",
            }}
          >
            {user.displayName}
          </span>
        )}
      </div> 
    </Dropdown>
  );
}
