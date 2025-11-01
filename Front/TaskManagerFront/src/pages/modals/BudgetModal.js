import React from "react";
import {
    Modal,
    Button,
    Card,
    Form,
    Input,
    Row,
    Col,
    Divider,
    Typography,
    List,
} from "antd";

const { Title, Text } = Typography;

export function BudgetModal({
    visible,
    task,
    budgetName,
    setBudgetName,
    budgetSum,
    setBudgetSum,
    tempBudgetItems,
    setTempBudgetItems,
    onAdd,
    onSave,
    onClose,
}) {
    if (!task) return null;

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0, color: "#1a2233" }}>
                    Budget Tracker
                </Title>
            }
            open={visible}
            centered
            destroyOnClose
            maskClosable={true}
            keyboard={true}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose} style={{ marginRight: 8 }}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={onSave}>
                    Save
                </Button>,
            ]}
            width={600}
            styles={{
                header: {
                    background: "#e6f4ff",
                    padding: "16px 24px",
                    borderRadius: "8px 8px 0 0",
                },
                body: {
                    padding: "24px",
                    background: "#f9fafb",
                    borderRadius: "0 0 8px 8px",
                },
                content: {
                    padding: 0,
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
                footer: {
                    padding: "16px",
                    borderRadius: "0 0 8px 8px",
                },
            }}
        >
            <Card
                bordered={false}
                style={{
                    background: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    marginBottom: "16px",
                }}
            >
                <Title level={5} style={{ margin: "0 0 16px 0", color: "#1a2233" }}>
                    Add Budget Item
                </Title>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Item Name" required>
                                <Input
                                    value={budgetName}
                                    onChange={(e) => setBudgetName(e.target.value)}
                                    placeholder="e.g. Hosting"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Amount" required>
                                <Input
                                    type="number"
                                    value={budgetSum}
                                    onChange={(e) => setBudgetSum(e.target.value)}
                                    placeholder="100.00"
                                    suffix="$"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label=" ">
                                <Button
                                    type="primary"
                                    onClick={onAdd}
                                    style={{ width: "100%" }}
                                >
                                    Add
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
            {tempBudgetItems.length > 0 && (
                <>
                    <Divider
                        orientation="left"
                        style={{ margin: "16px 0", color: "#1a2233" }}
                    >
                        New Budget Items
                    </Divider>
                    <List
                        bordered
                        dataSource={tempBudgetItems}
                        renderItem={(item) => (
                            <List.Item
                                style={{
                                    padding: "12px 16px",
                                    background: "#f9fafb",
                                    borderRadius: "4px",
                                    marginBottom: "8px",
                                }}
                            >
                                <Text>
                                    {item.name}: <strong>${item.sum.toFixed(2)}</strong>
                                </Text>
                            </List.Item>
                        )}
                        style={{ marginBottom: "16px" }}
                    />
                </>
            )}
            <Text
                strong
                style={{ color: "#4d5156", display: "block", marginLeft: "0.7vw" }}
            >
                Total: $
                {(
                    (task?.price || 0) +
                    tempBudgetItems.reduce((acc, item) => acc + item.sum, 0)
                ).toFixed(2)}
            </Text>
        </Modal>
    );
}