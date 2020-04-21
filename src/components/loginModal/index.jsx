import React from 'react';
import { connect } from 'umi';
import { Button, Modal, Form, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const tailLayout = {
  wrapperCol: { offset: 2, span: 22 },
};

const LoginModal = (props) => {
  const {
    visible,
    hideVisible,
    dispatch,
    submitting,
    // login: { status },
  } = props;

  const onFinish = (values) => {
    dispatch({ type: 'login/login', payload: { ...values } }).then((status) => {
      if (status === 'ok') {
        hideVisible();
        message.success(`👏 ${values.name}, 欢迎回来 👏`);
      }
    });
  };

  // const onFinishFailed = errorInfo => {
  //   console.log('Failed:', errorInfo);
  // };

  return (
    <Modal
      title="🤩用户登录"
      visible={visible}
      // onOk={handleOk}
      onCancel={hideVisible}
      footer={null}
    >
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label="用户名"
          name="name"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入用密码!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={submitting} block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))(LoginModal);
