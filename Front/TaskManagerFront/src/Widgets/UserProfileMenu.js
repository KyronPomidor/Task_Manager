import { Menu, Dropdown } from "antd";

export default function UserProfileMenu({ user, onLogout }) {
  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={onLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

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
          <span style={{ fontWeight: 500 }}>{user.displayName}</span>
        )}
      </div>
    </Dropdown>
  );
}
