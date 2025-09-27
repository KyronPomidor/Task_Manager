import React, { useState, useEffect } from "react";
import { Modal, InputNumber, Button, List } from "antd";

export default function BudgetModal({ visible, task, onClose, onSave }) {
  const [expenses, setExpenses] = useState(task?.expenses || []);

  useEffect(() => {
    setExpenses(task?.expenses || []);
  }, [task]);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const addExpense = () => {
    setExpenses([...expenses, { id: Date.now(), amount: 0 }]);
  };

  const updateExpense = (id, amount) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, amount } : e));
  };

  const handleSave = () => {
    onSave({ ...task, expenses, price: total });
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      title={`Budget for ${task?.title}`}
    >
      <List
        dataSource={expenses}
        renderItem={(item) => (
          <List.Item>
            <InputNumber
              min={0}
              value={item.amount}
              onChange={(val) => updateExpense(item.id, val)}
            />
          </List.Item>
        )}
      />
      <Button onClick={addExpense} style={{ marginTop: 12 }}>
        Add Expense
      </Button>
      <div style={{ marginTop: 16, fontWeight: "bold" }}>
        Total: {total}
      </div>
    </Modal>
  );
}
